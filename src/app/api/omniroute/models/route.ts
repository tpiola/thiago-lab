/* ==========================================================================
   /api/omniroute/models — Lista modelos disponíveis no OmniRoute Gateway
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';

const OMNIROUTE_URL = process.env.OMNIROUTE_URL || 'http://localhost:20128';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch(`${OMNIROUTE_URL}/v1/models`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      throw new Error(`OmniRoute HTTP ${res.status}`);
    }

    const data = await res.json();
    const models = (data.data || data || [])
      .filter((m: any) => !m.type || m.type === 'llm' || m.type === undefined)
      .map((m: any) => ({
        id: m.id,
        name: m.name || m.id,
        owned_by: m.owned_by || 'unknown',
        context_length: m.context_length || 128000,
        capabilities: m.capabilities || {},
      }));

    return NextResponse.json({ models, total: models.length });
  } catch (err) {
    // Fallback: return known models from mock
    const fallbackModels = [
      { id: 'oc/deepseek-v4-flash-free', name: 'DeepSeek V4 Flash Free', owned_by: 'opencode', context_length: 1000000, capabilities: { reasoning: true, tool_calling: true } },
      { id: 'tllm/deepseek_v4', name: 'DeepSeek V4 (The Old LLM)', owned_by: 'theoldllm', context_length: 128000, capabilities: { reasoning: true, tool_calling: true } },
      { id: 'tllm/gpt_5_4', name: 'GPT-5.4 (The Old LLM)', owned_by: 'theoldllm', context_length: 400000, capabilities: { reasoning: true, tool_calling: true } },
      { id: 'pepper/pepper-1', name: 'Pepper (Chipotle AI)', owned_by: 'chipotle', context_length: 128000, capabilities: { reasoning: true } },
    ];
    return NextResponse.json({
      models: fallbackModels,
      total: fallbackModels.length,
      fallback: true,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
