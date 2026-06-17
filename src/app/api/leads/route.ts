import { NextResponse } from 'next/server';

/* ─── POST /api/leads ──────────────────────────────────────────
 *  Recebe leads do Lab Lite e salva no Supabase.
 *  Requer variáveis de ambiente:
 *    SUPABASE_URL
 *    SUPABASE_SERVICE_ROLE_KEY
 *    SUPABASE_TABLE (opcional, default: 'leads')
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, goal, source } = body;

    // Validation
    if (!name || !email || !goal) {
      return NextResponse.json(
        { error: 'name, email e goal são obrigatórios' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Supabase config from env
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const table = process.env.SUPABASE_TABLE || 'leads';

    if (!supabaseUrl || !supabaseKey) {
      // Fallback: log to console when Supabase is not configured
      console.log('[LabLite] Lead received (Supabase not configured):', {
        name,
        email,
        goal,
        source,
        created_at: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: 'Lead registrado (modo dev — Supabase não configurado)',
      });
    }

    // Insert into Supabase
    const res = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name,
        email,
        goal,
        source: source || 'thiagolab.com',
        created_at: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[LabLite] Supabase insert failed:', res.status, errorText);
      return NextResponse.json(
        { error: 'Erro ao salvar lead no banco' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[LabLite] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
