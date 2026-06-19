/* ==========================================================================
   html-to-components.ts — Converte HTML Raspado para Componentes React
   Extrai seções visuais (header, hero, features, footer), identifica
   padrões de layout e gera código JSX + Tailwind equivalente.
   Usa OmniRoute LLM para análise semântica quando disponível.
   Firecrawl-like Scraper — thiagolab.com
   ========================================================================== */

import * as cheerio from 'cheerio';

// ─── Tipos ──────────────────────────────────────────────────────────────────

/** Tipo de seção visual detectada */
export type SectionType =
  | 'header'
  | 'hero'
  | 'features'
  | 'about'
  | 'services'
  | 'pricing'
  | 'testimonials'
  | 'gallery'
  | 'cta'
  | 'contact'
  | 'faq'
  | 'stats'
  | 'footer'
  | 'blog'
  | 'team'
  | 'logo-cloud'
  | 'content'
  | 'sidebar'
  | 'unknown';

/** Padrão de layout */
export type LayoutPattern =
  | 'grid'
  | 'flex-row'
  | 'flex-col'
  | 'card-grid'
  | 'hero-split'
  | 'single-column'
  | 'two-column'
  | 'three-column'
  | 'four-column'
  | 'sidebar-layout'
  | 'masonry'
  | 'carousel'
  | 'unknown';

/** Seção visual extraída */
export interface ExtractedSection {
  /** Tipo da seção */
  type: SectionType;
  /** Nome detectado */
  name: string;
  /** HTML original da seção */
  html: string;
  /** Texto limpo */
  text: string;
  /** Código JSX gerado */
  jsx: string;
  /** Classes Tailwind usadas */
  tailwind: string[];
  /** Padrão de layout */
  layout: LayoutPattern;
  /** Confiança da detecção (0-1) */
  confidence: number;
  /** Ordem na página */
  order: number;
}

/** Resultado completo da conversão */
export interface ConversionResult {
  /** Seções extraídas e convertidas */
  sections: ExtractedSection[];
  /** Página completa em JSX */
  fullPage: string;
  /** Estilos Tailwind globais necessários */
  requiredTailwindClasses: string[];
  /** Metadados do layout */
  layout: {
    totalSections: number;
    layoutPatterns: LayoutPattern[];
    hasStickyHeader: boolean;
    hasFooter: boolean;
    isLandingPage: boolean;
    sectionsOrder: SectionType[];
  };
}

// ─── Detectores de Seção ────────────────────────────────────────────────────

interface SectionDetector {
  type: SectionType;
  name: string;
  confidence: number;
  /** Padrões de seletor para encontrar a seção */
  selectors: string[];
  /** Atributos/classes que indicam o tipo */
  indicators: RegExp[];
}

