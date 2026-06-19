/* ==========================================================================
   /api/n8n — Proxy para n8n
   Proxy completo para API do n8n: workflows, execuções
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const N8N_API_URL = process.env.N8N_API_URL || 'http://localhost:32768';
const N8N_API_KEY = process.env.N8N_API_KEY || '';

export const dynamic = 'force-dynamic';

/**
 * GET /api/n8n?type=workflows — Lista workflows
 * GET /api/n8n?type=executions&workflowId=X — Lista execuções
 * GET /api/n8n?type=workflow&id=X — Workflow específico
 * GET /api/n8n?type=execution&id=X — Execução específica
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'workflows';
    const id = searchParams.get('id');
    const workflowId = searchParams.get('workflowId');
    const limit = searchParams.get('limit') || '20';

    let url: string;

    switch (type) {
      case 'workflows':
        url = `${N8N_API_URL}/api/v1/workflows?limit=${limit}`;
        break;
      case 'workflow':
        if (!id) return NextResponse.json({ error: 'id é obrigatório para type=workflow' }, { status: 400 });
        url = `${N8N_API_URL}/api/v1/workflows/${id}`;
        break;
      case 'executions':
        url = `${N8N_API_URL}/api/v1/executions?limit=${limit}`;
        if (workflowId) url += `&workflowId=${workflowId}`;
        break;
      case 'execution':
        if (!id) return NextResponse.json({ error: 'id é obrigatório para type=execution' }, { status: 400 });
        url = `${N8N_API_URL}/api/v1/executions/${id}`;
        break;
      default:
        url = `${N8N_API_URL}/api/v1/workflows?limit=${limit}`;
    }

    console.log('[N8N Proxy] Fetching:', type, id || '');

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(N8N_API_KEY ? { 'X-N8N-API-KEY': N8N_API_KEY } : {}),
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('[N8N Proxy] Error:', res.status, text.slice(0, 200));
      return NextResponse.json(
        { error: `n8n retornou HTTP ${res.status}`, detail: text.slice(0, 200) },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[N8N Proxy] Request failed:', err);
    return NextResponse.json(
      { error: 'Falha ao conectar com n8n', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}
