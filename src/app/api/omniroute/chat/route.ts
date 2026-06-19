/* ==========================================================================
   /api/omniroute/chat — Chat com OmniRoute Gateway (streaming + non-streaming)
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const OMNIROUTE_URL = process.env.OMNIROUTE_URL || 'http://localhost:20128';
const DEFAULT_MODEL = 'tllm/deepseek_v4';
const TIMEOUT_MS = 60_000;

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { messages, model, stream } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Mensagens são obrigatórias' },
        { status: 400 },
      );
    }

    const selectedModel = model || DEFAULT_MODEL;

    // Build the request body
    const body: Record<string, unknown> = {
      model: selectedModel,
      messages,
      max_tokens: 4096,
      temperature: 0.7,
      stream: false,
    };

    if (stream === true) {
      body.stream = true;
    }

    const res = await fetch(`${OMNIROUTE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error');
      throw new Error(`OmniRoute HTTP ${res.status}: ${errorText}`);
    }

    // Handle streaming response
    if (stream === true) {
      // Return the stream directly
      return new Response(res.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // Handle non-streaming response
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || '';
    const reasoning = data.choices?.[0]?.message?.reasoning_content || '';
    const finishReason = data.choices?.[0]?.finish_reason || 'stop';
    const usage = data.usage || {};

    return NextResponse.json({
      reply,
      reasoning,
      finishReason,
      usage,
      model: data.model || selectedModel,
    });
  } catch (err) {
    // Mock fallback for demo/testing
    const { messages } = await req.json().catch(() => ({ messages: [] }));
    const lastMsg = messages?.[messages.length - 1]?.content || '';
    const mockReply = generateMockReply(lastMsg);

    return NextResponse.json({
      reply: mockReply,
      reasoning: '',
      finishReason: 'stop',
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      model: 'mock-fallback',
      fallback: true,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

function generateMockReply(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  if (msg.includes('hello') || msg.includes('oi') || msg.includes('olá')) {
    return 'Olá! Como posso ajudar você hoje?';
  }
  if (msg.includes('analytics') || msg.includes('metric')) {
    return 'Acesse o painel de Analytics & BI para métricas detalhadas de receita, churn e cohorts.';
  }
  if (msg.includes('competitor') || msg.includes('concorrente')) {
    return 'A seção Competitive Intelligence monitora DataPulse AI, NeuralStack e outros concorrentes em tempo real.';
  }
  if (msg.includes('agent') || msg.includes('agente')) {
    return 'Temos agentes como Hermes Agent, Clarity OS e INEMA ativos e prontos para executar tarefas.';
  }
  return `Recebi sua mensagem: "${userMessage}". Estou processando com IA para gerar a melhor resposta.`;
}