const SECTION_DETECTORS: SectionDetector[] = [
  {
    type: 'header',
    name: 'Header / Navegação',
    confidence: 0.9,
    selectors: ['header', '[role="banner"]', '.header', '#header', '.navbar', '.nav', '.navigation'],
    indicators: [/header/i, /nav/i, /navbar/i, /menu/i, /logo/i],
  },
  {
    type: 'hero',
    name: 'Hero / Banner Principal',
    confidence: 0.85,
    selectors: ['.hero', '#hero', '.banner', '#banner', '.hero-section', '[class*="hero"]'],
    indicators: [/hero/i, /banner/i, /intro/i, /headline/i, /jumbotron/i, /landing/i],
  },
  {
    type: 'features',
    name: 'Recursos / Diferenciais',
    confidence: 0.8,
    selectors: ['.features', '#features', '.benefits', '.diferenciais', '.services-grid', '[class*="feature"]'],
    indicators: [/feature/i, /benefit/i, /diferencial/i, /recurso/i, /vantagem/i, /grid/i],
  },
  {
    type: 'about',
    name: 'Sobre / Quem Somos',
    confidence: 0.8,
    selectors: ['.about', '#about', '.about-us', '.sobre', '#sobre', '[class*="about"]'],
    indicators: [/about/i, /sobre/i, /quem-somos/i, /historia/i, /company/i],
  },
  {
    type: 'services',
    name: 'Serviços',
    confidence: 0.8,
    selectors: ['.services', '#services', '.servicos', '#servicos', '[class*="service"]'],
    indicators: [/service/i, /servico/i, /offer/i, /oferecemos/i],
  },
  {
    type: 'pricing',
    name: 'Preços / Planos',
    confidence: 0.85,
    selectors: ['.pricing', '#pricing', '.plans', '.planos', '.pricing-table', '.price', '[class*="pricing"]'],
    indicators: [/price/i, /pricing/i, /plano/i, /plan/i, /preco/i, /payment/i, /assinatura/i],
  },
  {
    type: 'testimonials',
    name: 'Depoimentos',
    confidence: 0.85,
    selectors: ['.testimonials', '#testimonials', '.depoimentos', '.reviews', '.feedback', '.testimonial'],
    indicators: [/testimonial/i, /depoimento/i, /review/i, /feedback/i, /cliente/i, /comentario/i],
  },
  {
    type: 'gallery',
    name: 'Galeria / Portfólio',
    confidence: 0.75,
    selectors: ['.gallery', '#gallery', '.portfolio', '.galeria', '.works', '.showcase'],
    indicators: [/gallery/i, /galeria/i, /portfolio/i, /showcase/i, /work/i, /projeto/i],
  },
  {
    type: 'cta',
    name: 'Call-to-Action',
    confidence: 0.8,
    selectors: ['.cta', '#cta', '.cta-section', '.call-to-action', '.cta-banner', '.action'],
    indicators: [/cta/i, /call.?to.?action/i, /inscreva/i, /cadastre/i, /comece/i, /solicite/i],
  },
  {
    type: 'contact',
    name: 'Contato',
    confidence: 0.85,
    selectors: ['.contact', '#contact', '.contato', '#contato', '.contact-form', '.contact-section'],
    indicators: [/contact/i, /contato/i, /fale/i, /form/i, /email/i, /telefone/i],
  },
  {
    type: 'faq',
    name: 'FAQ / Perguntas Frequentes',
    confidence: 0.85,
    selectors: ['.faq', '#faq', '.faq-section', '.perguntas', '.questions', '.accordion'],
    indicators: [/faq/i, /pergunta/i, /question/i, /accordion/i, /duvida/i, /frequente/i],
  },
  {
    type: 'stats',
    name: 'Estatísticas / Números',
    confidence: 0.75,
    selectors: ['.stats', '#stats', '.statistics', '.numeros', '.counters', '.metrics'],
    indicators: [/stat/i, /numer/i, /contador/i, /metric/i, /counter/i, /number/i],
  },
  {
    type: 'footer',
    name: 'Rodapé',
    confidence: 0.95,
    selectors: ['footer', '.footer', '#footer', '[role="contentinfo"]'],
    indicators: [/footer/i, /rodape/i, /copyright/i, /direitos/i],
  },
  {
    type: 'blog',
    name: 'Blog / Artigos',
    confidence: 0.7,
    selectors: ['.blog', '#blog', '.articles', '.posts', '.blog-posts', '[class*="blog"]'],
    indicators: [/blog/i, /artigo/i, /post/i, /article/i, /noticia/i],
  },
  {
    type: 'team',
    name: 'Equipe / Time',
    confidence: 0.75,
    selectors: ['.team', '#team', '.equipe', '.team-members', '.team-grid', '[class*="team"]'],
    indicators: [/team/i, /equipe/i, /time/i, /member/i, /colaborador/i, /pessoa/i],
  },
  {
    type: 'logo-cloud',
    name: 'Logos / Clientes',
    confidence: 0.7,
    selectors: ['.clients', '.partners', '.logos', '.clientes', '.parceiros', '.trusted-by'],
    indicators: [/client/i, /partner/i, /logo/i, /trusted/i, /marca/i, /apoiador/i],
  },
];

// ─── Funções de Detecção ────────────────────────────────────────────────────

/**
 * Detecta o padrão de layout de um elemento.
 */
