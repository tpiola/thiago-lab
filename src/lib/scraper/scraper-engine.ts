/* ==========================================================================
   scraper-engine.ts — Motor de Raspagem Firecrawl-like
   Extrai HTML, metadados, estrutura, markdown e detecta tech stack
   de qualquer URL. Suporta profundidade 1-3 com crawling recursivo.
   Firecrawl-like Scraper — thiagolab.com
   ========================================================================== */

import * as cheerio from 'cheerio';
import { detectTechStack, type TechStack } from './tech-detector';

// ─── Tipos ──────────────────────────────────────────────────────────────────

/** Configuração do scrape */
export interface ScrapeOptions {
  /** URL para raspar */
  url: string;
  /** Profundidade de crawling (1-3, default: 1) */
  depth?: number;
  /** Timeout em ms por request (default: 15000) */
  timeout?: number;
  /** Headers HTTP customizados */
  headers?: Record<string, string>;
  /** Extrair imagens (default: true) */
  extractImages?: boolean;
  /** Extrair links (default: true) */
  extractLinks?: boolean;
  /** Converter para markdown (default: true) */
  toMarkdown?: boolean;
}

/** Resultado de um item de heading */
export interface ScrapedHeading {
  level: number;
  text: string;
  id?: string;
}

/** Resultado de um item de imagem */
export interface ScrapedImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/** Resultado de um link */
export interface ScrapedLink {
  href: string;
  text: string;
  isInternal: boolean;
  isExternal: boolean;
}

/** Metadados extraídos */
export interface ScrapedMetadata {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  ogSiteName?: string;
  twitterCard?: string;
  twitterImage?: string;
  twitterDescription?: string;
  favicon?: string;
  canonical?: string;
  charset?: string;
  viewport?: string;
  keywords?: string;
  author?: string;
  language?: string;
}

/** Resultado completo do scrape */
export interface ScrapeResult {
  /** URL raspada */
  url: string;
  /** Título da página */
  title: string;
  /** Descrição meta */
  description: string;
  /** Conteúdo em markdown */
  markdown: string;
  /** Tech stack detectada */
  techStack: TechStack;
  /** Headings extraídos */
  headings: ScrapedHeading[];
  /** Imagens extraídas */
  images: ScrapedImage[];
  /** Links extraídos */
  links: ScrapedLink[];
  /** Metadados completos */
  metadata: ScrapedMetadata;
  /** HTML bruto (apenas se solicitado) */
  rawHtml?: string;
  /** Erro (se houver) */
  error?: string;
  /** Status code HTTP */
  statusCode?: number;
  /** Headers HTTP da resposta */
  responseHeaders?: Record<string, string>;
  /** Quantidade de palavras no conteúdo principal */
  wordCount: number;
  /** Tempo de execução em ms */
  duration: number;
  /** Profundidade real usada */
  depth: number;
}

