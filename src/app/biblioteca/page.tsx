"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Copy,
  Check,
  BookOpen,
  Tag,
  Cpu,
  Zap,
  ChevronRight,
  X,
} from "lucide-react";
import { promptsData, type PromptEntry } from "@/content/prompts";

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════ */
const CATEGORIAS = ["Todas", "Saúde", "Farmácia", "Código", "Marketing", "Automação", "Conteúdo"] as const;

const CATEGORIA_ICONS: Record<string, string> = {
  "Saúde": "💚",
  "Farmácia": "💊",
  "Código": "💻",
  "Marketing": "📈",
  "Automação": "⚡",
  "Conteúdo": "✍️",
};

const easeOut = [0.16, 1, 0.3, 1] as const;

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — Prompt Card
   ═══════════════════════════════════════════════════════════════ */
function PromptCard({ prompt }: { prompt: PromptEntry }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: easeOut }}
      className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-emerald-500/20 hover:bg-white/[0.04]"
    >
      {/* Header */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">{CATEGORIA_ICONS[prompt.categoria] || "📋"}</span>
            <div>
              <h3 className="text-base font-bold text-white font-['Clash_Display',system-ui,sans-serif]">
                {prompt.titulo}
              </h3>
              <span className="text-[11px] text-white/30 font-medium uppercase tracking-wider">
                {prompt.categoria}
              </span>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className={`shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium transition-all ${
              copied
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                : "bg-white/[0.03] text-white/40 hover:text-white border border-white/[0.06] hover:border-white/[0.12]"
            }`}
          >
            {copied ? (
              <>
                <Check size={13} />
                Copiado
              </>
            ) : (
              <>
                <Copy size={13} />
                Copiar
              </>
            )}
          </button>
        </div>

        <p className="text-sm text-white/50 leading-relaxed mb-3">{prompt.descricao}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium text-emerald-400/70 bg-emerald-500/5 border border-emerald-500/10"
            >
              {tag}
            </span>
          ))}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium text-white/25 bg-white/[0.02] border border-white/[0.04]">
            <Cpu size={10} />
            {prompt.modelo}
          </span>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-emerald-400/60 hover:text-emerald-400 transition-colors"
        >
          {expanded ? "Recolher" : "Ver prompt"}
          <ChevronRight
            size={12}
            className={`transition-transform ${expanded ? "rotate-90" : ""}`}
          />
        </button>
      </div>

      {/* Expanded Prompt */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-5 pt-2">
              <pre className="rounded-xl bg-black/40 border border-white/[0.06] p-4 text-xs text-white/60 font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-[300px] overflow-y-auto">
                {prompt.prompt}
              </pre>
              <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <Zap size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-400/70 leading-relaxed">{prompt.dica}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — Category Filter
   ═══════════════════════════════════════════════════════════════ */
function CategoryFilter({
  categorias,
  active,
  onChange,
}: {
  categorias: readonly string[];
  active: string;
  onChange: (cat: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {categorias.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
            active === cat
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(0,201,167,0.08)]"
              : "bg-white/[0.02] text-white/40 hover:text-white/60 border border-white/[0.04] hover:border-white/[0.08]"
          }`}
        >
          {cat !== "Todas" && <span>{CATEGORIA_ICONS[cat] || "📋"}</span>}
          {cat}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE — Biblioteca de Prompts
   ═══════════════════════════════════════════════════════════════ */
export default function BibliotecaPage() {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("Todas");

  const promptsFiltrados = useMemo(() => {
    let filtrados = promptsData;

    if (categoriaAtiva !== "Todas") {
      filtrados = filtrados.filter((p) => p.categoria === categoriaAtiva);
    }

    if (busca.trim()) {
      const termo = busca.toLowerCase();
      filtrados = filtrados.filter(
        (p) =>
          p.titulo.toLowerCase().includes(termo) ||
          p.descricao.toLowerCase().includes(termo) ||
          p.tags.some((t) => t.toLowerCase().includes(termo)) ||
          p.categoria.toLowerCase().includes(termo)
      );
    }

    return filtrados;
  }, [busca, categoriaAtiva]);

  return (
    <div className="min-h-screen" style={{ background: "#030303" }}>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle at center, rgba(0,201,167,0.3) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute top-1/2 right-0 w-80 h-80 rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle at center, rgba(61,245,197,0.2) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/5 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-emerald-400 mb-6">
              <BookOpen size={12} />
              Prompt Library
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-['Clash_Display',system-ui,sans-serif] leading-[1.1]">
              Biblioteca de{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300">
                Prompts
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-white/40 max-w-xl leading-relaxed">
              Prompts testados e otimizados para ChatGPT, Claude, DeepSeek e Gemini.
              Categorizados por área de aplicação. Copie, cole e adapte.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}
            className="mt-8 max-w-md"
          >
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
              />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome, categoria ou tag..."
                className="w-full h-12 pl-10 pr-10 rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/30 transition-all font-mono"
              />
              {busca && (
                <button
                  onClick={() => setBusca("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FILTERS + GRID ═══════════════ */}
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: easeOut }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <Tag size={14} className="text-white/30" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/30">
                Categorias
              </span>
              <span className="text-[10px] text-white/15 ml-auto">
                {promptsFiltrados.length} prompt{promptsFiltrados.length !== 1 ? "s" : ""}
              </span>
            </div>
            <CategoryFilter
              categorias={CATEGORIAS}
              active={categoriaAtiva}
              onChange={setCategoriaAtiva}
            />
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {promptsFiltrados.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center"
                >
                  <Search size={32} className="mx-auto text-white/10 mb-4" />
                  <p className="text-white/30 text-sm">
                    Nenhum prompt encontrado para &ldquo;{busca}&rdquo;
                  </p>
                  <button
                    onClick={() => { setBusca(""); setCategoriaAtiva("Todas"); }}
                    className="mt-3 text-xs text-emerald-400/60 hover:text-emerald-400 transition-colors"
                  >
                    Limpar filtros
                  </button>
                </motion.div>
              ) : (
                promptsFiltrados.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA Final ═══════════════ */}
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="relative overflow-hidden rounded-2xl border border-emerald-500/10 bg-gradient-to-br from-emerald-500/[0.04] to-transparent p-8 sm:p-10 text-center"
          >
            <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-emerald-500/5 blur-[100px]" />

            <BookOpen size={28} className="mx-auto mb-4 text-emerald-400" />
            <h3 className="text-xl sm:text-2xl font-bold text-white font-['Clash_Display',system-ui,sans-serif] mb-2">
              Não encontrou o prompt que precisa?
            </h3>
            <p className="text-sm text-white/40 max-w-md mx-auto mb-6">
              A biblioteca cresce continuamente com novos prompts testados em produção.
            </p>
            <a
              href="/builder"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 transition-all"
            >
              <Zap size={14} />
              Criar projeto com IA
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