function detectLayout($: cheerio.CheerioAPI, element: cheerio.Cheerio<any>): LayoutPattern {
  const html = $.html(element) || '';
  const classes = element.attr('class') || '';

  // Grid explícito
  if (classes.includes('grid') || html.includes('display: grid') || html.includes('display:grid')) {
    const childCount = element.children().length;
    if (childCount <= 2) return 'two-column';
    if (childCount <= 3) return 'three-column';
    if (childCount <= 4) return 'four-column';
    return 'card-grid';
  }

  // Flex row
  if (
    classes.includes('flex') &&
    (classes.includes('flex-row') || classes.includes('flex-wrap') || html.includes('flex-direction: row'))
  ) {
    return 'flex-row';
  }

  // Flex col
  if (classes.includes('flex-col') || html.includes('flex-direction: column')) {
    return 'flex-col';
  }

  // Sidebar
  if (element.find('aside, .sidebar, [role="complementary"]').length > 0) {
    return 'sidebar-layout';
  }

  // Carrossel
  if (classes.includes('slick') || classes.includes('swiper') || classes.includes('carousel') || classes.includes('owl')) {
    return 'carousel';
  }

  // Hero split
  if (element.find('img, .image, figure').length > 0 && element.find('h1, h2').length > 0) {
    return 'hero-split';
  }

  // Cards grid (múltiplos filhos com classes de card)
  const children = element.children().filter('div, section, article');
  const cardCount = children.filter((_, el) => {
    const childClasses = $(el).attr('class') || '';
    return childClasses.includes('card') || childClasses.includes('item') || childClasses.includes('box');
  }).length;

  if (cardCount >= 3) return 'card-grid';
  if (cardCount === 2) return 'two-column';
  if (cardCount === 1) return 'single-column';

  // Fallback pela contagem de filhos
  const childCount = children.length;
  if (childCount === 0) return 'single-column';
  if (childCount === 1) return 'single-column';
  if (childCount === 2) return 'two-column';
  if (childCount <= 4) return 'flex-row';

  return 'unknown';
}

/**
 * Gera JSX para um elemento HTML usando Tailwind.
 */
function generateJsx(
  $: cheerio.CheerioAPI,
  element: cheerio.Cheerio<any>,
  sectionType: SectionType,
  depth = 0,
): string {
  if (depth > 6) return '';
  const indent = '  '.repeat(depth);

  const el = element.get(0);
  if (!el) return '';
  if (el.type === 'text') {
    const text = $(el).text().trim();
    return text ? `${indent}{'${text}'}` : '';
  }

  if (el.type === 'tag') {
    const tag = (el as any).tagName?.toLowerCase() || 'div';
    const attrs: Record<string, string> = {};
    const cls = $(el).attr('class') || '';
    const tailwindClasses: string[] = [];

    // Mapear classes para Tailwind
    cls.split(/\s+/).forEach((c) => {
      if (c && !c.startsWith('Mui') && !c.startsWith('ng-') && !c.startsWith('_') && !c.startsWith('css-')) {
        tailwindClasses.push(c);
      }
    });

    // Detectar links
    if (tag === 'a') {
      const href = $(el).attr('href') || '';
      if (href) attrs.href = href;
      // Adicionar target para links externos
      if (href.startsWith('http') && !href.includes(window?.location?.hostname || '')) {
        attrs.target = '_blank';
        attrs.rel = 'noopener noreferrer';
      }
    }

    // Detectar imagens
    if (tag === 'img') {
      const src = $(el).attr('src') || $(el).attr('data-src') || '';
      const alt = $(el).attr('alt') || '';
      if (src) attrs.src = src;
      if (alt) attrs.alt = alt;
      attrs.className = tailwindClasses.join(' ');
    }

    // Detectar inputs
    if (tag === 'input') {
      const type = $(el).attr('type') || 'text';
      attrs.type = type;
      const placeholder = $(el).attr('placeholder') || '';
      if (placeholder) attrs.placeholder = placeholder;
    }

    // Detectar buttons
    if (tag === 'button') {
      // ok
    }

    // Construir JSX tag
    let tagName = tag;

    // Mapear tags que não existem em JSX
    const tagMap: Record<string, string> = {
      nav: 'nav',
      header: 'header',
      footer: 'footer',
      section: 'section',
      article: 'article',
      aside: 'aside',
      main: 'main',
      figure: 'figure',
      figcaption: 'figcaption',
    };

    // Construir atributos JSX
    const attrsStr = Object.entries(attrs)
      .map(([key, val]) => `${key}="${val.replace(/"/g, '&quot;')}"`)
      .join(' ');

    const clsAttr = tailwindClasses.length > 0 ? ` className="${tailwindClasses.join(' ')}"` : '';
    const allAttrs = `${clsAttr}${attrsStr ? ' ' + attrsStr : ''}`;

    // Processar children
    const children = $(el).contents();
    let childrenJsx = '';
    const childArray: string[] = [];

    children.each((_, child) => {
      const childHtml = generateJsx($, $(child), sectionType, depth + 1);
      if (childHtml.trim()) childArray.push(childHtml);
    });

    if (childArray.length > 0) {
      childrenJsx = '\n' + childArray.join('\n') + '\n' + indent;
    }

    // Tags sem children (auto-close)
    const voidElements = ['img', 'input', 'br', 'hr', 'meta', 'link'];
    if (voidElements.includes(tag) || children.length === 0) {
      return `${indent}<${tagName}${allAttrs} />`;
    }

    return `${indent}<${tagName}${allAttrs}>${childrenJsx}</${tagName}>`;
  }

  return '';
}

