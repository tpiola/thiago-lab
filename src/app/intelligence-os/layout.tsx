"use client";

import { useState, useCallback, useEffect } from "react";
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
  Sparkles,
  LayoutGrid,
  NotebookPen,
  AppWindow,
  MapPin,
  Copy,
  BarChart3,
  Crosshair,
  Megaphone,
  Zap,
  FileText,
  Hammer,
} from "lucide-react";

/* ── Grupos de navegação ─────────────────────────────────────────────────── */
const NAV_GROUPS = [
  {
    label: "Principal",
    items: [
      { label: "Dashboard",              icon: LayoutDashboard, href: "/intelligence-os" },
      { label: "Analytics",              icon: BarChart3,       href: "/intelligence-os/analytics" },
      { label: "Dashboards Customizáveis",icon: LayoutGrid,     href: "/intelligence-os/dashboards" },
    ],
  },
  {
    label: "CRM & Vendas",
    items: [
      { label: "Pipelines",    icon: KanbanSquare, href: "/intelligence-os/pipelines" },
      { label: "Clientes",     icon: Users,        href: "/intelligence-os/clientes" },
      { label: "Competidores", icon: Crosshair,    href: "/intelligence-os/competitors" },
      { label: "Campanhas Ads",icon: Megaphone,    href: "/intelligence-os/ads" },
    ],
  },
  {
    label: "IA & Automação",
    items: [
      { label: "Agentes Hermes", icon: Bot,      href: "/intelligence-os/agents" },
      { label: "Automações",     icon: Workflow, href: "/intelligence-os/automacoes" },
      { label: "Gemini AI",      icon: Sparkles, href: "/intelligence-os/gemini" },
    ],
  },
  {
    label: "Produção",
    items: [
      { label: "Site Forge",   icon: Globe,     href: "/intelligence-os/forge" },
      { label: "Site Cloner",  icon: Copy,      href: "/intelligence-os/cloner" },
      { label: "AI Builder",   icon: Hammer,    href: "/ai-builder" },
      { label: "Templates",    icon: FileText,  href: "/templates" },
    ],
  },
  {
    label: "Conhecimento",
    items: [
      { label: "Knowledge / Notion", icon: BookOpen,    href: "/intelligence-os/knowledge" },
      { label: "NotebookLM",         icon: NotebookPen, href: "/intelligence-os/notebook" },
      { label: "Google Drive",       icon: HardDrive,   href: "/intelligence-os/drive" },
    ],
  },
  {
    label: "Dev & Infra",
    items: [
      { label: "Repositórios", icon: Globe,      href: "/intelligence-os/repos" },
      { label: "GitHub Sync",  icon: GitBranch,  href: "/intelligence-os/github" },
      { label: "Google Maps",  icon: MapPin,     href: "/intelligence-os/maps" },
      { label: "Email",        icon: Mail,       href: "/intelligence-os/email" },
      { label: "Workspace",    icon: AppWindow,  href: "/intelligence-os/workspace" },
    ],
  },
];

/* Flat list for collapsed sidebar */
const NAV_FLAT = NAV_GROUPS.flatMap(g => g.items);

