/* ==========================================================================
   /api/generator/generate — Geração via IA (v0/Framer-like)
   Prompt → Site React + Tailwind completo com design premium.
   Usa OmniRoute LLM para interpretar prompt, monta site a partir de
   templates de design-tokens, hero e sections.
   thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getPalette, getFonts, getSections, getLayoutInfo } from '@/lib/generator/design-tokens';
import type { Palette, FontSet } from '@/lib/generator/design-tokens';
import { renderHero, getRecommendedHero } from '@/lib/generator/templates/hero';
import type { HeroTemplate } from '@/lib/generator/templates/hero';
import { renderSection, getVariationForTone } from '@/lib/generator/templates/sections';
import type { SectionContext, SectionType } from '@/lib/generator/templates/sections';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

// ─── Config ─────────────────────────────────────────────────────────────────

const OMNIROUTE_URL = process.env.OMNIROUTE_URL || 'http://localhost:20128';
const OMNIROUTE_MODEL = process.env.OMNIROUTE_MODEL || 'oc/deepseek-v4-flash-free';
const TIMEOUT_MS = 60_000;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GenerateRequest {
  prompt: string;
  model?: string;
}

interface ParsedPrompt {
  siteName: string;
  type: string;
  industry: string;
  tone: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  darkMode: boolean;
  heroTemplate: HeroTemplate;
  sections: string[];
  features: string[];
  targetAudience: string;
}

export interface GenerateResponse {
  success: boolean;
  data?: {
    html: string;
    sections: string[];
    colors: Palette['colors'];
    fonts: { name: string; display: string; body: string };
    prompt_analysis: {
      siteName: string;
      type: string;
      industry: string;
      tone: string;
      heroTemplate: HeroTemplate;
      sections: string[];
    };
    rawCode: string;
    generationTime: number;
    timing?: {
      interpretation: number;
      generation: number;
      total: number;
    };
  };
  error?: string;
}

// ─── POST Handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const totalStart = Date.now();
  const logPrefix = '[Generator]';

  try {
    // ─── 1. Parse body ────────────────────────────────────────────────
    let body: GenerateRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Body JSON inválido. Envie { "prompt": "..." }' },
        { status: 400 },
      );
    }

    const { prompt } = body;
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Prompt deve ter pelo menos 5 caracteres' },
        { status: 400 },
      );
    }

    console.log(`${logPrefix} 🚀 POST /api/generator/generate`);
    console.log(`${logPrefix} 📝 Prompt: "${prompt.slice(0, 120)}..."`);

    // ─── 2. Interpretar via LLM ──────────────────────────────────────
    const interpretStart = Date.now();
    const parsed = await interpretWithLLM(prompt);
    const interpretTime = Date.now() - interpretStart;
    console.log(`${logPrefix} ✅ Interpretado: ${parsed.siteName} (${parsed.type}, tom: ${parsed.tone}) [${interpretTime}ms]`);

    // ─── 3. Selecionar design tokens ──────────────────────────────────
    const palette: Palette = getPalette(parsed.industry || parsed.type);
    const fonts: FontSet = getFonts(parsed.industry || parsed.type);
    const layoutInfo = getLayoutInfo(parsed.type);

    // Ensure sections from layout if not specified
    const sectionsList = parsed.sections.length > 0 ? parsed.sections : layoutInfo.recommendedSections;
    const heroType = parsed.heroTemplate || getRecommendedHero(parsed.type);

    const c = palette.colors;

    // ─── 4. Build hero ────────────────────────────────────────────────
    const heroHtml = renderHero(heroType, {
      company: parsed.siteName,
      tagline: parsed.heroTitle,
      subtitle: parsed.heroSubtitle,
      cta: parsed.ctaText,
      secondaryCta: 'Saiba mais',
      colors: c,
      darkMode: parsed.darkMode,
    });

    // ─── 5. Build sections ────────────────────────────────────────────
    const sectionCtx: SectionContext = {
      company: parsed.siteName,
      tagline: parsed.heroTitle,
      subtitle: parsed.heroSubtitle,
      cta: parsed.ctaText,
      colors: c,
      darkMode: parsed.darkMode,
      siteName: parsed.siteName,
      industry: parsed.industry,
    };

    const sectionsHtml: string[] = [];
    for (const sec of sectionsList) {
      if (sec === 'hero') continue; // already rendered
      const variation = getVariationForTone(sec as SectionType, parsed.tone);
      const html = renderSection(sec as SectionType, sectionCtx, variation);
      if (html.trim()) {
        sectionsHtml.push(html);
      }
    }

    // ─── 6. Assemble full page ────────────────────────────────────────
    const fullPage = buildCompletePage(palette, fonts, parsed, heroHtml, sectionsHtml);

    const genTime = Date.now() - interpretStart;
    const totalTime = Date.now() - totalStart;

    // ─── 7. LLM copy enhancement (optional) ───────────────────────────
    let enhancedCopy: string | null = null;
    try {
      enhancedCopy = await llmEnhanceCopy(parsed, palette, fonts);
    } catch {
      // Non-critical
    }

    const response: GenerateResponse = {
      success: true,
      data: {
        html: fullPage,
        sections: sectionsList,
        colors: c,
        fonts: { name: fonts.name, display: fonts.display, body: fonts.body },
        prompt_analysis: {
          siteName: parsed.siteName,
          type: parsed.type,
          industry: parsed.industry,
          tone: parsed.tone,
          heroTemplate: heroType,
          sections: sectionsList,
        },
        rawCode: enhancedCopy || fullPage,
        generationTime: totalTime,
        timing: {
          interpretation: interpretTime,
          generation: genTime,
          total: totalTime,
        },
      },
    };

    console.log(`${logPrefix} ✅ Gerado em ${totalTime}ms — ${sectionsList.length} seções`);
    return NextResponse.json(response);

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`${logPrefix} ❌ Erro:`, errorMessage);
    return NextResponse.json(
      { success: false, error: `Erro ao gerar site: ${errorMessage}` },
      { status: 500 },
    );
  }
}

// ─── LLM Interpretation ─────────────────────────────────────────────────────

async function interpretWithLLM(prompt: string): Promise<ParsedPrompt> {
  const systemPrompt = `Você é um designer/desenvolvedor expert em criar sites premium.
Analise o prompt do usuário e extraia parâmetros estruturados.

Retorne APENAS JSON válido (sem markdown, sem explicações):

{
  "type": "landing|saas|ecommerce|portfolio|blog|app|institutional|restaurant|health|education|event|agency",
  "industry": "setor/detecao (ex: Tecnologia, Saúde, Moda, Gastronomia)",
  "siteName": "nome do projeto",
  "heroTitle": "título principal impactante (máx 12 palavras)",
  "heroSubtitle": "subtítulo explicativo (máx 20 palavras)",
  "ctaText": "texto do botão principal (ex: Começar agora, Solicitar demonstração)",
  "tone": "luxo|moderno|minimalista|corporativo|criativo|tecnico|divertido|elegante|profissional|jovem|serio",
  "heroTemplate": "center|split|fullscreen|animated|video|minimal",
  "sections": ["hero","features","pricing","testimonials","cta","footer"],
  "darkMode": false,
  "features": ["feature1","feature2"],
  "targetAudience": "descrição do público"
}

REGRAS:
- Gere conteúdo REAL e ESPECÍFICO para o nicho mencionado
- heroTemplate: center (texto central), split (texto+imagem), fullscreen (gradiente fundo), animated (com animações), video (foco mídia), minimal (limpo)
- Para luxo/premium: center ou split com Gold Noir
- Para tech/startup: split ou animated
- Para portfólio/criativo: fullscreen
- sections deve conter as seções mais adequadas (mínimo: hero, features, cta, footer)
- Se o prompt mencionar dark/escuro/noturno, set darkMode: true`;

  try {
    const res = await fetch(`${OMNIROUTE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OMNIROUTE_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 2048,
        stream: false,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      console.warn(`[Generator] LLM HTTP ${res.status}, usando fallback`);
      return fallbackInterpret(prompt);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '';
    if (!content.trim()) return fallbackInterpret(prompt);

    return parseLLMJson(content, prompt);
  } catch (err) {
    console.warn('[Generator] LLM error:', (err as Error).message);
    return fallbackInterpret(prompt);
  }
}

function parseLLMJson(raw: string, originalPrompt: string): ParsedPrompt {
  let jsonStr = raw;
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonStr = jsonMatch[1];

  const start = jsonStr.indexOf('{');
  const end = jsonStr.lastIndexOf('}');
  if (start !== -1 && end > start) {
    jsonStr = jsonStr.slice(start, end + 1);
  }

  try {
    const parsed = JSON.parse(jsonStr);
    const heroTemplates: HeroTemplate[] = ['center', 'split', 'fullscreen', 'animated', 'video', 'minimal'];
    const heroTemplate = heroTemplates.includes(parsed.heroTemplate) ? parsed.heroTemplate : 'center';

    return {
      type: String(parsed.type || 'landing').toLowerCase(),
      industry: String(parsed.industry || '').trim() || 'Tecnologia',
      siteName: String(parsed.siteName || '').trim() || extractSiteName(originalPrompt),
      heroTitle: String(parsed.heroTitle || '').trim() || 'Transforme suas ideias em realidade',
      heroSubtitle: String(parsed.heroSubtitle || '').trim() || 'Soluções premium para o seu negócio',
      ctaText: String(parsed.ctaText || '').trim() || 'Começar agora',
      tone: String(parsed.tone || 'moderno').toLowerCase(),
      heroTemplate,
      sections: Array.isArray(parsed.sections) && parsed.sections.length > 0
        ? [...new Set(parsed.sections as string[])]
        : ['hero', 'features', 'cta', 'footer'],
      features: Array.isArray(parsed.features) ? parsed.features as string[] : [],
      targetAudience: String(parsed.targetAudience || '').trim() || 'Público geral',
      darkMode: parsed.darkMode === true,
    };
  } catch {
    return fallbackInterpret(originalPrompt);
  }
}

function fallbackInterpret(prompt: string): ParsedPrompt {
  const lower = prompt.toLowerCase();

  let type = 'landing';
  if (/saas|software|plataforma|app.*web/i.test(lower)) type = 'saas';
  else if (/ecommerce|loja|produtos|comprar|shop/i.test(lower)) type = 'ecommerce';
  else if (/portf[oó]lio|trabalhos|showcase/i.test(lower)) type = 'portfolio';
  else if (/blog|artigos|conte[úu]do/i.test(lower)) type = 'blog';
  else if (/restaurante|card[aá]pio|food|comida/i.test(lower)) type = 'restaurant';
  else if (/sa[úu]de|cl[ií]nica|m[eé]dico|hospital|est[eé]tica/i.test(lower)) type = 'health';
  else if (/educação|curso|escola/i.test(lower)) type = 'education';
  else if (/evento|casamento|festa/i.test(lower)) type = 'event';
  else if (/ag[eê]ncia|consultoria|marketing/i.test(lower)) type = 'agency';

  let tone = 'moderno';
  if (/luxo|sofisticado|premium|elegante|dourado|exclusivo/i.test(lower)) tone = 'luxo';
  else if (/minimalista|limpo|simples|clean/i.test(lower)) tone = 'minimalista';
  else if (/divertido|colorido|criativo|jovem/i.test(lower)) tone = 'criativo';
  else if (/corporativo|profissional|empresarial/i.test(lower)) tone = 'corporativo';

  const darkMode = /dark|escuro|preto|noturno/i.test(lower) || tone === 'luxo';

  const sections = ['hero'];
  if (/features?|funcionalidades|recursos|serviços/i.test(lower)) sections.push('features');
  if (/pricing|pre[çc]os|planos/i.test(lower)) sections.push('pricing');
  if (/testimonial|depoimentos|clientes/i.test(lower)) sections.push('testimonials');
  if (/faq|perguntas|d[vú]vidas/i.test(lower)) sections.push('faq');
  if (/contato|contact|fale.*conosco/i.test(lower)) sections.push('contact');
  if (!sections.includes('cta')) sections.push('cta');
  if (!sections.includes('footer')) sections.push('footer');

  return {
    type,
    industry: extractIndustry(prompt, type),
    siteName: extractSiteName(prompt) || 'Meu Site Premium',
    heroTitle: extractHeroTitle(prompt, type),
    heroSubtitle: extractHeroSubtitle(prompt, type),
    ctaText: type === 'saas' ? 'Começar grátis' : type === 'health' ? 'Agendar consulta' : 'Fale conosco',
    tone,
    heroTemplate: darkMode ? 'animated' : 'center',
    sections: [...new Set(sections)],
    features: [],
    targetAudience: 'Público geral',
    darkMode,
  };
}

function extractSiteName(prompt: string): string {
  const patterns = [
    /(?:chamado|criado|para) ["']([^"']+)["']/i,
    /(?:para|da) (?:empresa|marca|neg[óo]cio|startup|cl[ií]nica|restaurante) ([^,\.]+)/i,
    /(?:site|landing page|portal) (?:do|da|para) ([^,\.]+)/i,
  ];
  for (const p of patterns) {
    const m = prompt.match(p);
    if (m) return m[1].trim();
  }
  return '';
}

function extractHeroTitle(prompt: string, type: string): string {
  const titles: Record<string, string> = {
    saas: 'Revolucione seu negócio com tecnologia inteligente',
    ecommerce: 'Sua loja online em minutos',
    portfolio: 'Criatividade sem limites',
    health: 'Sua saúde em boas mãos',
    restaurant: 'Uma experiência gastronômica única',
    education: 'O conhecimento ao alcance de todos',
    agency: 'Estratégia criativa. Resultados reais.',
    event: 'O grande dia está chegando',
  };
  return titles[type] || 'Transforme suas ideias em realidade';
}

function extractHeroSubtitle(prompt: string, type: string): string {
  const subtitles: Record<string, string> = {
    saas: 'Plataforma completa para acelerar seu crescimento com ferramentas inteligentes e suporte dedicado.',
    health: 'Cuidado humanizado com profissionais qualificados e tecnologia de ponta para seu bem-estar.',
    restaurant: 'Sabores que encantam em um ambiente pensado para momentos inesquecíveis.',
    agency: 'Da estratégia à execução, entregamos resultados que transformam marcas.',
  };
  return subtitles[type] || 'Soluções premium para transformar seu negócio digital com design excepcional.';
}

function extractIndustry(prompt: string, type: string): string {
  const industryMap: Record<string, string> = {
    landing: 'Tecnologia',
    saas: 'SaaS/Tecnologia',
    ecommerce: 'E-commerce',
    portfolio: 'Portfólio Criativo',
    blog: 'Conteúdo Digital',
    institutional: 'Institucional',
    restaurant: 'Gastronomia',
    health: 'Saúde & Bem-estar',
    education: 'Educação',
    event: 'Eventos',
    agency: 'Agência Digital',
  };
  return industryMap[type] || 'Tecnologia';
}

// ─── LLM Copy Enhancement (optional) ────────────────────────────────────────

async function llmEnhanceCopy(parsed: ParsedPrompt, palette: Palette, fonts: FontSet): Promise<string | null> {
  const systemPrompt = `Você é um copywriter especializado em sites premium.
Gere uma versão aprimorada do HTML com copy persuasiva e personalizada.
Retorne APENAS o código HTML completo (sem markdown).`;

  const userPrompt = `Site: ${parsed.siteName}
Tipo: ${parsed.type}
Setor: ${parsed.industry}
Tom: ${parsed.tone}
Paleta: ${palette.name} (${JSON.stringify(palette.colors)})
Fontes: ${fonts.name}

Gere HTML completo com:
- Hero section com copy impactante
- Features section com 3-6 benefícios
- CTA section persuasiva
- Footer
- Tailwind CSS classes via CDN
- Design responsivo`;

  try {
    const res = await fetch(`${OMNIROUTE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OMNIROUTE_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 4096,
        stream: false,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '';
    const clean = content.replace(/^```(?:html)?\s*|```$/gm, '').trim();
    return clean || null;
  } catch {
    return null;
  }
}

// ─── Page Builder ───────────────────────────────────────────────────────────

function buildCompletePage(
  palette: Palette,
  fonts: FontSet,
  parsed: ParsedPrompt,
  heroHtml: string,
  sectionsHtml: string[],
): string {
  const c = palette.colors;

  const allSections = [heroHtml, ...sectionsHtml].join('\n\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${parsed.siteName} — ${parsed.heroTitle}</title>
  <meta name="description" content="${parsed.heroSubtitle}" />
  <meta property="og:title" content="${parsed.siteName}" />
  <meta property="og:description" content="${parsed.heroSubtitle}" />
  <meta property="og:type" content="website" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${fonts.googleImport}

    :root {
      --color-primary: ${c.primary};
      --color-secondary: ${c.secondary};
      --color-accent: ${c.accent};
      --color-background: ${c.background};
      --color-surface: ${c.surface};
      --color-text: ${c.text};
      --color-text-secondary: ${c.textSecondary};
      --color-border: ${c.border};
      --color-error: ${c.error};
      --color-success: ${c.success};
      --color-warning: ${c.warning};
    }

    * { scroll-behavior: smooth; margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: ${fonts.bodyFamily};
      background: ${c.background};
      color: ${c.text};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: ${fonts.displayFamily};
    }

    ::selection {
      background: ${c.secondary}33;
      color: ${c.text};
    }

    :focus-visible {
      outline: 2px solid ${c.secondary};
      outline-offset: 2px;
    }

    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: ${c.background}; }
    ::-webkit-scrollbar-thumb { background: ${c.border}; border-radius: 4px; }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    [data-animate] {
      opacity: 0;
    }

    [data-animate].is-visible {
      animation: fadeInUp 0.6s ease-out forwards;
    }

    @media (prefers-reduced-motion: reduce) {
      [data-animate] { opacity: 1; }
      *, *::before, *::after { animation-duration: 0.01ms !important; }
    }
  </style>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    });
  </script>
</head>
<body>
  <!-- ═══════════════ HEADER ═══════════════ -->
  <header class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[${c.background}]/80 border-b border-[${c.border}]/30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 md:h-20">
        <a href="/" class="flex items-center gap-2 group">
          <div class="w-8 h-8 rounded-lg bg-[${c.secondary}] flex items-center justify-center">
            <span class="text-[${c.background}] font-bold text-sm">S</span>
          </div>
          <span class="font-semibold text-lg tracking-tight text-[${c.text}]">${parsed.siteName}</span>
        </a>
        <nav class="hidden md:flex items-center gap-8">
          <a href="#features" class="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Recursos</a>
          <a href="#pricing" class="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Preços</a>
          <a href="#testimonials" class="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Depoimentos</a>
          <a href="#contact" class="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Contato</a>
        </nav>
        <div class="flex items-center gap-3">
          <a href="#login" class="hidden sm:inline-flex text-sm font-medium text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Entrar</a>
          <a href="#cta" class="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-[${c.background}] bg-[${c.secondary}] hover:opacity-90 transition-all shadow-lg shadow-[${c.secondary}]/20">
            ${parsed.ctaText}
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- ═══════════════ HERO ═══════════════ -->
  ${heroHtml}

  <!-- ═══════════════ SECTIONS ═══════════════ -->
  ${sectionsHtml.join('\n\n')}

  <!-- ═══════════════ COPYRIGHT ═══════════════ -->
  <p class="text-center text-xs text-[${c.textSecondary}] py-6 border-t border-[${c.border}]/50">
    © ${new Date().getFullYear()} ${parsed.siteName}. Todos os direitos reservados. Gerado por ThiagoLab AI.
  </p>
</body>
</html>`;
}
