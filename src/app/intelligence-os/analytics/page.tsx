"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Activity,
  Calendar,
  ChevronDown,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   ANALYTICS & BI — Intelligence OS
═══════════════════════════════════════════════════════════════════════════ */

const MRR_DATA = [28400, 31200, 29800, 34500, 37100, 39600, 42300, 44800, 41200, 46900, 47500, 48200];
const MONTHS   = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

const CHANNEL_DATA = [
  { channel: "WhatsApp",   leads: 412, conv: 8.2, revenue: 18400, color: "#10B981" },
  { channel: "Google Ads", leads: 298, conv: 5.4, revenue: 12300, color: "#C9A227" },
  { channel: "Instagram",  leads: 234, conv: 6.1, revenue: 9800,  color: "#6366F1" },
  { channel: "Orgânico",   leads: 188, conv: 9.3, revenue: 7700,  color: "#F59E0B" },
  { channel: "Indicação",  leads: 152, conv: 14.5,revenue: 6200,  color: "#EF4444" },
];

const COHORT_DATA = [
  { month: "Jan/26", m0: 100, m1: 78, m2: 64, m3: 58, m4: 52, m5: 49 },
  { month: "Fev/26", m0: 100, m1: 81, m2: 67, m3: 61, m4: 55 },
  { month: "Mar/26", m0: 100, m1: 75, m2: 63, m3: 57 },
  { month: "Abr/26", m0: 100, m1: 82, m2: 69 },
  { month: "Mai/26", m0: 100, m1: 79 },
  { month: "Jun/26", m0: 100 },
];

const maxMRR = Math.max(...MRR_DATA);