/** Resultado de scraping em profundidade */
export interface DeepScrapeResult extends ScrapeResult {
  /** Páginas filhas raspadas */
  pages?: ScrapeResult[];
  /** Sitemap de links internos encontrados */
  internalLinks?: string[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Valida e normaliza uma URL.
 */
function normalizeUrl(raw: string): string {
  let url = raw.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  try {
    const parsed = new URL(url);
    return parsed.href;
  } catch {
    throw new Error(`URL inválida: ${raw}`);
  }
}

/**
 * Determina se um link é interno (mesmo domínio).
 */
function isInternalUrl(href: string, baseUrl: string): boolean {
  try {
    const base = new URL(baseUrl);
    const link = new URL(href, baseUrl);
    return link.hostname === base.hostname;
  } catch {
    return false;
  }
}

/**
 * Extrai o domínio de uma URL.
 */
function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

// ─── Conversão HTML → Markdown ──────────────────────────────────────────────

/**
 * Converte HTML para markdown simples usando cheerio.
 * Foco em conteúdo legível, não perfeição.
 */
function htmlToMarkdown($: cheerio.CheerioAPI): string {
  const parts: string[] = [];

  // Elementos de bloco que geram quebras
  $('body')
    .contents()
    .each(function (this: any) {
      const el = $(this);
      const tag = this.type === 'tag' ? (this as any).tagName?.toLowerCase() || '' : '';

      if (this.type === 'text') {
        const text = $(this).text().replace(/\s+/g, ' ').trim();
        if (text) parts.push(text);
        return;
      }

      if (this.type !== 'tag') return;

      switch (tag) {
        case 'h1':
          parts.push(`# ${el.text().trim()}`);
          break;
        case 'h2':
          parts.push(`## ${el.text().trim()}`);
          break;
        case 'h3':
          parts.push(`### ${el.text().trim()}`);
          break;
        case 'h4':
          parts.push(`#### ${el.text().trim()}`);
          break;
        case 'h5':
          parts.push(`##### ${el.text().trim()}`);
          break;
        case 'h6':
          parts.push(`###### ${el.text().trim()}`);
          break;
        case 'p':
        case 'div':
        case 'section':
        case 'article':
        case 'blockquote': {
          const text = el.clone().children('script,style').remove().end().text().replace(/\s+/g, ' ').trim();
          if (text && text.length > 3) {
            parts.push(tag === 'blockquote' ? `> ${text}` : text);
          }
          break;
        }
        case 'pre': {
          const code = el.find('code').first().text() || el.text();
          parts.push('```\n' + code.trim() + '\n```');
          break;
        }
        case 'code':
          parts.push('`' + el.text().trim() + '`');
          break;
        case 'strong':
        case 'b':
          parts.push(`**${el.text().trim()}**`);
          break;
        case 'em':
        case 'i':
          parts.push(`*${el.text().trim()}*`);
          break;
        case 'a': {
          const href = el.attr('href') || '';
          const text = el.text().trim();
          if (href && text) {
            parts.push(`[${text}](${href})`);
          } else if (href) {
            parts.push(href);
          } else {
            parts.push(text);
          }
          break;
        }
        case 'img': {
          const src = el.attr('src') || '';
          const alt = el.attr('alt') || '';
          if (src) parts.push(`![${alt}](${src})`);
          break;
        }
        case 'ul':
        case 'ol': {
          el.find('> li').each((_, li) => {
            const prefix = tag === 'ol' ? '1. ' : '- ';
            parts.push(`${prefix}${$(li).text().trim()}`);
          });
          break;
        }
        case 'hr':
          parts.push('---');
          break;
        case 'br':
          parts.push('');
          break;
        case 'table': {
          // Markdown table (simplified)
          const rows: string[][] = [];
          el.find('tr').each((_, tr) => {
            const cells: string[] = [];
            $(tr)
              .find('th, td')
              .each((_, cell) => {
                cells.push($(cell).text().trim());
              });
            if (cells.length > 0) rows.push(cells);
          });
          if (rows.length > 0) {
            parts.push('| ' + rows[0].join(' | ') + ' |');
            parts.push('| ' + rows[0].map(() => '---').join(' | ') + ' |');
            for (let i = 1; i < rows.length; i++) {
              parts.push('| ' + rows[i].join(' | ') + ' |');
            }
          }
          break;
        }
      }
    });

  return parts.filter((p) => p).join('\n\n');
}

// ─── Função Principal ───────────────────────────────────────────────────────

/**
 * Raspa uma URL e retorna dados estruturados completos.
 *
 * @param options - Opções de scrape
 * @returns ScrapeResult com todos os dados extraídos
 *
 * @example
 * ```ts
 * const result = await scrape({ url: 'https://thiagolab.com' });
 * console.log(result.title, result.markdown.slice(0, 200));
 * ```
 */
export async function scrape(options: ScrapeOptions): Promise<ScrapeResult> {
  const startTime = Date.now();
  const { url, depth = 1, timeout = 15000, extractImages = true, extractLinks = true, toMarkdown = true, headers = {} } = options;

  const result: ScrapeResult = {
    url: '',
    title: '',
    description: '',
    markdown: '',
    techStack: {
      framework: null,
      cssFramework: null,
      cms: null,
      hosting: null,
      analytics: [],
      outros: [],
      versoes: {},
    },
    headings: [],
    images: [],
    links: [],
    metadata: {
      title: '',
      description: '',
    },
    wordCount: 0,
    duration: 0,
    depth,
  };

  try {
    const normalizedUrl = normalizeUrl(url);
    result.url = normalizedUrl;
    console.log(`[Scraper] 🔍 Raspando: ${normalizedUrl} (profundidade: ${depth})`);

    // ─── Fazer request HTTP com got ─────────────────────────────────
    const { default: got } = await import('got');

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      abortController.abort();
      console.warn(`[Scraper] ⏰ Timeout após ${timeout}ms para ${normalizedUrl}`);
    }, timeout);

    try {
      const response = await got(normalizedUrl, {
        timeout: { request: timeout },
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; Firecrawl-Like/1.0; +https://thiagolab.com)',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
          ...headers,
        },
        followRedirect: true,
        maxRedirects: 5,
        retry: {
          limit: 2,
          methods: ['GET'],
          statusCodes: [408, 429, 500, 502, 503, 504],
        },
        signal: abortController.signal,
        https: {
          rejectUnauthorized: false,
        },
      });

      clearTimeout(timeoutId);

      const html = response.body;
      const responseHeaders = response.headers as Record<string, string>;
      result.statusCode = response.statusCode;
      result.responseHeaders = responseHeaders;

      console.log(`[Scraper] ✅ Status: ${response.statusCode}, Tamanho: ${html.length} bytes`);

      // ─── Parsear HTML ──────────────────────────────────────────────
      const $ = cheerio.load(html);

      // ─── Extrair metadados ─────────────────────────────────────────
      result.metadata = extractMetadata($, normalizedUrl);
      result.title = result.metadata.title;
      result.description = result.metadata.description;

      // ─── Extrair headings ──────────────────────────────────────────
      result.headings = extractHeadings($);

      // ─── Extrair imagens ───────────────────────────────────────────
      if (extractImages) {
        result.images = extractImagesFromHtml($, normalizedUrl);
      }

      // ─── Extrair links ─────────────────────────────────────────────
      if (extractLinks) {
        result.links = extractLinksFromHtml($, normalizedUrl);
      }

      // ─── Converter para markdown ───────────────────────────────────
      if (toMarkdown) {
        result.markdown = htmlToMarkdown($);
      }

      // ─── Contar palavras ───────────────────────────────────────────
      const cleanText = $('body').text().replace(/\s+/g, ' ').trim();
      result.wordCount = cleanText.split(/\s+/).filter(Boolean).length;

      // ─── Detectar tech stack ───────────────────────────────────────
      result.techStack = detectTechStack(html, responseHeaders);

      // ─── Raw HTML ──────────────────────────────────────────────────
      result.rawHtml = html;

      result.duration = Date.now() - startTime;
      console.log(`[Scraper] ✅ Finalizado em ${result.duration}ms - "${result.title}"`);

      return result;
    } catch (err) {
      clearTimeout(timeoutId);

      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`[Scraper] ❌ Erro ao raspar ${normalizedUrl}:`, errorMessage);

