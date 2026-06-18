"use client";

import {
  Globe,
  Plus,
  ExternalLink,
  Code,
  Layout,
  CheckCircle,
  FileText,
  Clock,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */
interface ForgeProject {
  id: string;
  name: string;
  url: string;
  status: "Deployed" | "Draft";
  template: string;
  createdAt: string;
  pages: number;
  lastEdit: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════ */
const PROJECTS: ForgeProject[] = [
  {
    id: "p1",
    name: "Rei das Vendas",
    url: "https://reidasvendas.com.br",
    status: "Deployed",
    template: "Landing Page Premium",
    createdAt: "15/03/2026",
    pages: 5,
    lastEdit: "2h atrás",
  },
  {
    id: "p2",
    name: "SaúdeGPT",
    url: "https://saudegpt.com.br",
    status: "Deployed",
    template: "SaaS Dashboard",
    createdAt: "02/04/2026",
    pages: 8,
    lastEdit: "1 dia atrás",
  },
  {
    id: "p3",
    name: "Thiago Piola",
    url: "https://thiagopiola.com.br",
    status: "Deployed",
    template: "Portfolio Criativo",
    createdAt: "10/02/2026",
    pages: 4,
    lastEdit: "5 dias atrás",
  },
  {
    id: "p4",
    name: "NEXUS CRM (Landing)",
    url: "https://nexuscrm.com.br",
    status: "Deployed",
    template: "Landing Page Premium",
    createdAt: "20/01/2026",
    pages: 6,
    lastEdit: "1 semana atrás",
  },
  {
    id: "p5",
    name: "Clarity OS",
    url: "https://clarityos.ai",
    status: "Draft",
    template: "Product Launch",
    createdAt: "01/06/2026",
    pages: 12,
    lastEdit: "3h atrás",
  },
  {
    id: "p6",
    name: "INEMA Monitor",
    url: "https://inema.io",
    status: "Draft",
    template: "Dashboard Analytics",
    createdAt: "10/06/2026",
    pages: 12,
    lastEdit: "1h atrás",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   FORGE PROJECT CARD
   ═══════════════════════════════════════════════════════════════════════════ */
function ForgeProjectCard({ project }: { project: ForgeProject }) {
  const isDeployed = project.status === "Deployed";

  return (
    <div className="nexus-card p-4 hover:border-[rgba(201,162,39,0.15)] transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.06)] flex items-center justify-center">
            <Globe size={20} className="text-[#C9A227]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#E8EDF2]">{project.name}</h3>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-medium mt-0.5 px-1.5 py-0.5 rounded-full ${
                isDeployed
                  ? "bg-[rgba(52,211,153,0.1)] text-[#34D399]"
                  : "bg-[rgba(251,191,36,0.1)] text-[#FBBF24]"
              }`}
            >
              {isDeployed ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
              {isDeployed ? "Deployed" : "Draft"}
            </span>
          </div>
        </div>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-[rgba(201,162,39,0.1)] text-[#C9A227] transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={14} />
        </a>
      </div>

      <div className="space-y-1.5 text-[11px] mb-4">
        <div className="flex items-center justify-between">
          <span className="text-[#6B7280]">Template</span>
          <span className="text-[#9BA3B8]">{project.template}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#6B7280]">Páginas</span>
          <span className="text-[#9BA3B8]">{project.pages}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#6B7280]">Criado em</span>
          <span className="text-[#9BA3B8]">{project.createdAt}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="nexus-btn-primary flex-1 text-xs py-2">
          <Code size={13} />
          Abrir no Builder
        </button>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="nexus-btn-outline flex-1 text-xs py-2 inline-flex items-center justify-center gap-1.5"
        >
          <ExternalLink size={13} />
          Visitar
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FORGE PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function ForgePage() {
  const deployedCount = PROJECTS.filter((p) => p.status === "Deployed").length;
  const draftCount = PROJECTS.filter((p) => p.status === "Draft").length;
  const totalPages = PROJECTS.reduce((acc, p) => acc + p.pages, 0);

  return (
    <div className="p-4 lg:p-6 min-h-full nexus-grid-bg">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="nexus-section-title text-2xl">NEXUS Forge</h1>
          <p className="nexus-section-subtitle mt-1">
            Crie e gerencie sites com inteligência artificial
          </p>
        </div>
        <a
          href="/builder"
          className="nexus-btn-primary inline-flex items-center gap-1.5"
        >
          <Plus size={16} />
          Criar Novo Projeto
        </a>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="nexus-metric">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={14} className="text-[#C9A227]" />
            <span className="nexus-metric-label" style={{ margin: 0 }}>Total Sites</span>
          </div>
          <div className="nexus-metric-value text-xl">{PROJECTS.length}</div>
        </div>
        <div className="nexus-metric">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={14} className="text-[#34D399]" />
            <span className="nexus-metric-label" style={{ margin: 0 }}>Deployed</span>
          </div>
          <div className="nexus-metric-value text-xl" style={{ color: "#34D399" }}>{deployedCount}</div>
        </div>
        <div className="nexus-metric">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={14} className="text-[#FBBF24]" />
            <span className="nexus-metric-label" style={{ margin: 0 }}>Draft</span>
          </div>
          <div className="nexus-metric-value text-xl" style={{ color: "#FBBF24" }}>{draftCount}</div>
        </div>
        <div className="nexus-metric">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-[#C9A227]" />
            <span className="nexus-metric-label" style={{ margin: 0 }}>Total Pages</span>
          </div>
          <div className="nexus-metric-value text-xl">{totalPages}+</div>
        </div>
      </div>

      {/* ── Project Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROJECTS.map((project) => (
          <ForgeProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
