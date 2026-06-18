"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Star,
  ExternalLink,
  Code2,
  Layout,
  Bot,
  ArrowUpRight,
  GitFork,
  Eye,
  Zap,
  Globe,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface Repo {
  id: string;
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  category: "UI Libraries" | "Design Systems" | "AI Tools" | "Templates" | "React" | "Full Stack";
  updatedAt: string;
  owner: string;
}

type Category = "all" | "UI Libraries" | "Design Systems" | "AI Tools" | "Templates" | "React" | "Full Stack";

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA — Melhores repositórios profissionais
   ═══════════════════════════════════════════════════════════════════════════ */

const REPOS: Repo[] = [
  {
    id: "r1",
    name: "shadcn/ui",
    description: "Beautifully designed components that you can copy and paste into your apps. Acessible. Customizable. Open Source.",
    url: "https://github.com/shadcn-ui/ui",
    stars: 85000,
    forks: 4500,
    language: "TypeScript",
    category: "UI Libraries",
    updatedAt: "2026-06-18",
    owner: "shadcn-ui",
  },
  {
    id: "r2",
    name: "radix-ui/primitives",
    description: "Open source UI component library for building high-quality, accessible design systems and web apps.",
    url: "https://github.com/radix-ui/primitives",
    stars: 17000,
    forks: 950,
    language: "TypeScript",
    category: "UI Libraries",
    updatedAt: "2026-06-17",
    owner: "radix-ui",
  },
  {
    id: "r3",
    name: "tailwindlabs/tailwindcss",
    description: "A utility-first CSS framework for rapid UI development. v4 with CSS-first config.",
    url: "https://github.com/tailwindlabs/tailwindcss",
    stars: 87000,
    forks: 4400,
    language: "CSS",
    category: "Design Systems",
    updatedAt: "2026-06-18",
    owner: "tailwindlabs",
  },
  {
    id: "r4",
    name: "vercel/next.js",
    description: "The React Framework for Production — App Router, Server Components, Streaming.",
    url: "https://github.com/vercel/next.js",
    stars: 132000,
    forks: 28000,
    language: "TypeScript",
    category: "Full Stack",
    updatedAt: "2026-06-18",
    owner: "vercel",
  },
  {
    id: "r5",
    name: "facebook/react",
    description: "The library for web and native user interfaces. React 19 with Server Components.",
    url: "https://github.com/facebook/react",
    stars: 240000,
    forks: 49000,
    language: "JavaScript",
    category: "React",
    updatedAt: "2026-06-17",
    owner: "facebook",
  },
  {
    id: "r6",
    name: "framer/motion",
    description: "Open source, production-ready animation and gesture library for React.",
    url: "https://github.com/framer/motion",
    stars: 28000,
    forks: 900,
    language: "TypeScript",
    category: "UI Libraries",
    updatedAt: "2026-06-16",
    owner: "framer",
  },
  {
    id: "r7",
    name: "recharts/recharts",
    description: "Redefined chart library built with React and D3.",
    url: "https://github.com/recharts/recharts",
    stars: 25000,
    forks: 1800,
    language: "TypeScript",
    category: "UI Libraries",
    updatedAt: "2026-06-15",
    owner: "recharts",
  },
  {
    id: "r8",
    name: "react-grid-layout/react-grid-layout",
    description: "A draggable and resizable grid layout with responsive breakpoints, for React.",
    url: "https://github.com/react-grid-layout/react-grid-layout",
    stars: 21000,
    forks: 2600,
    language: "JavaScript",
    category: "UI Libraries",
    updatedAt: "2026-06-14",
    owner: "react-grid-layout",
  },
  {
    id: "r9",
    name: "anthropics/claude-code",
    description: "Claude Code is an agentic coding tool that lives in your terminal.",
    url: "https://github.com/anthropics/claude-code",
    stars: 15000,
    forks: 700,
    language: "TypeScript",
    category: "AI Tools",
    updatedAt: "2026-06-18",
    owner: "anthropics",
  },
  {
    id: "r10",
    name: "langchain-ai/langchain",
    description: "Building applications with LLMs through composability. Python & JS.",
    url: "https://github.com/langchain-ai/langchain",
    stars: 105000,
    forks: 17000,
    language: "Python",
    category: "AI Tools",
    updatedAt: "2026-06-18",
    owner: "langchain-ai",
  },
  {
    id: "r11",
    name: "n8n-io/n8n",
    description: "Fair-code workflow automation platform with native AI capabilities.",
    url: "https://github.com/n8n-io/n8n",
    stars: 58000,
    forks: 13500,
    language: "TypeScript",
    category: "AI Tools",
    updatedAt: "2026-06-18",
    owner: "n8n-io",
  },
  {
    id: "r12",
    name: "shadcn-ui/taxonomy",
    description: "An open source application built using the new router, server components and everything new in Next.js.",
    url: "https://github.com/shadcn-ui/taxonomy",
    stars: 19000,
    forks: 2800,
    language: "TypeScript",
    category: "Templates",
    updatedAt: "2026-06-10",
    owner: "shadcn-ui",
  },
  {
    id: "r13",
    name: "dnd-kit/dnd-kit",
    description: "A modern, lightweight, performant, accessible and extensible drag & drop toolkit for React.",
    url: "https://github.com/clauderic/dnd-kit",
    stars: 14000,
    forks: 580,
    language: "TypeScript",
    category: "UI Libraries",
    updatedAt: "2026-06-12",
    owner: "clauderic",
  },
  {
    id: "r14",
    name: "sst/sst",
    description: "Build full-stack applications on your own infrastructure with AWS.",
    url: "https://github.com/sst/sst",
    stars: 23000,
    forks: 1300,
    language: "TypeScript",
    category: "Full Stack",
    updatedAt: "2026-06-16",
    owner: "sst",
  },
  {
    id: "r15",
    name: "mckaywrigley/chatbot-ui",
    description: "AI chat for every model - an open-source interface for Claude, GPT, Gemini, and more.",
    url: "https://github.com/mckaywrigley/chatbot-ui",
    stars: 32000,
    forks: 4500,
    language: "TypeScript",
    category: "AI Tools",
    updatedAt: "2026-06-15",
    owner: "mckaywrigley",
  },
];

