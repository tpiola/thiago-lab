'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  BookOpen,
  Code,
  Terminal,
  Star,
  ExternalLink,
  GitFork,
  ArrowUpRight,
  GraduationCap,
  Wrench,
  BookMarked,
  Github,
  Layers,
  Tag,
} from 'lucide-react';
import { INEMA_ITEMS, INEMA_STATS, LANG_COLORS } from '@/app/inema/data';
import type { InemaItem, InemaCategory } from '@/app/inema/data';

/* ─── Icon resolver ─── */
function ItemIcon({ item }: { item: InemaItem }) {
  const cls = 'w-5 h-5 text-ios-accent';
  return item.category === 'curso' ? <BookOpen className={cls} /> : <Wrench className={cls} />;
}

/* ─── Language Badge ─── */
function LangBadge({ language }: { language: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${LANG_COLORS[language] || LANG_COLORS['N/A']}`}>
      <Code size={10} className="mr-1" />
      {language || 'N/A'}
    </span>
  );
}

/* ─── Card Component ─── */
function InemaCard({ item, index }: { item: InemaItem; index: number }) {
  return (
    <div className="card-3d">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: index * 0.06, ease: [0.19, 1, 0.22, 1] }}
      >
        <Link
          href={`/inema/${item.slug}`}
          className="card-surface card-3d-inner group flex h-full flex-col transition-all duration-300 hover:border-ios-accent/30 hover:shadow-ios-glow-sm"
        >
          {/* Card header */}
          <div className="flex items-start justify-between p-5 pb-3">
            <div className="flex items-center gap-3">
              <div className="img-zoom flex h-10 w-10 items-center justify-center rounded-lg border border-ios-border bg-ios-surface-2">
                <ItemIcon item={item} />
              </div>
              <div>
                <h3 className="font-mono text-sm font-bold text-ios-text group-hover:text-ios-accent transition-colors">{item.name}</h3>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-ios-muted">
                  <GitFork size={10} />
                  {item.category === 'curso' ? 'Curso' : 'Ferramenta'}
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              {item.featured && (
                <Star size={12} className="text-ios-accent" />
              )}
              <ExternalLink size={14} className="shrink-0 text-ios-muted transition-colors group-hover:text-ios-accent" />
            </div>
          </div>

          {/* Description */}
          <div className="px-5 pb-3 flex-1">
            <p className="text-sm leading-relaxed text-ios-text-secondary line-clamp-3">
              {item.description}
            </p>
          </div>

          {/* Tags */}
          <div className="px-5 pb-3 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 rounded-full border border-ios-border/40 bg-ios-surface-2/50 px-2 py-0.5 font-mono text-[8px] text-ios-muted"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="font-mono text-[8px] text-ios-muted/60">+{item.tags.length - 3}</span>
            )}
          </div>

          {/* Card footer */}
          <div className="mt-auto flex items-center gap-2 border-t border-ios-border/30 px-5 py-3">
            <LangBadge language={item.language} />
            <span className="ml-auto flex items-center gap-1 font-mono text-[10px] text-ios-accent opacity-0 transition-opacity group-hover:opacity-100">
              Ver detalhes <ArrowUpRight size={10} />
            </span>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}

/* ─── Featured Card (compact, for "Em Destaque" row) ─── */
function FeaturedCard({ item, index }: { item: InemaItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.19, 1, 0.22, 1] }}
    >
      <Link
        href={`/inema/${item.slug}`}
        className="group flex flex-col items-center gap-3 rounded-xl border border-ios-border/50 bg-ios-surface p-5 text-center transition-all duration-300 hover:border-ios-accent/30 hover:bg-ios-surface-2 hover:shadow-ios-glow-sm h-full"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ios-accent-dim">
          <Star size={20} className="text-ios-accent" />
        </div>
        <span className="font-mono text-sm font-bold text-ios-text group-hover:text-ios-accent">{item.name}</span>
        <span className="line-clamp-2 text-[11px] leading-relaxed text-ios-muted">{item.description}</span>
        <div className="mt-auto flex flex-wrap items-center justify-center gap-1.5">
          <LangBadge language={item.language} />
          <span className="inline-flex items-center gap-1 rounded-full border border-ios-border bg-ios-surface-2 px-2 py-0.5 font-mono text-[8px] text-ios-muted">
            {item.category === 'curso' ? 'Curso' : 'Ferramenta'}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function InemaPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<InemaCategory>('todos');

  const filtered = useMemo(() => {
    return INEMA_ITEMS.filter((item) => {
      const matchSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.language.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchFilter = filter === 'todos' || item.category === filter;
      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  const featuredItems = INEMA_ITEMS.filter((i) => i.featured);

  return (
    <main className="min-h-screen bg-ios-base">
      {/* ── Hero ── */}
      <section className="reveal-fade relative overflow-hidden border-b border-ios-border/40 pt-28 pb-20 sm:pt-36 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_30%,rgba(61,245,197,0.04),transparent)]" />
        <div className="container-ios relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-ios-accent/20 bg-ios-accent-dim px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-widest text-ios-accent">
              <Terminal size={12} />
              inema.vip
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-ios-accent/20 to-transparent" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
            className="heading-xl max-w-4xl"
          >
            INEMA.VIP —{' '}
            <span className="text-gradient-accent">Catálogo de Cursos e Ferramentas</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="mt-4 max-w-2xl text-base leading-relaxed text-ios-text-secondary"
          >
            Catálogo completo com {INEMA_STATS.cursos} cursos e {INEMA_STATS.ferramentas} ferramentas
            do ecossistema INEMA.VIP — engenharia de prompt, agentes de IA, Claude Code,
            e plataformas prontas para deploy. Tudo open source no{' '}
            <a href="https://github.com/inematds" target="_blank" rel="noopener noreferrer" className="text-ios-accent underline underline-offset-2 hover:brightness-110">
              github.com/inematds
            </a>.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="mt-8 flex flex-wrap gap-6"
          >
            {[
              { label: 'Cursos', value: String(INEMA_STATS.cursos), icon: GraduationCap },
              { label: 'Ferramentas', value: String(INEMA_STATS.ferramentas), icon: Wrench },
              { label: 'Em Destaque', value: String(INEMA_STATS.featured), icon: Star },
              { label: 'Total', value: String(INEMA_STATS.total), icon: Layers },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-lg border border-ios-border bg-ios-surface-2/50 px-4 py-3">
                <s.icon size={16} className="text-ios-accent" />
                <span className="font-mono text-2xl font-bold text-ios-accent">{s.value}</span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-ios-muted">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Destaques ── */}
      {featuredItems.length > 0 && (
        <section className="reveal-fade container-ios py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="mb-8 flex items-center gap-2"
          >
            <Star size={16} className="text-ios-accent" />
            <span className="font-mono text-sm font-bold uppercase tracking-wider text-ios-accent">Em Destaque</span>
            <div className="h-px flex-1 bg-gradient-to-r from-ios-accent/20 to-transparent" />
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredItems.map((item, i) => (
              <FeaturedCard key={item.slug} item={item} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ── Grid com Filtro ── */}
      <section className="reveal-fade container-ios pb-24 sm:pb-32">
        {/* Search + Filter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ios-muted" />
            <input
              type="text"
              placeholder="Buscar por nome, descrição, tecnologia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-ios-border bg-ios-surface py-2.5 pl-10 pr-4 font-mono text-sm text-ios-text placeholder:text-ios-muted/60 transition-colors focus:border-ios-accent/40 focus:outline-none focus:ring-1 focus:ring-ios-accent/20"
            />
          </div>

          {/* Filter buttons */}
          <div className="flex gap-1.5">
            {(['todos', 'curso', 'ferramenta'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-wider transition-all duration-200 ${
                  filter === f
                    ? 'bg-ios-accent text-ios-base shadow-ios-glow-sm'
                    : 'border border-ios-border bg-ios-surface text-ios-muted hover:border-ios-accent/30 hover:text-ios-text'
                }`}
              >
                {f === 'todos'
                  ? '📋 Todos'
                  : f === 'curso'
                  ? '📚 Cursos'
                  : '🔧 Ferramentas'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, i) => (
            <InemaCard key={item.slug} item={item} index={i} />
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16 flex flex-col items-center gap-4 text-center"
          >
            <BookMarked size={32} className="text-ios-muted" />
            <p className="font-mono text-sm text-ios-muted">Nenhum item encontrado</p>
            <button
              onClick={() => { setSearch(''); setFilter('todos'); }}
              className="btn-outline text-xs"
            >
              Limpar filtros
            </button>
          </motion.div>
        )}

        {/* Terminal bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="mx-auto mt-10 flex max-w-lg items-center gap-2 rounded-lg border border-ios-border bg-ios-surface-2 px-4 py-2.5 font-mono text-[11px] text-ios-muted"
        >
          <Terminal size={13} className="text-ios-accent" />
          <span className="text-ios-accent">$</span>
          <span>ls -la ./inema/ --filter={filter} --search=&quot;{search || 'todos'}&quot;</span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ios-accent/60" />
            <span className="text-ios-accent/80">{filtered.length} resultados</span>
          </span>
        </motion.div>
      </section>
    </main>
  );
}
