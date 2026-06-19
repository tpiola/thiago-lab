'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  GitFork,
  Globe,
  Tag,
  Code2,
  BookOpen,
  Wrench,
  Star,
  ChevronDown,
  Terminal,
  Layers,
} from 'lucide-react';
import { INEMA_ITEMS, LANG_COLORS } from '@/app/inema/data';

export default function InemaDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [expanded, setExpanded] = useState(false);

  const item = useMemo(
    () => INEMA_ITEMS.find((i) => i.slug === slug),
    [slug]
  );

  if (!item) {
    return (
      <main className="min-h-screen bg-ios-base">
        <div className="container-ios pt-36 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-ios-border bg-ios-surface-2">
              <Code2 size={28} className="text-ios-muted" />
            </div>
            <h1 className="heading-lg text-ios-text">Item não encontrado</h1>
            <p className="max-w-md text-sm leading-relaxed text-ios-text-secondary">
              O curso ou ferramenta &quot;{slug}&quot; não foi encontrado no catálogo do INEMA.VIP.
            </p>
            <Link
              href="/inema"
              className="inline-flex items-center gap-2 rounded-lg border border-ios-border bg-ios-surface px-5 py-2.5 font-mono text-xs font-medium text-ios-text transition-all hover:border-ios-accent/30 hover:text-ios-accent"
            >
              <ArrowLeft size={14} />
              Voltar ao catálogo
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  const categoryIcon = item.category === 'curso' ? BookOpen : Wrench;
  const categoryLabel = item.category === 'curso' ? 'Curso' : 'Ferramenta';

  return (
    <main className="min-h-screen bg-ios-base">
      {/* ── Hero Section ── */}
      <section className="reveal-fade relative overflow-hidden border-b border-ios-border/40 pt-28 pb-16 sm:pt-36 sm:pb-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_30%,rgba(61,245,197,0.04),transparent)]" />
        <div className="container-ios relative">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          >
            <Link
              href="/inema"
              className="group mb-6 inline-flex items-center gap-2 rounded-lg border border-ios-border bg-ios-surface px-3.5 py-2 font-mono text-[11px] text-ios-muted transition-all hover:border-ios-accent/30 hover:text-ios-accent"
            >
              <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
              Voltar ao catálogo
            </Link>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-ios-accent/20 bg-ios-accent-dim px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-widest text-ios-accent">
              <Terminal size={12} />
              inema.vip / {item.category}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-ios-accent/20 to-transparent" />
          </motion.div>

          {/* Title and description */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
                className="heading-xl mb-4"
              >
                {item.name}
                {item.featured && (
                  <span className="ml-3 inline-flex items-center gap-1 rounded-full bg-ios-accent-dim px-2.5 py-0.5 align-middle font-mono text-[10px] font-medium uppercase tracking-wider text-ios-accent">
                    <Star size={10} />
                    Destaque
                  </span>
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                className="max-w-2xl text-base leading-relaxed text-ios-text-secondary"
              >
                {item.description}
              </motion.p>
            </div>

            {/* Quick actions */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.25, ease: [0.19, 1, 0.22, 1] }}
              className="flex shrink-0 flex-col gap-2"
            >
              <a
                href={item.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent inline-flex items-center gap-2 text-sm"
              >
                <GitFork size={16} />
                Ver no GitHub
                <ExternalLink size={13} />
              </a>
              {item.pages && (
                <a
                  href={item.pages}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline inline-flex items-center gap-2 text-sm"
                >
                  <Globe size={16} />
                  Site do Curso
                  <ExternalLink size={13} />
                </a>
              )}
            </motion.div>
          </div>

          {/* Metadata strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            {/* Language badge */}
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider ${LANG_COLORS[item.language] || LANG_COLORS['N/A']}`}>
              <Code2 size={11} />
              {item.language}
            </span>

            {/* Category badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ios-border bg-ios-surface-2 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-ios-muted">
              {categoryIcon({ size: 11, className: 'text-ios-accent' })}
              {categoryLabel}
            </span>

            {/* Tags */}
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border border-ios-border/50 bg-ios-surface px-2.5 py-0.5 font-mono text-[9px] text-ios-muted"
              >
                <Tag size={9} />
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Long Description ── */}
      {item.longDescription && (
        <section className="container-ios py-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.19, 1, 0.22, 1] }}
            className="max-w-3xl"
          >
            <h2 className="heading-md mb-6 flex items-center gap-2 text-ios-text">
              <Layers size={18} className="text-ios-accent" />
              Sobre este {categoryLabel.toLowerCase()}
            </h2>

            <div className={`prose prose-invert prose-sm max-w-none leading-relaxed text-ios-text-secondary ${!expanded ? 'line-clamp-[12]' : ''}`}>
              {item.longDescription.split('\n').map((line, i) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return (
                    <h3 key={i} className="mt-5 mb-2 font-mono text-sm font-bold text-ios-text">
                      {line.replace(/\*\*/g, '')}
                    </h3>
                  );
                }
                if (line.startsWith('- ')) {
                  return (
                    <p key={i} className="ml-4 mb-1 text-sm">
                      {line}
                    </p>
                  );
                }
                if (line.trim() === '') {
                  return <div key={i} className="h-2" />;
                }
                return (
                  <p key={i} className="mb-2 text-sm">
                    {line}
                  </p>
                );
              })}
            </div>

            {item.longDescription.length > 400 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-ios-border bg-ios-surface px-4 py-2 font-mono text-[11px] text-ios-muted transition-all hover:border-ios-accent/30 hover:text-ios-accent"
              >
                {expanded ? 'Mostrar menos' : 'Ler mais'}
                <ChevronDown
                  size={13}
                  className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          </motion.div>
        </section>
      )}

      {/* ── Links Section ── */}
      <section className="container-ios pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="mb-6 flex items-center gap-2"
        >
          <ExternalLink size={16} className="text-ios-accent" />
          <span className="font-mono text-sm font-bold uppercase tracking-wider text-ios-accent">
            Links e Recursos
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-ios-accent/20 to-transparent" />
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <motion.a
            href={item.github}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="group flex items-center gap-4 rounded-xl border border-ios-border/50 bg-ios-surface p-5 transition-all hover:border-ios-accent/30 hover:shadow-ios-glow-sm"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-ios-accent-dim">
              <GitFork size={22} className="text-ios-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-mono text-sm font-bold text-ios-text group-hover:text-ios-accent">Repositório GitHub</h3>
              <p className="mt-0.5 font-mono text-[11px] text-ios-muted line-clamp-1">
                {item.github.replace('https://github.com/', '')}
              </p>
            </div>
            <ExternalLink size={14} className="shrink-0 text-ios-muted transition-colors group-hover:text-ios-accent" />
          </motion.a>

          {item.pages && (
            <motion.a
              href={item.pages}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="group flex items-center gap-4 rounded-xl border border-ios-border/50 bg-ios-surface p-5 transition-all hover:border-ios-accent/30 hover:shadow-ios-glow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-ios-accent-dim">
                <Globe size={22} className="text-ios-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-mono text-sm font-bold text-ios-text group-hover:text-ios-accent">
                  {item.category === 'curso' ? 'Acessar Curso' : 'Página da Ferramenta'}
                </h3>
                <p className="mt-0.5 font-mono text-[11px] text-ios-muted line-clamp-1">
                  {item.pages.replace('https://', '')}
                </p>
              </div>
              <ExternalLink size={14} className="shrink-0 text-ios-muted transition-colors group-hover:text-ios-accent" />
            </motion.a>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="flex items-center gap-4 rounded-xl border border-ios-border/50 bg-ios-surface p-5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-ios-surface-2">
              <Code2 size={22} className="text-ios-muted" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-ios-text">Tecnologia</h3>
              <span className={`mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${LANG_COLORS[item.language] || LANG_COLORS['N/A']}`}>
                {item.language}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Terminal Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
        className="container-ios pb-24"
      >
        <div className="mx-auto flex max-w-2xl items-center gap-2 rounded-lg border border-ios-border bg-ios-surface-2 px-4 py-2.5 font-mono text-[11px] text-ios-muted">
          <Terminal size={13} className="text-ios-accent" />
          <span className="text-ios-accent">$</span>
          <span>cat ./inema/{item.slug}/README.md | head -n 50</span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ios-accent/60" />
            <span className="text-ios-accent/80">{item.tags.length} tags</span>
          </span>
        </div>
      </motion.div>
    </main>
  );
}
