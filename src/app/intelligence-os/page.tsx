"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  DollarSign,
  Plus,
  Globe,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  MessageSquare,
  Bot,
  CheckCircle,
  Clock,
  Target,
  Layers,
  FileText,
  Star,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   KPI DATA
═══════════════════════════════════════════════════════════════════════════ */
const KPI_CARDS = [
  {
    label: "Receita Mensal",
    value: "R$ 48.200",
    change: "+18,4%",
    positive: true,
    icon: DollarSign,
    sub: "vs. mês anterior",
    color: "#10B981",
  },
  {
    label: "Novos Leads",
    value: "1.284",
    change: "+23,1%",
    positive: true,
    icon: Users,
    sub: "este mês",
    color: "#C9A227",
  },
  {
    label: "Automações Ativas",
    value: "47",
    change: "+5",
    positive: true,
    icon: Zap,
    sub: "em execução",
    color: "#6366F1",
  },
  {
    label: "Taxa de Conversão",
    value: "6,7%",
    change: "-0,8%",
    positive: false,
    icon: Target,
    sub: "leads → clientes",
    color: "#EF4444",
  },
];

/* ── Mini bar chart data (last 7 days) ── */
const CHART_DATA = [42, 68, 55, 80, 63, 91, 74];
const CHART_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

/* ── Pipeline stages ── */
const PIPELINE = [
  { stage: "Prospecção",  count: 84,  value: "R$ 62.000", color: "#6366F1" },
  { stage: "Qualificação",count: 52,  value: "R$ 41.500", color: "#C9A227" },
  { stage: "Proposta",    count: 31,  value: "R$ 98.000", color: "#10B981" },
  { stage: "Negociação",  count: 18,  value: "R$ 134.200",color: "#F59E0B" },
  { stage: "Fechado",     count: 9,   value: "R$ 48.200", color: "#EF4444" },
];

/* ── Agent activity ── */
const AGENT_FEED = [
  { icon: Bot,          text: "Hermes captou 12 novos leads via WhatsApp",         time: "2min",  type: "success" },
  { icon: MessageSquare,text: "3 respostas automáticas enviadas no Telegram",        time: "8min",  type: "info" },
  { icon: CheckCircle,  text: "Campanha Google Ads otimizada automaticamente",       time: "15min", type: "success" },
  { icon: AlertCircle,  text: "Lead 'TechCorp' não respondeu em 48h — reativar",    time: "1h",    type: "warning" },
  { icon: Zap,          text: "Automação N8N: 47 emails de nurturing disparados",    time: "2h",    type: "info" },
  { icon: Star,         text: "Cliente 'ABC Ltda' avaliou 5 estrelas",              time: "3h",    type: "success" },
  { icon: RefreshCw,    text: "Sync Notion: 8 páginas atualizadas",                 time: "4h",    type: "info" },
];

/* ── Notion pages ── */
const NOTION_PAGES = [
  { title: "Estratégia Q3 2026",     icon: "📋", updated: "hoje",      tag: "Estratégia" },
  { title: "Roteiro de Automações",  icon: "⚡", updated: "ontem",     tag: "Automação" },
  { title: "CRM — Procedimentos",    icon: "👥", updated: "2 dias",    tag: "CRM" },
  { title: "Análise Competitiva",    icon: "🎯", updated: "3 dias",    tag: "Research" },
];

