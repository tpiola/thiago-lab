/* ==========================================================================
   /api/generator/preview — Endpoint de Preview Rápido
   Gera HTML preview da primeira seção (hero) para visualização
   em tempo real enquanto o usuário digita.
   AI Site Generator — thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { interpretPrompt } from '@/lib/generator/prompt-engine';
import { selectPalette, selectFontPairing, generateColorCSS } from '@/lib/generator/design-system';
import { generateSection } from '@/lib/generator/templates';
import type { SectionContext } from '@/lib/generator/templates';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * POST /api/generator/preview
 *
 * Gera preview rápido (hero + CTA) para visualização em tempo real.
 *
 * Body:
 * ```json
 * {
 *   "prompt": "Landing page para clínica de estética...",
 *   "model": "oc/deepseek-v4-flash-free"
 * }
 * ```
 *
 * Resposta:
 * ```json
 * {
 *   "success": true,
 *   "html": "<html>...</html>",
 *   "type": "landing",
 *   "designTokens": {...},
 *   "time": 123
 * }
 * ```
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // ─── Validar body ────────────────────────────────────────────────
    let body: { prompt: string; model?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Body JSON inválido' },
        { status: 400 },
      );
    }

    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Prompt deve ter pelo menos 3 caracteres' },
        { status: 400 },
      );
    }

    console.log(`[Preview API] 🚀 POST /api/generator/preview — "${prompt.slice(0, 60)}..."`);

    // ─── Interpretar prompt (rápido) ─────────────────────────────────
    const params = await interpretPrompt(prompt);

    // ─── Selecionar design tokens ────────────────────────────────────
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

    // ─── Criar contexto ──────────────────────────────────────────────
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

    // ─── Gerar hero section ──────────────────────────────────────────
    let heroVariation = 1;
    if (params.tone === 'luxo' || params.tone === 'elegante') heroVariation = 1;
    else if (params.tone === 'minimalista') heroVariation = 2;
    else if (params.tone === 'criativo' || params.tone === 'jovem') heroVariation = 3;

    const heroHtml = generateSection('hero', ctx, heroVariation);
    const ctaHtml = generateSection('cta', ctx, 2); // CTA minimalista

    // ─── Montar preview HTML ─────────────────────────────────────────
    const colorCSS = generateColorCSS(palette);
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${params.siteName} — Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${font.googleImport}
    ${colorCSS}
    body { font-family: ${font.bodyFamily}; margin: 0; }
    h1, h2, h3, h4, h5, h6 { font-family: ${font.displayFamily}; }
    * { scroll-behavior: smooth; }
    ::selection { background: ${palette.colors.secondary}44; }
    .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  </style>
</head>
<body>
${heroHtml}
${ctaHtml}
</body>
</html>`;

    const time = Date.now() - startTime;

    console.log(`[Preview API] ✅ Preview gerado em ${time}ms — tipo=${params.type}`);

    return NextResponse.json({
      success: true,
      html,
      type: params.type,
      siteName: params.siteName,
      designTokens: {
        palette: { name: palette.name, description: palette.description, colors: palette.colors },
        font: { name: font.name, display: font.display, body: font.body },
      },
      sections: params.sections,
      time,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[Preview API] ❌ Erro:', errorMessage);

    return NextResponse.json(
      { success: false, error: errorMessage, time: Date.now() - startTime },
      { status: 500 },
    );
  }
}
