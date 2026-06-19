/* ==========================================================================
   GET /api/n8n/leads — Buscar leads do n8n webhook + Supabase
   Proxy para n8n webhook de leads, com fallback para Supabase
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';

const N8N_WEBHOOK_URL = process.env.N8N_LEADS_WEBHOOK || '';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const dynamic = 'force-dynamic';

interface Lead {
  id: string;
  nome: string;
  empresa: string;
  telefone: string;
  email: string;
  status: 'Ativo' | 'Lead' | 'Inativo';
  ultimoContato: string;
  valor: string;
  created_at?: string;
  origem?: string;
}

interface LeadRow {
  id: string;
  name?: string;
  nome?: string;
  empresa?: string;
  company?: string;
  telefone?: string;
  phone?: string;
  email?: string;
  status?: string;
  valor?: string;
  value?: string;
  ultimo_contato?: string;
  last_contact?: string;
  created_at?: string;
  origem?: string;
  source?: string;
  message?: string;
  mensagem?: string;
}

function normalizeLead(row: LeadRow): Lead {
  const now = new Date().toISOString().split('T')[0].replace(/-/g, '/');
  const [y, m, d] = now.split('/');
  const today = `${d}/${m}/${y}`;

  return {
    id: row.id || String(Math.random().toString(36).slice(2, 10)),
    nome: row.name || row.nome || 'Visitante',
    empresa: row.empresa || row.company || '—',
    telefone: row.telefone || row.phone || '—',
    email: row.email || '—',
    status: (row.status === 'Ativo' || row.status === 'Lead' || row.status === 'Inativo')
      ? row.status as Lead['status']
      : 'Lead',
    ultimoContato: row.ultimo_contato || row.last_contact || today,
    valor: row.valor || row.value ? `R$ ${Number(row.value || row.valor).toLocaleString('pt-BR')}` : '—',
  };
}

/* ─── Buscar dados do n8n webhook ─────────────────────────────── */
async function fetchFromN8n(): Promise<Lead[] | null> {
  if (!N8N_WEBHOOK_URL) return null;

  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: 'GET',
      signal: AbortSignal.timeout(8000),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      console.warn(`[n8n/leads] Webhook respondeu HTTP ${res.status}`);
      return null;
    }

    const data = await res.json();
    const rows = Array.isArray(data) ? data : (data.data || data.leads || []);

    if (!Array.isArray(rows) || rows.length === 0) return null;

    return rows.map(normalizeLead);
  } catch (err) {
    console.warn('[n8n/leads] Erro ao buscar do webhook:', (err as Error).message);
    return null;
  }
}

/* ─── Buscar dados do Supabase ─────────────────────────────────── */
async function fetchFromSupabase(): Promise<Lead[] | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads?order=created_at.desc&limit=100`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;

    const data: LeadRow[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    return data.map(normalizeLead);
  } catch (err) {
    console.warn('[n8n/leads] Erro ao buscar do Supabase:', (err as Error).message);
    return null;
  }
}

/* ─── GET Handler ──────────────────────────────────────────────── */
export async function GET() {
  try {
    // 1. Tenta n8n webhook primeiro (dados ao vivo)
    const n8nLeads = await fetchFromN8n();
    if (n8nLeads && n8nLeads.length > 0) {
      return NextResponse.json({
        leads: n8nLeads,
        source: 'n8n',
        live: true,
        fetchedAt: new Date().toISOString(),
        total: n8nLeads.length,
      });
    }

    // 2. Fallback: Supabase
    const supabaseLeads = await fetchFromSupabase();
    if (supabaseLeads && supabaseLeads.length > 0) {
      return NextResponse.json({
        leads: supabaseLeads,
        source: 'supabase',
        live: true,
        fetchedAt: new Date().toISOString(),
        total: supabaseLeads.length,
      });
    }

    // 3. Sem fontes configuradas — retorna array vazio (frontend usa mock)
    return NextResponse.json({
      leads: [],
      source: 'none',
      live: false,
      fetchedAt: new Date().toISOString(),
      total: 0,
    });
  } catch (err) {
    console.error('[GET /api/n8n/leads]', err);
    return NextResponse.json(
      {
        leads: [],
        source: 'error',
        live: false,
        error: (err as Error).message,
        fetchedAt: new Date().toISOString(),
      },
      { status: 200 }, // Always return 200 so frontend can fallback gracefully
    );
  }
}

/* ─── POST Handler — Criar lead via n8n webhook + Supabase ─────── */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, telefone, empresa, mensagem } = body;

    if (!nome || !email) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: nome, email' },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 },
      );
    }

    const leadData = {
      nome,
      email: email.toLowerCase().trim(),
      telefone: telefone || '',
      empresa: empresa || '',
      mensagem: mensagem || '',
      source: 'intelligence-os-crm',
      status: 'Lead',
      created_at: new Date().toISOString(),
    };

    let n8nResult = 'not_configured';

    // Enviar para n8n webhook
    if (N8N_WEBHOOK_URL) {
      try {
        const webhookRes = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData),
          signal: AbortSignal.timeout(5000),
        });
        n8nResult = webhookRes.ok ? 'sent' : `error_${webhookRes.status}`;
      } catch (err) {
        n8nResult = 'error';
        console.warn('[n8n/leads] POST webhook error:', (err as Error).message);
      }
    }

    // Salvar no Supabase
    let supabaseResult = 'not_configured';
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: 'return=representation',
          },
          body: JSON.stringify({
            name: nome,
            email: leadData.email,
            phone: telefone,
            company: empresa,
            message: mensagem,
            status: 'Lead',
            source: 'intelligence-os-crm',
            created_at: leadData.created_at,
          }),
        });
        supabaseResult = res.ok ? 'saved' : `error_${res.status}`;
      } catch (err) {
        supabaseResult = 'error';
        console.warn('[n8n/leads] POST Supabase error:', (err as Error).message);
      }
    }

    console.log('[n8n/leads] Lead criado:', { nome, email, n8nResult, supabaseResult });

    return NextResponse.json({
      success: true,
      lead: leadData,
      n8n: n8nResult,
      database: supabaseResult,
    });
  } catch (err) {
    console.error('[POST /api/n8n/leads]', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 },
    );
  }
}
