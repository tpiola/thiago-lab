"use client";

import {
  BookOpen,
  ExternalLink,
  FileText,
  Clock,
  Layers,
  Palette,
  Server,
  TrendingUp,
  Package,
  Users,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */
interface KnowledgeCategory {
  id: string;
  name: string;
  description: string;
  icon: typeof BookOpen;
  docCount: number;
  lastUpdate: string;
  notionUrl: string;
  color: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════ */
const CATEGORIES: KnowledgeCategory[] = [
  {
    id: "brand",
    name: "Brand Kit",
    description: "Logos, cores, fontes, assets visuais e diretrizes de marca",
    icon: Palette,
    docCount: 12,
    lastUpdate: "Hoje",
    notionUrl: "https://notion.so/brand-kit",
    color: "#C9A227",
  },
  {
    id: "infra",
    name: "Infraestrutura",
    description: "Servidores, deploys, DNS, VPS, domínios e configurações",
    icon: Server,
    docCount: 9,
    lastUpdate: "Ontem",
    notionUrl: "https://notion.so/infra",
    color: "#60A5FA",
  },
  {
    id: "vendas",
    name: "Vendas",
    description: "Scripts, funis, pitch decks, estratégias e métricas",
    icon: TrendingUp,
    docCount: 11,
    lastUpdate: "2 dias atrás",
    notionUrl: "https://notion.so/vendas",
    color: "#34D399",
  },
  {
    id: "produtos",
    name: "Produtos",
    description: "Documentação técnica, roadmaps e especificações dos produtos",
    icon: Package,
    docCount: 8,
    lastUpdate: "3 dias atrás",
    notionUrl: "https://notion.so/produtos",
    color: "#FBBF24",
  },
  {
    id: "clientes",
    name: "Clientes",
    description: "Informações, históricos e documentos por cliente",
    icon: Users,
    docCount: 7,
    lastUpdate: "Hoje",
    notionUrl: "https://notion.so/clientes",
    color: "#A78BFA",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   CATEGORY CARD
   ═══════════════════════════════════════════════════════════════════════════ */
function CategoryCard({ category }: { category: KnowledgeCategory }) {
  const Icon = category.icon;

  return (
    <div className="intelligence-os-card p-5 hover:border-[rgba(201,162,39,0.15)] transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `${category.color}12`, border: `1px solid ${category.color}20` }}
        >
          <Icon size={22} style={{ color: category.color }} />
        </div>
        <a
          href={category.notionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-[rgba(201,162,39,0.1)] text-[#C9A227] transition-all"
        >
          <ExternalLink size={14} />
        </a>
      </div>

      <h3 className="text-sm font-semibold text-[#E8EDF2] mb-1">{category.name}</h3>
      <p className="text-xs text-[#6B7280] mb-4 line-clamp-2">{category.description}</p>

      <div className="flex items-center justify-between text-[11px] pt-3 border-t border-[rgba(201,162,39,0.06)]">
        <div className="flex items-center gap-1 text-[#6B7280]">
          <FileText size={11} />
          <span>{category.docCount} documentos</span>
        </div>
        <div className="flex items-center gap-1 text-[#6B7280]">
          <Clock size={11} />
          <span>{category.lastUpdate}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   KNOWLEDGE PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function KnowledgePage() {
  const totalDocs = CATEGORIES.reduce((acc, c) => acc + c.docCount, 0);

  return (
    <div className="p-4 lg:p-6 min-h-full intelligence-os-grid-bg">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="intelligence-os-section-title text-2xl">Knowledge Base</h1>
          <p className="intelligence-os-section-subtitle mt-1">
            Central do conhecimento — documentação, brand kit, infra e mais
          </p>
        </div>
        <a
          href="https://notion.so"
          target="_blank"
          rel="noopener noreferrer"
          className="intelligence-os-btn-primary inline-flex items-center gap-1.5"
        >
          <ExternalLink size={16} />
          Abrir Notion
        </a>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={14} className="text-[#C9A227]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Total Docs</span>
          </div>
          <div className="intelligence-os-metric-value text-xl">{totalDocs}</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={14} className="text-[#60A5FA]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Categorias</span>
          </div>
          <div className="intelligence-os-metric-value text-xl" style={{ color: "#60A5FA" }}>{CATEGORIES.length}</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-[#34D399]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Última Edição</span>
          </div>
          <div className="intelligence-os-metric-value text-xl text-[#34D399]">Hoje</div>
        </div>
      </div>

      {/* ── Category Grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}
