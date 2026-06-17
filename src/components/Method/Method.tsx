'use client';

import { motion } from 'framer-motion';
import {
  Search,
  Settings,
  Zap,
  Package,
  ArrowRight,
  Terminal,
} from 'lucide-react';

/* ─── Method Steps ─── */
const STEPS = [
  {
    icon: Search,
    number: '01',
    title: 'Diagnóstico',
    subtitle: 'Onde estamos?',
    description:
      'Mapeio processos, ferramentas e gargalos. Entrevisto stakeholders, analiso dados reais e identifico o que está travando o crescimento. Sem achismo: tudo documentado.',
    color: 'from-blue-500/20 to-blue-500/5',
    border: 'border-blue-500/20',
    glow: 'shadow-blue-500/5',
  },
  {
    icon: Settings,
    number: '02',
    title: 'Sistema',
    subtitle: 'Onde precisamos chegar?',
    description:
      'Desenho a arquitetura ideal — fluxos, integrações, banco de dados, automações. O projeto é seu, revisável a qualquer momento. Aqui ainda não escrevi uma linha de código.',
    color: 'from-violet-500/20 to-violet-500/5',
    border: 'border-violet-500/20',
    glow: 'shadow-violet-500/5',
  },
  {
    icon: Zap,
    number: '03',
    title: 'Automação',
    subtitle: 'Construindo o motor.',
    description:
      'Aqui o terminal esquenta. Conecto APIs, crio agentes, configuro pipelines n8n, escrevo scripts. Cada automação é testada, documentada e entregue rodando em produção.',
    color: 'from-ios-accent/20 to-ios-accent/5',
    border: 'border-ios-accent/20',
    glow: 'shadow-ios-accent/5',
  },
  {
    icon: Package,
    number: '04',
    title: 'Produto',
    subtitle: 'Entregue, rodando, seu.',
    description:
      'Entrego o sistema completo com documentação, acesso ao código e um vídeo tutorial. Você recebe um produto funcional — não um PDF com promessas. Suporte incluso por 30 dias.',
    color: 'from-emerald-500/20 to-emerald-500/5',
    border: 'border-emerald-500/20',
    glow: 'shadow-emerald-500/5',
  },
];

/* ─── Step Card ─── */
function StepCard({
  step,
  index,
}: {
  step: (typeof STEPS)[number];
  index: number;
}) {
  const Icon = step.icon;

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
      className="group relative"
    >
      {/* Connector line (desktop) */}
      {index < STEPS.length - 1 && (
        <div className="absolute -right-3 top-12 hidden h-px w-6 bg-gradient-to-r from-ios-accent/40 to-transparent lg:block" />
      )}

      <div
        className={`relative flex flex-col gap-4 rounded-xl border bg-ios-surface p-6 transition-all duration-300 hover:shadow-md ${step.border} ${step.glow}`}
      >
        {/* Number + Icon row */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-ios-muted">
            ETAPA {step.number}
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ios-accent-dim">
            <Icon size={17} className="text-ios-accent" />
          </div>
        </div>

        {/* Title / Subtitle */}
        <div>
          <h3 className="font-mono text-base font-bold uppercase tracking-wider text-ios-text">
            {step.title}
          </h3>
          <span className="mt-0.5 block font-mono text-xs text-ios-muted">
            {step.subtitle}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-ios-text-secondary">
          {step.description}
        </p>
      </div>

      {/* Arrow connector (mobile) */}
      {index < STEPS.length - 1 && (
        <div className="flex justify-center py-2 lg:hidden">
          <ArrowRight size={16} className="rotate-90 text-ios-accent/30" />
        </div>
      )}
    </motion.div>
  );
}

/* ─── Timeline / Terminal Bar ─── */
function MethodTimeline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.7, ease: [0.19, 1, 0.22, 1] }}
      className="mx-auto mt-14 flex max-w-2xl items-center gap-3 rounded-lg border border-ios-border bg-ios-surface-2 px-5 py-3 font-mono text-xs"
    >
      <Terminal size={14} className="text-ios-accent" />
      <span className="text-ios-accent">$</span>
      <span className="text-ios-muted">./method.sh --timeline</span>
      <span className="text-ios-text-secondary">|</span>
      <span className="text-ios-accent">~2-4 semanas</span>
      <span className="text-ios-text-secondary">do diagnóstico ao deploy</span>
    </motion.div>
  );
}

/* ─── Component ─── */
export function Method() {
  return (
    <section
      id="metodo"
      className="relative border-t border-ios-border/40 py-24 sm:py-32"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_70%_50%,rgba(61,245,197,0.02),transparent)]" />

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
            <Terminal size={12} />
            método
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
          Diagnóstico → Sistema → Automação →{' '}
          <span className="text-gradient-accent">Produto</span>
        </motion.h2>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="mt-4 max-w-2xl text-base leading-relaxed text-ios-text-secondary"
        >
          Não tem &quot;metodologia ágil&quot; tribunal. Tem 4 etapas, uma
          sequência lógica e um entregável funcionando no final. O método é
          simples porque a execução que é difícil — e é aí que eu entro.
        </motion.p>

        {/* Steps Grid */}
        <div className="mt-14 grid gap-0 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>

        {/* Terminal Timeline */}
        <MethodTimeline />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-8 text-center"
        >
          <a
            href="#lab-lite"
            className="btn-accent inline-flex gap-2 font-mono text-xs uppercase tracking-wider"
          >
            <Zap size={14} />
            quero meu diagnóstico
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default Method;
