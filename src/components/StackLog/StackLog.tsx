'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Braces,
  Workflow,
  Bot,
  Database,
  Cloud,
  GitBranch,
  Cpu,
  Globe,
  ArrowUpRight,
} from 'lucide-react';

/* ─── Data: Stack Log ─── */
const STACK_CATEGORIES = [
  {
    label: 'agentes & ia',
    icon: Bot,
    items: ['Claude (Anthropic)', 'OpenAI GPT-4o', 'LangChain/LangGraph', 'n8n AI Agents', 'Hugging Face', 'RAG pipelines'],
  },
  {
    label: 'automação',
    icon: Workflow,
    items: ['n8n (self-hosted)', 'Make', 'Zapier', 'Python scripts', 'Cron + Webhooks', 'GitHub Actions'],
  },
  {
    label: 'backend & dados',
    icon: Database,
    items: ['Node.js / Python', 'Supabase (Postgres)', 'Prisma ORM', 'Redis / Upstash', 'QStash', 'Neon DB'],
  },
  {
    label: 'frontend & ux',
    icon: Globe,
    items: ['Next.js 15', 'React 19', 'Tailwind v4', 'Framer Motion', 'GSAP', 'Three.js / Spline'],
  },
  {
    label: 'infra & deploy',
    icon: Cloud,
    items: ['Vercel', 'Docker', 'Railway', 'Cloudflare', 'AWS Lambda', 'Linux (Ubuntu)'],
  },
  {
    label: 'devops & git',
    icon: GitBranch,
    items: ['Git / GitHub', 'CI/CD pipelines', 'n8n workflows', 'Monorepo (Turborepo)', 'Testing (Vitest)', 'ESLint / Prettier'],
  },
];

/* ─── Stack Card ─── */
function StackCard({
  category,
  index,
}: {
  category: (typeof STACK_CATEGORIES)[number];
  index: number;
}) {
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.19, 1, 0.22, 1] }}
      className="group card-surface overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-ios-border px-5 py-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ios-accent-dim">
          <Icon size={15} className="text-ios-accent" />
        </div>
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-ios-muted">
          {category.label}
        </span>
      </div>

      {/* Items */}
      <ul className="divide-y divide-ios-border/50">
        {category.items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 px-5 py-2.5 font-mono text-sm text-ios-text-secondary transition-colors duration-200 group-hover:text-ios-text"
          >
            <span className="text-ios-accent/60 text-xs">▸</span>
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ─── Terminal Summary Bar ─── */
const TECH_TOTAL = STACK_CATEGORIES.reduce((acc, c) => acc + c.items.length, 0);

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}</span>;
}

function TerminalSummary() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-2 rounded-lg border border-ios-border bg-ios-surface px-5 py-3 font-mono text-xs"
    >
      <span className="text-ios-accent">$</span>
      <span className="text-ios-muted">du -sh ~/stack</span>
      <span className="text-ios-text-secondary">
        <AnimatedCounter target={TECH_TOTAL} /> techs · 6 domínios
      </span>
      <span className="text-ios-accent/40">||</span>
      <span className="text-ios-accent">✓</span>
      <span className="text-ios-text-secondary">production ready</span>
    </motion.div>
  );
}

/* ─── Component ─── */
export function StackLog() {
  return (
    <section
      id="stack"
      className="relative border-t border-ios-border/40 py-24 sm:py-32"
    >
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(61,245,197,0.03),transparent)]" />

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
            <Cpu size={12} />
            stack log
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
          Não é teoria.{' '}
          <span className="text-gradient-accent">É stack de guerra.</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="mt-4 max-w-2xl text-base leading-relaxed text-ios-text-secondary"
        >
          Todo dia eu tô no terminal — construindo agentes, automatizando processos
          e entregando produtos reais com{' '}
          <span className="text-ios-accent">{TECH_TOTAL}+ ferramentas</span> na
          ponta dos dedos. Cada linha abaixo é algo que eu uso de verdade, não
          hype de LinkedIn.
        </motion.p>

        {/* Grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STACK_CATEGORIES.map((cat, i) => (
            <StackCard key={cat.label} category={cat} index={i} />
          ))}
        </div>

        {/* Terminal Summary */}
        <TerminalSummary />

        {/* Ghost CTA — subtle link to full resume */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <a
            href="#cases"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-ios-muted transition-colors duration-200 hover:text-ios-accent"
          >
            <ArrowUpRight size={13} />
            ver cases reais com essa stack
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default StackLog;
