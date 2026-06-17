'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  Clock,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  CheckCircle,
} from 'lucide-react';

/* ─── Case Studies ─── */
const CASES = [
  {
    id: 'case-01',
    icon: TrendingUp,
    category: 'automação de marketing',
    client: 'Agência de Performance',
    context:
      'A agência perdia 8h/semana gerando relatórios manuais de Meta Ads + Google Ads. Dados copiados de 3 dashboards diferentes, erros constantes.',
    solution:
      'Construí um agente n8n que puxa dados via API, consolida em uma planilha e dispara um resumo no Slack toda segunda-feira às 8h.',
    results: [
      { label: 'horas economizadas/semana', value: '8h' },
      { label: 'redução de erros', value: '~100%' },
      { label: 'ROI em dias', value: '12' },
    ],
    tech: 'n8n · Meta API · Google Ads API · Slack · Google Sheets',
    border: 'border-blue-500/20',
    badge: 'bg-blue-500/10 text-blue-400',
  },
  {
    id: 'case-02',
    icon: Clock,
    category: 'agente inteligente',
    client: 'E-commerce de Nicho',
    context:
      'Suporte humano respondendo 350+ mensagens/dia no WhatsApp. Lead time médio de 4h. Clientes desistiam antes de finalizar a compra.',
    solution:
      'Agente Claude + WhatsApp Business API + base de conhecimento em Supabase. Responde 85% das perguntas em segundos. Humano só entra em casos críticos.',
    results: [
      { label: 'respostas automatizadas', value: '85%' },
      { label: 'lead time médio', value: '12s' },
      { label: 'conversão recuperada', value: '+23%' },
    ],
    tech: 'Claude API · WhatsApp Cloud · Supabase · n8n · LangChain',
    border: 'border-ios-accent/20',
    badge: 'bg-ios-accent-dim text-ios-accent',
  },
  {
    id: 'case-03',
    icon: DollarSign,
    category: 'produto digital',
    client: 'Consultor B2B',
    context:
      'Consultor vendia mentorias manuais — agendamento por WhatsApp, cobrança por link, planilha de alunos. Escalar era impossível sem virar operador de suporte.',
    solution:
      'MVP completo em 3 semanas: landing page + checkout + área de membros + automação de e-mails. Tudo integrado, zero manutenção manual.',
    results: [
      { label: 'faturamento/mês', value: '3.5x' },
      { label: 'tempo do consultor liberado', value: '15h/sem' },
      { label: 'NPS dos alunos', value: '92' },
    ],
    tech: 'Next.js · Supabase · Stripe · Resend · n8n',
    border: 'border-violet-500/20',
    badge: 'bg-violet-500/10 text-violet-400',
  },
];

/* ─── Result Badge ─── */
function ResultPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-lg font-bold text-ios-accent sm:text-xl">
        {value}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-wider text-ios-muted">
        {label}
      </span>
    </div>
  );
}

/* ─── Case Card ─── */
function CaseCard({
  c,
  index,
}: {
  c: (typeof CASES)[number];
  index: number;
}) {
  const Icon = c.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.19, 1, 0.22, 1],
      }}
      className={`card-surface group relative flex flex-col overflow-hidden border-l-2 ${c.border}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-ios-border/50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ios-accent-dim">
            <Icon size={19} className="text-ios-accent" />
          </div>
          <div>
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${c.badge}`}
            >
              {c.category}
            </span>
            <p className="mt-1 font-mono text-xs text-ios-muted">
              {c.client}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Context */}
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ios-muted">
            contexto
          </span>
          <p className="mt-1 text-sm leading-relaxed text-ios-text-secondary">
            {c.context}
          </p>
        </div>

        {/* Solution */}
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ios-accent">
            solução
          </span>
          <p className="mt-1 text-sm leading-relaxed text-ios-text">
            {c.solution}
          </p>
        </div>

        {/* Results */}
        <div className="mt-auto flex flex-wrap items-center gap-6 rounded-lg bg-ios-surface-2 p-4">
          <BarChart3 size={16} className="text-ios-accent/40" />
          {c.results.map((r) => (
            <ResultPill key={r.label} label={r.label} value={r.value} />
          ))}
        </div>

        {/* Tech */}
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-ios-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-ios-accent/50" />
          {c.tech}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Component ─── */
export function Cases() {
  return (
    <section
      id="cases"
      className="relative border-t border-ios-border/40 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_50%,rgba(61,245,197,0.02),transparent)]" />

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
            <CheckCircle size={12} />
            cases reais
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
          Não é promessa.{' '}
          <span className="text-gradient-accent">É resultado</span> que
          pode ser verificado.
        </motion.h2>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="mt-4 max-w-2xl text-base leading-relaxed text-ios-text-secondary"
        >
          Cada case abaixo é um projeto real que eu executei do zero. Cliente
          real, stack real, resultado real. Sem slides bonitos — só entrega.
        </motion.p>

        {/* Grid */}
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {CASES.map((c, i) => (
            <CaseCard key={c.id} c={c} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-10 text-center"
        >
          <a
            href="#lab-lite"
            className="btn-accent inline-flex gap-2 font-mono text-xs uppercase tracking-wider"
          >
            <ArrowUpRight size={14} />
            quero um case assim pra mim
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default Cases;
