/* ==========================================================================
   POST /api/lead — Captura de Lead (Lab Lite)
   ==========================================================================
   Grava no Supabase (tabela leads) e envia e-mail de boas-vindas.
   Supabase será configurado posteriormente — por enquanto registra no
   console e retorna sucesso.
   ========================================================================== */

import { NextResponse } from 'next/server';

/* ─── Tipos ─── */

interface LeadPayload {
  email: string;
}

/* ─── Validação ─── */

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ─── POST ─── */

export async function POST(request: Request) {
  try {
    const body: LeadPayload = await request.json();

    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json(
        { error: 'E-mail inválido. Digite um e-mail válido.' },
        { status: 400 }
      );
    }

    const email = body.email.toLowerCase().trim();

    // ── TODO: Inserir no Supabase (tabela leads) ───────────────
    // Exemplo (quando Supabase estiver configurado):
    //
    //   const { error } = await supabase
    //     .from('leads')
    //     .insert({ email, source: 'lab-lite', created_at: new Date().toISOString() });
    //
    //   if (error) throw error;

    console.log('[LEAD] Novo lead capturado:', {
      email,
      source: 'lab-lite',
      timestamp: new Date().toISOString(),
    });

    // ── TODO: Enviar e-mail de boas-vindas ─────────────────────
    // Exemplo (quando serviço de e-mail estiver configurado):
    //
    //   await sendWelcomeEmail({
    //     to: email,
    //     subject: 'Bem-vindo ao Lab Lite 🧪',
    //     html: welcomeTemplate(),
    //   });

    console.log('[LEAD] E-mail de boas-vindas simulado para:', email);

    return NextResponse.json(
      {
        success: true,
        message: 'Lead cadastrado com sucesso! Verifique seu e-mail.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[LEAD] Erro ao processar lead:', error);

    return NextResponse.json(
      { error: 'Erro interno do servidor. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}
