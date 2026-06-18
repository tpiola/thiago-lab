"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BarChart3,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CalendarDays,
  ShieldCheck,
  UserCheck,
  Receipt,
  Banknote,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts";

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS — Dark BI Theme
   ═══════════════════════════════════════════════════════════════════════════ */
const C = {
  bg: "#06080C",
  surface: "#0C0F15",
  text: "#E8EDF2",
  muted: "#7A8694",
  accent: "#3DF5C5",
  accentDim: "rgba(61, 245, 197, 0.12)",
  border: "rgba(61, 245, 197, 0.08)",
  glass: "rgba(12, 15, 21, 0.75)",
};

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════ */

const METRICS = [
  {
    label: "MRR",
    value: "R$ 284.500",
    change: "+12.4%",
    up: true,
    icon: DollarSign,
    sub: "Receita Recorrente Mensal",
  },
  {
    label: "ARR",
    value: "R$ 3.414.000",
    change: "+18.2%",
    up: true,
    icon: Banknote,
    sub: "Receita Recorrente Anual",
  },
  {
    label: "Churn",
    value: "2.1%",
    change: "-0.8pp",
    up: false,
    icon: Users,
    sub: "Taxa de Cancelamento",
  },
  {
    label: "LTV",
    value: "R$ 18.450",
    change: "+8.6%",
    up: true,
    icon: Target,
    sub: "Lifetime Value Médio",
  },
];

const MONTHS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const revenueData = MONTHS.map((m, i) => ({
  month: m,
  receita: 180000 + Math.round(Math.random() * 120000 * (1 + i * 0.04)),
  custos: 80000 + Math.round(Math.random() * 40000 * (1 + i * 0.02)),
}));

const churnData = MONTHS.map((m) => ({
  month: m,
  churn: +(1.5 + Math.random() * 2.5).toFixed(1),
  retencao: +(88 + Math.random() * 10).toFixed(1),
}));

const clientesAtivos = [
  { nome: "TechCorp Soluções", valor: "R$ 24.900", plano: "Enterprise", status: "Ativo" },
  { nome: "DigitalWave Ltda", valor: "R$ 8.490", plano: "Pro", status: "Ativo" },
  { nome: "NovaMídia Group", valor: "R$ 4.990", plano: "Starter", status: "Ativo" },
  { nome: "CloudNine Tech", valor: "R$ 16.800", plano: "Enterprise", status: "Ativo" },
  { nome: "DataFlow Systems", valor: "R$ 6.490", plano: "Pro", status: "Ativo" },
  { nome: "GreenField Agro", valor: "R$ 49.900", plano: "Enterprise+", status: "Ativo" },
  { nome: "BlueOcean Co", valor: "R$ 3.990", plano: "Starter", status: "Inativo" },
  { nome: "AlphaBeta Labs", valor: "R$ 12.400", plano: "Pro", status: "Ativo" },
];

const funilData = [
  { etapa: "Leads", valor: 4850, cor: "#7A8694" },
  { etapa: "Oportunidades", valor: 1240, cor: "#3DF5C5" },
  { etapa: "Propostas", valor: 480, cor: "#3DB8F5" },
  { etapa: "Fechadas", valor: 192, cor: "#F5A63D" },
];

const forecastData = Array.from({ length: 30 }, (_, i) => ({
  dia: `D+${i + 1}`,
  previsao: 9200 + Math.round(Math.random() * 1200 + i * 85),
  otimista: 9800 + Math.round(Math.random() * 1000 + i * 95),
  pessimista: 8500 + Math.round(Math.random() * 800 + i * 60),
}));

const cohortData = [
  { mes: "Jan", m0: 100, m1: 78, m2: 65, m3: 58, m4: 52, m5: 47 },
  { mes: "Fev", m0: 100, m1: 81, m2: 70, m3: 62, m4: 55, m5: 49 },
  { mes: "Mar", m0: 100, m1: 75, m2: 68, m3: 60, m4: 54, m5: 48 },
  { mes: "Abr", m0: 100, m1: 79, m2: 72, m3: 64, m4: 57, m5: 50 },
  { mes: "Mai", m0: 100, m1: 82, m2: 71, m3: 63, m4: 56, m5: 51 },
  { mes: "Jun", m0: 100, m1: 77, m2: 66, m3: 59, m4: 53, m5: 46 },
];

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENTES REUTILIZÁVEIS
   ═══════════════════════════════════════════════════════════════════════════ */

function GlassCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.19, 1, 0.22, 1] }}
      className={`rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:border-[${C.accent}]/30 hover:shadow-[0_0_30px_rgba(61,245,197,0.06)] ${className}`}
      style={{
        background: C.glass,
        borderColor: C.border,
      }}
    >
      {children}
    </motion.div>
  );
}

function CardHeader({ title, subtitle, icon: Icon }: { title: string; subtitle?: string; icon?: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      {Icon && (
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: C.accentDim }}
        >
          <Icon size={18} style={{ color: C.accent }} />
        </div>
      )}
      <div>
        <h3 className="text-sm font-semibold" style={{ color: C.text }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs" style={{ color: C.muted }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MÉTRICAS DO TOPO (MetricCard)
   ═══════════════════════════════════════════════════════════════════════════ */

function MetricCard({
  label,
  value,
  change,
  up,
  icon: Icon,
  sub,
  delay,
}: (typeof METRICS)[number] & { delay: number }) {
  return (
    <GlassCard delay={delay} className="p-5 group">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(61,245,197,0.15)]"
          style={{ background: C.accentDim }}
        >
          <Icon size={20} style={{ color: C.accent }} />
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            up
              ? "text-green-400 bg-green-500/10"
              : "text-red-400 bg-red-500/10"
          }`}
        >
          {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </span>
      </div>
      <p className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: C.muted }}>
        {label}
      </p>
      <p className="text-2xl font-bold tracking-tight" style={{ color: C.text }}>
        {value}
      </p>
      <p className="text-xs mt-1" style={{ color: C.muted }}>
        {sub}
      </p>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GRÁFICO DE RECEITA (AreaChart)
   ═══════════════════════════════════════════════════════════════════════════ */

function RevenueChart() {
  return (
    <GlassCard className="p-5 col-span-full lg:col-span-2">
      <CardHeader title="Receita Mensal" subtitle="Últimos 12 meses" icon={BarChart3} />
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.accent} stopOpacity={0.35} />
                <stop offset="100%" stopColor={C.accent} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F55" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#F55" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(122,134,148,0.12)" />
            <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                color: C.text,
              }}
              labelStyle={{ color: C.muted }}
            />
            <Area
              type="monotone"
              dataKey="custos"
              stroke="#F55"
              strokeWidth={2}
              fill="url(#costGrad)"
              name="Custos"
            />
            <Area
              type="monotone"
              dataKey="receita"
              stroke={C.accent}
              strokeWidth={2.5}
              fill="url(#revGrad)"
              name="Receita"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GRÁFICO DE CHURN (BarChart)
   ═══════════════════════════════════════════════════════════════════════════ */

function ChurnChart() {
  return (
    <GlassCard className="p-5">
      <CardHeader title="Churn Rate" subtitle="Cancelamentos mensais" icon={Users} />
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={churnData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(122,134,148,0.12)" />
            <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
            <Tooltip
              contentStyle={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                color: C.text,
              }}
              labelStyle={{ color: C.muted }}
            />
            <Bar dataKey="churn" name="Churn %" radius={[6, 6, 0, 0]} maxBarSize={24}>
              {churnData.map((entry) => (
                <Cell
                  key={entry.month}
                  fill={entry.churn > 3 ? "#F55" : entry.churn > 2 ? "#F5A63D" : C.accent}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TABELA DE CLIENTES ATIVOS
   ═══════════════════════════════════════════════════════════════════════════ */

function ClientesTable() {
  const statusColor = (s: string) =>
    s === "Ativo" ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10";

  const planColor = (p: string) => {
    if (p === "Enterprise+") return "text-purple-400 bg-purple-500/10";
    if (p === "Enterprise") return "text-blue-400 bg-blue-500/10";
    if (p === "Pro") return C.accent;
    return C.muted;
  };

  return (
    <GlassCard className="p-5 col-span-full lg:col-span-2">
      <CardHeader title="Clientes Ativos" subtitle="8 clientes cadastrados" icon={UserCheck} />
      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-sm" style={{ color: C.text }}>
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider" style={{ color: C.muted }}>
              <th className="px-5 pb-3 font-semibold">Cliente</th>
              <th className="px-4 pb-3 font-semibold">Valor</th>
              <th className="px-4 pb-3 font-semibold">Plano</th>
              <th className="px-4 pb-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {clientesAtivos.map((c, i) => (
              <motion.tr
                key={c.nome}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="border-t transition-colors duration-200 hover:bg-white/[0.02]"
                style={{ borderColor: C.border }}
              >
                <td className="px-5 py-3.5 font-medium">{c.nome}</td>
                <td className="px-4 py-3.5 font-semibold" style={{ color: C.accent }}>
                  {c.valor}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      typeof planColor(c.plano) === "string" && planColor(c.plano).includes("text-")
                        ? planColor(c.plano)
                        : ""
                    }`}
                    style={
                      typeof planColor(c.plano) !== "string" || !planColor(c.plano).includes("text-")
                        ? { color: planColor(c.plano) as string, background: C.accentDim }
                        : {}
                    }
                  >
                    {c.plano}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusColor(c.status)}`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: c.status === "Ativo" ? "#4ade80" : "#f87171",
                      }}
                    />
                    {c.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FUNIL DE CONVERSÃO
   ═══════════════════════════════════════════════════════════════════════════ */

function FunilConversao() {
  const maxValor = Math.max(...funilData.map((f) => f.valor));

  return (
    <GlassCard className="p-5">
      <CardHeader title="Funil de Conversão" subtitle="Leads → Fechadas" icon={Activity} />
      <div className="space-y-3.5">
        {funilData.map((item, i) => {
          const pct = (item.valor / maxValor) * 100;
          return (
            <motion.div
              key={item.etapa}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ delay: i * 0.12, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium" style={{ color: C.text }}>
                  {item.etapa}
                </span>
                <span className="text-sm font-bold" style={{ color: item.cor }}>
                  {item.valor.toLocaleString()}
                </span>
              </div>
              <div
                className="h-2.5 rounded-full overflow-hidden"
                style={{ background: "rgba(122,134,148,0.1)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: i * 0.12 + 0.3, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                  className="h-full rounded-full"
                  style={{
                    background: item.cor,
                    boxShadow: `0 0 12px ${item.cor}44`,
                  }}
                />
              </div>
              {i < funilData.length - 1 && (
                <div className="flex justify-center my-1">
                  <span className="text-lg" style={{ color: C.muted }}>
                    ↓
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PREVISÃO DE RECEITA (Próximos 30 dias)
   ═══════════════════════════════════════════════════════════════════════════ */

function RevenueForecast() {
  const totalPrevisto = forecastData.reduce((s, d) => s + d.previsao, 0);
  const totalOtimista = forecastData.reduce((s, d) => s + d.otimista, 0);
  const totalPessimista = forecastData.reduce((s, d) => s + d.pessimista, 0);

  const sampledData = forecastData.filter((_, i) => i % 3 === 0);

  return (
    <GlassCard className="p-5">
      <CardHeader title="Previsão de Receita" subtitle="Próximos 30 dias" icon={CalendarDays} />
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl p-3 text-center" style={{ background: "rgba(61,245,197,0.06)" }}>
          <p className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: C.muted }}>
            Pessimista
          </p>
          <p className="text-sm font-bold text-red-400">R$ {(totalPessimista / 1000).toFixed(0)}k</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: C.accentDim }}>
          <p className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: C.muted }}>
            Previsto
          </p>
          <p className="text-sm font-bold" style={{ color: C.accent }}>
            R$ {(totalPrevisto / 1000).toFixed(0)}k
          </p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: "rgba(61,180,245,0.06)" }}>
          <p className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: C.muted }}>
            Otimista
          </p>
          <p className="text-sm font-bold text-blue-400">R$ {(totalOtimista / 1000).toFixed(0)}k</p>
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampledData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(122,134,148,0.08)" />
            <XAxis dataKey="dia" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
            <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                color: C.text,
              }}
              labelStyle={{ color: C.muted }}
            />
            <Line type="monotone" dataKey="pessimista" stroke="#F55" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Pessimista" />
            <Line type="monotone" dataKey="previsao" stroke={C.accent} strokeWidth={2.5} dot={false} name="Previsto" />
            <Line type="monotone" dataKey="otimista" stroke="#3DB8F5" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Otimista" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SAÚDE DO NEGÓCIO
   ═══════════════════════════════════════════════════════════════════════════ */

function BusinessHealth() {
  const score = 78;
  const ringCircumference = 2 * Math.PI * 54;
  const progress = (score / 100) * ringCircumference;
  const color = score >= 80 ? C.accent : score >= 60 ? "#F5A63D" : "#F55";

  const factors = [
    { label: "MRR Crescimento", value: "12.4%", ok: true },
    { label: "Churn Rate", value: "2.1%", ok: true },
    { label: "LTV/CAC", value: "4.8x", ok: true },
    { label: "NPS", value: "72", ok: true },
    { label: "Retenção", value: "89%", ok: true },
  ];

  return (
    <GlassCard className="p-5">
      <CardHeader title="Saúde do Negócio" subtitle="Score geral" icon={ShieldCheck} />
      <div className="flex flex-col items-center mb-4">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(122,134,148,0.1)" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringCircumference - progress}
              style={{
                transition: "stroke-dashoffset 1.5s ease-in-out",
                filter: `drop-shadow(0 0 8px ${color}55)`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold" style={{ color: C.text }}>
              {score}
            </span>
          </div>
        </div>
        <p className="text-sm mt-2" style={{ color: C.muted }}>
          {score >= 80 ? "Excelente" : score >= 60 ? "Bom" : "Atenção"}
        </p>
      </div>
      <div className="space-y-2">
        {factors.map((f) => (
          <div key={f.label} className="flex items-center justify-between text-sm">
            <span style={{ color: C.muted }}>{f.label}</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ color: C.text }}>
                {f.value}
              </span>
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: f.ok ? C.accent : "#F55",
                  boxShadow: f.ok ? `0 0 6px ${C.accent}66` : "0 0 6px #F55666",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COHORT ANALYSIS
   ═══════════════════════════════════════════════════════════════════════════ */

function CohortAnalysis() {
  const months = ["M0", "M1", "M2", "M3", "M4", "M5"];

  const getColor = (val: number) => {
    if (val >= 80) return C.accent;
    if (val >= 70) return "#3DB8F5";
    if (val >= 60) return "#F5A63D";
    if (val >= 50) return "#F55";
    return "#7A8694";
  };

  return (
    <GlassCard className="p-5 col-span-full lg:col-span-2">
      <CardHeader title="Cohort Analysis" subtitle="Retenção por mês (%)" icon={Receipt} />
      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-sm" style={{ color: C.text }}>
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider" style={{ color: C.muted }}>
              <th className="px-5 pb-3 font-semibold">Mês</th>
              {months.map((m) => (
                <th key={m} className="px-3 pb-3 font-semibold text-center">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohortData.map((row, i) => (
              <motion.tr
                key={row.mes}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                className="border-t transition-colors duration-200 hover:bg-white/[0.02]"
                style={{ borderColor: C.border }}
              >
                <td className="px-5 py-2.5 font-semibold text-xs" style={{ color: C.accent }}>
                  {row.mes}
                </td>
                {months.map((_, mi) => {
                  const key = `m${mi}` as keyof typeof row;
                  const val = row[key] as number;
                  return (
                    <td key={mi} className="px-3 py-2.5 text-center">
                      <span
                        className="inline-flex items-center justify-center w-10 h-8 rounded-md text-xs font-bold"
                        style={{
                          background: `${getColor(val)}22`,
                          color: getColor(val),
                        }}
                      >
                        {val}%
                      </span>
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE PRINCIPAL
   ═══════════════════════════════════════════════════════════════════════════ */

export default function IntelligenceAnalyticsPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{ background: C.bg, color: C.text }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: C.accentDim }}
          >
            <BarChart3 size={20} style={{ color: C.accent }} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold" style={{ color: C.text }}>
              Analytics & BI
            </h1>
            <p className="text-sm" style={{ color: C.muted }}>
              Business Intelligence Platform — Métricas e insights em tempo real
            </p>
          </div>
        </div>
      </motion.div>

      {/* Grid Principal */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
      >
        {/* Métricas do Topo */}
        {METRICS.map((m, i) => (
          <MetricCard key={m.label} {...m} delay={i * 0.08} />
        ))}

        {/* Gráfico de Receita */}
        <RevenueChart />

        {/* Gráfico de Churn */}
        <ChurnChart />

        {/* Funil de Conversão */}
        <FunilConversao />

        {/* Previsão de Receita */}
        <RevenueForecast />

        {/* Saúde do Negócio */}
        <BusinessHealth />

        {/* Tabela de Clientes */}
        <ClientesTable />

        {/* Cohort Analysis */}
        <CohortAnalysis />
      </motion.div>
    </div>
  );
}