function CohortCell({ value }: { value?: number }) {
  if (value === undefined) return <td className="px-2 py-1.5 text-center"><span className="text-[#2D3748] text-xs">—</span></td>;
  const intensity = value / 100;
  const bg = `rgba(201,162,39,${intensity * 0.6})`;
  return (
    <td className="px-2 py-1.5 text-center">
      <span
        className="text-xs font-medium px-2 py-0.5 rounded"
        style={{ background: bg, color: value > 60 ? "#E8EDF2" : "#9CA3AF" }}
      >
        {value}%
      </span>
    </td>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("12m");

  const currentMRR  = MRR_DATA[MRR_DATA.length - 1];
  const prevMRR     = MRR_DATA[MRR_DATA.length - 2];
  const mrrGrowth   = (((currentMRR - prevMRR) / prevMRR) * 100).toFixed(1);
  const arr          = currentMRR * 12;
  const churn        = 2.8;
  const ltv          = (currentMRR / (churn / 100)).toFixed(0);

  return (
    <div className="p-4 lg:p-6 min-h-full intelligence-os-grid-bg">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="intelligence-os-section-title text-2xl">Analytics & BI</h1>
          <p className="intelligence-os-section-subtitle mt-1">
            MRR, ARR, Churn, LTV e análise por canal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-[rgba(201,162,39,0.06)] border border-[rgba(201,162,39,0.1)] rounded-lg p-1">
            {["3m","6m","12m"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                  period === p
                    ? "bg-[rgba(201,162,39,0.2)] text-[#C9A227]"
                    : "text-[#6B7280] hover:text-[#E8EDF2]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="intelligence-os-btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5">
            <Calendar size={13} />
            Jun 2026
            <ChevronDown size={12} />
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "MRR",      value: `R$ ${(currentMRR/1000).toFixed(1)}k`,   change: `+${mrrGrowth}%`, positive: true,  icon: DollarSign, color: "#10B981" },
          { label: "ARR",      value: `R$ ${(arr/1000).toFixed(0)}k`,         change: "+18,4%",           positive: true,  icon: TrendingUp, color: "#C9A227" },
          { label: "Churn",    value: `${churn}%`,                             change: "-0,3%",            positive: true,  icon: TrendingDown,color: "#EF4444" },
          { label: "LTV",      value: `R$ ${Number(ltv).toLocaleString()}`,   change: "+11,2%",           positive: true,  icon: Target,     color: "#6366F1" },
        ].map((kpi) => (
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
            <div className="text-xl font-bold text-[#E8EDF2] font-['Clash_Display',system-ui,sans-serif]">
              {kpi.value}
            </div>
            <div className="text-xs text-[#6B7280] mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* ── MRR Chart ── */}
      <div className="intelligence-os-card p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#E8EDF2]">Receita Recorrente Mensal (MRR)</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">Últimos 12 meses — Total acumulado: R$ 471.500</p>
          </div>
          <span className="flex items-center gap-1 text-xs text-[#10B981] font-medium">
            <TrendingUp size={13} /> +69,7% no período
          </span>
        </div>
        <div className="flex items-end gap-1.5 h-32">
          {MRR_DATA.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full">
                <div
                  className="w-full rounded-t cursor-pointer transition-opacity hover:opacity-100"
                  style={{
                    height: `${(v / maxMRR) * 120}px`,
                    background: i === MRR_DATA.length - 1
                      ? "linear-gradient(180deg, #C9A227 0%, #B8911E 100%)"
                      : "linear-gradient(180deg, rgba(201,162,39,0.5) 0%, rgba(184,145,30,0.3) 100%)",
                  }}
                />
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:flex bg-[#0C0F15] border border-[rgba(201,162,39,0.2)] px-2 py-1 rounded text-[10px] text-[#E8EDF2] whitespace-nowrap z-10">
                  R$ {(v/1000).toFixed(1)}k
                </div>
              </div>
              <span className="text-[9px] text-[#4B5563]">{MONTHS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Channels + Cohort ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

        {/* Channels */}
        <div className="intelligence-os-card p-4">
          <h3 className="text-sm font-semibold text-[#E8EDF2] mb-3 flex items-center gap-2">
            <BarChart3 size={14} className="text-[#C9A227]" />
            Leads por Canal
          </h3>
          <div className="space-y-2.5">
            {CHANNEL_DATA.map((ch) => {
              const maxL = Math.max(...CHANNEL_DATA.map(c => c.leads));
              const pct  = (ch.leads / maxL) * 100;
              return (
                <div key={ch.channel}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[#E8EDF2]">{ch.channel}</span>
                    <div className="flex items-center gap-3 text-[10px] text-[#6B7280]">
                      <span>{ch.leads} leads</span>
                      <span style={{ color: ch.color }}>{ch.conv}% conv.</span>
                      <span className="text-[#C9A227] font-medium">R$ {(ch.revenue/1000).toFixed(1)}k</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[rgba(201,162,39,0.05)] rounded overflow-hidden">
                    <div
                      className="h-full rounded transition-all duration-700"
                      style={{ width: `${pct}%`, background: ch.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cohort Retention */}
        <div className="intelligence-os-card p-4 overflow-x-auto">
          <h3 className="text-sm font-semibold text-[#E8EDF2] mb-3 flex items-center gap-2">
            <Users size={14} className="text-[#C9A227]" />
            Cohort de Retenção
          </h3>
          <table className="w-full text-[11px]">
            <thead>
              <tr>
                <th className="px-2 py-1.5 text-left text-[#6B7280] font-medium">Cohort</th>
                {["M+0","M+1","M+2","M+3","M+4","M+5"].map((m) => (
                  <th key={m} className="px-2 py-1.5 text-center text-[#6B7280] font-medium">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COHORT_DATA.map((row) => (
                <tr key={row.month} className="border-t border-[rgba(201,162,39,0.04)]">
                  <td className="px-2 py-1.5 text-[#9CA3AF] font-medium">{row.month}</td>
                  <CohortCell value={row.m0} />
                  <CohortCell value={row.m1} />
                  <CohortCell value={row.m2} />
                  <CohortCell value={row.m3} />
                  <CohortCell value={row.m4} />
                  <CohortCell value={row.m5} />
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-[#4B5563] mt-2">Retenção média M+3: 58% • M+5: 49%</p>
        </div>
      </div>

      {/* ── Forecast ── */}
      <div className="intelligence-os-card p-4">
        <h3 className="text-sm font-semibold text-[#E8EDF2] mb-3 flex items-center gap-2">
          <Activity size={14} className="text-[#C9A227]" />
          Previsão — Próximos 3 Meses
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { month: "Jul/26", mrr: "R$ 51.400", growth: "+6,6%", conf: "Alta" },
            { month: "Ago/26", mrr: "R$ 54.800", growth: "+6,6%", conf: "Média" },
            { month: "Set/26", mrr: "R$ 58.200", growth: "+6,2%", conf: "Baixa" },
          ].map((f) => (
            <div key={f.month} className="p-3 rounded-lg bg-[rgba(201,162,39,0.04)] border border-[rgba(201,162,39,0.08)]">
              <div className="text-[10px] text-[#6B7280] uppercase tracking-wide mb-1">{f.month}</div>
              <div className="text-lg font-bold text-[#E8EDF2] font-['Clash_Display',system-ui,sans-serif]">{f.mrr}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-[#10B981]">{f.growth}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  f.conf === "Alta" ? "bg-[#10B98118] text-[#10B981]" :
                  f.conf === "Média" ? "bg-[#C9A22718] text-[#C9A227]" :
                  "bg-[rgba(107,114,128,0.15)] text-[#6B7280]"
                }`}>
                  {f.conf}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
