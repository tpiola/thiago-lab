"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard, BarChart3, Users, Bot, Workflow, Globe, GitBranch,
  BookOpen, HardDrive, Mail, Sparkles, MapPin, Copy, Crosshair, Megaphone,
  LayoutGrid, NotebookPen, AppWindow, TrendingUp, DollarSign, Target,
  Activity, Clock, Zap, Shield, ArrowRight, ChevronRight,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   PLATFORM DATA — Intelligence OS Modules
   ═══════════════════════════════════════════════════════════════ */

const PLATFORM_MODULES = [
  { icon: LayoutDashboard, label: "Dashboard Central", href: "/intelligence-os", desc: "Visão geral do ecossistema", color: "#3DF5C5" },
  { icon: BarChart3, label: "Analytics & BI", href: "/intelligence-os/analytics", desc: "MRR, ARR, Churn, LTV, receita, cohort", color: "#60A5FA" },
  { icon: LayoutGrid, label: "Dashboards Customizáveis", href: "/intelligence-os/dashboards", desc: "Widgets arrastáveis com recharts", color: "#C9A227" },
  { icon: Crosshair, label: "Competidores", href: "/intelligence-os/competitors", desc: "SWOT, benchmarking, share of voice", color: "#A78BFA" },
  { icon: Megaphone, label: "Campanhas Ads", href: "/intelligence-os/ads", desc: "Google + Facebook Ads Manager", color: "#F97316" },
  { icon: Users, label: "Clientes", href: "/intelligence-os/clientes", desc: "CRM com pipeline de vendas", color: "#34D399" },
  { icon: Bot, label: "AI Agents", href: "/intelligence-os/agents", desc: "Agentes de IA para automação", color: "#8B5CF6" },
  { icon: Workflow, label: "Automações", href: "/intelligence-os/automacoes", desc: "n8n + Make workflows", color: "#EC4899" },
  { icon: Globe, label: "Site Forge", href: "/intelligence-os/forge", desc: "Construtor de sites com IA", color: "#14B8A6" },
  { icon: Copy, label: "Site Cloner", href: "/intelligence-os/cloner", desc: "Clone qualquer site com IA", color: "#F59E0B" },
  { icon: GitBranch, label: "GitHub Sync", href: "/intelligence-os/github", desc: "Sincronização de repositórios", color: "#6B7280" },
  { icon: BookOpen, label: "Knowledge Base", href: "/intelligence-os/knowledge", desc: "Base de conhecimento inteligente", color: "#3B82F6" },
  { icon: MapPin, label: "Google Maps", href: "/intelligence-os/maps", desc: "My Business + relatórios locais", color: "#10B981" },
  { icon: Sparkles, label: "Google Gemini", href: "/intelligence-os/gemini", desc: "IA generativa do Google", color: "#A855F7" },
  { icon: NotebookPen, label: "NotebookLM", href: "/intelligence-os/notebook", desc: "Pesquisa com IA contextual", color: "#0EA5E9" },
  { icon: AppWindow, label: "Workspace", href: "/intelligence-os/workspace", desc: "Gmail, Drive, Calendar, Meet", color: "#84CC16" },
];

const KPI_DATA = [
  { label: "Receita Total", value: "R$ 847.320", change: "+23.5%", icon: DollarSign, positive: true },
  { label: "Projetos Ativos", value: "47", change: "+8", icon: Activity, positive: true },
  { label: "Clientes", value: "234", change: "+12.8%", icon: Users, positive: true },
  { label: "Automações", value: "156", change: "+31", icon: Zap, positive: true },
  { label: "Tempo Médio", value: "6.2d", change: "-18%", icon: Clock, positive: true },
  { label: "ROI Médio", value: "4.7x", change: "+0.8x", icon: Target, positive: true },
];

const RECENT_ACTIVITY = [
  { action: "Projeto entregue", project: "Rei das Vendas — Automação de vendas", time: "2h atrás", color: "#34D399" },
  { action: "Dashboard atualizado", project: "Intelligence OS — Analytics BI", time: "5h atrás", color: "#60A5FA" },
  { action: "Cliente aprovou", project: "SaúdeGPT — Ficha cadastral multi-step", time: "1d atrás", color: "#C9A227" },
  { action: "Deploy realizado", project: "thiagolab.com — VPS Hostinger", time: "1d atrás", color: "#A78BFA" },
  { action: "Novo módulo", project: "Campanhas Ads — Google + Facebook", time: "2d atrás", color: "#F97316" },
];

/* ═══════════════════════════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════════════════════════ */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};
const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

/* ═══════════════════════════════════════════════════════════════
   KPI CARD
   ═══════════════════════════════════════════════════════════════ */
