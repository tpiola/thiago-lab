/* ==========================================================================
   /api/omniroute — Proxy para OmniRoute Gateway
   Interface OpenAI-compatible para LLMs via gateway local
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const OMNIROUTE_URL = process.env.OMNIROUTE_URL || 'http://localhost:20128';
const DEFAULT_MODEL = process.env.OMNIROUTE_MODEL || 'oc/deepseek-v4-flash-free';

export const dynamic = 'force-dynamic';

/**
 * GET /api/omniroute/models — Lista modelos disponíveis
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'models';

    switch (action) {
      case 'models': {
        console.log('[OmniRoute] Fetching models...');
        const res = await fetch(`${OMNIROUTE_URL}/v1/models`, {
          signal: AbortSignal.timeout(5000),
        });

        if (!res.ok) {
          return NextResponse.json(
            { error: `OmniRoute retornou HTTP ${res.status}` },
            { status: res.status },
          );
        }

        const data = await res.json();
        return NextResponse.json(data);
      }

      default:
        return NextResponse.json({ error: `Ação desconhecida: ${action}` }, { status: 400 });
    }
  } catch (err) {
    console.error('[OmniRoute] GET failed:', err);
    return NextResponse.json(
      { error: 'Falha ao conectar com OmniRoute', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}

/**
 * POST /api/omniroute — Envia prompt para OmniRoute
 *
 * Body (OpenAI-compatible):
 * {
 *   model?: string,
 *   messages: [{ role: 'user'|'system'|'assistant', content: string }],
 *   temperature?: number,
 *   max_tokens?: number,
 *   stream?: boolean
 * }
 *
 * Body simplificado:
 * {
 *   prompt: string,
 *   system?: string,
 *   model?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Body JSON inválido' }, { status: 400 });
    }

    // Suporta tanto formato OpenAI quanto simplificado
    let omniBody: any;

    if (body.messages) {
      // Formato OpenAI-compatible
      omniBody = {
        model: body.model || DEFAULT_MODEL,
        messages: body.messages,
        temperature: body.temperature ?? 0.7,
        max_tokens: body.max_tokens ?? 2048,
        stream: body.stream ?? false,
      };
    } else if (body.prompt) {
      // Formato simplificado
      omniBody = {
        model: body.model || DEFAULT_MODEL,
        messages: [
          ...(body.system ? [{ role: 'system', content: body.system }] : []),
          { role: 'user', content: body.prompt },
        ],
        temperature: body.temperature ?? 0.7,
        max_tokens: body.max_tokens ?? 2048,
        stream: false,
      };
    } else {
      return NextResponse.json(
        { error: 'Envie { messages } (OpenAI) ou { prompt } (simplificado)' },
        { status: 400 },
      );
    }

    // Se for streaming, retorna streaming response
    if (omniBody.stream) {
      console.log('[OmniRoute] Streaming request, model:', omniBody.model);

      const upstreamRes = await fetch(`${OMNIROUTE_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(omniBody),
        signal: AbortSignal.timeout(60000),
      });

      if (!upstreamRes.ok) {
        const text = await upstreamRes.text().catch(() => '');
        return NextResponse.json(
          { error: `OmniRoute retornou HTTP ${upstreamRes.status}`, detail: text.slice(0, 200) },
          { status: upstreamRes.status },
        );
      }

      // Repassar streaming response
      return new Response(upstreamRes.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // Non-streaming
    console.log('[OmniRoute] Chat request, model:', omniBody.model);

    const res = await fetch(`${OMNIROUTE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(omniBody),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('[OmniRoute] Error:', res.status, text.slice(0, 200));
      return NextResponse.json(
        { error: `OmniRoute retornou HTTP ${res.status}`, detail: text.slice(0, 200) },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[OmniRoute] POST failed:', err);
    return NextResponse.json(
      { error: 'Falha ao conectar com OmniRoute', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}
