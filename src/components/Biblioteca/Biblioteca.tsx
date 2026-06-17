'use client';

import { motion } from 'framer-motion';
import {
  FileText,
  BookOpen,
  Code,
  GitBranch,
  Tag,
  Terminal,
  ArrowUpRight,
} from 'lucide-react';

/* ─── Biblioteca Resources ─── */

interface ResourceCard {
  id: string;
  icon: React.ElementType;
  name: string;
  description: string;
  tags: string[];
  gradient: string;
  badge: string;
  badgeColor: string;
  href?: string;
}

const RESOURCES: ResourceCard[] = [
  {
    id: 'prompt-validado',
    icon: FileText,
    name: 'Prompt Validado',
    description:
      'Prompts testados e otimizados para cada área de aplicação. Copie, cole e execute — zero ajuste fino. Inclui variáveis parametrizadas, exemplos few-shot e estratégias de chain-of-thought documentadas.',
    tags: ['Claude', 'GPT', 'RAG', 'Few-shot'],
    gradient: 'from-blue-500/10 to-blue-500/5',
    badge: 'destaque',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    id: 'estudo-de-caso',
    icon: BookOpen,
    name: 'Estudo de Caso',
    description:
      'Projetos reais documentados do diagnóstico ao deploy. Arquitetura, decisões técnicas, código-fonte e métricas de resultado. Aprenda com implementações que já rodam em produção.',
    tags: ['n8n', 'Supabase', 'Next.js', 'Claude'],
    gradient: 'from-violet-500/10 to-violet-500/5',
    badge: 'popular',
    badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  },
  {
    id: 'miniapp',
    icon: Code,
    name: 'MiniApp',
    description:
      'Aplicações funcionais e modulares que resolvem um problema específico. Instale, configure e use. Código aberto, documentado e com instruções de deploy em qualquer VPS ou servidor.',
    tags: ['Next.js', 'Python', 'React', 'API'],
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    badge: 'novo',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'workflow',
    icon: GitBranch,
    name: 'Workflow',
    description:
      'Automações prontas para importar no n8n. Fluxos completos com webhooks, integrações e tratamento de erros. Conecte sua stack em minutos com pipelines testados em produção.',
    tags: ['n8n', 'Automação', 'Webhook', 'Pipeline'],
    gradient: 'from-ios-accent/10 to-ios-accent/5',
    badge: 'automação',
    badgeColor: 'text-ios-accent bg-ios-accent-dim border-ios-accent/20',
  },
];

/* ─── Resource Card ─── */

function ResourceCard({
  resource,
  index,
}: {
  resource: ResourceCard;
  index: number;
}) {
  const Icon = resource.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.19, 1, 0.22, 1],
      }}
      className="card-surface group relative flex flex-col overflow-hidden"
    >
      {/* Hover accent top line */}
      <div className="h-0.5 w-0 bg-gradient-to-r from-ios-accent to-emerald-400 transition-all duration-500 group-hover:w-full" />

      {/* Card Top */}
      <div className="p-5 pb-0">
        {/* Badge + Icon row */}
        <div className="flex items-start justify-between">
          {/* Badge */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${resource.badgeColor}`}
          >
            <Tag size={10} />
            {resource.badge}
          </span>

          {/* Icon */}
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${resource.gradient} border border-ios-border`}>
            <Icon size={18} className="text-ios-accent" />
          </div>
        </div>

        {/* Name */}
        <h3 className="mt-4 font-mono text-sm font-bold uppercase tracking-wider text-ios-text">
          {resource.name}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm leading-relaxed text-ios-text-secondary">
          {resource.description}
        </p>
      </div>

      {/* Card Bottom */}
      <div className="mt-auto flex flex-col gap-3 p-5 pt-4">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          {resource.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md border border-ios-border bg-ios-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ios-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Access link */}
        <a
          href={resource.href || '#'}
          className="inline-flex items-center gap-1.5 self-start font-mono text-[11px] font-medium uppercase tracking-wider text-ios-accent transition-all duration-300 hover:gap-2"
        >
          Acessar recurso
          <ArrowUpRight size={12} />
        </a>
      </div>
    </motion.article>
  );
}

/* ─── Component ─── */

export function Biblioteca() {
  return (
    <section
      id="biblioteca"
      className="relative border-t border-ios-border/40 py-24 sm:py-32"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_70%,rgba(61,245,197,0.02),transparent)]" />

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
            biblioteca
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
          Conteúdo organizado{' '}
          <span className="text-gradient-accent">como produto</span>
        </motion.h2>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="mt-4 max-w-2xl text-base leading-relaxed text-ios-text-secondary"
        >
          Não é um blog com posts soltos. Cada recurso aqui é um ativo
          testado, documentado e pronto para uso — prompt, código,
          automação ou estudo completo.
        </motion.p>

        {/* Grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {RESOURCES.map((resource, i) => (
            <ResourceCard key={resource.id} resource={resource} index={i} />
          ))}
        </div>

        {/* Terminal status bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7, ease: [0.19, 1, 0.22, 1] }}
          className="mx-auto mt-10 flex max-w-lg items-center gap-2 rounded-lg border border-ios-border bg-ios-surface-2 px-4 py-2.5 font-mono text-[11px] text-ios-muted"
        >
          <Terminal size={13} className="text-ios-accent" />
          <span className="text-ios-accent">$</span>
          <span>ls -la ./biblioteca/</span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ios-accent/60" />
            <span className="text-ios-accent/80">{RESOURCES.length} recursos</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}

export default Biblioteca;
