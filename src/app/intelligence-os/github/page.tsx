"use client";

import { useState } from "react";
import {
  GitBranch,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  GitCommit,
  GitPullRequest,
  Star,
  ExternalLink,
  FileWarning,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */
interface Repo {
  id: string;
  name: string;
  description: string;
  branch: string;
  lastCommit: string;
  lastCommitMsg: string;
  status: "Clean" | "Uncommitted" | "Behind";
  language: string;
  stars: number;
  url: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════ */
const REPOS: Repo[] = [
  {
    id: "r1",
    name: "thiagopiola",
    description: "Site pessoal e portfólio",
    branch: "main",
    lastCommit: "2h atrás",
    lastCommitMsg: "feat: adiciona seção de cases",
    status: "Clean",
    language: "TypeScript",
    stars: 12,
    url: "https://github.com/thiagolab/thiagopiola",
  },
  {
    id: "r2",
    name: "reidasvendas",
    description: "Landing page Rei das Vendas",
    branch: "main",
    lastCommit: "5h atrás",
    lastCommitMsg: "fix: ajusta responsividade mobile",
    status: "Clean",
    language: "TypeScript",
    stars: 8,
    url: "https://github.com/thiagolab/reidasvendas",
  },
  {
    id: "r3",
    name: "saudegpt",
    description: "Plataforma SaaS de saúde com IA",
    branch: "develop",
    lastCommit: "1h atrás",
    lastCommitMsg: "feat: integra API de diagnóstico",
    status: "Uncommitted",
    language: "TypeScript",
    stars: 24,
    url: "https://github.com/thiagolab/saudegpt",
  },
  {
    id: "r4",
    name: "intelligence-os-crm",
    description: "Intelligence OS CRM — plataforma principal",
    branch: "main",
    lastCommit: "30 min atrás",
    lastCommitMsg: "feat: adiciona página de automações",
    status: "Clean",
    language: "TypeScript",
    stars: 45,
    url: "https://github.com/thiagolab/intelligence-os-crm",
  },
  {
    id: "r5",
    name: "clarity-os",
    description: "Sistema operacional cognitivo",
    branch: "main",
    lastCommit: "1 dia atrás",
    lastCommitMsg: "refactor: otimiza memória vetorial",
    status: "Clean",
    language: "Python",
    stars: 67,
    url: "https://github.com/thiagolab/clarity-os",
  },
  {
    id: "r6",
    name: "inema-monitor",
    description: "Monitor de infraestrutura",
    branch: "staging",
    lastCommit: "3h atrás",
    lastCommitMsg: "chore: atualiza dependências",
    status: "Behind",
    language: "Go",
    stars: 15,
    url: "https://github.com/thiagolab/inema-monitor",
  },
  {
    id: "r7",
    name: "thiago-lab-website",
    description: "Site institucional thiagolab.com",
    branch: "main",
    lastCommit: "2 dias atrás",
    lastCommitMsg: "feat: adiciona animações GSAP",
    status: "Clean",
    language: "TypeScript",
    stars: 5,
    url: "https://github.com/thiagolab/thiago-lab-website",
  },
];

const STATUS_CONFIG: Record<string, { bg: string; color: string; icon: typeof CheckCircle }> = {
  Clean:       { bg: "rgba(52,211,153,0.1)",  color: "#34D399", icon: CheckCircle },
  Uncommitted: { bg: "rgba(251,191,36,0.1)",  color: "#FBBF24", icon: FileWarning },
  Behind:      { bg: "rgba(239,68,68,0.1)",   color: "#EF4444", icon: AlertCircle },
};

/* ═══════════════════════════════════════════════════════════════════════════
   REPO ROW
   ═══════════════════════════════════════════════════════════════════════════ */
function RepoRow({ repo }: { repo: Repo }) {
  const sc = STATUS_CONFIG[repo.status];
  const StatusIcon = sc.icon;

  return (
    <div className="intelligence-os-card p-4 hover:border-[rgba(201,162,39,0.12)] transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.06)] flex items-center justify-center flex-shrink-0">
            <GitBranch size={16} className="text-[#C9A227]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-[#E8EDF2]">{repo.name}</h3>
              <span className="text-[10px] text-[#6B7280] bg-[rgba(107,114,128,0.1)] px-1.5 py-0.5 rounded">
                {repo.branch}
              </span>
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-0.5 text-[#6B7280] hover:text-[#C9A227] transition-colors"
              >
                <ExternalLink size={12} />
              </a>
            </div>
            <p className="text-xs text-[#6B7280] mb-2">{repo.description}</p>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-[#6B7280]">{repo.language}</span>
              <span className="flex items-center gap-0.5 text-[#6B7280]">
                <Star size={10} />
                {repo.stars}
              </span>
              <span className="flex items-center gap-1 text-[#6B7280]">
                <GitCommit size={10} />
                {repo.lastCommit}
              </span>
            </div>
            <p className="text-[11px] text-[#9BA3B8] mt-1.5 font-mono">
              {repo.lastCommitMsg}
            </p>
          </div>
        </div>

        <span
          className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium flex-shrink-0 ml-3"
          style={{ background: sc.bg, color: sc.color }}
        >
          <StatusIcon size={10} />
          {repo.status}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GITHUB PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function GithubPage() {
  const [syncing, setSyncing] = useState(false);

  const cleanCount = REPOS.filter((r) => r.status === "Clean").length;
  const uncommittedCount = REPOS.filter((r) => r.status === "Uncommitted").length;
  const behindCount = REPOS.filter((r) => r.status === "Behind").length;

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  return (
    <div className="p-4 lg:p-6 min-h-full intelligence-os-grid-bg">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="intelligence-os-section-title text-2xl">GitHub Sync</h1>
          <p className="intelligence-os-section-subtitle mt-1">
            Monitore e sincronize seus repositórios
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#6B7280] flex items-center gap-1">
            <Clock size={12} />
            Último sync: há 2h
          </span>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="intelligence-os-btn-primary"
          >
            <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Sincronizando..." : "Sync All"}
          </button>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch size={14} className="text-[#C9A227]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Total</span>
          </div>
          <div className="intelligence-os-metric-value text-xl">{REPOS.length}</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={14} className="text-[#34D399]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Clean</span>
          </div>
          <div className="intelligence-os-metric-value text-xl" style={{ color: "#34D399" }}>{cleanCount}</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <FileWarning size={14} className="text-[#FBBF24]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Uncommitted</span>
          </div>
          <div className="intelligence-os-metric-value text-xl" style={{ color: "#FBBF24" }}>{uncommittedCount}</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={14} className="text-[#EF4444]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Behind</span>
          </div>
          <div className="intelligence-os-metric-value text-xl" style={{ color: "#EF4444" }}>{behindCount}</div>
        </div>
      </div>

      {/* ── Repo List ────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {REPOS.map((repo) => (
          <RepoRow key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
}
