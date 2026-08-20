import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useTheme } from "@/hooks/useTheme";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Zap, LayoutDashboard, Users, GitBranch, FolderKanban, BookOpen,
  MessageCircle, Mail, Calendar, Sparkles, Globe, Settings, Menu,
  ChevronLeft, ChevronRight, FileText, Workflow, Search, Rocket,
  GraduationCap, Filter, Moon, Sun, Database, Bot, Activity
} from "lucide-react";

const navSections = [
  { label: "Principal", items: [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/projetos", label: "Projetos", icon: FolderKanban },
    { path: "/docs", label: "Docs & Wiki", icon: BookOpen },
    { path: "/tarefas", label: "Tarefas", icon: FileText },
    { path: "/notion", label: "Notion", icon: Database },
  ]},
  { label: "Negocio", items: [
    { path: "/crm", label: "CRM / Leads", icon: Users },
    { path: "/pipeline", label: "Pipeline", icon: GitBranch },
    { path: "/funis", label: "Funis", icon: Filter },
    { path: "/cursos", label: "Cursos", icon: GraduationCap },
    { path: "/comunidades", label: "Comunidades", icon: MessageCircle },
    { path: "/campanhas", label: "Campanhas", icon: Mail },
    { path: "/agenda", label: "Agenda", icon: Calendar },
  ]},
  { label: "Inteligencia", items: [
    { path: "/automacoes", label: "Automacoes", icon: Workflow },
    { path: "/pesquisa", label: "Pesquisa", icon: Search },
    { path: "/ia", label: "AI Studio", icon: Sparkles },
    { path: "/sites", label: "Sites", icon: Globe },
    { path: "/templates", label: "Monetizacao", icon: Rocket },
  ]},
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { toggle, isDark } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const NavItems = () => (
    <>
      {navSections.map((section) => (
        <div key={section.label} className="mb-1">
          {!collapsed && <p className="px-4 py-1.5 text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{section.label}</p>}
          {section.items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 mx-2 rounded-lg text-[13px] transition-all ${active ? "font-medium" : "hover:opacity-80"} ${collapsed ? 'justify-center px-2' : ''}`}
                style={active ? { background: 'var(--accent)15', color: 'var(--accent)' } : { color: 'var(--text-secondary)' }}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      ))}
    </>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-secondary)' }}>
      <div className={`flex items-center gap-3 px-4 h-14 border-b shrink-0 ${collapsed ? 'justify-center' : ''}`} style={{ borderColor: 'var(--border)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--accent)' }}>
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <>
            <span className="font-bold text-sm tracking-tight flex-1 truncate" style={{ color: 'var(--text)' }}>HERMES OS</span>
            <button onClick={() => setCollapsed(true)} className="hidden lg:block transition-colors" style={{ color: 'var(--text-muted)' }}>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        )}
        {collapsed && (
          <button onClick={() => setCollapsed(false)} className="hidden lg:flex transition-colors absolute left-full ml-2 top-4 rounded-full p-1 z-50" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {!collapsed ? (
        <div className="px-4 py-2.5 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--accent)15' }}>
            <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>T</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>Thiago Piola</p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Administrador</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="Hermes Online" />
          </div>
        </div>
      ) : (
        <div className="flex justify-center py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)15' }}>
            <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>T</span>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2">
        <NavItems />
      </nav>

      {!collapsed && (
        <div className="px-4 py-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: '#00ff8808', border: '1px solid #00ff8820' }}>
            <Bot className="w-3.5 h-3.5" style={{ color: '#00ff88' }} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium" style={{ color: '#00ff88' }}>Hermes Online</p>
              <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>DeepSeek V4 Pro</p>
            </div>
            <Activity className="w-3 h-3" style={{ color: '#00ff88' }} />
          </div>
        </div>
      )}

      <div className="border-t p-2 shrink-0" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={toggle}
          className="flex items-center gap-3 px-3 py-2 mx-2 rounded-lg text-[13px] w-full transition-all hover:opacity-80"
          style={{ color: 'var(--text-secondary)' }}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {!collapsed && <span>{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>}
        </button>
        <Link
          to="/config"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-2 mx-2 rounded-lg text-[13px] transition-all hover:opacity-80"
          style={isActive('/config') ? { background: 'var(--accent)15', color: 'var(--accent)' } : { color: 'var(--text-secondary)' }}
        >
          <Settings className="w-4 h-4" />
          {!collapsed && <span>Configuracoes</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-12 backdrop-blur border-b flex items-center px-3 gap-3" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button className="shrink-0 h-8 w-8 flex items-center justify-center" style={{ color: 'var(--text)' }}>
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] p-0 border-r-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight" style={{ color: 'var(--text)' }}>HERMES OS</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <button onClick={toggle} className="h-8 w-8 flex items-center justify-center" style={{ color: 'var(--text-secondary)' }}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen border-r z-40 transition-all duration-300 ${collapsed ? "w-[56px]" : "w-[220px]"}`} style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        {sidebarContent}
      </aside>

      <main className={`flex-1 min-w-0 transition-all duration-300 ${collapsed ? "lg:ml-[56px]" : "lg:ml-[220px]"}`}>
        <div className="pt-12 lg:pt-0">{children}</div>
      </main>
    </div>
  );
            }
