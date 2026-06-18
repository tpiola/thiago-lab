"use client";

import {
  TrendingUp,
  Users,
  Activity,
  Package,
  Plus,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  UserPlus,
  FileText,
  CheckCircle,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════ */

const METRICS = [
  {
    label: "Receita",
    value: "R$ 184.7k",
    change: "+12.5%",
    positive: true,
    icon: TrendingUp,
  },
  {
    label: "Leads",
    value: "312",
    change: "+8.2%",
    positive: true,
    icon: Users,
  },
  {
    label: "Automações",
    value: "89",
    change: "+23.1%",
    positive: true,
    icon: Activity,
  },
  {
    label: "Produtos",
    value: "47",
    change: "-2.4%",
    positive: false,
    icon: Package,
  },
];

const MONTHLY_REVENUE = [
  { month: "Jan", receita: 128000, leads: 180 },
  { month: "Fev", receita: 135000, leads: 195 },
  { month: "Mar", receita: 142000, leads: 210 },
  { month: "Abr", receita: 158000, leads: 225 },
  { month: "Mai", receita: 165000, leads: 260 },
  { month: "Jun", receita: 184700, leads: 312 },
];

const LEADS_BY_CHANNEL = [
  { channel: "Orgânico", valor: 145 },
  { channel: "Indicação", valor: 89 },
  { channel: "Redes Sociais", valor: 52 },
  { channel: "Email", valor: 26 },
];

const RECENT_ACTIVITIES = [
  { type: "lead",   text: "Novo lead: Empresa XYZ",         time: "2 min atrás",  icon: UserPlus,   color: "#FBBF24" },
  { type: "proposal", text: "Proposta enviada para Acme Corp", time: "15 min atrás", icon: FileText,  color: "#C9A227" },
  { type: "deal",   text: "Negócio fechado: TechStart",     time: "1h atrás",     icon: CheckCircle, color: "#34D399" },
  { type: "automation", text: "Automação 'Follow-up' executada", time: "2h atrás", icon: Zap,       color: "#60A5FA" },
  { type: "lead",   text: "Novo lead: Maria Silva (Potencial)", time: "3h atrás",  icon: UserPlus,   color: "#FBBF24" },
  { type: "deal",   text: "Pipeline atualizado: GlobalTech",    time: "5h atrás",  icon: TrendingUp, color: "#C9A227" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="intelligence-os-card p-3 text-xs shadow-xl">
      <p className="text-[#9BA3B8] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.name === "receita" ? `R$ ${(p.value / 1000).toFixed(1)}k` : p.value}
        </p>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
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
        <div className="flex items-center gap-2">
          <button className="intelligence-os-btn-outline">
            <Plus size={16} />
            Novo Lead
          </button>
          <button className="intelligence-os-btn-primary">
            <Globe size={16} />
            Gerar Site com IA
          </button>
        </div>
      </div>

      {/* ── Metrics Grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {METRICS.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="intelligence-os-metric">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.06)] flex items-center justify-center">
                  <Icon size={16} className="text-[#C9A227]" />
                </div>
                <span className={`intelligence-os-metric-change ${m.positive ? "positive" : "negative"}`}>
                  {m.positive ? <ArrowUpRight size={12} className="inline mr-0.5" /> : <ArrowDownRight size={12} className="inline mr-0.5" />}
                  {m.change}
                </span>
              </div>
              <div className="intelligence-os-metric-value">{m.value}</div>
              <div className="intelligence-os-metric-label">{m.label}</div>
            </div>
          );
        })}
      </div>

      {/* ── Charts Row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Revenue Chart */}
        <div className="intelligence-os-card p-4 lg:col-span-2">
          <h3 className="text-sm font-semibold text-[#E8EDF2] mb-4">
            Receita Mensal
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_REVENUE}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A227" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#C9A227" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,162,39,0.06)" />
                <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="receita" stroke="#C9A227" strokeWidth={2} fill="url(#revGrad)" name="receita" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leads by Channel */}
        <div className="intelligence-os-card p-4">
          <h3 className="text-sm font-semibold text-[#E8EDF2] mb-4">
            Leads por Canal
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={LEADS_BY_CHANNEL} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,162,39,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="channel" type="category" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="valor" fill="#C9A227" radius={[0, 4, 4, 0]} barSize={20} name="leads" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Recent Activity & Pipeline Progress ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity Timeline */}
        <div className="intelligence-os-card p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#E8EDF2]">
              Atividade Recente
            </h3>
            <div className="flex items-center gap-1 text-xs text-[#6B7280]">
              <Clock size={12} />
              <span>Hoje</span>
            </div>
          </div>
          <div className="space-y-0">
            {RECENT_ACTIVITIES.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="intelligence-os-timeline-item last:pb-0">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${a.color}15`, border: `1px solid ${a.color}25` }}
                    >
                      <Icon size={13} style={{ color: a.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#E8EDF2]">{a.text}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{a.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pipeline Overview */}
        <div className="intelligence-os-card p-4">
          <h3 className="text-sm font-semibold text-[#E8EDF2] mb-4">
            Pipeline Geral
          </h3>
          <div className="space-y-4">
            {[
              { stage: "Lead",     count: 48, pct: 100, color: "#FBBF24" },
              { stage: "Contato",  count: 32, pct: 67,  color: "#60A5FA" },
              { stage: "Proposta", count: 18, pct: 38,  color: "#C9A227" },
              { stage: "Fechado",  count: 12, pct: 25,  color: "#34D399" },
            ].map((s) => (
              <div key={s.stage}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[#9BA3B8]">{s.stage}</span>
                  <span className="text-[#6B7280]">{s.count} leads</span>
                </div>
                <div className="intelligence-os-progress">
                  <div
                    className="intelligence-os-progress-bar"
                    style={{ width: `${s.pct}%`, background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-[rgba(201,162,39,0.06)]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6B7280]">Taxa de Conversão</span>
              <span className="text-[#34D399] font-semibold">25.0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
