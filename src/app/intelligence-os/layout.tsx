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
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  LayoutGrid,
  NotebookPen,
  AppWindow,
  MapPin,
  Copy,
  BarChart3,
  Crosshair,
  Megaphone,
} from "lucide-react";

/* -- Navegação ------------------------------------------------------------ */
const NAV_ITEMS = [
  { label: "Dashboard",   icon: LayoutDashboard, href: "/intelligence-os" },
  { label: "Analytics",   icon: BarChart3, href: "/intelligence-os/analytics" },
  { label: "Dashboards Customizáveis", icon: LayoutGrid, href: "/intelligence-os/dashboards" },
  { label: "Competidores", icon: Crosshair, href: "/intelligence-os/competitors" },
  { label: "Campanhas Ads", icon: Megaphone, href: "/intelligence-os/ads" },
  { label: "Pipelines",   icon: KanbanSquare, href: "/intelligence-os/pipelines" },
  { label: "Clientes",    icon: Users, href: "/intelligence-os/clientes" },
  { label: "AI Agents",   icon: Bot, href: "/intelligence-os/agents" },
  { label: "Automações",  icon: Workflow, href: "/intelligence-os/automacoes" },
  { label: "Site Forge",  icon: Globe, href: "/intelligence-os/forge" },
  { label: "Site Cloner", icon: Copy, href: "/intelligence-os/cloner" },
  { label: "Repositórios",icon: Globe, href: "/intelligence-os/repos" },
  { label: "GitHub Sync", icon: GitBranch, href: "/intelligence-os/github" },
  { label: "Knowledge",   icon: BookOpen, href: "/intelligence-os/knowledge" },
  { label: "Google Drive",icon: HardDrive, href: "/intelligence-os/drive" },
  { label: "Email",       icon: Mail, href: "/intelligence-os/email" },
  { label: "Gemini",      icon: Sparkles, href: "/intelligence-os/gemini" },
  { label: "NotebookLM",  icon: NotebookPen, href: "/intelligence-os/notebook" },
  { label: "Workspace",   icon: AppWindow, href: "/intelligence-os/workspace" },
  { label: "Google Maps", icon: MapPin, href: "/intelligence-os/maps" },
];

/* -- Status Badge ---------------------------------------------------------- */
function StatusBadge() {
  return (
    <span className="intelligence-os-badge">
      <span className="intelligence-os-status-dot active" style={{ width: 6, height: 6 }} />
      Online
    </span>
  );
}

/* --- Recents (placeholder) ----------------------------------------------- */
const RECENT_PAGES = [
  { label: "Analytics",    href: "/intelligence-os/analytics" },
  { label: "Campanhas Ads", href: "/intelligence-os/ads" },
  { label: "Competidores", href: "/intelligence-os/competitors" },
  { label: "Google Maps",  href: "/intelligence-os/maps" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   Intelligence OS LAYOUT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function IntelligenceOSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [searchOpen, setSearchOpen] = useState(false);

  /* -- Detect Viewport --------------------------------------------------- */
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w < 768) setViewport("mobile");
      else if (w < 1024) setViewport("tablet");
      else setViewport("desktop");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* -- Auto-collapse sidebar on tablet ----------------------------------- */
  useEffect(() => {
    if (viewport === "tablet") setCollapsed(true);
  }, [viewport]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const isActive = (href: string) => {
    if (href === "/intelligence-os") return pathname === "/intelligence-os";
    return pathname.startsWith(href);
  };

  const isCollapsed = viewport === "tablet" ? true : collapsed;

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "#050D1A" }}>
      {/* -- Overlay Mobile ----------------------------------------------- */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={closeMobile}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════
          SIDEBAR
          ══════════════════════════════════════════════════════════════════ */}
      <aside
        className={`
          fixed lg:relative z-50 h-full flex flex-col
          transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-[68px]" : "lg:w-[240px]"}
          ${viewport === "tablet" ? "w-[68px]" : ""}
          bg-[#050D1A] border-r border-[rgba(201,162,39,0.1)]
        `}
      >
        {/* -- Logo -------------------------------------------------------- */}
        <div className="flex items-center h-16 px-4 border-b border-[rgba(201,162,39,0.08)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A227] to-[#B8911E] flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} className="text-[#050D1A]" />
            </div>
            {!isCollapsed && (
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
          {/* Close button on mobile */}
          {mobileOpen && (
            <button
              onClick={closeMobile}
              className="ml-auto p-1 text-[#6B7280] hover:text-[#E8EDF2] rounded transition-colors lg:hidden"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* -- Navigation -------------------------------------------------- */}
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
                  ${isCollapsed ? "justify-center" : ""}
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon size={18} className="flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* -- Recents ---------------------------------------------------- */}
        {!isCollapsed && (
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

        {/* -- Footer ------------------------------------------------------ */}
        <div className={`px-2 py-3 border-t border-[rgba(201,162,39,0.06)] ${isCollapsed ? "flex flex-col items-center gap-2" : ""}`}>
          <button
            onClick={() => setCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-full gap-2 px-3 py-2 text-xs text-[#6B7280] hover:text-[#E8EDF2] rounded-lg hover:bg-[rgba(201,162,39,0.04)] transition-colors"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={14} /> Recolher</>}
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════
          MAIN CONTENT
          ══════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* -- Top Bar ---------------------------------------------------- */}
        <header className="intelligence-os-glass h-16 flex items-center justify-between px-4 lg:px-6 border-b border-[rgba(201,162,39,0.06)] flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger - visible on mobile/tablet */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex lg:hidden p-2 text-[#6B7280] hover:text-[#E8EDF2] rounded-lg hover:bg-[rgba(201,162,39,0.04)]"
            >
              <Menu size={20} />
            </button>

            {/* Search - hidden on mobile unless toggled, shown on tablet/desktop */}
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
            {/* Search toggle for mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="sm:hidden p-2 text-[#6B7280] hover:text-[#E8EDF2] rounded-lg hover:bg-[rgba(201,162,39,0.04)] transition-colors"
            >
              <Search size={18} />
            </button>

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

        {/* -- Mobile Search Bar (shown when toggled) -------------------- */}
        {searchOpen && (
          <div className="sm:hidden px-4 py-3 bg-[#050D1A] border-b border-[rgba(201,162,39,0.06)]">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Buscar leads, clientes, automações..."
                className="intelligence-os-input w-full pl-9 pr-3 py-2 text-sm"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* -- Page Content ----------------------------------------------- */}
        <main className="flex-1 overflow-y-auto intelligence-os-scrollbar">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
