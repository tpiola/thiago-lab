'use client';

import { useState, useMemo } from 'react';
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
  ChevronDown,
  BrainCircuit,
  Layers,
} from 'lucide-react';
import { KARPATHY_REPOS, KARPATHY_STATS, CATEGORY_LABELS, CATEGORY_COLORS } from '@/data/karpathy-repos';
import type { KarpathyCategory } from '@/data/karpathy-repos';

/* ─── INEMA Repository Data ─── */
interface InemaRepo {
  name: string;
  description: string;
  language: string;
  url: string;
  category: 'curso' | 'ferramenta';
  featured: boolean;
  icon: string;
}

const ALL_REPOS: InemaRepo[] = [
  // ── CURSOS (12) ──
  { name: 'FEP', description: 'Formação Engenharia de Prompt — 8 módulos completos de prompt engineering com system prompts, few-shot, chain-of-thought e técnicas avançadas.', language: 'HTML', url: 'https://github.com/inematds/FEP', category: 'curso', featured: true, icon: 'book' },
  { name: 'FDF', description: 'Designer do Futuro — Design com IA generativa para criativos, UX designers e artistas digitais.', language: 'Shell', url: 'https://github.com/inematds/FDF', category: 'curso', featured: true, icon: 'book' },
  { name: 'FEA-IA', description: 'Formação Engenheiros Agentes IA — Arquitetura de agentes, ferramentas, loops autônomos e sistemas multiagentes.', language: 'HTML', url: 'https://github.com/inematds/FEA-IA', category: 'curso', featured: true, icon: 'book' },
  { name: 'BMAD-Academy', description: 'BMAD Academy — Soluções No-Code AI para negócios. Crie agentes sem programar.', language: 'JavaScript', url: 'https://github.com/inematds/BMAD-Academy', category: 'curso', featured: true, icon: 'book' },
  { name: 'CLI-x', description: 'Terminal como Interface — CLI agents, ferramentas de terminal agentic e automação via linha de comando.', language: 'HTML', url: 'https://github.com/inematds/CLI-x', category: 'curso', featured: true, icon: 'book' },
  { name: 'deerflow', description: 'DeerFlow 2.0 — Agent harness para orquestração de agentes com fluxos de trabalho declarativos.', language: 'HTML', url: 'https://github.com/inematds/deerflow', category: 'curso', featured: false, icon: 'book' },
  { name: '6pilarccb', description: '6 Pilares do Claude Code — Metodologia completa para dominar Claude Code em 6 pilares fundamentais.', language: 'HTML', url: 'https://github.com/inematds/6pilarccb', category: 'curso', featured: true, icon: 'book' },
  { name: 'multiagentes', description: 'Equipes de Agentes — Arquitetura e implementação de sistemas com múltiplos agentes colaborativos.', language: 'HTML', url: 'https://github.com/inematds/multiagentes', category: 'curso', featured: false, icon: 'book' },
  { name: 'ccguide2026', description: 'Claude Code 2026 — Guia completo de Claude Code: skills, ferramentas, configuração e melhores práticas.', language: 'HTML', url: 'https://github.com/inematds/ccguide2026', category: 'curso', featured: true, icon: 'book' },
  { name: 'aiosagi', description: 'AIOS — AI Agent OS: sistema operacional para agentes de IA com gerenciamento de recursos.', language: 'HTML', url: 'https://github.com/inematds/aiosagi', category: 'curso', featured: false, icon: 'book' },
  { name: 'claudecode-manual', description: 'Manual completo do Claude Code — referência técnica, skills, debug e deploy.', language: 'HTML', url: 'https://github.com/inematds/claudecode-manual', category: 'curso', featured: false, icon: 'book' },
  { name: 'remotion-skills', description: 'Remotion Skills — Criação de vídeos programáticos com React/Remotion + agentes Claude Code.', language: 'TypeScript', url: 'https://github.com/inematds/remotion-skills', category: 'curso', featured: false, icon: 'book' },

  // ── FERRAMENTAS (13) ──
  { name: 'intelecto', description: 'Telegram AI Agent em Python — assistente inteligente para Telegram com ferramentas e memória.', language: 'Python', url: 'https://github.com/inematds/intelecto', category: 'ferramenta', featured: true, icon: 'tool' },
  { name: 'nanobot', description: 'Framework modular de agentes (Python/Docker) — construa agentes customizados com plugins.', language: 'Python', url: 'https://github.com/inematds/nanobot', category: 'ferramenta', featured: true, icon: 'tool' },
  { name: 'nm82', description: 'Sistema de Padrinhos e Afiliados INEMA.VIP — Next.js/Supabase com gestão de comissões.', language: 'TypeScript', url: 'https://github.com/inematds/nm82', category: 'ferramenta', featured: false, icon: 'tool' },
  { name: 'whatsapp-agentkit', description: 'WhatsApp Bot (Node.js/TypeScript) — agente inteligente para WhatsApp Business API.', language: 'TypeScript', url: 'https://github.com/inematds/whatsapp-agentkit', category: 'ferramenta', featured: true, icon: 'tool' },
  { name: 'APIPXINTER', description: 'API Pix Banco Inter — integração financeira com Pix via Banco Inter (Node.js).', language: 'JavaScript', url: 'https://github.com/inematds/APIPXINTER', category: 'ferramenta', featured: false, icon: 'tool' },
  { name: 'yt-pub-livesx', description: 'YouTube Live Management — gerencie lives e publicações no YouTube automaticamente (Python).', language: 'Python', url: 'https://github.com/inematds/yt-pub-livesx', category: 'ferramenta', featured: false, icon: 'tool' },
  { name: 'inemavox', description: 'Processamento de áudio/vídeo com IA — transcrição, síntese de voz e edição automatizada (Python).', language: 'Python', url: 'https://github.com/inematds/inemavox', category: 'ferramenta', featured: false, icon: 'tool' },
  { name: 'ai-strategy-factory', description: 'Fábrica de Estratégias de IA — gera planos estratégicos personalizados de adoção de IA.', language: 'Python', url: 'https://github.com/inematds/ai-strategy-factory', category: 'ferramenta', featured: false, icon: 'tool' },
  { name: 'docker-moltbot', description: 'Container Docker para agente MoltBot — deploy rápido de agentes em contêiner.', language: 'Shell', url: 'https://github.com/inematds/docker-moltbot', category: 'ferramenta', featured: false, icon: 'tool' },
  { name: 'docker-clawdbot', description: 'Container Docker para agente ClawdBot — ambiente isolado para agentes de código.', language: 'Shell', url: 'https://github.com/inematds/docker-clawdbot', category: 'ferramenta', featured: false, icon: 'tool' },
  { name: 'lk_agente_v3', description: 'Agente de Voz com LiveKit — assistente de voz inteligente em Português com LiveKit.', language: 'Python', url: 'https://github.com/inematds/lk_agente_v3', category: 'ferramenta', featured: false, icon: 'tool' },
  { name: 'openpcbot', description: 'PC Bot — automação e controle remoto de computador via bot.', language: 'TypeScript', url: 'https://github.com/inematds/openpcbot', category: 'ferramenta', featured: false, icon: 'tool' },
  { name: 'GIPM', description: 'GIPM — Gestão Integrada de Projetos e Marketing com dashboards e automação.', language: 'HTML', url: 'https://github.com/inematds/GIPM', category: 'ferramenta', featured: false, icon: 'tool' },
];

