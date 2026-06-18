"use client";

import { useState } from "react";
import {
  Workflow,
  Play,
  Pause,
  AlertCircle,
  Clock,
  CheckCircle,
  Zap,
  MessageSquare,
  Mail,
  Database,
  Users,
  FileText,
  ShoppingCart,
  Globe,
  RefreshCw,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */
interface WorkflowData {
  id: string;
  name: string;
  description: string;
  icon: typeof Workflow;
  status: "Ativo" | "Pausado" | "Erro";
  lastRun: string;
  trigger: string;
  executions: number;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════ */
const WORKFLOWS: WorkflowData[] = [
  {
    id: "w1",
    name: "Leads WhatsApp",
    description: "Captura leads do WhatsApp e cria automaticamente no CRM",
    icon: MessageSquare,
    status: "Ativo",
    lastRun: "2 min atrás",
    trigger: "WhatsApp Webhook",
    executions: 1247,
  },
  {
    id: "w2",
    name: "Email Marketing",
    description: "Dispara campanhas de email automatizadas para leads quentes",
    icon: Mail,
    status: "Ativo",
    lastRun: "15 min atrás",
    trigger: "Agendado (Diário)",
    executions: 8923,
  },
  {
    id: "w3",
    name: "CRM Sync",
    description: "Sincroniza dados entre Intelligence OS CRM e plataformas externas",
    icon: Database,
    status: "Ativo",
    lastRun: "5 min atrás",
    trigger: "Webhook",
    executions: 5671,
  },
  {
    id: "w4",
    name: "Follow-up Automático",
    description: "Envia mensagens de follow-up para leads sem resposta após 24h",
    icon: Users,
    status: "Ativo",
    lastRun: "1h atrás",
    trigger: "Timer (24h)",
    executions: 3456,
  },
  {
    id: "w5",
    name: "Geração de Propostas",
    description: "Gera propostas comerciais automaticamente com base no perfil do lead",
    icon: FileText,
    status: "Ativo",
    lastRun: "30 min atrás",
    trigger: "Evento: Novo Lead",
    executions: 892,
  },
  {
    id: "w6",
    name: "Notificação de Vendas",
    description: "Notifica equipe no Telegram quando uma venda é concluída",
    icon: ShoppingCart,
    status: "Pausado",
    lastRun: "2 dias atrás",
    trigger: "Evento: Venda",
    executions: 2341,
  },
  {
    id: "w7",
    name: "Importação de Planilhas",
    description: "Importa dados de planilhas Google Sheets para o CRM automaticamente",
    icon: Globe,
    status: "Erro",
    lastRun: "3h atrás",
    trigger: "Schedule (6h)",
    executions: 156,
  },
  {
    id: "w8",
    name: "Relatório Semanal",
    description: "Gera e envia relatório semanal de desempenho por email",
    icon: RefreshCw,
    status: "Pausado",
    lastRun: "5 dias atrás",
    trigger: "Agendado (Semanal)",
    executions: 89,
  },
];

const STATUS_CONFIG: Record<string, { bg: string; color: string; icon: typeof Play }> = {
  Ativo:   { bg: "rgba(52,211,153,0.1)",  color: "#34D399", icon: CheckCircle },
  Pausado: { bg: "rgba(251,191,36,0.1)",  color: "#FBBF24", icon: Pause },
  Erro:    { bg: "rgba(239,68,68,0.1)",   color: "#EF4444", icon: AlertCircle },
};

/* ═══════════════════════════════════════════════════════════════════════════
   WORKFLOW CARD
   ═══════════════════════════════════════════════════════════════════════════ */
function WorkflowCard({ workflow }: { workflow: WorkflowData }) {
  const [currentStatus, setCurrentStatus] = useState(workflow.status);
  const Icon = workflow.icon;
  const sc = STATUS_CONFIG[currentStatus];
  const StatusIcon = sc.icon;

  const toggleStatus = () => {
    setCurrentStatus((prev) => {
      if (prev === "Ativo") return "Pausado";
      if (prev === "Pausado") return "Ativo";
      return "Ativo"; // Erro -> Ativo
    });
  };

  return (
    <div className="intelligence-os-card p-4 hover:border-[rgba(201,162,39,0.15)] transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${sc.color}10`, border: `1px solid ${sc.color}15` }}
          >
            <Icon size={20} style={{ color: sc.color }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#E8EDF2]">{workflow.name}</h3>
            <span
              className="inline-flex items-center gap-1 text-[10px] font-medium mt-0.5 px-1.5 py-0.5 rounded-full"
              style={{ background: sc.bg, color: sc.color }}
            >
              <StatusIcon size={10} />
              {currentStatus}
            </span>
          </div>
        </div>
        <button
          onClick={toggleStatus}
          className={`p-1.5 rounded-lg transition-all ${
            currentStatus === "Ativo"
              ? "bg-[rgba(52,211,153,0.1)] text-[#34D399] hover:bg-[rgba(52,211,153,0.2)]"
              : "bg-[rgba(107,114,128,0.1)] text-[#6B7280] hover:bg-[rgba(201,162,39,0.1)] hover:text-[#C9A227]"
          }`}
        >
          {currentStatus === "Ativo" ? <Pause size={14} /> : <Play size={14} />}
        </button>
      </div>

      <p className="text-xs text-[#6B7280] mb-3">{workflow.description}</p>

      <div className="space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="text-[#6B7280]">Gatilho</span>
          <span className="text-[#9BA3B8]">{workflow.trigger}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#6B7280]">Execuções</span>
          <span className="text-[#9BA3B8]">{workflow.executions.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#6B7280]">Última execução</span>
          <span className="text-[#9BA3B8]">{workflow.lastRun}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AUTOMAÇÕES PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function AutomacoesPage() {
  const activeCount = WORKFLOWS.filter((w) => w.status === "Ativo").length;
  const errorCount = WORKFLOWS.filter((w) => w.status === "Erro").length;
  const totalExecutions = WORKFLOWS.reduce((acc, w) => acc + w.executions, 0);

  return (
    <div className="p-4 lg:p-6 min-h-full intelligence-os-grid-bg">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="intelligence-os-section-title text-2xl">Automações n8n</h1>
          <p className="intelligence-os-section-subtitle mt-1">
            Workflows inteligentes que automatizam seu negócio
          </p>
        </div>
        <button className="intelligence-os-btn-primary">
          <Zap size={16} />
          Nova Automação
        </button>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <Workflow size={14} className="text-[#C9A227]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Total</span>
          </div>
          <div className="intelligence-os-metric-value text-xl">{WORKFLOWS.length}</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <Play size={14} className="text-[#34D399]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Ativos</span>
          </div>
          <div className="intelligence-os-metric-value text-xl" style={{ color: "#34D399" }}>{activeCount}</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={14} className="text-[#EF4444]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Erros</span>
          </div>
          <div className="intelligence-os-metric-value text-xl" style={{ color: "#EF4444" }}>{errorCount}</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-[#C9A227]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Execuções Hoje</span>
          </div>
          <div className="intelligence-os-metric-value text-xl">{totalExecutions.toLocaleString()}</div>
        </div>
      </div>

      {/* ── Workflow Grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {WORKFLOWS.map((wf) => (
          <WorkflowCard key={wf.id} workflow={wf} />
        ))}
      </div>
    </div>
  );
}
