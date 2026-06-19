"use client";

import { useState, useEffect, useCallback } from "react";
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
  RefreshCw,
  Activity,
  Database,
  Server,
} from "lucide-react";
import Link from "next/link";

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

interface HealthStatus {
  status: string;
  vercel: { status: string; user?: string };
  omniRoute: { status: string };
}

/* ─── Mock Data (fallback) ────────────────────────────────────────── */

const PROJECTS_MOCK: ForgeProject[] = [
  { id: "p1", name: "Rei das Vendas", url: "https://reidasvendas.com.br", status: "Deployed", template: "Landing Page Premium", createdAt: "15/03/2026", pages: 5, lastEdit: "2h atrás" },
  { id: "p2", name: "SaúdeGPT", url: "https://saudegpt.com.br", status: "Deployed", template: "SaaS Dashboard", createdAt: "02/04/2026", pages: 8, lastEdit: "1 dia atrás" },
  { id: "p3", name: "Thiago Piola", url: "https://thiagopiola.com.br", status: "Deployed", template: "Portfolio Criativo", createdAt: "10/02/2026", pages: 4, lastEdit: "5 dias atrás" },
  { id: "p4", name: "Intelligence OS CRM (Landing)", url: "https://intelligence-os.com.br", status: "Deployed", template: "Landing Page Premium", createdAt: "20/01/2026", pages: 6, lastEdit: "1 semana atrás" },
  { id: "p5", name: "Clarity OS", url: "https://clarityos.ai", status: "Draft", template: "Product Launch", createdAt: "01/06/2026", pages: 12, lastEdit: "3h atrás" },
  { id: "p6", name: "INEMA Monitor", url: "https://inema.io", status: "Draft", template: "Dashboard Analytics", createdAt: "10/06/2026", pages: 12, lastEdit: "1h atrás" },
];

/* ─── Helpers ─────────────────────────────────────────────────────── */

function normalizeProject(data: Record<string, unknown>): ForgeProject {
  const now = new Date().toISOString().split('T')[0].replace(/-/g, '/');
  const [y, m, d] = now.split('/');
  const today = `${d}/${m}/${y}`;

  const rawDate = typeof data.created_at === 'string' ? data.created_at
    : typeof data.createdAt === 'string' ? data.createdAt
    : '';
  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString('pt-BR')
    : today;

  return {
    id: String(data.id || ''),
    name: String(data.name || 'Projeto'),
    url: String(data.domain || data.vercel_deploy_url || 'https://vercel.com'),
    status: data.deployed === true || data.deployed === 'true' ? 'Deployed' : 'Draft',
    template: String(data.template_id || 'Personalizado'),
    createdAt: formattedDate,
    pages: Array.isArray(data.blocks) ? data.blocks.length : Number(data.pages || 1),
    lastEdit: data.updated_at && typeof data.updated_at === 'string'
      ? timeAgo(new Date(data.updated_at))
      : today,
  };
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'agora';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}min atrás`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h atrás`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d atrás`;
  return date.toLocaleDateString('pt-BR');
}

/* ═══════════════════════════════════════════════════════════════════════════
   HEALTH BADGE
   ═══════════════════════════════════════════════════════════════════════════ */

function HealthBadge({ health }: { health: HealthStatus | null }) {
  if (!health) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium bg-[rgba(107,114,128,0.08)] text-[#6B7280] border border-[rgba(107,114,128,0.12)]">
        <Server size={10} />
        Verificando...
      </span>
    );
  }

  const vercelOk = health.vercel?.status === 'Authenticated';
  const omniOk = health.omniRoute?.status === 'Online';
  const allOk = vercelOk || omniOk;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium border ${
        allOk
          ? 'bg-[rgba(52,211,153,0.08)] text-[#34D399] border-[rgba(52,211,153,0.12)]'
          : 'bg-[rgba(251,191,36,0.08)] text-[#FBBF24] border-[rgba(251,191,36,0.12)]'
      }`}
    >
      <Activity size={10} />
      {allOk ? 'Deploy Online' : 'Deploy Limitado'}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FORGE PROJECT CARD
   ═══════════════════════════════════════════════════════════════════════════ */

