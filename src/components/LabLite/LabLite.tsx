'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Terminal,
  Loader2,
  CheckCircle,
  AlertCircle,
  Zap,
  MessageSquare,
} from 'lucide-react';

/* ─── States ─── */
type FormStatus = 'idle' | 'sending' | 'success' | 'error';

/* ─── Component ─── */
export function LabLite() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [goal, setGoal] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  /* ─── Submit ─── */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !goal.trim()) {
      setErrorMsg('Preenche todos os campos, parça.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        goal: goal.trim(),
        source: 'thiagolab.com',
        created_at: new Date().toISOString(),
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || 'Erro ao enviar');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setGoal('');
    } catch (err) {
      console.error('[LabLite] submit error:', err);
      setErrorMsg(
        err instanceof Error ? err.message : 'Algo deu errado. Tenta de novo?'
      );
      setStatus('error');
    }
  }

  /* ─── Form fields ─── */
  const inputClass =
    'w-full rounded-lg border border-ios-border bg-ios-surface-2 px-4 py-3 font-mono text-sm text-ios-text placeholder:text-ios-muted/50 transition-colors duration-200 focus:border-ios-accent/50 focus:outline-none focus:ring-1 focus:ring-ios-accent/20';

  return (
    <section
      id="lab-lite"
      className="relative border-t border-ios-border/40 py-24 sm:py-32"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(61,245,197,0.04),transparent)]" />

      <div className="container-ios relative">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="mb-4 flex items-center gap-3"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-ios-accent/20 bg-ios-accent-dim px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-widest text-ios-accent">
            <Zap size={12} />
            lab lite
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-ios-accent/20 to-transparent" />
        </motion.div>

        <div className="mx-auto grid max-w-5xl items-start gap-12 lg:grid-cols-5">
          {/* ─── Left Copy ─── */}
          <div className="lg:col-span-3">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.19, 1, 0.22, 1],
              }}
              className="heading-xl"
            >
              Bora construir algo{' '}
              <span className="text-gradient-accent">juntos</span>?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
              className="mt-4 max-w-lg text-base leading-relaxed text-ios-text-secondary"
            >
              Me conta qual é o seu desafio. Em até 48h eu te mando um
              diagnóstico gratuito — sem compromisso, sem empurrar curso,
              sem enrolação.
            </motion.p>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
              className="mt-8 space-y-4"
            >
              {[
                'Diagnóstico gratuito e sincero',
                'Sem reunião de 1h pra vender nada',
                'Resposta em até 48h',
                'Código e dados 100% seus',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ios-accent-dim text-[10px] text-ios-accent">
                    ✓
                  </span>
                  <span className="text-sm text-ios-text-secondary">
                    {item}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* WhatsApp alternative */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 flex items-center gap-2 rounded-lg border border-ios-border bg-ios-surface-2 p-4"
            >
              <MessageSquare size={16} className="text-ios-accent" />
              <span className="font-mono text-xs text-ios-text-secondary">
                Mais rápido? Me chama no{' '}
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ios-accent underline underline-offset-2 transition-colors hover:text-ios-accent/80"
                >
                  WhatsApp
                </a>
              </span>
            </motion.div>
          </div>

          {/* ─── Form ─── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.25,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="lg:col-span-2"
          >
            <div className="card-surface overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 border-b border-ios-border px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-ios-error/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-ios-warning/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-ios-accent/70" />
                </div>
                <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-ios-muted">
                  lab-lite@thiago:~$ _
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                {status === 'success' ? (
                  /* ── Success State ── */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-3 py-8 text-center"
                  >
                    <CheckCircle
                      size={40}
                      className="text-ios-accent"
                    />
                    <p className="font-mono text-sm font-medium text-ios-text">
                      Recebido! 🚀
                    </p>
                    <p className="max-w-xs text-xs leading-relaxed text-ios-text-secondary">
                      Vou analisar seu desafio e te responder em até 48h.
                      Fica de olho no email (e na caixa de spam, só por
                      via das dúvidas).
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus('idle')}
                      className="btn-outline mt-2 font-mono text-xs uppercase tracking-wider"
                    >
                      enviar outro
                    </button>
                  </motion.div>
                ) : (
                  <>
                    {/* Name */}
                    <div>
                      <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-ios-muted">
                        nome
                      </label>
                      <input
                        type="text"
                        placeholder="Seu nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClass}
                        disabled={status === 'sending'}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-ios-muted">
                        email
                      </label>
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        disabled={status === 'sending'}
                      />
                    </div>

                    {/* Goal */}
                    <div>
                      <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-ios-muted">
                        qual seu desafio?
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Ex: Quero automatizar o follow-up de vendas..."
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className={`${inputClass} resize-none`}
                        disabled={status === 'sending'}
                      />
                    </div>

                    {/* Error */}
                    {status === 'error' && errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 rounded-lg bg-ios-error/10 p-3"
                      >
                        <AlertCircle size={14} className="shrink-0 text-ios-error" />
                        <span className="font-mono text-xs text-ios-error">
                          {errorMsg}
                        </span>
                      </motion.div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="btn-accent w-full font-mono text-xs uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {status === 'sending' ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          enviando...
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          enviar diagnóstico gratuito
                        </>
                      )}
                    </button>

                    {/* Tiny footnote */}
                    <p className="text-center font-mono text-[10px] text-ios-muted">
                      Seus dados não vão virar newsletter. Prometo.
                    </p>
                  </>
                )}
              </form>
            </div>

            {/* Supabase badge */}
            <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[10px] text-ios-muted">
              <Terminal size={11} />
              dados seguros em Supabase · response em 48h
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default LabLite;