/* ── Agent Status Indicator ─────────────────────────────────────────────── */
function HermesStatus() {
  const [sessions, setSessions] = useState(2401);
  useEffect(() => {
    const interval = setInterval(() => {
      setSessions(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="px-3 py-2 mx-2 mb-2 rounded-lg bg-[rgba(201,162,39,0.06)] border border-[rgba(201,162,39,0.1)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[10px] font-semibold text-[#C9A227] uppercase tracking-wider">Hermes</span>
        </div>
        <span className="text-[10px] text-[#10B981] font-bold">{sessions.toLocaleString()}</span>
      </div>
      <div className="text-[9px] text-[#4B5563] mt-0.5">sessões ativas agora</div>
    </div>
  );
}

/* ── Recents ─────────────────────────────────────────────────────────────── */
const RECENT_PAGES = [
  { label: "Analytics",    href: "/intelligence-os/analytics" },
  { label: "Campanhas Ads",href: "/intelligence-os/ads" },
  { label: "Competidores", href: "/intelligence-os/competitors" },
  { label: "Google Maps",  href: "/intelligence-os/maps" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   Intelligence OS LAYOUT
═══════════════════════════════════════════════════════════════════════════ */
export default function IntelligenceOSLayout({ children }: { children: React.ReactNode }) {
  const pathname    = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [viewport, setViewport]   = useState<"mobile"|"tablet"|"desktop">("desktop");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w < 768)       setViewport("mobile");
      else if (w < 1024) setViewport("tablet");
      else               setViewport("desktop");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (viewport === "tablet") setCollapsed(true);
  }, [viewport]);

  const closeMobile  = useCallback(() => setMobileOpen(false), []);
  const isCollapsed  = viewport === "tablet" ? true : collapsed;

  const isActive = (href: string) => {
    if (href === "/intelligence-os") return pathname === "/intelligence-os";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "#050D1A" }}>
      {/* Overlay Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={closeMobile} />
      )}

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside
        className={`
          fixed lg:relative z-50 h-full flex flex-col
          transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-[68px]" : "lg:w-[250px]"}
          ${viewport === "tablet" ? "w-[68px]" : ""}
          bg-[#050D1A] border-r border-[rgba(201,162,39,0.1)]
        `}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-[rgba(201,162,39,0.08)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A227] to-[#B8911E] flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(201,162,39,0.4)]">
              <Zap size={16} className="text-[#050D1A]" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="text-sm font-bold text-[#E8EDF2] font-['Clash_Display',system-ui,sans-serif] leading-tight">
                  Hermes OS
                </div>
                <div className="text-[10px] text-[#6B7280] font-medium tracking-wider uppercase">
                  Intelligence Suite
                </div>
              </div>
            )}
          </div>
          {mobileOpen && (
            <button onClick={closeMobile} className="ml-auto p-1 text-[#6B7280] hover:text-[#E8EDF2] rounded transition-colors lg:hidden">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Hermes Status */}
        {!isCollapsed && <div className="mt-3"><HermesStatus /></div>}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 intelligence-os-scrollbar">
          {isCollapsed ? (
            /* Collapsed: flat icons only */
            <div className="space-y-1">
              {NAV_FLAT.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMobile}
                    title={item.label}
                    className={`
                      flex items-center justify-center p-2.5 rounded-lg transition-all duration-200
                      ${active
                        ? "bg-[rgba(201,162,39,0.1)] text-[#C9A227] border border-[rgba(201,162,39,0.15)]"
                        : "text-[#6B7280] hover:text-[#E8EDF2] hover:bg-[rgba(201,162,39,0.04)] border border-transparent"
                      }
                    `}
                  >
                    <item.icon size={18} className="flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Expanded: grouped */
            <div className="space-y-4">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <div className="text-[9px] font-semibold uppercase tracking-widest text-[#4B5563] px-3 mb-1">
                    {group.label}
                  </div>
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={closeMobile}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                          transition-all duration-200
                          ${active
                            ? "bg-[rgba(201,162,39,0.1)] text-[#C9A227] border border-[rgba(201,162,39,0.15)]"
                            : "text-[#6B7280] hover:text-[#E8EDF2] hover:bg-[rgba(201,162,39,0.04)] border border-transparent"
                          }
                        `}
                      >
                        <item.icon size={16} className="flex-shrink-0" />
                        <span className="truncate text-xs">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* Recents */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-t border-[rgba(201,162,39,0.06)]">
            <div className="text-[9px] font-semibold uppercase tracking-widest text-[#4B5563] mb-1">
              Recentes
            </div>
            {RECENT_PAGES.map((r) => (
              <Link
                key={r.label}
                href={r.href}
                onClick={closeMobile}
                className="block px-2 py-1 text-[11px] text-[#6B7280] hover:text-[#E8EDF2] rounded transition-colors"
              >
                {r.label}
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className={`px-2 py-3 border-t border-[rgba(201,162,39,0.06)] ${isCollapsed ? "flex flex-col items-center" : ""}`}>
          <button
            onClick={() => setCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-full gap-2 px-3 py-2 text-xs text-[#6B7280] hover:text-[#E8EDF2] rounded-lg hover:bg-[rgba(201,162,39,0.04)] transition-colors"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={14} /> Recolher</>}
          </button>
        </div>
      </aside>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="intelligence-os-glass h-16 flex items-center justify-between px-4 lg:px-6 border-b border-[rgba(201,162,39,0.06)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex lg:hidden p-2 text-[#6B7280] hover:text-[#E8EDF2] rounded-lg hover:bg-[rgba(201,162,39,0.04)]"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Buscar leads, clientes, automações..."
                className="intelligence-os-input w-48 lg:w-72 xl:w-80 pl-9 pr-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="sm:hidden p-2 text-[#6B7280] hover:text-[#E8EDF2] rounded-lg hover:bg-[rgba(201,162,39,0.04)] transition-colors">
              <Search size={18} />
            </button>
            <span className="intelligence-os-badge flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Online
            </span>
            <button className="p-2 text-[#6B7280] hover:text-[#E8EDF2] rounded-lg hover:bg-[rgba(201,162,39,0.04)] transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C9A227]" />
            </button>
            <div className="w-px h-6 bg-[rgba(201,162,39,0.08)]" />
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

        {/* Mobile Search */}
        {searchOpen && (
          <div className="sm:hidden px-4 py-3 bg-[#050D1A] border-b border-[rgba(201,162,39,0.06)]">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input type="text" placeholder="Buscar..." className="intelligence-os-input w-full pl-9 pr-3 py-2 text-sm" autoFocus />
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto intelligence-os-scrollbar">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
