/* ==========================================================================
   /api/ai-builder — Geração de sites via IA (Prompt-to-Site)
   Conecta ao OmniRoute Gateway ou fallback para DeepSeek API
   thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COMPONENT_META } from '@/components/Builder/BuilderTypes';
import type { BlockType, BuilderBlock } from '@/components/Builder/BuilderTypes';

/* ─── Config ─── */
const OMNIROUTE_URL = process.env.OMNIROUTE_URL || 'http://localhost:20128';
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEFAULT_MODEL = process.env.AI_BUILDER_MODEL || 'oc/deepseek-v4-flash-free';
const FALLBACK_MODEL = 'tllm/deepseek_v4';
const TIMEOUT_MS = 60_000;
const VALID_BLOCK_TYPES: BlockType[] = [
  'hero', 'features', 'pricing', 'testimonials',
  'faq', 'cta', 'footer', 'stats', 'gallery', 'contact',
];

/* ─── System Prompt ─── */
function buildSystemPrompt(userPrompt: string): string {
  return `Você é um especialista em criar sites. Gere um JSON de site baseado na descrição abaixo.

Formato de resposta (JSON válido, sem markdown, sem code blocks):
{
  "name": "Nome do Projeto",
  "blocks": [
    {
      "type": "hero|features|pricing|testimonials|faq|cta|footer|stats|gallery|contact",
      "props": { ... }
    }
  ]
}

Descrição do usuário: ${userPrompt}

Regras:
- 3 a 8 blocos no máximo
- Hero sempre primeiro, Footer sempre último
- Props seguem este formato de exemplo:

HERO: { title, subtitle, cta, bgColor, accentColor }
FEATURES: { columns, title, items: [{ icon, title, desc }] }
PRICING: { title, monthly, plans: [{ name, price (number), features: string[], featured (boolean) }] }
TESTIMONIALS: { title, items: [{ name, role, text }] }
FAQ: { title, items: [{ q, a }] }
CTA: { title, subtitle, buttonText }
FOOTER: { copyright, links: [{ label, href }] }
STATS: { title, items: [{ label, value (number) }] }
GALLERY: { title, images: [{ src, alt }] }
CONTACT: { title, email, phone, address }

- Preço em reais (R$)
- Nomes e textos em português
- Gere conteúdo real e específico, não placeholder genérico
- Cores em hex: use #06080C (fundo escuro), #0C0F15 (superfície), #3DF5C5 (destaque verde), #E8EDF2 (texto), #B0B8C4 (texto secundário)
- Retorne APENAS o JSON, sem explicações adicionais`;
}

/* ─── LLM Call ─── */
async function callLLM(prompt: string, model: string): Promise<string | null> {
  const body = JSON.stringify({
    model,
    messages: [
      { role: 'system', content: buildSystemPrompt(prompt) },
      { role: 'user', content: prompt },
    ],
    max_tokens: 4096,
    temperature: 0.7,
    stream: false,
  });

  // Try OmniRoute Gateway first
  try {
    const url = `${OMNIROUTE_URL}/v1/chat/completions`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content;
    }
  } catch (e) {
    console.warn('OmniRoute failed, trying fallback:', (e as Error).message);
  }

  // Try DeepSeek API directly as fallback
  if (DEEPSEEK_KEY) {
    try {
      const cleanModel = model.replace(/^oc\//, '').replace(/^tllm\//, '');
      const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_KEY}`,
        },
        body: JSON.stringify({
          model: cleanModel.includes('deepseek') ? 'deepseek-chat' : 'deepseek-chat',
          messages: [
            { role: 'system', content: buildSystemPrompt(prompt) },
            { role: 'user', content: prompt },
          ],
          max_tokens: 4096,
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (res.ok) {
        const data = await res.json();
        return data.choices?.[0]?.message?.content || null;
      }
    } catch (e) {
      console.warn('DeepSeek fallback also failed:', (e as Error).message);
    }
  }

  return null;
}

/* ─── JSON Parser ─── */
function extractJSON(text: string): Record<string, unknown> | null {
  // Try to find JSON between code blocks or braces
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1] : text;
  
  try {
    return JSON.parse(jsonStr.trim());
  } catch {
    // Try to find first { ... } pair
    const start = jsonStr.indexOf('{');
    const end = jsonStr.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(jsonStr.slice(start, end + 1));
      } catch { /* ignore */ }
    }
    return null;
  }
}

/* ─── Block Normalizer ─── */
function normalizeBlocks(blocks: unknown[]): BuilderBlock[] {
  const defaultProps = COMPONENT_META;
  const result: BuilderBlock[] = [];
  let hasHero = false;
  let hasFooter = false;

  for (const b of blocks) {
    const block = b as Record<string, unknown>;
    const type = String(block.type ?? '') as BlockType;
    if (!VALID_BLOCK_TYPES.includes(type)) continue;
    
    const props = (block.props as Record<string, unknown>) ?? {};
    const defaults = defaultProps[type]?.defaultProps ?? {};
    
    result.push({
      id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      props: { ...defaults, ...props },
    });

    if (type === 'hero') hasHero = true;
    if (type === 'footer') hasFooter = true;
  }

  // Ensure Hero first, Footer last
  const hero = result.find(b => b.type === 'hero');
  const footer = result.find(b => b.type === 'footer');
  const middle = result.filter(b => b.type !== 'hero' && b.type !== 'footer');

  const ordered: BuilderBlock[] = [];
  if (hero) ordered.push(hero);
  else {
    // Add default hero
    ordered.push({
      id: `hero-${Date.now()}`,
      type: 'hero',
      props: { ...defaultProps.hero.defaultProps, title: 'Seu projeto', subtitle: 'Gerado por IA' },
    });
  }
  ordered.push(...middle);
  if (footer) ordered.push(footer);
  else {
    ordered.push({
      id: `footer-${Date.now()}`,
      type: 'footer',
      props: defaultProps.footer.defaultProps,
    });
  }

  return ordered;
}

/* ─── POST Handler ─── */
export async function POST(req: NextRequest) {
  try {
    const { prompt, model } = await req.json();
    
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
      return NextResponse.json(
        { error: 'Descreva seu site em pelo menos 3 caracteres' },
        { status: 400 }
      );
    }

    const selectedModel = model || DEFAULT_MODEL;
    const raw = await callLLM(prompt, selectedModel);
    
    if (!raw) {
      return NextResponse.json(
        { error: 'Nenhum modelo LLM disponível no momento. Configure OMNIROUTE_URL ou DEEPSEEK_API_KEY no .env.local' },
        { status: 503 }
      );
    }

    const parsed = extractJSON(raw);
    if (!parsed || !Array.isArray(parsed.blocks)) {
      console.error('Failed to parse LLM output:', raw.slice(0, 500));
      return NextResponse.json(
        { error: 'IA retornou formato inválido. Tente novamente com uma descrição diferente.' },
        { status: 422 }
      );
    }

    const project = {
      id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: String(parsed.name || 'Projeto Gerado por IA').trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blocks: normalizeBlocks(parsed.blocks as unknown[]),
    };

    return NextResponse.json(project);
  } catch (error) {
    console.error('AI Builder error:', error);
    return NextResponse.json(
      { error: 'Erro interno ao gerar site. Tente novamente.' },
      { status: 500 }
    );
  }
}
