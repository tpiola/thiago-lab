'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Workflow,
  AppWindow,
  FileSearch,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Crown,
  ArrowRight,
} from 'lucide-react';

/* ─── States ─── */
type FormStatus = 'idle' | 'sending' | 'success' | 'error';

/* ─── Benefits ─── */
const BENEFITS = [
  {
    icon: BookOpen,
    title: 'Biblioteca Avançada de Prompts',
    desc: 'Centenas de prompts testados e otimizados para ChatGPT, Claude, Gemini e ferramentas de IA — curados por uso real, não por teoria.',
  },
  {
    icon: Workflow,
    title: 'Workflows Completos',
    desc: 'Automações passo a passo com n8n, Make, Python e agentes de IA. Do diagnóstico à execução, tudo documentado e replicável.',
  },
  {
    icon: AppWindow,
    title: 'Miniapps e Ferramentas',
    desc: 'Aplicativos funcionais que resolvem problemas reais: extratores, analisadores, dashboards e muito mais — código aberto e seu.',
  },
  {
    icon: FileSearch,
    title: 'Estudos de Caso',
    desc: 'Projetos reais com resultados mensuráveis. Economia de horas, aumento de conversão, automação de processos — tudo com dados reais.',
  },
];

/* ─── Component ─── */
export function LabPro() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const inputClass =
    'w-full rounded-lg border border-ios-border bg-ios-surface-2 px-4 py-3 font-mono text-sm text-ios-text placeholder:text-ios-muted/50 transition-colors duration-200 focus:border-ios-accent/50 focus:outline-none focus:ring-1 focus:ring-ios-accent/20';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMsg('Insira seu melhor email.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      const payload = {
        email: email.trim(),
        source: 'thiagolab.com-labpro',
        created_at: new Date().toISOString(),
      };

      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || 'Erro ao cadastrar');
      }

      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error('[LabPro] submit error:', err);
      setErrorMsg(
        err instanceof Error ? err.message : 'Algo deu errado. Tenta de novo?'
      );
      setStatus('error');
    }
  }

  return (
    <section
      id="lab-pro"
      className="relative border-t border-ios-border/40 py-24 sm:py-32"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,rgba(61,245,197,0.05),transparent)]" />

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
            <Crown size={12} />
            lab pro
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-ios-accent/20 to-transparent" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          className="heading-xl max-w-3xl"
        >
          Leve seu jogo para o{' '}
          <span className="text-gradient-accent">próximo nível</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="mt-4 max-w-2xl text-base leading-relaxed text-ios-text-secondary"
        >
          O Lab Pro é o plano premium do Thiago Lab. Acesso completo a todo o
          conhecimento, ferramentas e automações que construí — e continuo
          construindo — em produção.
        </motion.p>

        {/* Benefits Grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + i * 0.1,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className="card-surface group relative flex flex-col gap-4 overflow-hidden p-6 sm:p-8"
              >
                {/* Glow on hover */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-ios-accent/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ios-accent-dim transition-colors duration-300 group-hover:bg-ios-accent/20">
                  <Icon size={20} className="text-ios-accent" />
                </div>

                <h3 className="heading-md font-semibold text-ios-text">
                  {b.title}
                </h3>

                <p className="text-sm leading-relaxed text-ios-text-secondary">
                  {b.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA + Lead Capture */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.4,
            ease: [0.19, 1, 0.22, 1],
          }}
          className="mx-auto mt-14 max-w-lg text-center"
        >
          {/* Highlight box */}
          <div className="relative overflow-hidden rounded-2xl border border-ios-accent/15 bg-gradient-to-br from-ios-surface-3/60 to-ios-surface/80 p-8 sm:p-10">
            {/* Glow */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-ios-accent/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-ios-accent/5 blur-3xl" />

            <Crown size={32} className="mx-auto mb-4 text-ios-accent" />

            <h3 className="heading-md text-ios-text">
              Quer entrar na lista de espera?
            </h3>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ios-text-secondary">
              O Lab Pro ainda está sendo refinado. Deixa seu email que eu te
              aviso assim que abrir — e você ainda ganha um desconto de
              lançamento.
            </p>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 flex flex-col items-center gap-3 py-4"
              >
                <CheckCircle size={36} className="text-ios-accent" />
                <p className="font-mono text-sm font-medium text-ios-text">
                  Você está na lista! 🚀
                </p>
                <p className="max-w-xs text-xs leading-relaxed text-ios-text-secondary">
                  Vou te avisar assim que o Lab Pro abrir. Fica de olho no
                  email (e na caixa de spam, só por segurança).
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:flex-row"
              >
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${inputClass} pr-4`}
                    disabled={status === 'sending'}
                    aria-label="Seu email para entrar na lista"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-accent font-mono text-xs uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      enviando...
                    </>
                  ) : (
                    <>
                      <ArrowRight size={14} />
                      entrar na lista
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Error */}
            {status === 'error' && errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto mt-4 flex max-w-sm items-center gap-2 rounded-lg bg-ios-error/10 p-3"
              >
                <AlertCircle size={14} className="shrink-0 text-ios-error" />
                <span className="font-mono text-xs text-ios-error">
                  {errorMsg}
                </span>
              </motion.div>
            )}

            {/* Privacy note */}
            <p className="mt-4 font-mono text-[10px] text-ios-muted">
              Sem spam. Seus dados não vão virar newsletter. Só o aviso do
              lançamento.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default LabPro;
