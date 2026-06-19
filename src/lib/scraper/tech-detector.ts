/* ==========================================================================
   tech-detector.ts — Detector de Tech Stack de Sites
   Analisa HTML, scripts, meta tags, classes CSS e headers HTTP
   para identificar frameworks, CMS, hospedagem e ferramentas.
   Firecrawl-like Scraper — thiagolab.com
   ========================================================================== */

import * as cheerio from 'cheerio';

// ─── Tipos ──────────────────────────────────────────────────────────────────

/** Resultado completo da detecção de tecnologia */
export interface TechStack {
  /** Framework JavaScript principal (React, Next.js, Vue, Angular, etc.) */
  framework: string | null;
  /** Framework CSS principal (Tailwind, Bootstrap, etc.) */
  cssFramework: string | null;
  /** CMS identificado (WordPress, Shopify, etc.) */
  cms: string | null;
  /** Plataforma de hospedagem (Vercel, Netlify, etc.) */
  hosting: string | null;
  /** Ferramentas de analytics */
  analytics: string[];
  /** Outras tecnologias detectadas */
  outros: string[];
  /** Versões específicas quando detectadas */
  versoes: Record<string, string>;
}

interface TechPattern {
  name: string;
  category: 'framework' | 'cssFramework' | 'cms' | 'hosting' | 'analytics' | 'outros';
  /** Padrões para buscar no HTML/script src */
  htmlPatterns?: RegExp[];
  /** Padrões para buscar em classes CSS */
  classPatterns?: RegExp[];
  /** Padrões para buscar em meta tags */
  metaPatterns?: { name?: string; content?: RegExp }[];
  /** Padrões para buscar em headers HTTP */
  headerPatterns?: { header: string; pattern: RegExp }[];
}

// ─── Padrões de Detecção ────────────────────────────────────────────────────

