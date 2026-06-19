"use client";

import { useState, useEffect } from "react";
import {
  Bot,
  Play,
  Cpu,
  Zap,
  Clock,
  CheckCircle,
  X,
  Sparkles,
  Activity,
  MessageSquare,
  Database,
  Globe,
  BarChart3,
  Loader2,
  Wifi,
  WifiOff,
} from "lucide-react";
import ChatInterface from "./chat-interface";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */
interface Agent {
  id: string;
  name: string;
  description: string;
  icon: typeof Bot;
  status: "Online" | "Offline" | "Busy";
  lastRun: string;
  tasksCompleted: number;
  successRate: number;
  model: string;
}

interface OmniRouteHealth {
  online: boolean;
  models: number;
  latency?: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATIC AGENT DEFINITIONS (core agents, always shown)
   ═══════════════════════════════════════════════════════════════════════════ */
const CORE_AGENTS: Agent[] = [
  {
    id: "hermes",
    name: "Hermes Agent",
    description: "Assistente IA principal — executa tarefas, análises e automações via MCP",
    icon: Bot,
    status: "Online",
    lastRun: "2 min atrás",
    tasksCompleted: 1247,
    successRate: 98.5,
    model: "DeepSeek V4 Flash",
  },
  {
    id: "clarity",
    name: "Clarity OS",
    description: "Sistema operacional cognitivo — gerencia memória e contexto do ecossistema",
    icon: Cpu,
    status: "Online",
    lastRun: "5 min atrás",
    tasksCompleted: 892,
    successRate: 99.1,
    model: "Clarity Core v3",
  },
  {
    id: "inema",
    name: "INEMA",
    description: "Agente de infraestrutura — monitora servidores, deploys e saúde do sistema",
    icon: Activity,
    status: "Online",
    lastRun: "1 min atrás",
    tasksCompleted: 563,
    successRate: 97.8,
    model: "INEMA Monitor",
  },
  {
    id: "omniroute-chat",
    name: "OmniRoute Chat",
    description: "Chat com modelos de IA via OmniRoute Gateway — DeepSeek, GPT-5, Claude e mais",
    icon: MessageSquare,
    status: "Online",
    lastRun: "Agora",
    tasksCompleted: 0,
    successRate: 100,
    model: "Multi-Model",
  },
  {
    id: "dataforge",
    name: "DataForge",
    description: "Agente de dados — ETL, análise e relatórios automatizados",
    icon: Database,
    status: "Offline",
    lastRun: "2h atrás",
    tasksCompleted: 678,
    successRate: 96.3,
    model: "DataForge Analytics",
  },
  {
    id: "webforge",
    name: "WebForge",
    description: "Gerador de sites com IA — cria landing pages completas por prompt",
    icon: Globe,
    status: "Busy",
    lastRun: "15 min atrás",
    tasksCompleted: 234,
    successRate: 92.7,
    model: "Intelligence OS Forge AI",
  },
];

const STATUS_CONFIG: Record<string, { dot: string; bg: string; color: string; label: string }> = {
  Online:  { dot: "active",   bg: "rgba(52,211,153,0.1)",  color: "#34D399", label: "Online" },
  Offline: { dot: "inactive", bg: "rgba(107,114,128,0.1)", color: "#6B7280", label: "Offline" },
  Busy:    { dot: "lead",     bg: "rgba(251,191,36,0.1)",  color: "#FBBF24", label: "Ocupado" },
};

/* ═══════════════════════════════════════════════════════════════════════════
   AGENT DETAIL MODAL
   ═══════════════════════════════════════════════════════════════════════════ */
function AgentDetailModal({ agent, open, onClose }: { agent: Agent | null; open: boolean; onClose: () => void }) {
  if (!open || !agent) return null;
  const sc = STATUS_CONFIG[agent.status];

  return (
    <div className="intelligence-os-modal-overlay" onClick={onClose}>
      <div className="intelligence-os-modal max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[rgba(201,162,39,0.1)] border border-[rgba(201,162,39,0.12)] flex items-center justify-center">
              <agent.icon size={24} className="text-[#C9A227]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#E8EDF2] font-['Clash_Display',system-ui,sans-serif]">
                {agent.name}
              </h2>
              <span className="inline-flex items-center gap-1.5 mt-1 text-xs font-medium" style={{ color: sc.color }}>
                <span className={`intelligence-os-status-dot ${sc.dot}`} />
                {sc.label}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#6B7280] hover:text-[#E8EDF2] rounded transition-colors">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-[#9BA3B8] mb-6">{agent.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="intelligence-os-card p-3">
            <div className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">Modelo</div>
            <div className="text-sm font-medium text-[#E8EDF2]">{agent.model}</div>
          </div>
          <div className="intelligence-os-card p-3">
            <div className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">Tasks</div>
            <div className="text-sm font-medium text-[#E8EDF2]">{agent.tasksCompleted.toLocaleString()}</div>
          </div>
          <div className="intelligence-os-card p-3">
            <div className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">Taxa de Sucesso</div>
            <div className="text-sm font-medium text-[#34D399]">{agent.successRate}%</div>
          </div>
          <div className="intelligence-os-card p-3">
            <div className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">Última Execução</div>
            <div className="text-sm font-medium text-[#E8EDF2]">{agent.lastRun}</div>
          </div>
        </div>

        <div className="flex gap-2">
          {agent.id === "omniroute-chat" ? (
            <button
              className="intelligence-os-btn-primary flex-1"
              onClick={() => document.getElementById("omniroute-chat-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              <MessageSquare size={14} />
              Abrir Chat
            </button>
          ) : (
            <button className="intelligence-os-btn-primary flex-1">
              <Play size={14} />
              Executar Agora
            </button>
          )}
          <button className="intelligence-os-btn-outline flex-1">
            <BarChart3 size={14} />
            Ver Logs
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AGENT CARD
   ═══════════════════════════════════════════════════════════════════════════ */
function AgentCard({ agent, onDetail }: { agent: Agent; onDetail: (a: Agent) => void }) {
  const Icon = agent.icon;
  const sc = STATUS_CONFIG[agent.status];

  return (
    <div
      className="intelligence-os-card p-4 cursor-pointer hover:border-[rgba(201,162,39,0.15)] transition-all duration-200 group"
      onClick={() => onDetail(agent)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.06)] flex items-center justify-center">
            <Icon size={20} className="text-[#C9A227]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#E8EDF2]">{agent.name}</h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium mt-0.5" style={{ color: sc.color }}>
              <span className={`intelligence-os-status-dot ${sc.dot}`} />
              {sc.label}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDetail(agent); }}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-[rgba(201,162,39,0.1)] text-[#C9A227] transition-all"
        >
          <Play size={14} />
        </button>
      </div>

      <p className="text-xs text-[#6B7280] mb-4 line-clamp-2">{agent.description}</p>

      <div className="flex items-center justify-between text-[10px] pt-3 border-t border-[rgba(201,162,39,0.06)]">
        <div className="flex items-center gap-1 text-[#6B7280]">
          <CheckCircle size={11} className="text-[#34D399]" />
          <span>{agent.tasksCompleted.toLocaleString()} tasks</span>
        </div>
        <div className="flex items-center gap-1 text-[#6B7280]">
          <Clock size={11} />
          <span>{agent.lastRun}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AGENTS PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [health, setHealth] = useState<OmniRouteHealth | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [showChat, setShowChat] = useState(false);

  // Fetch real OmniRoute health
  useEffect(() => {
    fetch("/api/omniroute/models")
      .then((r) => r.json())
      .then((data) => {
        setHealth({
          online: !data.fallback,
          models: data.total || data.models?.length || 0,
          latency: data.error ? undefined : "~50ms",
        });
      })
      .catch(() => {
        setHealth({ online: false, models: 0 });
      })
      .finally(() => setLoadingHealth(false));
  }, []);

  // Dynamically update OmniRoute Chat agent model
  const agents = CORE_AGENTS.map((a) => {
    if (a.id === "omniroute-chat" && health) {
      return {
        ...a,
        tasksCompleted: health.models,
        lastRun: health.online ? "Online agora" : "Offline",
        status: health.online ? "Online" as const : "Offline" as const,
        model: `${health.models} modelos disponíveis`,
        description: health.online
          ? `Chat com ${health.models} modelos de IA via OmniRoute Gateway`
          : "Chat com IA — modo fallback (OmniRoute offline)",
      };
    }
    return a;
  });

  const activeCount = agents.filter((a) => a.status === "Online").length;

  return (
    <div className="p-4 lg:p-6 min-h-full intelligence-os-grid-bg">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="intelligence-os-section-title text-2xl">AI Agents</h1>
          <p className="intelligence-os-section-subtitle mt-1">
            Gerencie seus agentes de IA — Hermes, Clarity OS, INEMA e OmniRoute Chat
          </p>
        </div>
        <div className="flex items-center gap-2">
          {loadingHealth ? (
            <span className="flex items-center gap-2 text-xs text-[#6B7280]">
              <Loader2 size={12} className="animate-spin" />
              Verificando OmniRoute...
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
              style={{
                background: health?.online ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)",
                color: health?.online ? "#34D399" : "#ef4444",
              }}
            >
              {health?.online ? <Wifi size={12} /> : <WifiOff size={12} />}
              OmniRoute {health?.online ? `(${health.models} modelos)` : "Offline"}
            </span>
          )}
          <button className="intelligence-os-btn-primary" onClick={() => setShowChat(true)}>
            <MessageSquare size={16} />
            Chat OmniRoute
          </button>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <Bot size={14} className="text-[#C9A227]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Total Agents</span>
          </div>
          <div className="intelligence-os-metric-value text-xl">{agents.length}</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={14} className="text-[#34D399]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Online</span>
          </div>
          <div className="intelligence-os-metric-value text-xl" style={{ color: "#34D399" }}>{activeCount}</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-[#C9A227]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Modelos OmniRoute</span>
          </div>
          <div className="intelligence-os-metric-value text-xl">
            {loadingHealth ? "..." : health?.models || "N/A"}
          </div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={14} className="text-[#60A5FA]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Gateway Status</span>
          </div>
          <div
            className="intelligence-os-metric-value text-sm"
            style={{ color: health?.online ? "#34D399" : "#ef4444" }}
          >
            {loadingHealth ? "Verificando..." : health?.online ? "Online" : "Offline (fallback ativo)"}
          </div>
        </div>
      </div>

      {/* ── Agent Grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onDetail={setSelectedAgent} />
        ))}
      </div>

      {/* ── OmniRoute Chat Section ───────────────────────────────────────── */}
      <div id="omniroute-chat-section" className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="intelligence-os-section-title">Chat OmniRoute</h2>
            <p className="intelligence-os-section-subtitle mt-1">
              Conectado ao OmniRoute Gateway — converse com modelos de IA em tempo real
            </p>
          </div>
        </div>
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            background: "rgba(12, 15, 21, 0.75)",
            borderColor: "rgba(61, 245, 197, 0.08)",
            height: "520px",
          }}
        >
          <ChatInterface embedded />
        </div>
      </div>

      {/* ── Detail Modal ─────────────────────────────────────────────────── */}
      <AgentDetailModal agent={selectedAgent} open={!!selectedAgent} onClose={() => setSelectedAgent(null)} />
    </div>
  );
}
