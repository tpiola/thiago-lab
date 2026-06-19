"use client";

import {
  TrendingUp,
  Users,
  Activity,
  Package,
  Plus,
  Globe,
  BarChart3,
  Clock,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD PAGE — Em construção
   Intelligence OS — thiagolab.com
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

      {/* ── Em construção ────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.06)] flex items-center justify-center mb-4">
          <BarChart3 size={32} className="text-[#C9A227]" />
        </div>
        <h2 className="text-xl font-bold text-[#E8EDF2] mb-2 font-['Clash_Display',system-ui,sans-serif]">
          Dashboard em construção
        </h2>
        <p className="text-sm text-[#6B7280] max-w-md mb-6">
          Os dados reais do seu negócio aparecerão aqui em breve.
          Conecte suas fontes de dados (n8n, Supabase, APIs) para começar.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
          {[
            { label: "Métricas", desc: "Receita, leads, automações e produtos" },
            { label: "Gráficos", desc: "Receita mensal, leads por canal" },
            { label: "Atividades", desc: "Feed de ações em tempo real" },
          ].map((item) => (
            <div key={item.label} className="intelligence-os-card p-4 text-left">
              <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider mb-1">
                {item.label}
              </p>
              <p className="text-xs text-[#6B7280]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