const CATEGORIES: { value: Category; label: string; icon: typeof Layout }[] = [
  { value: "all", label: "Todos", icon: Layout },
  { value: "UI Libraries", label: "UI Libraries", icon: Layout },
  { value: "Design Systems", label: "Design Systems", icon: Layout },
  { value: "AI Tools", label: "AI Tools", icon: Bot },
  { value: "Templates", label: "Templates", icon: Layout },
  { value: "React", label: "React", icon: Code2 },
  { value: "Full Stack", label: "Full Stack", icon: GitFork },
];

/* ═══════════════════════════════════════════════════════════════════════════
   REPO CARD
   ═══════════════════════════════════════════════════════════════════════════ */

function RepoCard({ repo }: { repo: Repo }) {
  const starsFormatted = repo.stars >= 1000
    ? `${(repo.stars / 1000).toFixed(repo.stars >= 10000 ? 0 : 1)}k`
    : String(repo.stars);

  return (
    <div className="intelligence-os-card p-4 hover:border-[rgba(201,162,39,0.15)] transition-all duration-200 group">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.06)] flex items-center justify-center flex-shrink-0">
          <Globe size={20} className="text-[#C9A227]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#E8EDF2] truncate">{repo.name}</h3>
            <span className="text-[10px] text-[#6B7280] bg-[rgba(107,114,128,0.1)] px-1.5 py-0.5 rounded-full whitespace-nowrap">
              {repo.owner}
            </span>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-1 line-clamp-2">{repo.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[11px] mb-3">
        <span className="flex items-center gap-1 text-[#6B7280]">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background:
                repo.language === "TypeScript" ? "#3178C6" :
                repo.language === "JavaScript" ? "#F7DF1E" :
                repo.language === "Python" ? "#3572A5" :
                repo.language === "CSS" ? "#563D7C" :
                "#6B7280",
            }}
          />
          {repo.language}
        </span>
        <span className="flex items-center gap-1 text-[#6B7280]">
          <Star size={10} />
          {starsFormatted}
        </span>
        <span className="flex items-center gap-1 text-[#6B7280]">
          <GitFork size={10} />
          {repo.forks >= 1000 ? `${(repo.forks / 1000).toFixed(1)}k` : repo.forks}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] text-[#6B7280] flex items-center gap-1">
          <Eye size={10} />
          Atualizado {repo.updatedAt}
        </span>
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="intelligence-os-btn-outline text-[10px] py-1.5 px-3 inline-flex items-center gap-1"
        >
          <ExternalLink size={10} />
          Importar
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   REPOS PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ReposPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");

  const filtered = useMemo(() => {
    return REPOS.filter((repo) => {
      const matchSearch = !search ||
        repo.name.toLowerCase().includes(search.toLowerCase()) ||
        repo.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "all" || repo.category === category;
      return matchSearch && matchCategory;
    });
  }, [search, category]);

  const totalStars = REPOS.reduce((acc, r) => acc + r.stars, 0);
  const starsFormatted = totalStars >= 1000
    ? `${(totalStars / 1000).toFixed(0)}k+`
    : String(totalStars);

  return (
    <div className="p-4 lg:p-6 min-h-full intelligence-os-grid-bg">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="intelligence-os-section-title text-2xl">Repositórios Profissionais</h1>
          <p className="intelligence-os-section-subtitle mt-1">
            Bibliotecas, design systems e ferramentas modernas para desenvolvimento web
          </p>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="intelligence-os-btn-primary"
        >
          <Globe size={16} />
          Explorar GitHub
          <ArrowUpRight size={12} />
        </a>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={14} className="text-[#C9A227]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Total</span>
          </div>
          <div className="intelligence-os-metric-value text-xl">{REPOS.length}</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <Star size={14} className="text-[#FBBF24]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Stars</span>
          </div>
          <div className="intelligence-os-metric-value text-xl" style={{ color: "#FBBF24" }}>{starsFormatted}</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-[#34D399]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Atualizado</span>
          </div>
          <div className="intelligence-os-metric-value text-lg" style={{ color: "#34D399" }}>Hoje</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <Code2 size={14} className="text-[#60A5FA]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Categorias</span>
          </div>
          <div className="intelligence-os-metric-value text-xl">{CATEGORIES.length - 1}</div>
        </div>
      </div>

      {/* ── Search & Filters ────────────────────────────────────────────── */}
      <div className="intelligence-os-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar repositórios..."
              className="intelligence-os-input w-full pl-10 pr-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {CATEGORIES.map((cat) => {
            const CatIcon = cat.icon;
            const active = category === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                  active
                    ? "bg-[rgba(201,162,39,0.1)] text-[#C9A227] border border-[rgba(201,162,39,0.15)]"
                    : "text-[#6B7280] hover:text-[#E8EDF2] hover:bg-[rgba(201,162,39,0.04)] border border-transparent"
                }`}
              >
                <CatIcon size={12} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Results count ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-[#6B7280]">
          {filtered.length} de {REPOS.length} repositórios encontrados
        </p>
      </div>

      {/* ── Repos Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Globe size={48} className="mx-auto text-[rgba(201,162,39,0.2)] mb-4" />
          <p className="text-sm text-[#6B7280]">Nenhum repositório encontrado para sua busca.</p>
        </div>
      )}
    </div>
  );
}