      result.error = errorMessage;
      result.duration = Date.now() - startTime;
      return result;
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`[Scraper] ❌ Erro fatal:`, errorMessage);
    result.error = errorMessage;
    result.duration = Date.now() - startTime;
    return result;
  }
}

/**
 * Raspagem em profundidade — raspa a URL principal e recursivamente
 * as subpáginas internas até a profundidade especificada.
 *
 * @param options - Opções de scrape
 * @returns DeepScrapeResult com páginas filhas
 */
export async function deepScrape(options: ScrapeOptions): Promise<DeepScrapeResult> {
  const mainResult = await scrape(options);
  const depth = options.depth ?? 1;

  if (depth <= 1) {
    return { ...mainResult, pages: [], internalLinks: mainResult.links.filter((l) => l.isInternal).map((l) => l.href) };
  }

  console.log(`[Scraper] 🔄 Raspagem profunda (depth=${depth}) — coletando links internos...`);

  // Coletar links internos únicos
  const internalLinks = mainResult.links
    .filter((l) => l.isInternal && !l.href.includes('#') && !l.href.match(/\.(pdf|zip|rar|jpg|jpeg|png|gif|svg|webp|mp4|mp3)$/i))
    .map((l) => l.href);

  const uniqueLinks = [...new Set(internalLinks)].slice(0, 10); // max 10 subpages
  console.log(`[Scraper] 📄 ${uniqueLinks.length} subpáginas para raspar`);

  // Raspar subpáginas (depth-1, no recursion beyond level 2 for safety)
  const subDepth = Math.min(depth - 1, 2);
  const subResults = await Promise.allSettled(
    uniqueLinks.map((link) =>
      scrape({
        url: link,
        depth: subDepth,
        timeout: options.timeout,
        extractImages: options.extractImages,
        extractLinks: false,
        toMarkdown: true,
      }),
    ),
  );

  const pages: ScrapeResult[] = [];
  for (const r of subResults) {
    if (r.status === 'fulfilled' && !r.value.error) {
      pages.push(r.value);
    }
  }

  console.log(`[Scraper] 📚 ${pages.length}/${uniqueLinks.length} subpáginas raspadas com sucesso`);

  return {
    ...mainResult,
    pages,
    internalLinks: uniqueLinks,
  };
}