function ForgeProjectCard({
  project,
  onDeploy,
}: {
  project: ForgeProject;
  onDeploy: (project: ForgeProject) => void;
}) {
  const isDeployed = project.status === "Deployed";

  return (
    <div className="intelligence-os-card p-4 hover:border-[rgba(201,162,39,0.15)] transition-all duration-200 group">
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
        {project.url && project.url !== 'https://vercel.com' && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-[rgba(201,162,39,0.1)] text-[#C9A227] transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      <div className="space-y-1.5 text-[11px] mb-4">
        <div className="flex items-center justify-between">
          <span className="text-[#6B7280]">Template</span>
          <span className="text-[#9BA3B8]">{project.template}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#6B7280]">Blocos</span>
          <span className="text-[#9BA3B8]">{project.pages}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#6B7280]">Criado em</span>
          <span className="text-[#9BA3B8]">{project.createdAt}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#6B7280]">Última edição</span>
          <span className="text-[#9BA3B8]">{project.lastEdit}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/builder/${project.id}`}
          className="intelligence-os-btn-primary flex-1 text-xs py-2 inline-flex items-center justify-center gap-1.5"
        >
          <Code size={13} />
          Abrir no Builder
        </Link>
        {!isDeployed ? (
          <button
            onClick={() => onDeploy(project)}
            className="intelligence-os-btn-outline flex-1 text-xs py-2 inline-flex items-center justify-center gap-1.5"
          >
            <ArrowUpRight size={13} />
            Deploy
          </button>
        ) : (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="intelligence-os-btn-outline flex-1 text-xs py-2 inline-flex items-center justify-center gap-1.5"
          >
            <ExternalLink size={13} />
            Visitar
          </a>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FORGE PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ForgePage() {
  const [projects, setProjects] = useState<ForgeProject[]>(PROJECTS_MOCK);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [deploying, setDeploying] = useState<string | null>(null);

  /* ─── Fetch Projects ─────────────────────────────────────────────── */
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        signal: AbortSignal.timeout(8000),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
          const mapped = data.projects.map(normalizeProject);
          setProjects(mapped);
          setLive(true);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Silently fallback to mock
    }

    // Fallback to mock
    setProjects(PROJECTS_MOCK);
    setLive(false);
    setLoading(false);
  }, []);

  /* ─── Fetch Health ───────────────────────────────────────────────── */
  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/health', {
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
    } catch {
      setHealth(null);
    }
  }, []);

  /* ─── Deploy Handler ─────────────────────────────────────────────── */
  const handleDeploy = useCallback(async (project: ForgeProject) => {
    setDeploying(project.id);
    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: project.name,
          blocks: [],
          projectId: project.id,
        }),
        signal: AbortSignal.timeout(30000),
      });

      const data = await res.json();

      if (res.ok && data.deploy) {
        // Update project status
        setProjects((prev) =>
          prev.map((p) =>
            p.id === project.id ? { ...p, status: 'Deployed', url: `https://${data.deploy.url}` } : p,
          ),
        );
      }
    } catch (err) {
      console.warn('[Deploy] Error:', (err as Error).message);
    } finally {
      setDeploying(null);
    }
  }, []);

  /* ─── Init ───────────────────────────────────────────────────────── */
  useEffect(() => {
    fetchProjects();
    fetchHealth();
  }, [fetchProjects, fetchHealth]);

  const deployedCount = projects.filter((p) => p.status === "Deployed").length;
  const draftCount = projects.filter((p) => p.status === "Draft").length;
  const totalPages = projects.reduce((acc, p) => acc + p.pages, 0);

  return (
    <div className="p-4 lg:p-6 min-h-full intelligence-os-grid-bg">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="intelligence-os-section-title text-2xl">Intelligence OS Forge</h1>
            <p className="intelligence-os-section-subtitle mt-1">
              Crie e gerencie sites com inteligência artificial
            </p>
          </div>
          <div className="flex items-center gap-2 ml-auto sm:ml-3">
            <HealthBadge health={health} />
            <button
              onClick={() => { fetchProjects(); fetchHealth(); }}
              disabled={loading}
              className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#E8EDF2] hover:bg-[rgba(201,162,39,0.06)] transition-all disabled:opacity-50"
              title="Atualizar"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
        <a
          href="/builder"
          className="intelligence-os-btn-primary inline-flex items-center gap-1.5"
        >
          <Plus size={16} />
          Criar Novo Projeto
        </a>
      </div>

      {/* ── Live indicator ──────────────────────────────────────────────── */}
      {!loading && (
        <div className="mb-4">
          {live ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium bg-[rgba(52,211,153,0.08)] text-[#34D399] border border-[rgba(52,211,153,0.12)]">
              <Database size={10} />
              Projetos ao vivo — Supabase
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium bg-[rgba(251,191,36,0.08)] text-[#FBBF24] border border-[rgba(251,191,36,0.12)]">
              <Database size={10} />
              Projetos simulados
            </span>
          )}
        </div>
      )}

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={14} className="text-[#C9A227]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Total Sites</span>
          </div>
          <div className="intelligence-os-metric-value text-xl">{projects.length}</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={14} className="text-[#34D399]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Deployed</span>
          </div>
          <div className="intelligence-os-metric-value text-xl" style={{ color: "#34D399" }}>{deployedCount}</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={14} className="text-[#FBBF24]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Draft</span>
          </div>
          <div className="intelligence-os-metric-value text-xl" style={{ color: "#FBBF24" }}>{draftCount}</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <Layout size={14} className="text-[#C9A227]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Total Blocos</span>
          </div>
          <div className="intelligence-os-metric-value text-xl">{totalPages}+</div>
        </div>
      </div>

      {/* ── Project Grid ─────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw size={20} className="text-[#C9A227] animate-spin" />
          <span className="ml-3 text-sm text-[#6B7280]">Carregando projetos...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ForgeProjectCard
              key={project.id}
              project={project}
              onDeploy={handleDeploy}
            />
          ))}
        </div>
      )}

      {/* ── Deploy Modal / Status ──────────────────────────────────────── */}
      {deploying && (
        <div className="intelligence-os-modal-overlay" style={{ zIndex: 100 }}>
          <div className="intelligence-os-modal max-w-sm text-center py-8">
            <RefreshCw size={24} className="animate-spin text-[#C9A227] mx-auto mb-4" />
            <h3 className="text-base font-semibold text-[#E8EDF2] mb-2">Fazendo Deploy...</h3>
            <p className="text-xs text-[#6B7280]">
              Enviando projeto para Vercel. Isso pode levar alguns segundos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