/* ─── Language Colors ─── */
const LANG_COLORS: Record<string, string> = {
  Python: 'text-blue-400 bg-blue-500/10',
  TypeScript: 'text-blue-300 bg-blue-400/10',
  JavaScript: 'text-yellow-400 bg-yellow-500/10',
  HTML: 'text-orange-400 bg-orange-500/10',
  Shell: 'text-green-400 bg-green-500/10',
  'N/A': 'text-ios-muted bg-ios-surface-2',
};

/* ─── Icon resolver ─── */
function RepoIcon({ icon }: { icon: string }) {
  const cls = 'w-5 h-5 text-ios-accent';
  switch (icon) {
    case 'book': return <BookOpen className={cls} />;
    case 'tool': return <Wrench className={cls} />;
    default: return <Code className={cls} />;
  }
}

/* ─── Card Component ─── */
function RepoCard({ repo, index }: { repo: InemaRepo; index: number }) {
  return (
    <div className="card-3d">
      <motion.a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: index * 0.06, ease: [0.19, 1, 0.22, 1] }}
        className="card-surface card-3d-inner group flex flex-col transition-all duration-300 hover:border-ios-accent/30 hover:shadow-ios-glow-sm"
      >
        {/* Card header */}
        <div className="flex items-start justify-between p-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="img-zoom flex h-10 w-10 items-center justify-center rounded-lg border border-ios-border bg-ios-surface-2">
              <RepoIcon icon={repo.icon} />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-ios-text">{repo.name}</h3>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-ios-muted">
                <GitFork size={10} />
                {repo.category === 'curso' ? 'Curso' : 'Ferramenta'}
              </span>
            </div>
          </div>
          <ExternalLink size={14} className="shrink-0 text-ios-muted transition-colors group-hover:text-ios-accent" />
        </div>

        {/* Description */}
        <div className="px-5 pb-3">
          <p className="text-sm leading-relaxed text-ios-text-secondary line-clamp-3">
            {repo.description}
          </p>
        </div>

        {/* Card footer */}
        <div className="mt-auto flex items-center gap-2 border-t border-ios-border/30 px-5 py-3">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${LANG_COLORS[repo.language] || LANG_COLORS['N/A']}`}>
            {repo.language || 'N/A'}
          </span>
          <span className="ml-auto flex items-center gap-1 font-mono text-[10px] text-ios-accent opacity-0 transition-opacity group-hover:opacity-100">
            Ver repositório <ArrowUpRight size={10} />
          </span>
        </div>
      </motion.a>
    </div>
  );
}

/* ─── Page Component ─── */
export default function InemaPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'todos' | 'curso' | 'ferramenta'>('todos');

  const filtered = useMemo(() => {
    return ALL_REPOS.filter((r) => {
      const matchSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()) ||
        r.language.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'todos' || r.category === filter;
      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  const featured = ALL_REPOS.filter((r) => r.featured);

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
            <span className="text-gradient-accent">Ecossistema de Agentes e Formação</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="mt-4 max-w-2xl text-base leading-relaxed text-ios-text-secondary"
          >
            Mais de 300 repositórios de formação e ferramentas — cursos completos de
            engenharia de prompt, agentes de IA, Claude Code, e plataformas prontas
            para deploy. Tudo open source no{' '}
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
              { label: 'Repositórios', value: '313+' },
              { label: 'Cursos', value: '12' },
              { label: 'Ferramentas', value: '13+' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-lg border border-ios-border bg-ios-surface-2/50 px-4 py-3">
                <span className="font-mono text-2xl font-bold text-ios-accent">{s.value}</span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-ios-muted">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Destaques ── */}
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {featured.map((repo, i) => (
            <motion.a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.19, 1, 0.22, 1] }}
              className="group flex flex-col items-center gap-3 rounded-xl border border-ios-border/50 bg-ios-surface p-5 text-center transition-all duration-300 hover:border-ios-accent/30 hover:bg-ios-surface-2 hover:shadow-ios-glow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ios-accent-dim">
                <Star size={20} className="text-ios-accent" />
              </div>
              <span className="font-mono text-sm font-bold text-ios-text group-hover:text-ios-accent">{repo.name}</span>
              <span className="line-clamp-2 text-[11px] leading-relaxed text-ios-muted">{repo.description}</span>
              <span className="mt-auto inline-flex items-center gap-1 rounded-full border border-ios-border bg-ios-surface-2 px-2.5 py-0.5 font-mono text-[10px] uppercase text-ios-muted">
                <ArrowUpRight size={10} /> {repo.language}
              </span>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── KARPATHY LABS ── */}
      <section className="reveal-fade container-ios py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="mb-8 flex items-center gap-2"
        >
          <BrainCircuit size={16} className="text-purple-400" />
          <span className="font-mono text-sm font-bold uppercase tracking-wider text-purple-400">Karpathy Labs</span>
          <div className="h-px flex-1 bg-gradient-to-r from-purple-400/20 to-transparent" />
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          className="mb-8 flex flex-wrap gap-4"
        >
          <div className="flex items-center gap-3 rounded-lg border border-purple-500/20 bg-purple-500/5 px-4 py-3">
            <span className="font-mono text-2xl font-bold text-purple-400">{KARPATHY_STATS.total}</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-purple-400/70">Repositórios</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
            <span className="font-mono text-2xl font-bold text-yellow-400">{(KARPATHY_STATS.totalStars / 1000).toFixed(0)}M+</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-yellow-400/70">Stars</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-3">
            <span className="font-mono text-2xl font-bold text-blue-400">{KARPATHY_STATS.totalForks.toLocaleString()}</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-blue-400/70">Forks</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3">
            <span className="font-mono text-2xl font-bold text-green-400">{Object.keys(KARPATHY_STATS.categories).length}</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-green-400/70">Categorias</span>
          </div>
        </motion.div>

        {/* Category breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {Object.entries(KARPATHY_STATS.categories).map(([cat, count]) => (
            <span
              key={cat}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider ${CATEGORY_COLORS[cat as KarpathyCategory]}`}
            >
              <Layers size={10} />
              {CATEGORY_LABELS[cat as KarpathyCategory]} ({count})
            </span>
          ))}
        </motion.div>

        {/* Top repos grid */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-6 font-mono text-[11px] uppercase tracking-wider text-ios-muted"
        >
          Top repositórios por estrelas:
        </motion.p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {KARPATHY_REPOS.slice(0, 12).map((repo, i) => (
            <motion.a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.19, 1, 0.22, 1] }}
              className="group flex flex-col rounded-xl border border-ios-border/50 bg-ios-surface p-4 transition-all duration-300 hover:border-purple-500/30 hover:bg-ios-surface-2 hover:shadow-ios-glow-sm"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-ios-text group-hover:text-purple-400">{repo.name}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-yellow-400">★</span>
                  <span className="font-mono text-[10px] text-ios-muted">{repo.stars >= 1000 ? `${(repo.stars/1000).toFixed(1)}k` : repo.stars}</span>
                </div>
              </div>
              <p className="mb-3 line-clamp-2 text-[11px] leading-relaxed text-ios-text-secondary">{repo.description || 'No description'}</p>
              <div className="mt-auto flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider ${CATEGORY_COLORS[repo.category as KarpathyCategory]}`}>
                  {CATEGORY_LABELS[repo.category as KarpathyCategory]}
                </span>
                <span className="ml-auto font-mono text-[9px] text-ios-muted">{repo.language}</span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* See all link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 text-center"
        >
          <a
            href="https://github.com/karpathy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/5 px-5 py-2.5 font-mono text-xs font-medium text-purple-400 transition-all hover:bg-purple-500/10 hover:shadow-ios-glow-sm"
          >
            <ExternalLink size={14} />
            Ver todos os 63 repositórios no GitHub
            <ArrowUpRight size={12} />
          </a>
        </motion.div>
      </section>

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
              placeholder="Buscar repositórios..."
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
                {f === 'todos' ? 'Todos' : f === 'curso' ? '📚 Cursos' : '🔧 Ferramentas'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((repo, i) => (
            <RepoCard key={repo.name} repo={repo} index={i} />
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
            <p className="font-mono text-sm text-ios-muted">Nenhum repositório encontrado</p>
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