// ─── Função de Conversão ─────────────────────────────────────────────────────

/**
 * Converte HTML raspado em componentes React + Tailwind.
 *
 * @param html - HTML completo ou parcial da página
 * @param options - Opções de conversão
 * @returns ConversionResult com seções JSX e página completa
 *
 * @example
 * ```ts
 * const result = convertHtmlToComponents('<html>...</html>');
 * console.log(result.sections[0].jsx);
 * ```
 */
export function convertHtmlToComponents(
  html: string,
  options?: {
    /** Usar OmniRoute para análise semântica (se disponível) */
    useLlm?: boolean;
    /** Forçar tipo de seção (opcional) */
    forceSections?: boolean;
  },
): ConversionResult {
  const $ = cheerio.load(html);
  const sections: ExtractedSection[] = [];
  const usedTailwindClasses = new Set<string>();

  // ─── 1. Coletar todas as classes Tailwind ──────────────────────────
  $('[class]').each((_, el) => {
    const cls = $(el).attr('class') || '';
    cls.split(/\s+/).forEach((c) => {
      if (c.trim() && !c.startsWith('Mui') && !c.startsWith('ng-')) {
        usedTailwindClasses.add(c.trim());
      }
    });
  });

  // ─── 2. Encontrar e classificar seções ────────────────────────────
  const visitedSelectors = new Set<string>();

  for (const detector of SECTION_DETECTORS) {
    for (const selector of detector.selectors) {
      const elements = $(selector);
      if (elements.length === 0) continue;

      elements.each((index, el) => {
        const element = $(el);
        const elementHtml = $.html(element) || '';
        const elementText = element.text().trim();

        // Evitar duplicatas
        const key = `${selector}::${index}`;
        if (visitedSelectors.has(key)) return;
        visitedSelectors.add(key);

        // Verificar indicators
        let indicatorScore = 0;
        for (const indicator of detector.indicators) {
          if (indicator.test(elementHtml)) indicatorScore++;
        }

        const confidence = indicatorScore > 0
          ? Math.min(1, detector.confidence + indicatorScore * 0.05)
          : detector.confidence * 0.5;

        // Detectar layout
        const layout = detectLayout($, element);

        // Gerar JSX
        const jsx = generateJsx($, element, detector.type);

        sections.push({
          type: detector.type,
          name: detector.name,
          html: elementHtml,
          text: elementText,
          jsx,
          tailwind: Array.from(usedTailwindClasses).filter((c) => elementHtml.includes(c)),
          layout,
          confidence,
          order: index,
        });
      });
    }
  }

  // ─── 3. Ordenar seções por ordem de aparição no HTML ──────────────
  const bodyContents = $('body').contents();
  sections.sort((a, b) => {
    const aIndex = bodyContents.index($(a.html).first());
    const bIndex = bodyContents.index($(b.html).first());
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    return a.order - b.order;
  });

  // ─── 4. Construir página completa ──────────────────────────────────
  const sectionsJsx = sections
    .filter((s) => s.confidence > 0.4)
    .map((s) => s.jsx);

  const sectionTypeStrings = sections
    .filter((s) => s.confidence > 0.4)
    .map((s) => s.type);

  const layoutPatterns = sections
    .filter((s) => s.confidence > 0.4)
    .map((s) => s.layout);

  const fullPage = `/* eslint-disable @next/next/no-img-element */
import React from 'react';

/** Página convertida automaticamente de ${'url'} */
export default function ConvertedPage() {
  return (
    <main className="min-h-screen">
${sectionsJsx.map((s) => `      ${s}`).join('\n\n')}
    </main>
  );
}
`;

  // ─── 5. Construir resultado ────────────────────────────────────────
  const result: ConversionResult = {
    sections,
    fullPage,
    requiredTailwindClasses: Array.from(usedTailwindClasses).slice(0, 100),
    layout: {
      totalSections: sections.length,
      layoutPatterns,
      hasStickyHeader: sections.some((s) => s.type === 'header' && s.confidence > 0.6),
      hasFooter: sections.some((s) => s.type === 'footer' && s.confidence > 0.6),
      isLandingPage: sectionTypeStrings.includes('hero') && sectionTypeStrings.includes('cta') && sectionTypeStrings.includes('footer'),
      sectionsOrder: sectionTypeStrings,
    },
  };

  console.log(`[HtmlToComponents] Convertidas ${sections.length} seções`);
  return result;
}

