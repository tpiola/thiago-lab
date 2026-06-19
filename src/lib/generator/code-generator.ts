/* ==========================================================================
   code-generator.ts — Gerador de Código React + Tailwind
   Monta sites completos a partir dos parâmetros do prompt engine,
   usando templates modulares e OmniRoute LLM para customizações.
   AI Site Generator — thiagolab.com
   ========================================================================== */

import type { ParsedPrompt } from './prompt-engine';
import { selectPalette, selectFontPairing, generateAnimationCSS, generateAnimationUtilities, generateColorCSS, generateTailwindUtilities } from './design-system';
import type { ColorPalette, FontPairing } from './design-system';
import { generateSection } from './templates';
import type { SectionContext } from './templates';

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface GenerateResult {
  files: GeneratedFile[];
  preview: string;
  designTokens: {
    palette: ColorPalette;
    font: FontPairing;
  };
  sections: string[];
  time: number;
}

// ─── Config ─────────────────────────────────────────────────────────────────

const OMNIROUTE_URL = process.env.OMNIROUTE_URL || 'http://localhost:20128';
const OMNIROUTE_MODEL = process.env.OMNIROUTE_MODEL || 'oc/deepseek-v4-flash-free';
const TIMEOUT_MS = 60_000;

// ─── Função Principal ───────────────────────────────────────────────────────

/**
 * Gera um site completo React + Tailwind a partir dos parâmetros interpretados.
 */
export async function generateSite(params: ParsedPrompt): Promise<GenerateResult> {
  const startTime = Date.now();
  console.log(`[CodeGenerator] 🎨 Gerando site: "${params.siteName}" (${params.type})`);

  // ─── 1. Selecionar tokens de design ─────────────────────────────────
  const palette = selectPalette({
    tone: params.tone,
    industry: params.industry,
    darkMode: params.darkMode,
  });

  const font = selectFontPairing({
    fontPairing: params.fontPairing,
    tone: params.tone,
    industry: params.industry,
  });

  console.log(`[CodeGenerator] 🎨 Paleta: "${palette.name}" | Fonte: "${font.name}"`);

  // ─── 2. Criar contexto para templates ───────────────────────────────
  const ctx: SectionContext = {
    palette,
    font,
    siteName: params.siteName,
    heroTitle: params.heroTitle,
    heroSubtitle: params.heroSubtitle,
    ctaText: params.ctaText,
    darkMode: params.darkMode,
    industry: params.industry,
    tone: params.tone,
    targetAudience: params.targetAudience,
  };

  // ─── 3. Gerar seções ────────────────────────────────────────────────
  const sectionJsxArray: string[] = [];

  for (const sectionName of params.sections) {
    let variation = 1;

    // Selecionar variação baseada no tom
    if (params.tone === 'luxo' || params.tone === 'elegante') {
      if (sectionName === 'hero') variation = 1;
      if (sectionName === 'cta') variation = 1;
    } else if (params.tone === 'minimalista') {
      if (sectionName === 'hero') variation = 2;
      if (sectionName === 'cta') variation = 2;
    } else if (params.tone === 'criativo' || params.tone === 'jovem') {
      if (sectionName === 'hero') variation = 3;
    }

    const jsx = generateSection(sectionName, ctx, variation);
    if (jsx.trim()) {
      sectionJsxArray.push(jsx);
    }
  }

  // ─── 4. Construir página completa ───────────────────────────────────
  const pageContent = buildPageContent(ctx, sectionJsxArray);
  const globalsContent = buildGlobalsCSS(ctx, palette, font);
  const layoutContent = buildLayout(ctx);

  const files: GeneratedFile[] = [
    { path: 'app/page.tsx', content: pageContent },
    { path: 'app/layout.tsx', content: layoutContent },
    { path: 'app/globals.css', content: globalsContent },
  ];

  // ─── 5. Tentar customizações via LLM ─────────────────────────────────
  try {
    const customContent = await llmCustomize(ctx, params);
    if (customContent) {
      files.push({ path: 'app/custom.css', content: customContent });
    }
  } catch {
    console.warn('[CodeGenerator] ⚠️ LLM customization skipped');
  }

  // ─── 6. Preview HTML (primeiras seções) ──────────────────────────────
  const previewSections = sectionJsxArray.slice(0, 3);
  const preview = buildPreview(ctx, previewSections);

  const result: GenerateResult = {
    files,
    preview,
    designTokens: { palette, font },
    sections: params.sections,
    time: Date.now() - startTime,
  };

  console.log(`[CodeGenerator] ✅ Gerado em ${result.time}ms — ${files.length} arquivos, ${params.sections.length} seções`);
  return result;
}

