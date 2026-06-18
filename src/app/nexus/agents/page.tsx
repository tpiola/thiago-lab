"use client";

import { useState } from "react";
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
  Code,
  BarChart3,
} from "lucide-react";

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

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════ */
const AGENTS: Agent[] = [
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
    id: "nexuschat",
    name: "NEXUS Chat",
    description: "Chat inteligente para suporte ao cliente com respostas contextuais",
    icon: MessageSquare,
    status: "Online",
    lastRun: "10 min atrás",
    tasksCompleted: 3451,
    successRate: 94.2,
    model: "GPT-4o",
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
    model: "NEXUS Forge AI",
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
    <div className="nexus-modal-overlay" onClick={onClose}>
      <div className="nexus-modal max-w-lg" onClick={(e) => e.stopPropagation()}>
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
                <span className={`nexus-status-dot ${sc.dot}`} />
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
          <div className="nexus-card p-3">
            <div className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">Modelo</div>
            <div className="text-sm font-medium text-[#E8EDF2]">{agent.model}</div>
          </div>
          <div className="nexus-card p-3">
            <div className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">Tasks</div>
            <div className="text-sm font-medium text-[#E8EDF2]">{agent.tasksCompleted.toLocaleString()}</div>
          </div>
          <div className="nexus-card p-3">
            <div className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">Taxa de Sucesso</div>
            <div className="text-sm font-medium text-[#34D399]">{agent.successRate}%</div>
          </div>
          <div className="nexus-card p-3">
            <div className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">Última Execução</div>
            <div className="text-sm font-medium text-[#E8EDF2]">{agent.lastRun}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="nexus-btn-primary flex-1">
            <Play size={14} />
            Executar Agora
          </button>
          <button className="nexus-btn-outline flex-1">
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
      className="nexus-card p-4 cursor-pointer hover:border-[rgba(201,162,39,0.15)] transition-all duration-200 group"
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
              <span className={`nexus-status-dot ${sc.dot}`} />
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

  const activeCount = AGENTS.filter((a) => a.status === "Online").length;
  const tasksToday = AGENTS.reduce((acc, a) => acc + a.tasksCompleted, 0);

  return (
    <div className="p-4 lg:p-6 min-h-full nexus-grid-bg">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="nexus-section-title text-2xl">AI Agents</h1>
          <p className="nexus-section-subtitle mt-1">
            Gerencie seus agentes de IA — Hermes, Clarity OS, INEMA e mais
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="nexus-btn-primary">
            <Zap size={16} />
            Executar Todos
          </button>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="nexus-metric">
          <div className="flex items-center gap-2 mb-2">
            <Bot size={14} className="text-[#C9A227]" />
            <span className="nexus-metric-label" style={{ margin: 0 }}>Total Agents</span>
          </div>
          <div className="nexus-metric-value text-xl">{AGENTS.length}</div>
        </div>
        <div className="nexus-metric">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={14} className="text-[#34D399]" />
            <span className="nexus-metric-label" style={{ margin: 0 }}>Active</span>
          </div>
          <div className="nexus-metric-value text-xl" style={{ color: "#34D399" }}>{activeCount}</div>
        </div>
        <div className="nexus-metric">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={14} className="text-[#C9A227]" />
            <span className="nexus-metric-label" style={{ margin: 0 }}>Tasks Hoje</span>
          </div>
          <div className="nexus-metric-value text-xl">{tasksToday.toLocaleString()}</div>
        </div>
        <div className="nexus-metric">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-[#60A5FA]" />
            <span className="nexus-metric-label" style={{ margin: 0 }}>Avg Response</span>
          </div>
          <div className="nexus-metric-value text-xl" style={{ color: "#60A5FA" }}>1.2s</div>
        </div>
      </div>

      {/* ── Agent Grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENTS.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onDetail={setSelectedAgent} />
        ))}
      </div>

      {/* ── Detail Modal ─────────────────────────────────────────────────── */}
      <AgentDetailModal agent={selectedAgent} open={!!selectedAgent} onClose={() => setSelectedAgent(null)} />
    </div>
  );
}