// ─── Funções Extratoras ─────────────────────────────────────────────────────

/**
 * Extrai metadados do HTML.
 */
function extractMetadata($: cheerio.CheerioAPI, baseUrl: string): ScrapedMetadata {
  const getMeta = (name: string): string => {
    return (
      $(`meta[name="${name}"]`).attr('content') ||
      $(`meta[property="${name}"]`).attr('content') ||
      ''
    );
  };

  const faviconLink =
    $('link[rel="icon"]').attr('href') ||
    $('link[rel="shortcut icon"]').attr('href') ||
    $('link[rel="apple-touch-icon"]').attr('href') ||
    '';

  let favicon = faviconLink;
  if (favicon && !favicon.startsWith('http')) {
    try {
      favicon = new URL(favicon, baseUrl).href;
    } catch {
      // keep original
    }
  }

  // Se não achou favicon, usa o padrão /favicon.ico
  if (!favicon) {
    try {
      favicon = new URL('/favicon.ico', baseUrl).href;
    } catch {
      // keep empty
    }
  }

  // Detectar linguagem
  const lang = $('html').attr('lang') || '';

  // Detectar charset
  const charset =
    $('meta[charset]').attr('charset') ||
    $('meta[http-equiv="Content-Type"]')
      .attr('content')
      ?.match(/charset=([\w-]+)/)?.[1] ||
    '';

  return {
    title: $('title').first().text().trim() || getMeta('og:title') || '',
    description: getMeta('description') || getMeta('og:description') || getMeta('twitter:description') || '',
    ogTitle: getMeta('og:title') || undefined,
    ogDescription: getMeta('og:description') || undefined,
    ogImage: getMeta('og:image') || undefined,
    ogUrl: getMeta('og:url') || undefined,
    ogType: getMeta('og:type') || undefined,
    ogSiteName: getMeta('og:site_name') || undefined,
    twitterCard: getMeta('twitter:card') || undefined,
    twitterImage: getMeta('twitter:image') || undefined,
    twitterDescription: getMeta('twitter:description') || undefined,
    favicon,
    canonical: $('link[rel="canonical"]').attr('href') || undefined,
    charset: charset || undefined,
    viewport: getMeta('viewport') || undefined,
    keywords: getMeta('keywords') || undefined,
    author: getMeta('author') || undefined,
    language: lang || undefined,
  };
}

