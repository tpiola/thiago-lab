/* ==========================================================================
   /api/cie/[action] — Proxy para CIE Platform
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CIE_API_URL = process.env.CIE_API_URL || 'http://localhost:8000';

export const dynamic = 'force-dynamic';

/**
 * Mapeia ações amigáveis para endpoints da CIE API
 */
const ACTION_MAP: Record<string, string> = {
  dashboard: '/api/dashboard/summary',
  competitors: '/api/competitors/analyze',
  investigate: '/api/investigate',
  enterprises: '/api/enterprise/search',
  health: '/health',
};

/**
 * GET /api/cie/dashboard — Dashboard summary
 * GET /api/cie/health — Health check da CIE
 * GET /api/cie/enterprises?q=empresa — Buscar empresas
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> },
) {
  const { action } = await params;

  try {
    const endpoint = ACTION_MAP[action];

    if (!endpoint) {
      return NextResponse.json(
        { error: `Ação desconhecida: ${action}. Ações: ${Object.keys(ACTION_MAP).join(', ')}` },
        { status: 400 },
      );
    }

    // Montar URL com query params
    const { searchParams } = new URL(request.url);
    let url = `${CIE_API_URL}${endpoint}`;
    const q = searchParams.get('q');
    if (q) url += `?q=${encodeURIComponent(q)}`;

    console.log('[CIE Proxy] GET', endpoint);

    const res = await fetch(url, {
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('[CIE Proxy] Error:', res.status, text.slice(0, 200));
      return NextResponse.json(
        { error: `CIE retornou HTTP ${res.status}`, detail: text.slice(0, 200) },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[CIE Proxy] Failed:', err);
    return NextResponse.json(
      { error: 'Falha ao conectar com CIE Platform', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}

/**
 * POST /api/cie/competitors — Analisar concorrentes
 * Body: { empresa: string, setor?: string }
 *
 * POST /api/cie/investigate — Iniciar investigação
 * Body: { empresa: string, localizacao?: string, mercado?: string }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> },
) {
  const { action } = await params;

  try {
    const endpoint = ACTION_MAP[action];

    if (!endpoint) {
      return NextResponse.json(
        { error: `Ação desconhecida: ${action}` },
        { status: 400 },
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    console.log('[CIE Proxy] POST', endpoint, body);

    const res = await fetch(`${CIE_API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('[CIE Proxy] Error:', res.status, text.slice(0, 200));
      return NextResponse.json(
        { error: `CIE retornou HTTP ${res.status}`, detail: text.slice(0, 200) },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[CIE Proxy] Failed:', err);
    return NextResponse.json(
      { error: 'Falha ao conectar com CIE Platform', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}
