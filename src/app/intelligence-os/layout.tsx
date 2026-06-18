"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  Bot,
  Workflow,
  Globe,
  GitBranch,
  BookOpen,
  HardDrive,
  Mail,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  LayoutGrid,
  NotebookPen,
  AppWindow,
} from "lucide-react";

/* ── Navegação ──────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Dashboard",   icon: LayoutDashboard, href: "/intelligence-os" },
  { label: "Dashboards Customizáveis", icon: LayoutGrid, href: "/intelligence-os/dashboards" },
  { label: "Pipelines",   icon: KanbanSquare, href: "/intelligence-os/pipelines" },
  { label: "Clientes",    icon: Users, href: "/intelligence-os/clientes" },
  { label: "AI Agents",   icon: Bot, href: "/intelligence-os/agents" },
  { label: "Automações",  icon: Workflow, href: "/intelligence-os/automacoes" },
  { label: "Site Forge",  icon: Globe, href: "/intelligence-os/forge" },
  { label: "GitHub Sync", icon: GitBranch, href: "/intelligence-os/github" },
  { label: "Knowledge",   icon: BookOpen, href: "/intelligence-os/knowledge" },
  { label: "Google Drive",icon: HardDrive, href: "/intelligence-os/drive" },
  { label: "Email",       icon: Mail, href: "/intelligence-os/email" },
  { label: "Gemini",      icon: Sparkles, href: "/intelligence-os/gemini" },
  { label: "NotebookLM",  icon: NotebookPen, href: "/intelligence-os/notebook" },
  { label: "Workspace",   icon: AppWindow, href: "/intelligence-os/workspace" },
];

/* ── Status Badge ────────────────────────────────────────────────────────── */
function StatusBadge() {
  return (
    <span className="intelligence-os-badge">
      <span className="intelligence-os-status-dot active" style={{ width: 6, height: 6 }} />
      Online
    </span>
  );
}

/* ─── Recents (placeholder) ─────────────────────────────────────────────── */
const RECENT_PAGES = [
  { label: "Pipeline Vendas", href: "/intelligence-os/pipelines" },
  { label: "Clientes Ativos", href: "/intelligence-os/clientes" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   Intelligence OS LAYOUT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function IntelligenceOSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const isActive = (href: string) => {
    if (href === "/intelligence-os") return pathname === "/intelligence-os";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "#050D1A" }}>
      {/* ── Overlay Mobile ─────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════
          SIDEBAR
          ══════════════════════════════════════════════════════════════════ */}
      <aside
        className={`
          fixed md:relative z-50 h-full flex flex-col
          transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${collapsed ? "md:w-[68px]" : "md:w-[240px]"}
          bg-[#050D1A] border-r border-[rgba(201,162,39,0.1)]
        `}
      >
        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <div className="flex items-center h-16 px-4 border-b border-[rgba(201,162,39,0.08)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A227] to-[#B8911E] flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} className="text-[#050D1A]" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="text-sm font-semibold text-[#E8EDF2] font-['Clash_Display',system-ui,sans-serif] leading-tight">
                  Intelligence OS
                </div>
                <div className="text-[10px] text-[#6B7280] font-medium tracking-wider uppercase">
                  Omni CRM
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Navigation ────────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 intelligence-os-scrollbar space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMobile}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${active
                    ? "bg-[rgba(201,162,39,0.1)] text-[#C9A227] border border-[rgba(201,162,39,0.15)]"
                    : "text-[#6B7280] hover:text-[#E8EDF2] hover:bg-[rgba(201,162,39,0.04)] border border-transparent"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={18} className="flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* ── Recents ──────────────────────────────────────────────────── */}
        {!collapsed && (
          <div className="px-4 py-3 border-t border-[rgba(201,162,39,0.06)]">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[#6B7280] mb-2">
              Recentes
            </div>
            {RECENT_PAGES.map((r) => (
              <Link
                key={r.label}
                href={r.href}
                onClick={closeMobile}
                className="block px-2 py-1.5 text-xs text-[#6B7280] hover:text-[#E8EDF2] rounded transition-colors"
              >
                {r.label}
              </Link>
            ))}
          </div>
        )}

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <div className={`px-2 py-3 border-t border-[rgba(201,162,39,0.06)] ${collapsed ? "flex flex-col items-center gap-2" : ""}`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center w-full gap-2 px-3 py-2 text-xs text-[#6B7280] hover:text-[#E8EDF2] rounded-lg hover:bg-[rgba(201,162,39,0.04)] transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={14} /> Recolher</>}
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════
          MAIN CONTENT
          ══════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Top Bar ──────────────────────────────────────────────────── */}
        <header className="intelligence-os-glass h-16 flex items-center justify-between px-4 lg:px-6 border-b border-[rgba(201,162,39,0.06)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-[#6B7280] hover:text-[#E8EDF2] rounded-lg hover:bg-[rgba(201,162,39,0.04)]"
            >
              <Menu size={20} />
            </button>

            {/* Search */}
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Buscar leads, clientes, automações..."
                className="intelligence-os-input w-64 lg:w-80 pl-9 pr-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <StatusBadge />

            <button className="p-2 text-[#6B7280] hover:text-[#E8EDF2] rounded-lg hover:bg-[rgba(201,162,39,0.04)] transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C9A227]" />
            </button>

            <div className="w-px h-6 bg-[rgba(201,162,39,0.08)]" />

            {/* User */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A227]/30 to-[#B8911E]/20 border border-[rgba(201,162,39,0.15)] flex items-center justify-center text-xs font-semibold text-[#C9A227]">
                TL
              </div>
              <div className="hidden lg:block">
                <div className="text-sm font-medium text-[#E8EDF2] leading-tight">Thiago</div>
                <div className="text-[10px] text-[#6B7280]">Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Page Content ─────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto intelligence-os-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