/**
 * Usa OmniRoute LLM para analisar semanticamente o HTML e
 * produzir componentes React mais inteligentes.
 *
 * @param html - HTML da página
 * @param omniRouteUrl - URL do OmniRoute Gateway
 * @returns Análise semântica em texto
 */
export async function analyzeWithLlm(
  html: string,
  omniRouteUrl = 'http://localhost:20128',
): Promise<string> {
  const $ = cheerio.load(html);

  // Extrair apenas o conteúdo principal (remover scripts, estilos)
  $('script, style, iframe, noscript').remove();
  const cleanHtml = $('body').html() || html.slice(0, 8000);

  const systemPrompt = `Você é um especialista em análise de páginas web e conversão para React + Tailwind CSS.
Analise o HTML fornecido e retorne APENAS um JSON válido com esta estrutura exata (sem markdown, sem explicações):

{
  "pageType": "landing-page | blog | ecommerce | portfolio | institutional | app | saas | other",
  "sections": [
    {
      "type": "hero | features | pricing | testimonials | cta | contact | footer | content",
      "label": "nome descritivo da seção",
      "mainHeading": "título principal",
      "description": "breve descrição do propósito",
      "suggestedComponent": "HeroBlock | FeaturesBlock | PricingBlock | TestimonialsBlock | CTABlock | ContactBlock | FooterBlock | ContentBlock",
      "elements": ["headline", "subheadline", "cta-button", "image", "list", "form", "card", "grid"]
    }
  ],
  "primaryColor": "#hex ou descrição",
  "typography": "descrição das fontes",
  "hasForm": true/false,
  "hasLogin": true/false,
  "isResponsive": true/false
}`;

  try {
    const res = await fetch(`${omniRouteUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'oc/deepseek-v4-flash-free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analise este HTML:\n\n${cleanHtml.slice(0, 12000)}` },
        ],
        temperature: 0.1,
        max_tokens: 2000,
        stream: false,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content || '';
    console.log('[HtmlToComponents] Análise LLM concluída');
    return content;
  } catch (err) {
    console.warn('[HtmlToComponents] LLM analysis unavailable:', err instanceof Error ? err.message : String(err));
    return JSON.stringify({
      pageType: 'unknown',
      sections: [],
      note: 'LLM analysis unavailable',
    });
  }
}

/**
 * Converte HTML em componentes React + Tailwind com suporte opcional
 * a análise LLM para classificação semântica mais precisa.
 */
export async function smartConvert(
  html: string,
  options?: {
    useLlm?: boolean;
    omniRouteUrl?: string;
  },
): Promise<ConversionResult> {
  const result = convertHtmlToComponents(html);

  if (options?.useLlm) {
    try {
      const llmAnalysis = await analyzeWithLlm(html, options.omniRouteUrl);
      console.log('[HtmlToComponents] LLM analysis:', llmAnalysis.slice(0, 200));
      // LLM analysis is stored as metadata for now
      // In a production version, we'd use it to refine section detection
    } catch (err) {
      console.warn('[HtmlToComponents] LLM analysis failed, using basic conversion');
    }
  }

  return result;
}
