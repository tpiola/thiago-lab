/* ==========================================================================
   /api/ai-builder — Geração de sites via IA (Prompt-to-Site)
   Conecta ao OmniRoute Gateway para gerar blocos de site via LLM
   thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COMPONENT_META } from '@/components/Builder/BuilderTypes';
import type { BlockType, BuilderBlock } from '@/components/Builder/BuilderTypes';

/* ─── Config ─── */
const GATEWAY_URL = 'http://localhost:20128/v1/chat/completions';
const DEFAULT_MODEL = 'oc/deepseek-v4-flash-free';
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
- Props seguem o formato dos templates existentes
- Preço em reais (R$)
- Nomes em português
- Gere conteúdo real, não placeholder
- Responda APENAS com o JSON puro, sem formatação markdown`;
}

/* ─── Call OmniRoute Gateway ─── */
async function callGateway(prompt: string): Promise<string> {
  const payload = {
    model: DEFAULT_MODEL,
    messages: [
      { role: 'system', content: buildSystemPrompt(prompt) },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 4096,
    stream: false,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      // Try fallback model
      const fallbackPayload = { ...payload, model: FALLBACK_MODEL };
      const fallbackRes = await fetch(GATEWAY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fallbackPayload),
        signal: controller.signal,
      });

      if (!fallbackRes.ok) {
        const text = await fallbackRes.text();
        throw new Error(`Gateway error (${fallbackRes.status}): ${text.slice(0, 200)}`);
      }

      const data = await fallbackRes.json();
      return data.choices?.[0]?.message?.content || '';
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  } finally {
    clearTimeout(timeout);
  }
}

/* ─── Validate and normalize blocks ─── */
function validateAndNormalize(llmOutput: string): { name: string; blocks: BuilderBlock[] } {
  // Clean markdown code blocks if present
  let cleaned = llmOutput.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');

  const parsed = JSON.parse(cleaned);

  const name = typeof parsed.name === 'string' && parsed.name.trim()
    ? parsed.name.trim()
    : 'Site gerado por IA';

  const rawBlocks = Array.isArray(parsed.blocks) ? parsed.blocks : [];

  if (rawBlocks.length < 3 || rawBlocks.length > 8) {
    throw new Error(`Número inválido de blocos: ${rawBlocks.length}. Deve ser entre 3 e 8.`);
  }

  const blocks: BuilderBlock[] = [];
  let blockIndex = 0;

  // Ensure first block is hero
  if (rawBlocks[0]?.type !== 'hero') {
    blocks.push({
      id: `ai-hero-${blockIndex++}`,
      type: 'hero',
      props: { ...COMPONENT_META.hero.defaultProps },
    });
  }

  for (const raw of rawBlocks) {
    const type = raw.type as BlockType;
    if (!VALID_BLOCK_TYPES.includes(type)) continue;

    // Skip hero if we already added one, or footer to add at end
    if (blocks.some(b => b.type === 'hero') && type === 'hero') continue;
    if (type === 'footer') continue;

    const defaultProps = COMPONENT_META[type]?.defaultProps || {};

    blocks.push({
      id: `ai-${type}-${blockIndex++}`,
      type,
      props: { ...defaultProps, ...raw.props },
    });
  }

  // Always add footer at the end
  blocks.push({
    id: `ai-footer-${blockIndex++}`,
    type: 'footer',
    props: { ...COMPONENT_META.footer.defaultProps },
  });

  return { name, blocks };
}

/* ─── POST /api/ai-builder ─── */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.prompt || typeof body.prompt !== 'string' || !body.prompt.trim()) {
      return NextResponse.json(
        { error: 'Campo "prompt" é obrigatório.' },
        { status: 400 },
      );
    }

    const prompt = body.prompt.trim();
    const llmOutput = await callGateway(prompt);

    if (!llmOutput) {
      return NextResponse.json(
        { error: 'O LLM não retornou conteúdo válido.' },
        { status: 502 },
      );
    }

    let project;
    try {
      project = validateAndNormalize(llmOutput);
    } catch (parseErr) {
      console.error('[ai-builder] JSON parse error:', parseErr);
      console.error('[ai-builder] Raw output:', llmOutput.slice(0, 1000));
      return NextResponse.json(
        {
          error: 'Não foi possível interpretar a resposta do LLM. Tente novamente.',
          rawOutput: llmOutput.slice(0, 2000),
        },
        { status: 422 },
      );
    }

    return NextResponse.json({
      project: {
        id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: project.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        blocks: project.blocks,
      },
    });
  } catch (err) {
    console.error('[POST /api/ai-builder]', err);

    if (err instanceof Error && err.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Tempo limite excedido (60s). Tente um prompt mais simples.' },
        { status: 504 },
      );
    }

    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro interno do servidor.' },
      { status: 500 },
    );
  }
}