/**
 * Extrai headings (h1-h6) do HTML.
 */
function extractHeadings($: cheerio.CheerioAPI): ScrapedHeading[] {
  const headings: ScrapedHeading[] = [];

  for (let level = 1; level <= 6; level++) {
    $(`h${level}`).each((_, el) => {
      const text = $(el).text().trim();
      if (text) {
        headings.push({
          level,
          text,
          id: $(el).attr('id') || undefined,
        });
      }
    });
  }

  return headings;
}

/**
 * Extrai imagens do HTML.
 */
function extractImagesFromHtml($: cheerio.CheerioAPI, baseUrl: string): ScrapedImage[] {
  const images: ScrapedImage[] = [];
  const seen = new Set<string>();

  $('img').each((_, el) => {
    let src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src') || '';
    if (!src) return;

    // Normalizar URL
    try {
      src = new URL(src, baseUrl).href;
    } catch {
      return;
    }

    // Evitar duplicatas
    if (seen.has(src)) return;
    seen.add(src);

    // Ignorar ícones/pixels pequenos
    if (src.includes('data:image/svg+xml') || src.includes('pixel') || src.includes('blank')) return;

    images.push({
      src,
      alt: $(el).attr('alt') || '',
      width: parseInt($(el).attr('width') || '0') || undefined,
      height: parseInt($(el).attr('height') || '0') || undefined,
    });
  });

  // Também extrair imagens de background (CSS inline)
  $('[style*="background-image"]').each((_, el) => {
    const style = $(el).attr('style') || '';
    const match = style.match(/url\(['"]?([^'")\s]+)['"]?\)/);
    if (match) {
      let src = match[1];
      try {
        src = new URL(src, baseUrl).href;
      } catch {
        return;
      }
      if (!seen.has(src)) {
        seen.add(src);
        images.push({ src, alt: '' });
      }
    }
  });

  return images;
}

/**
 * Extrai links do HTML.
 */
function extractLinksFromHtml($: cheerio.CheerioAPI, baseUrl: string): ScrapedLink[] {
  const links: ScrapedLink[] = [];
  const seen = new Set<string>();

  $('a[href]').each((_, el) => {
    let href = $(el).attr('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    // Normalizar URL
    try {
      href = new URL(href, baseUrl).href;
    } catch {
      return;
    }

    // Evitar duplicatas
    if (seen.has(href)) return;
    seen.add(href);

    const domain = getDomain(baseUrl);
    const linkDomain = getDomain(href);

    links.push({
      href,
      text: $(el).text().trim().slice(0, 200),
      isInternal: linkDomain === domain,
      isExternal: linkDomain !== domain,
    });
  });

  return links;
}

/**
 * Extrai a estrutura de sitemap de uma página (menus e navegação).
 *
 * @param html - HTML da página
 * @param baseUrl - URL base para resolver links
 * @returns Lista de itens de navegação encontrados
 */
export function extractNavigationStructure(
  html: string,
  baseUrl: string,
): Array<{ text: string; href: string; level: number }> {
  const $ = cheerio.load(html);
  const navItems: Array<{ text: string; href: string; level: number }> = [];
  const seen = new Set<string>();

  // Encontrar navegação
  $('nav a, header a, .nav a, .menu a, [role="navigation"] a, .navigation a').each((_, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim();
    if (!text || !href || href.startsWith('#') || href.startsWith('javascript:')) return;

    const key = `${text}::${href}`;
    if (seen.has(key)) return;
    seen.add(key);

    // Determinar nível baseado no aninhamento
    let level = 0;
    let parent = $(el).parent();
    for (let i = 0; i < 5; i++) {
      if (parent.is('li') || parent.is('nav') || parent.is('header')) {
        break;
      }
      parent = parent.parent();
      level++;
    }

    let resolvedHref = href;
    try {
      resolvedHref = new URL(href, baseUrl).href;
    } catch {
      // keep original
    }

    navItems.push({ text, href: resolvedHref, level });
  });

  return navItems;
}
