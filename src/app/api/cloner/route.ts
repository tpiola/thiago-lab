/* ==========================================================================
   /api/cloner — Clonagem de sites via IA (Firecrawl-like)
   Extrai HTML de qualquer URL e converte em componentes React + Tailwind
   ========================================================================== */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/* ─── Config ─── */
const OMNIROUTE_URL = process.env.OMNIROUTE_URL || 'http://localhost:20128';
const TIMEOUT_MS = 60_000;

interface ClonerBlock {
  type: string;
  title?: string;
  subtitle?: string;
  text?: string;
  links?: { label: string; href: string }[];
  items?: Record<string, string>[];
  images?: { src: string; alt: string }[];
  copyright?: string;
  style?: { bgColor?: string; textColor?: string };
  blocks?: ClonerBlock[];
  [key: string]: unknown;
}

/* ─── System Prompt ─── */
function buildPrompt(url: string, html: string): string {
  return `Analise o HTML do site "${url}" e extraia a estrutura em JSON.

HTML (primeiros 8000 caracteres):
${html.slice(0, 8000)}

Retorne APENAS JSON válido com esta estrutura:
{
  "name": "Nome do Site",
  "blocks": [
    {
      "type": "nav|hero|features|content|cta|footer|section",
      "title": "...",
      "subtitle": "...",
      "text": "...",
      "links": [{ "label": "...", "href": "..." }],
      "items": [{ "title": "...", "desc": "..." }],
      "images": [{ "src": "...", "alt": "..." }],
      "style": { "bgColor": "#...", "textColor": "#..." }
    }
  ]
}`;
}

/* ─── POST Handler ─── */
export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL é obrigatória' }, { status: 400 });
    }

    // Fetch the target site
    const htmlRes = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IntelligenceOS/1.0)' },
    });
    const html = await htmlRes.text();

    // Call LLM to analyze
    const prompt = buildPrompt(url, html);
    const llmRes = await fetch(`${OMNIROUTE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'oc/deepseek-v4-flash-free',
        messages: [
          { role: 'system', content: 'Você é um especialista em análise de HTML e extração de estrutura de sites.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 4096,
        temperature: 0.3,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const llmData = await llmRes.json();
    const content = llmData.choices?.[0]?.message?.content || '';

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const structure = jsonMatch ? JSON.parse(jsonMatch[0]) : { name: 'Cloned Site', blocks: [] };

    return NextResponse.json({
      id: `clone-${Date.now()}`,
      name: structure.name || 'Cloned Site',
      url,
      blocks: structure.blocks || [],
      html: html.slice(0, 5000),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cloner error:', error);
    return NextResponse.json(
      { error: 'Erro ao clonar site. Verifique a URL e tente novamente.' },
      { status: 500 }
    );
  }
}