// ─── Construtores de Página ─────────────────────────────────────────────────

function buildPageContent(ctx: SectionContext, sections: string[]): string {
  const { palette, font } = ctx;
  const c = palette.colors as Record<string, string>;

  return `/* eslint-disable */
'use client';

import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
${sections.map((s) => s.split('\n').map((line) => `      ${line}`).join('\n')).join('\n\n')}
    </>
  );
}
`;
}

function buildGlobalsCSS(ctx: SectionContext, palette: ColorPalette, font: FontPairing): string {
  const colorCSS = generateColorCSS(palette);
  const animCSS = generateAnimationCSS();
  const animUtils = generateAnimationUtilities();
  const tailwindUtils = generateTailwindUtilities(palette);

  return `@import "tailwindcss";

${font.googleImport}

${colorCSS}

${tailwindUtils}

${animCSS}

${animUtils}

/* ─── Base Styles ─────────────────────────────────────── */

* {
  scroll-behavior: smooth;
}

body {
  font-family: ${font.bodyFamily};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: ${font.displayFamily};
}

/* ─── Animations ──────────────────────────────────────── */

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-delay-1 { animation-delay: 0.1s; }
.animate-delay-2 { animation-delay: 0.2s; }
.animate-delay-3 { animation-delay: 0.3s; }
.animate-delay-4 { animation-delay: 0.4s; }
.animate-delay-5 { animation-delay: 0.5s; }

/* ─── Scrollbar ───────────────────────────────────────── */

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: ${palette.colors.background};
}

::-webkit-scrollbar-thumb {
  background: ${palette.colors.border};
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: ${palette.colors.textSecondary};
}

/* ─── Selection ───────────────────────────────────────── */

::selection {
  background: ${palette.colors.secondary}33;
  color: ${palette.colors.text};
}

/* ─── Focus ───────────────────────────────────────────── */

:focus-visible {
  outline: 2px solid ${palette.colors.secondary};
  outline-offset: 2px;
}
`;
}

function buildLayout(ctx: SectionContext): string {
  const { font } = ctx;

  return `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${ctx.siteName}',
  description: '${ctx.heroSubtitle}',
  openGraph: {
    title: '${ctx.siteName}',
    description: '${ctx.heroSubtitle}',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
`;
}

function buildPreview(ctx: SectionContext, sections: string[]): string {
  const { palette, font } = ctx;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${ctx.siteName} — Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${font.googleImport}
    ${generateColorCSS(palette)}
    body { font-family: ${font.bodyFamily}; }
    h1, h2, h3, h4 { font-family: ${font.displayFamily}; }
    ::selection { background: ${palette.colors.secondary}44; }
  </style>
</head>
<body>
${sections.join('\n')}
</body>
</html>`;
}

// ─── LLM Customization ──────────────────────────────────────────────────────

async function llmCustomize(ctx: SectionContext, params: ParsedPrompt): Promise<string | null> {
  const systemPrompt = `Você é um designer CSS especialista em criar estilos customizados premium.
Gere CSS personalizado para um site React + Tailwind baseado nas especificações abaixo.

Retorne APENAS CSS puro (sem markdown, sem explicações).
Foque em:
- Gradientes personalizados
- Efeitos de hover únicos
- Animações customizadas
- Glassmorphism effects
- Texturas e patterns
- Micro-interactions

O CSS será importado como custom.css junto com Tailwind.`;

  const userPrompt = `
Site: ${params.siteName}
Tipo: ${params.type}
Setor: ${params.industry}
Tom: ${params.tone}
Paleta: ${JSON.stringify(ctx.palette.colors)}
Font Display: ${ctx.font.displayFamily}
Font Body: ${ctx.font.bodyFamily}
Dark Mode: ${params.darkMode}

Gere CSS customizado e premium que complemente o design.`;

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
        max_tokens: 2048,
        stream: false,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '';
    if (!content.trim()) return null;

    // Strip markdown code blocks if present
    const clean = content.replace(/^```(?:css)?\s*|```$/gm, '').trim();
    return clean;
  } catch {
    return null;
  }
}