const TECH_PATTERNS: TechPattern[] = [
  // ── Frameworks JS ──
  {
    name: 'Next.js',
    category: 'framework',
    htmlPatterns: [/__NEXT_DATA__/, /__NEXT_LOADED_PAGES__/, /__NEXT_LOADABLE_CONTEXT__/],
  },
  {
    name: 'React',
    category: 'framework',
    htmlPatterns: [/data-reactroot/, /data-reactid/, /data-react-class/, /data-react-props/, /reactRoot/],
    classPatterns: [],
  },
  {
    name: 'Vue.js',
    category: 'framework',
    htmlPatterns: [/__VUE__/, /vue-root/, /vue-app/, /data-v-/],
    classPatterns: [],
  },
  {
    name: 'Angular',
    category: 'framework',
    htmlPatterns: [/ng-version/, /ng-app/, /ng-controller/],
    classPatterns: [/ng-/],
  },
  {
    name: 'Svelte',
    category: 'framework',
    htmlPatterns: [/svelte-\w+/, /__SVELTEKIT__/],
    classPatterns: [/svelte-/],
  },
  {
    name: 'Nuxt.js',
    category: 'framework',
    htmlPatterns: [/__NUXT__/],
  },
  {
    name: 'Gatsby',
    category: 'framework',
    htmlPatterns: [/___gatsby/, /gatsby-/],
  },
  {
    name: 'Remix',
    category: 'framework',
    htmlPatterns: [/__remixContext/, /remix-manifest/],
  },
  {
    name: 'Astro',
    category: 'framework',
    htmlPatterns: [/astro-/],
    metaPatterns: [{ name: 'generator', content: /astro/i }],
  },
  {
    name: 'Preact',
    category: 'framework',
    htmlPatterns: [/preact/i],
  },
  {
    name: 'Alpine.js',
    category: 'framework',
    htmlPatterns: [/x-data/, /x-init/, /x-show/, /x-if/, /alpine/i],
  },
  {
    name: 'HTMX',
    category: 'framework',
    htmlPatterns: [/htmx/, /hx-get/, /hx-post/, /hx-target/],
  },

  // ── CSS Frameworks ──
  {
    name: 'Tailwind CSS',
    category: 'cssFramework',
    classPatterns: [
      /\bflex\b/, /\bgrid\b/, /\bcontainer\b/,
      /\bp-\d/, /\bm-\d/, /\bpx-\d/, /\bpy-\d/, /\bmx-\d/, /\bmy-\d/,
      /\btext-\w+/, /\bbg-\w+/, /\bborder-\w+/,
      /\bjustify-\w+/, /\bitems-\w+/, /\bgap-\d/,
      /\bmd:\w+/, /\blg:\w+/, /\bsm:\w+/,
      /\bdark:\w+/,
      /\bpt-\d+/, /\bpb-\d+/, /\bpl-\d+/, /\bpr-\d+/,
      /\bmt-\d+/, /\bmb-\d+/, /\bml-\d+/, /\bmr-\d+/,
      /\bw-\w+/, /\bh-\w+/, /\bmin-h-\w+/, /\bmax-w-\w+/,
      /\bshadow-\w+/, /\brounded-\w+/,
      /\bfont-\w+/, /\bleading-\w+/,
      /\btransition\b/, /\bduration-\d+/, /\btransform\b/,
    ],
  },
  {
    name: 'Bootstrap',
    category: 'cssFramework',
    classPatterns: [
      /\bcontainer\b/, /\brow\b/, /\bcol-\w+/,
      /\bcol-md-\d+/, /\bcol-lg-\d+/, /\bcol-sm-\d+/,
      /\bbtn\b/, /\bbtn-\w+/, /\balert\b/, /\bcard\b/,
      /\bnavbar\b/, /\bmodal\b/, /\bform-control\b/,
      /\btable\b/, /\btable-\w+/,
      /\btext-\w+/, /\bbg-\w+/,
      /\bd-\w+/, /\bm-\d+/, /\bp-\d+/,
      /\bjustify-content-\w+/, /\balign-items-\w+/,
    ],
  },
  {
    name: 'Bulma',
    category: 'cssFramework',
    classPatterns: [/^column/, /^columns/, /^button is-/, /^field/, /^control/, /^box/, /^notification/],
  },
  {
    name: 'Materialize',
    category: 'cssFramework',
    classPatterns: [/materialize/, /^card-panel/, /^btn waves/],
  },
  {
    name: 'Foundation',
    category: 'cssFramework',
    classPatterns: [/foundation/i, /^top-bar/, /^callout/, /^orbit/],
  },
  {
    name: 'Chakra UI',
    category: 'cssFramework',
    htmlPatterns: [/chakra-ui/i, /chakra_/],
    classPatterns: [/css-\w+/],
  },
  {
    name: 'MUI (Material UI)',
    category: 'cssFramework',
    classPatterns: [/Mui\w+/, /MuiPaper/, /MuiButton/, /MuiGrid/],
  },
  {
    name: 'Shadcn/ui',
    category: 'cssFramework',
    htmlPatterns: [/shadcn/i],
    classPatterns: [],
  },

  // ── CMS ──
  {
    name: 'WordPress',
    category: 'cms',
    htmlPatterns: [/\/wp-content\//, /\/wp-json\//, /wp-includes/, /wp-block/],
    metaPatterns: [{ name: 'generator', content: /WordPress/i }],
  },
  {
    name: 'Shopify',
    category: 'cms',
    htmlPatterns: [/\/cdn\/shop\//, /shopify/, /Shopify\.\w+/],
  },
  {
    name: 'Wix',
    category: 'cms',
    htmlPatterns: [/wix\.com/, /Wix\./, /wixSession/],
  },
  {
    name: 'Squarespace',
    category: 'cms',
    htmlPatterns: [/squarespace/i, /static1\.squarespace/],
  },
  {
    name: 'Webflow',
    category: 'cms',
    htmlPatterns: [/webflow/i, /wfu-/],
    classPatterns: [/w-\w+/],
  },
  {
    name: 'Ghost',
    category: 'cms',
    htmlPatterns: [/ghost/i, /ghost-portal/],
    metaPatterns: [{ name: 'generator', content: /Ghost/i }],
  },
  {
    name: 'Drupal',
    category: 'cms',
    htmlPatterns: [/drupal/i, /\/sites\/default\//],
  },
  {
    name: 'Joomla',
    category: 'cms',
    htmlPatterns: [/joomla/i, /\/components\/com_/],
  },
  {
    name: 'Sanity',
    category: 'cms',
    htmlPatterns: [/sanity/i, /@sanity/],
  },
  {
    name: 'Strapi',
    category: 'cms',
    htmlPatterns: [/strapi/i, /_strapi/],
  },

  // ── Hospedagem ──
  {
    name: 'Vercel',
    category: 'hosting',
    htmlPatterns: [/vercel/i],
    headerPatterns: [{ header: 'x-vercel-id', pattern: /.*/ }],
  },
  {
    name: 'Netlify',
    category: 'hosting',
    headerPatterns: [{ header: 'server', pattern: /netlify/i }],
  },
  {
    name: 'Cloudflare Pages',
    category: 'hosting',
    headerPatterns: [{ header: 'server', pattern: /cloudflare/i }],
  },
  {
    name: 'AWS (CloudFront)',
    category: 'hosting',
    headerPatterns: [{ header: 'server', pattern: /CloudFront/i }],
  },
  {
    name: 'GitHub Pages',
    category: 'hosting',
    headerPatterns: [{ header: 'server', pattern: /GitHub\.com/i }],
  },
  {
    name: 'Firebase Hosting',
    category: 'hosting',
    headerPatterns: [{ header: 'x-powered-by', pattern: /Firebase/i }],
  },

  // ── Analytics ──
  {
    name: 'Google Analytics',
    category: 'analytics',
    htmlPatterns: [/gtag\s*\(/, /ga\s*\(/, /googletagmanager/, /G-[A-Z0-9]+/, /UA-\d+/],
  },
  {
    name: 'Meta Pixel',
    category: 'analytics',
    htmlPatterns: [/fbq\s*\(/, /connect\.facebook\.net/, /pixel/i],
  },
  {
    name: 'Hotjar',
    category: 'analytics',
    htmlPatterns: [/hotjar/i, /hj\s*\(/],
  },
  {
    name: 'HubSpot',
    category: 'analytics',
    htmlPatterns: [/js\.hs-scripts/, /hubspot/i, /hs-analytics/],
  },
  {
    name: 'Plausible',
    category: 'analytics',
    htmlPatterns: [/plausible\.io/, /plausible\s*\(/],
  },
  {
    name: 'Cloudflare Web Analytics',
    category: 'analytics',
    htmlPatterns: [/cloudflareinsights/, /beacon\.min\.js/],
  },
  {
    name: 'Microsoft Clarity',
    category: 'analytics',
    htmlPatterns: [/clarity\.ms/, /clarity\s*\(/],
  },
  {
    name: 'Amplitude',
    category: 'analytics',
    htmlPatterns: [/amplitude\.com/, /amplitude\s*\(/],
  },
  {
    name: 'Mixpanel',
    category: 'analytics',
    htmlPatterns: [/mixpanel\.com/, /mixpanel\s*\(/],
  },
  {
    name: 'LinkedIn Insight Tag',
    category: 'analytics',
    htmlPatterns: [/snap\.licdn\.com/, /_linkedin_partner_id/],
  },

  // ── Outros ──
  {
    name: 'jQuery',
    category: 'outros',
    htmlPatterns: [/jquery/i, /\$\./],
  },
  {
    name: 'GSAP',
    category: 'outros',
    htmlPatterns: [/gsap/i, /TweenMax/, /TimelineMax/],
  },
  {
    name: 'Three.js',
    category: 'outros',
    htmlPatterns: [/three\.js/i, /three\.min\.js/, /THREE\./],
  },
  {
    name: 'Swiper.js',
    category: 'outros',
    htmlPatterns: [/swiper/i, /Swiper/],
  },
  {
    name: 'Framer Motion',
    category: 'outros',
    htmlPatterns: [/framer-motion/i, /motion\./],
  },
  {
    name: 'Font Awesome',
    category: 'outros',
    htmlPatterns: [/font-awesome/i, /fontawesome/, /fa-/],
    classPatterns: [/fa\s/, /fa-\w+/],
  },
  {
    name: 'Google Fonts',
    category: 'outros',
    htmlPatterns: [/fonts\.googleapis\.com/, /fonts\.gstatic\.com/],
  },
  {
    name: 'Typekit/Adobe Fonts',
    category: 'outros',
    htmlPatterns: [/use\.typekit\.net/, /ptype\.com/],
  },
  {
    name: 'Lodash',
    category: 'outros',
    htmlPatterns: [/lodash/i, /_\.\w+/],
  },
  {
    name: 'Axios',
    category: 'outros',
    htmlPatterns: [/axios/i],
  },
  {
    name: 'Socket.io',
    category: 'outros',
    htmlPatterns: [/socket\.io/i, /io\.connect/],
  },
  {
    name: 'Recaptcha',
    category: 'outros',
    htmlPatterns: [/recaptcha/i, /g-recaptcha/],
  },
  {
    name: 'Stripe',
    category: 'outros',
    htmlPatterns: [/stripe\.com/, /Stripe/, /pk_live_/],
  },
  {
    name: 'Prismic',
    category: 'outros',
    htmlPatterns: [/prismic\.io/i, /prismic/i],
  },
  {
    name: 'Contentful',
    category: 'outros',
    htmlPatterns: [/contentful/i, /ctfassets/],
  },
];

// ─── Headers HTTP para detectar tecnologia ──────────────────────────────────

const TECH_HEADERS: { header: string; pattern: RegExp; name: string }[] = [
  { header: 'x-powered-by', pattern: /Next\.?js/i, name: 'Next.js' },
  { header: 'x-powered-by', pattern: /Express/i, name: 'Express' },
  { header: 'x-powered-by', pattern: /PHP/i, name: 'PHP' },
  { header: 'x-powered-by', pattern: /ASP\.NET/i, name: 'ASP.NET' },
  { header: 'x-powered-by', pattern: /Django/i, name: 'Django' },
  { header: 'x-powered-by', pattern: /Rails/i, name: 'Ruby on Rails' },
  { header: 'server', pattern: /nginx/i, name: 'Nginx' },
  { header: 'server', pattern: /Apache/i, name: 'Apache' },
  { header: 'server', pattern: /Caddy/i, name: 'Caddy' },
  { header: 'x-vercel-id', pattern: /.*/, name: 'Vercel' },
  { header: 'x-robots-tag', pattern: /.*/, name: 'Custom Robots Tag' },
];

// ─── Função Principal ───────────────────────────────────────────────────────

/**
 * Detecta a tech stack de um site a partir do HTML e headers HTTP.
 *
 * @param html - HTML completo da página
 * @param headers - Headers HTTP da resposta (opcional)
 * @returns TechStack com todas as tecnologias detectadas
 *
 * @example
 * ```ts
 * const tech = detectTechStack(html, responseHeaders);
 * console.log(tech.framework); // 'Next.js'
 * ```
 */
export function detectTechStack(
  html: string,
  headers?: Record<string, string>,
): TechStack {
  const result: TechStack = {
    framework: null,
    cssFramework: null,
    cms: null,
    hosting: null,
    analytics: [],
    outros: [],
    versoes: {},
  };

  const $ = cheerio.load(html);

  // ─── 1. Extrair script src tags ───────────────────────────────────────
  const scriptSrcs: string[] = [];
  $('script[src]').each((_, el) => {
    const src = $(el).attr('src');
    if (src) scriptSrcs.push(src);
  });

  // ─── 2. Extrair meta tags de generator ────────────────────────────────
  const metaTags: Record<string, string> = {};
  $('meta').each((_, el) => {
    const name = $(el).attr('name') || $(el).attr('property') || '';
    const content = $(el).attr('content') || '';
    if (name) metaTags[name] = content;
  });

  // ─── 3. Extrair classes de todos os elementos ─────────────────────────
  const allClasses = new Set<string>();
  $('[class]').each((_, el) => {
    const cls = $(el).attr('class');
    if (cls) {
      cls.split(/\s+/).forEach((c) => {
        if (c.trim()) allClasses.add(c.trim());
      });
    }
  });
  const classesArray = Array.from(allClasses);

  // ─── 4. Combinar todo o HTML com scripts para busca ───────────────────
  const fullHtml = html + '\n' + scriptSrcs.join('\n');

  // ─── 5. Verificar patterns ────────────────────────────────────────────
  for (const pattern of TECH_PATTERNS) {
    let found = false;

    // Verificar HTML/script patterns
    if (pattern.htmlPatterns) {
      for (const regex of pattern.htmlPatterns) {
        if (regex.test(fullHtml)) {
          found = true;
          break;
        }
      }
    }

    // Verificar class patterns
    if (!found && pattern.classPatterns) {
      for (const regex of pattern.classPatterns) {
        for (const cls of classesArray) {
          if (regex.test(cls)) {
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }

    // Verificar meta patterns
    if (!found && pattern.metaPatterns) {
      for (const mp of pattern.metaPatterns) {
        const metaContent = mp.name ? metaTags[mp.name] : undefined;
        if (metaContent && mp.content?.test(metaContent)) {
          found = true;
          break;
        }
      }
    }

    // Verificar header patterns
    if (!found && pattern.headerPatterns && headers) {
      for (const hp of pattern.headerPatterns) {
        const headerValue = headers[hp.header.toLowerCase()] || headers[hp.header];
        if (headerValue && hp.pattern.test(headerValue)) {
          found = true;
          break;
        }
      }
    }

    if (found) {
      switch (pattern.category) {
        case 'framework':
          // Não sobrescrever Next.js se React já foi detectado (Next.js é mais específico)
          if (pattern.name === 'Next.js' && result.framework === 'React') {
            result.framework = 'Next.js';
          } else if (!result.framework) {
            result.framework = pattern.name;
          }
          break;
        case 'cssFramework':
          if (!result.cssFramework) result.cssFramework = pattern.name;
          break;
        case 'cms':
          if (!result.cms) result.cms = pattern.name;
          break;
        case 'hosting':
          if (!result.hosting) result.hosting = pattern.name;
          break;
        case 'analytics':
          if (!result.analytics.includes(pattern.name)) {
            result.analytics.push(pattern.name);
          }
          break;
        case 'outros':
          if (!result.outros.includes(pattern.name)) {
            result.outros.push(pattern.name);
          }
          break;
      }
    }
  }

  // ─── 6. Verificar headers HTTP ────────────────────────────────────────
  if (headers) {
    for (const th of TECH_HEADERS) {
      const headerValue = headers[th.header.toLowerCase()] || headers[th.header];
      if (headerValue && th.pattern.test(headerValue)) {
        // Mapear para categoria apropriada
        if (th.name === 'Next.js' && !result.framework) {
          result.framework = 'Next.js';
        } else if (th.name === 'Vercel' && !result.hosting) {
          result.hosting = 'Vercel';
        } else if (th.name === 'Nginx' || th.name === 'Apache' || th.name === 'Caddy') {
          if (!result.outros.includes(th.name)) result.outros.push(th.name);
        } else {
          if (!result.outros.includes(th.name)) result.outros.push(th.name);
        }
      }
    }
  }

  // ─── 7. Extrair versões quando possível ───────────────────────────────
  // WordPress version from meta
  if (metaTags.generator && result.cms === 'WordPress') {
    const wpMatch = metaTags.generator.match(/WordPress\s*([\d.]+)/i);
    if (wpMatch) result.versoes['WordPress'] = wpMatch[1];
  }

  // Next.js version
  if (result.framework === 'Next.js') {
    const nextMatch = fullHtml.match(/__NEXT_DATA__.*?"version"\s*:\s*"([^"]+)"/);
    if (nextMatch) result.versoes['Next.js'] = nextMatch[1];
  }

  console.log('[TechDetector] Resultado:', JSON.stringify(result, null, 2));
  return result;
}

/**
 * Extrai informações de versão de bibliotecas a partir de URLs de scripts.
 *
 * @param scriptSrcs - Array de URLs de scripts
 * @returns Objeto com nome e versão
 */
export function extractVersionsFromScripts(scriptSrcs: string[]): Record<string, string> {
  const versions: Record<string, string> = {};

  const patterns: [string, RegExp][] = [
    ['jQuery', /jquery[.-]?([\d.]+)(?:\.min)?\.js/],
    ['Bootstrap', /bootstrap[.-]?([\d.]+)(?:\.min)?\.js/],
    ['React', /react[.-]?([\d.]+)(?:\.min)?\.js/],
    ['Vue', /vue[.-]?([\d.]+)(?:\.min)?\.js/],
    ['Angular', /angular[.-]?([\d.]+)(?:\.min)?\.js/],
    ['GSAP', /gsap[.-]?([\d.]+)(?:\.min)?\.js/],
    ['Three.js', /three[.-]?([\d.]+)(?:\.min)?\.js/],
    ['Swiper', /swiper[.-]?([\d.]+)(?:\.min)?\.js/],
  ];

  for (const src of scriptSrcs) {
    for (const [name, pattern] of patterns) {
      const match = src.match(pattern);
      if (match && match[1]) {
        versions[name] = match[1];
        break;
      }
    }
  }

  return versions;
}