/* ── Tab definitions ── */
const TABS = ["Visão Geral", "Pipeline", "Agentes IA", "Notion"];

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(0);
  const maxBar = Math.max(...CHART_DATA);

  return (
    <div className="p-4 lg:p-6 min-h-full intelligence-os-grid-bg">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="intelligence-os-section-title text-2xl">Dashboard</h1>
          <p className="intelligence-os-section-subtitle mt-1">
            Visão geral do seu negócio em tempo real
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="intelligence-os-btn-outline text-xs px-3 py-1.5">
            <RefreshCw size={14} />
            Sincronizar
          </button>
          <button className="intelligence-os-btn-outline text-xs px-3 py-1.5">
            <Plus size={14} />
            Novo Lead
          </button>
          <button className="intelligence-os-btn-primary text-xs px-3 py-1.5">
            <Globe size={14} />
            Gerar Site com IA
          </button>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {KPI_CARDS.map((kpi) => (
          <div key={kpi.label} className="intelligence-os-card p-4">
            <div className="flex items-start justify-between mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: kpi.color + "18", border: `1px solid ${kpi.color}30` }}
              >
                <kpi.icon size={16} style={{ color: kpi.color }} />
              </div>
              <span
                className="flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded"
                style={{
                  color: kpi.positive ? "#10B981" : "#EF4444",
                  background: kpi.positive ? "#10B98118" : "#EF444418",
                }}
              >
                {kpi.positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                {kpi.change}
              </span>
            </div>
            <div className="text-xl font-bold text-[#E8EDF2] font-['Clash_Display',system-ui,sans-serif] leading-tight">
              {kpi.value}
            </div>
            <div className="text-xs text-[#6B7280] mt-0.5">{kpi.label}</div>
            <div className="text-[10px] text-[#4B5563] mt-0.5">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-5 border-b border-[rgba(201,162,39,0.08)] pb-0">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
              activeTab === i
                ? "border-[#C9A227] text-[#C9A227]"
                : "border-transparent text-[#6B7280] hover:text-[#E8EDF2]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Tab: Visão Geral ────────────────────────────────────────────── */}
      {activeTab === 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Chart */}
          <div className="intelligence-os-card p-4 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#E8EDF2]">Leads — Últimos 7 dias</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">Total: 473 leads captados</p>
              </div>
              <span className="flex items-center gap-1 text-xs text-[#10B981] font-medium">
                <TrendingUp size={13} /> +23,1%
              </span>
            </div>
            <div className="flex items-end gap-2 h-28">
              {CHART_DATA.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t transition-all duration-500"
                    style={{
                      height: `${(v / maxBar) * 100}%`,
                      background: "linear-gradient(180deg, #C9A227 0%, #B8911E 100%)",
                      opacity: 0.85,
                    }}
                  />
                  <span className="text-[9px] text-[#4B5563]">{CHART_LABELS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="intelligence-os-card p-4">
            <h3 className="text-sm font-semibold text-[#E8EDF2] mb-3 flex items-center gap-2">
              <Activity size={14} className="text-[#C9A227]" />
              Feed de Atividades
            </h3>
            <div className="space-y-2.5 max-h-52 overflow-y-auto intelligence-os-scrollbar pr-1">
              {AGENT_FEED.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background:
                        item.type === "success" ? "#10B98118" :
                        item.type === "warning" ? "#F59E0B18" : "#6366F118",
                    }}
                  >
                    <item.icon
                      size={12}
                      style={{
                        color:
                          item.type === "success" ? "#10B981" :
                          item.type === "warning" ? "#F59E0B" : "#6366F1",
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#9CA3AF] leading-snug">{item.text}</p>
                    <span className="text-[10px] text-[#4B5563] flex items-center gap-1 mt-0.5">
                      <Clock size={9} />
                      {item.time} atrás
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Sites Ativos",       value: "12",  icon: Globe,       color: "#10B981" },
              { label: "Agentes Hermes",      value: "2401",icon: Bot,         color: "#C9A227" },
              { label: "Docs Notion",         value: "184", icon: FileText,    color: "#6366F1" },
              { label: "Automações Rodando",  value: "47",  icon: Layers,      color: "#F59E0B" },
            ].map((s) => (
              <div key={s.label} className="intelligence-os-card p-3 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: s.color + "18", border: `1px solid ${s.color}30` }}
                >
                  <s.icon size={15} style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-base font-bold text-[#E8EDF2]">{s.value}</div>
                  <div className="text-[10px] text-[#6B7280]">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Pipeline ───────────────────────────────────────────────── */}
      {activeTab === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PIPELINE.map((stage) => (
              <div key={stage.stage} className="intelligence-os-card p-4">
                <div
                  className="w-2 h-2 rounded-full mb-2"
                  style={{ background: stage.color }}
                />
                <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1">
                  {stage.stage}
                </div>
                <div className="text-2xl font-bold text-[#E8EDF2] font-['Clash_Display',system-ui,sans-serif]">
                  {stage.count}
                </div>
                <div className="text-xs text-[#C9A227] font-medium mt-1">{stage.value}</div>
              </div>
            ))}
          </div>

          {/* Pipeline bar */}
          <div className="intelligence-os-card p-4">
            <h3 className="text-sm font-semibold text-[#E8EDF2] mb-3">Funil Visual</h3>
            <div className="space-y-2">
              {PIPELINE.map((stage) => {
                const pct = (stage.count / PIPELINE[0].count) * 100;
                return (
                  <div key={stage.stage} className="flex items-center gap-3">
                    <div className="w-24 text-xs text-[#6B7280] text-right flex-shrink-0">
                      {stage.stage}
                    </div>
                    <div className="flex-1 h-7 bg-[rgba(201,162,39,0.04)] rounded overflow-hidden border border-[rgba(201,162,39,0.06)]">
                      <div
                        className="h-full rounded flex items-center pl-2 transition-all duration-700"
                        style={{ width: `${pct}%`, background: stage.color + "CC" }}
                      >
                        <span className="text-[10px] font-semibold text-white">{stage.count}</span>
                      </div>
                    </div>
                    <div className="w-24 text-xs text-[#C9A227] font-medium text-right flex-shrink-0">
                      {stage.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Agentes IA ─────────────────────────────────────────────── */}
      {activeTab === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="intelligence-os-card p-4">
            <h3 className="text-sm font-semibold text-[#E8EDF2] mb-3 flex items-center gap-2">
              <Bot size={14} className="text-[#C9A227]" />
              Status dos Agentes Hermes
            </h3>
            <div className="space-y-3">
              {[
                { name: "Hermes Main", sessions: 2401, msgs: 51367, status: "online",      channels: "WhatsApp • Telegram • CLI" },
                { name: "Lead Hunter", sessions: 312,  msgs: 8940,  status: "online",      channels: "Google Maps • Instagram" },
                { name: "Site Builder",sessions: 88,   msgs: 2300,  status: "idle",        channels: "Web • API" },
                { name: "Ads Manager", sessions: 44,   msgs: 1200,  status: "processing",  channels: "Google Ads • Meta" },
              ].map((agent) => (
                <div key={agent.name} className="flex items-center justify-between p-3 rounded-lg bg-[rgba(201,162,39,0.03)] border border-[rgba(201,162,39,0.07)]">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A227]/30 to-[#B8911E]/20 border border-[rgba(201,162,39,0.2)] flex items-center justify-center">
                        <Bot size={14} className="text-[#C9A227]" />
                      </div>
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#050D1A]"
                        style={{ background: agent.status === "online" ? "#10B981" : agent.status === "processing" ? "#F59E0B" : "#6B7280" }}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#E8EDF2]">{agent.name}</div>
                      <div className="text-[10px] text-[#6B7280]">{agent.channels}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#C9A227]">{agent.sessions.toLocaleString()}</div>
                    <div className="text-[10px] text-[#4B5563]">{agent.msgs.toLocaleString()} msgs</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="intelligence-os-card p-4">
            <h3 className="text-sm font-semibold text-[#E8EDF2] mb-3 flex items-center gap-2">
              <Activity size={14} className="text-[#C9A227]" />
              Log em Tempo Real
            </h3>
            <div className="space-y-2 max-h-72 overflow-y-auto intelligence-os-scrollbar pr-1">
              {AGENT_FEED.concat(AGENT_FEED.slice(0, 3)).map((item, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded bg-[rgba(201,162,39,0.02)]">
                  <item.icon
                    size={11}
                    className="flex-shrink-0 mt-0.5"
                    style={{
                      color:
                        item.type === "success" ? "#10B981" :
                        item.type === "warning" ? "#F59E0B" : "#6366F1",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#9CA3AF] leading-snug">{item.text}</p>
                  </div>
                  <span className="text-[9px] text-[#4B5563] flex-shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Notion ─────────────────────────────────────────────────── */}
      {activeTab === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Stats */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total de Páginas", value: "184",  icon: FileText,  color: "#6366F1" },
              { label: "Bases de Dados",   value: "12",   icon: Layers,    color: "#10B981" },
              { label: "Docs Ativos",      value: "47",   icon: CheckCircle,color: "#C9A227" },
              { label: "Última Sync",      value: "4h",   icon: RefreshCw, color: "#F59E0B" },
            ].map((s) => (
              <div key={s.label} className="intelligence-os-card p-3 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: s.color + "18", border: `1px solid ${s.color}30` }}
                >
                  <s.icon size={15} style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-base font-bold text-[#E8EDF2]">{s.value}</div>
                  <div className="text-[10px] text-[#6B7280]">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent pages */}
          <div className="intelligence-os-card p-4 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#E8EDF2]">Páginas Recentes</h3>
              <a
                href="/intelligence-os/knowledge"
                className="text-xs text-[#C9A227] hover:underline"
              >
                Ver tudo →
              </a>
            </div>
            <div className="space-y-2">
              {NOTION_PAGES.map((page) => (
                <div
                  key={page.title}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(201,162,39,0.03)] border border-[rgba(201,162,39,0.07)] hover:border-[rgba(201,162,39,0.15)] transition-colors cursor-pointer"
                >
                  <span className="text-lg flex-shrink-0">{page.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#E8EDF2] truncate">{page.title}</div>
                    <div className="text-[10px] text-[#6B7280]">Atualizado {page.updated}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[rgba(201,162,39,0.1)] text-[#C9A227] font-medium">
                    {page.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notion connect */}
          <div className="intelligence-os-card p-4">
            <h3 className="text-sm font-semibold text-[#E8EDF2] mb-3">Workspace Notion</h3>
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-xl bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.1)] flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🗃️</span>
              </div>
              <p className="text-xs text-[#6B7280] mb-4">
                Conecte seu workspace Notion para sincronizar páginas, bases de dados e tarefas automaticamente.
              </p>
              <a
                href="/intelligence-os/knowledge"
                className="intelligence-os-btn-primary text-xs px-4 py-2 inline-flex items-center gap-2"
              >
                <Zap size={13} />
                Conectar Notion
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