function KPICard({ label, value, change, icon: Icon, positive }: typeof KPI_DATA[0]) {
  return (
    <motion.div variants={itemAnim}
      className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-4
                 transition-all duration-200 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5">
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
             style={{ background: "rgba(61,245,197,0.08)", color: "#3DF5C5" }}>
          <Icon size={15} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg sm:text-xl font-extrabold text-white tabular-nums">{value}</span>
        <span className={`text-[10px] font-semibold ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODULE CARD
   ═══════════════════════════════════════════════════════════════ */
function ModuleCard({ module }: { module: typeof PLATFORM_MODULES[0] }) {
  return (
    <motion.div variants={itemAnim}>
      <Link
        href={module.href}
        className="group flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.015] p-3.5
                   transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.03]"
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: `${module.color}12`, color: module.color }}>
          <module.icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
              {module.label}
            </span>
            <ChevronRight size={12} className="text-white/20 group-hover:text-white/50 transition-all group-hover:translate-x-0.5 shrink-0" />
          </div>
          <p className="text-[11px] text-white/35 mt-0.5">{module.desc}</p>
        </div>
      </Link>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOME PAGE — Professional CRM Dashboard
   ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Bom dia");
    else if (h < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#050D1A" }}>
      {/* ══════════════════════════════════════════════════════════
          TOP BAR
          ══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-white/[0.04] backdrop-blur-xl"
              style={{ background: "rgba(5,13,26,0.8)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <Zap size={16} className="text-[#050D1A]" />
              </div>
              <div>
                <span className="text-sm font-bold text-white font-['Clash_Display',system-ui,sans-serif]">Thiago Lab</span>
                <span className="hidden sm:inline text-[10px] text-white/30 ml-2 font-medium uppercase tracking-wider">Intelligence OS</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {[
                { label: "Dashboard", href: "/intelligence-os" },
                { label: "Analytics", href: "/intelligence-os/analytics" },
                { label: "Builder", href: "/builder" },
                { label: "IA", href: "/ia" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3 py-1.5 text-xs font-medium text-white/50 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/intelligence-os"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11px] font-bold text-[#050D1A] bg-emerald-400 hover:bg-emerald-300 transition-colors"
              >
                <LayoutDashboard size={13} />
                <span className="hidden sm:inline">Acessar plataforma</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ════════════════════════════════════════════════════════
            GREETING + HEADER
            ════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-['Clash_Display',system-ui,sans-serif]">
            {greeting}, Thiago.
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Intelligence OS — Plataforma de construção de negócios milionários
          </p>
        </motion.div>

        {/* ════════════════════════════════════════════════════════
            KPI ROW — Apple-style metrics
            ════════════════════════════════════════════════════════ */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mb-6 sm:mb-8"
        >
          {KPI_DATA.map((kpi) => (
            <KPICard key={kpi.label} {...kpi} />
          ))}
        </motion.div>

        {/* ════════════════════════════════════════════════════════
            MAIN GRID — Modules + Activity
            ════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Modules — 2/3 width */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between mb-4"
            >
              <h2 className="text-sm font-bold text-white/80">Plataforma</h2>
              <Link
                href="/intelligence-os"
                className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
              >
                Ver todos <ArrowRight size={11} />
              </Link>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              {PLATFORM_MODULES.map((mod) => (
                <ModuleCard key={mod.label} module={mod} />
              ))}
            </motion.div>
          </div>

          {/* Activity Feed — 1/3 width */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between mb-4"
            >
              <h2 className="text-sm font-bold text-white/80">Atividades Recentes</h2>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="space-y-1.5"
            >
              {RECENT_ACTIVITY.map((act, i) => (
                <motion.div
                  key={i}
                  variants={itemAnim}
                  className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-3.5 transition-all duration-200 hover:border-white/[0.08]"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: act.color }} />
                    <span className="text-[11px] font-semibold text-white/60">{act.action}</span>
                  </div>
                  <p className="text-xs text-white/35 ml-3.5 truncate">{act.project}</p>
                  <p className="text-[10px] text-white/20 ml-3.5 mt-0.5">{act.time}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 rounded-xl border border-white/[0.04] bg-gradient-to-br from-emerald-500/[0.03] to-transparent p-4"
            >
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-3">Ações rápidas</h3>
              <div className="space-y-1.5">
                {[
                  { label: "Novo projeto", href: "/builder", icon: Globe },
                  { label: "Analytics completo", href: "/intelligence-os/analytics", icon: BarChart3 },
                  { label: "Dashboard customizado", href: "/intelligence-os/dashboards", icon: LayoutGrid },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/[0.04] transition-all"
                  >
                    <action.icon size={14} className="text-emerald-400/60" />
                    {action.label}
                    <ChevronRight size={11} className="ml-auto text-white/20" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            CTA FOOTER
            ════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 sm:mt-12 rounded-2xl border border-emerald-500/10 bg-gradient-to-r from-emerald-500/[0.04] to-transparent p-6 sm:p-8 text-center"
        >
          <h2 className="text-lg sm:text-xl font-bold text-white font-['Clash_Display',system-ui,sans-serif]">
            Pronto para construir seu próximo projeto milionário?
          </h2>
          <p className="text-sm text-white/40 mt-2 max-w-lg mx-auto">
            Intelligence OS tem tudo que você precisa — do briefing ao deploy em produção.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/intelligence-os"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-emerald-400 text-[#050D1A] text-sm font-bold hover:bg-emerald-300 transition-all"
            >
              <LayoutDashboard size={15} />
              Acessar Intelligence OS
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl border border-white/15 text-white/60 text-sm font-medium hover:text-white hover:border-white/30 transition-all"
            >
              <Globe size={15} />
              Criar novo projeto
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
