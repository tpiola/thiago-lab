/* ==========================================================================
   /api/leads — Captura de Leads
   Salva no Supabase + encaminha para n8n webhook
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';

const N8N_WEBHOOK_LEAD = process.env.N8N_WEBHOOK_LEAD || 'http://localhost:32768/webhook/captura-lead';

/* ─── POST /api/leads ──────────────────────────────────────────
 *  Recebe leads e:
 *  1. Valida dados
 *  2. Salva no Supabase (se configurado)
 *  3. Encaminha para n8n webhook (se disponível)
 */
export async function POST(request: Request) {
  const startTime = Date.now();
  const results: Record<string, any> = {};

  try {
    const body = await request.json();
    const { name, email, goal, phone, message, source } = body;

    // Validation
    if (!name || !email || !goal) {
      return NextResponse.json(
        { error: 'name, email e goal são obrigatórios' },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const leadData = {
      name,
      email: email.toLowerCase().trim(),
      goal,
      phone: phone || '',
      message: message || '',
      source: source || 'thiagolab.com',
      created_at: new Date().toISOString(),
    };

    // ── 1. Salvar no Supabase ─────────────────────────────────
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const table = process.env.SUPABASE_TABLE || 'leads';

    if (supabaseUrl && supabaseKey) {
      try {
        const sbRes = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify(leadData),
          signal: AbortSignal.timeout(5000),
        });

        if (sbRes.ok) {
          results.supabase = { status: 'saved' };
          console.log('[Leads] Salvo no Supabase:', email);
        } else {
          const errText = await sbRes.text();
          results.supabase = { status: 'error', detail: errText.slice(0, 100) };
          console.error('[Leads] Supabase error:', sbRes.status, errText);
        }
      } catch (err) {
        results.supabase = {
          status: 'error',
          detail: err instanceof Error ? err.message : String(err),
        };
      }
    } else {
      results.supabase = {
        status: 'skipped',
        detail: 'Supabase não configurado',
      };
      console.log('[Leads] Lead recebido (Supabase não configurado):', email);
    }

    // ── 2. Encaminhar para n8n webhook ────────────────────────
    try {
      const n8nRes = await fetch(N8N_WEBHOOK_LEAD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
        signal: AbortSignal.timeout(5000),
      });

      if (n8nRes.ok) {
        results.n8n = { status: 'forwarded' };
        console.log('[Leads] Encaminhado para n8n webhook:', email);
      } else {
        const n8nText = await n8nRes.text().catch(() => '');
        results.n8n = { status: 'error', detail: `HTTP ${n8nRes.status}: ${n8nText.slice(0, 100)}` };
        console.error('[Leads] n8n webhook error:', n8nRes.status);
      }
    } catch (err) {
      results.n8n = {
        status: 'error',
        detail: err instanceof Error ? err.message : String(err),
      };
      console.warn('[Leads] n8n webhook unavailable:', results.n8n.detail);
    }

    // ── Resposta final ────────────────────────────────────────
    const elapsed = Date.now() - startTime;
    const hasErrors = Object.values(results).some((r: any) => r?.status === 'error');

    return NextResponse.json({
      success: !hasErrors,
      message: hasErrors
        ? 'Lead registrado com ressalvas'
        : 'Lead registrado com sucesso',
      results,
      latency: `${elapsed}ms`,
    });
  } catch (err) {
    console.error('[Leads] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
