"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import GridLayout, { Responsive, type Layout, type LayoutItem } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { LayoutDashboard, Plus, Save, RotateCcw, X, LayoutGrid as LayoutGridIcon } from "lucide-react";

import { WidgetWrapper } from "@/components/dashboard/WidgetWrapper";
import { RevenueWidget } from "@/components/dashboard/RevenueWidget";
import { LeadsWidget } from "@/components/dashboard/LeadsWidget";
import { ActivityWidget } from "@/components/dashboard/ActivityWidget";
import { PipelineWidget } from "@/components/dashboard/PipelineWidget";
import { TasksWidget } from "@/components/dashboard/TasksWidget";
import { AnalyticsWidget } from "@/components/dashboard/AnalyticsWidget";
import { AIInsightsWidget } from "@/components/dashboard/AIInsightsWidget";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";

// ── Widget registry ────────────────────────────────────────────────────────

interface WidgetMeta {
  key: string;
  title: string;
  subtitle: string;
  defaultW: number;
  defaultH: number;
  component: React.FC;
}

const WIDGET_REGISTRY: WidgetMeta[] = [
  { key: "revenue",    title: "Receita",          subtitle: "Receita mensal",       defaultW: 4, defaultH: 4, component: RevenueWidget },
  { key: "leads",      title: "Leads por Canal",  subtitle: "Distribuição de leads",defaultW: 3, defaultH: 4, component: LeadsWidget },
  { key: "activity",   title: "Atividade Recente", subtitle: "Timeline em tempo real",defaultW: 4, defaultH: 5, component: ActivityWidget },
  { key: "pipeline",   title: "Pipeline",         subtitle: "Progresso do funil",   defaultW: 3, defaultH: 4, component: PipelineWidget },
  { key: "tasks",      title: "Tarefas",          subtitle: "Checklist do dia",     defaultW: 3, defaultH: 4, component: TasksWidget },
  { key: "analytics",  title: "Analytics",        subtitle: "Métricas rápidas",     defaultW: 3, defaultH: 3, component: AnalyticsWidget },
  { key: "aiinsights", title: "Insights IA",      subtitle: "Análise inteligente",  defaultW: 3, defaultH: 4, component: AIInsightsWidget },
  { key: "weather",    title: "Clima",            subtitle: "São Paulo, SP",        defaultW: 2, defaultH: 4, component: WeatherWidget },
];

const STORAGE_KEY = "intelligence-os-dashboard-layout";

// ── Default layout ─────────────────────────────────────────────────────────

function getDefaultLayout(): LayoutItem[] {
  return [
    { i: "revenue",    x: 0,  y: 0,  w: 4, h: 4, minW: 2, minH: 3 },
    { i: "leads",      x: 4,  y: 0,  w: 3, h: 4, minW: 2, minH: 3 },
    { i: "analytics",  x: 7,  y: 0,  w: 3, h: 3, minW: 2, minH: 2 },
    { i: "activity",   x: 0,  y: 4,  w: 4, h: 5, minW: 2, minH: 3 },
    { i: "pipeline",   x: 4,  y: 4,  w: 3, h: 4, minW: 2, minH: 3 },
    { i: "tasks",      x: 7,  y: 3,  w: 3, h: 4, minW: 2, minH: 3 },
    { i: "aiinsights", x: 0,  y: 9,  w: 3, h: 4, minW: 2, minH: 3 },
    { i: "weather",    x: 3,  y: 9,  w: 2, h: 4, minW: 2, minH: 3 },
  ];
}

// ── Mobile layout (stacked, static) ────────────────────────────────────────

function getMobileLayout(): LayoutItem[] {
  return [
    { i: "revenue",    x: 0, y: 0,  w: 1, h: 3, static: true },
    { i: "leads",      x: 0, y: 3,  w: 1, h: 3, static: true },
    { i: "analytics",  x: 0, y: 6,  w: 1, h: 3, static: true },
    { i: "activity",   x: 0, y: 9,  w: 1, h: 4, static: true },
    { i: "pipeline",   x: 0, y: 13, w: 1, h: 3, static: true },
    { i: "tasks",      x: 0, y: 16, w: 1, h: 3, static: true },
    { i: "aiinsights", x: 0, y: 19, w: 1, h: 3, static: true },
    { i: "weather",    x: 0, y: 22, w: 1, h: 3, static: true },
  ];
}

// ── Breakpoints ────────────────────────────────────────────────────────────

const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const COLS = { lg: 12, md: 10, sm: 6, xs: 2, xxs: 1 };

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARDS PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function DashboardsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setLayout(parsed.layout);
        setActiveKeys(parsed.keys);
        return;
      }
    } catch {
      // corrupted data — fall through
    }
    // Default
    setLayout(getDefaultLayout());
    setActiveKeys(WIDGET_REGISTRY.map((w) => w.key));
  }, []);

  // ── toast helper ──────────────────────────────────────────────────────────
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // ── Save layout ───────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ layout, keys: activeKeys })
    );
    showToast("Layout salvo com sucesso!");
  }, [layout, activeKeys, showToast]);

  // ── Reset layout ──────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setLayout(getDefaultLayout());
    setActiveKeys(WIDGET_REGISTRY.map((w) => w.key));
    showToast("Layout restaurado para o padrão");
  }, [showToast]);

  // ── Add widget ────────────────────────────────────────────────────────────
  const handleAddWidget = useCallback(
    (key: string) => {
      const meta = WIDGET_REGISTRY.find((w) => w.key === key);
      if (!meta) return;

      // Find free position
      const existing = layout.filter((l) => activeKeys.includes(l.i));
      const maxY = existing.reduce((m, l) => Math.max(m, l.y + l.h), 0);

      setActiveKeys((prev) => [...prev, key]);
      setLayout((prev) => [
        ...prev,
        {
          i: key,
          x: 0,
          y: maxY,
          w: meta.defaultW,
          h: meta.defaultH,
          minW: 2,
          minH: 3,
        },
      ]);
      setShowModal(false);
    },
    [layout, activeKeys]
  );

  // ── Remove widget ─────────────────────────────────────────────────────────
  const handleRemoveWidget = useCallback((key: string) => {
    setActiveKeys((prev) => prev.filter((k) => k !== key));
  }, []);

  // ── Layout change ─────────────────────────────────────────────────────────
  const handleLayoutChange = useCallback((newLayout: Layout) => {
    setLayout([...newLayout]);
  }, []);

  // ── Determine available widgets (not yet added) ───────────────────────────
  const availableWidgets = WIDGET_REGISTRY.filter(
    (w) => !activeKeys.includes(w.key)
  );

  // Don't render grid until we've loaded from localStorage
  if (!mounted) {
    return (
      <div className="p-4 lg:p-6 min-h-full nexus-grid-bg">
        <div className="flex items-center justify-center h-64">
          <div className="spinner-accent" />
        </div>
      </div>
    );
  }

  const currentLayout = layout.filter((l) => activeKeys.includes(l.i));

  return (
    <div className="p-4 lg:p-6 min-h-full nexus-grid-bg">
      {/* ── Toast ──────────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed top-4 right-4 z-[60] nexus-card px-4 py-3 shadow-ios-modal animate-fade-in-down">
          <p className="text-sm text-[#E8EDF2]">{toast}</p>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="nexus-section-title text-2xl">Dashboards</h1>
          <p className="nexus-section-subtitle mt-1">
            Arraste e personalize seus widgets em tempo real
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="nexus-btn-outline"
          >
            <Plus size={16} />
            Adicionar Widget
          </button>
          <button onClick={handleSave} className="nexus-btn-primary">
            <Save size={16} />
            Salvar Layout
          </button>
          <button
            onClick={handleReset}
            className="nexus-btn-outline"
            title="Resetar layout"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* ── Empty state ────────────────────────────────────────────────── */}
      {currentLayout.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 nexus-card p-8">
          <LayoutDashboard size={48} className="text-[#6B7280] mb-4" />
          <h3 className="text-lg font-semibold text-[#E8EDF2] mb-2">
            Nenhum widget adicionado
          </h3>
          <p className="text-sm text-[#6B7280] mb-4 text-center max-w-sm">
            Clique em &quot;Adicionar Widget&quot; para começar a montar seu
            dashboard personalizado.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="nexus-btn-primary"
          >
            <Plus size={16} />
            Adicionar Widget
          </button>
        </div>
      )}

      {/* ── Grid ────────────────────────────────────────────────────────── */}
      {currentLayout.length > 0 && (
        <Responsive
          className="layout"
          layouts={{ lg: currentLayout as LayoutItem[] }}
          breakpoints={BREAKPOINTS}
          cols={COLS}
          rowHeight={80}
          margin={[16, 16]}
          containerPadding={[0, 0]}
          dragConfig={{ enabled: true, handle: ".react-grid-drag-handle" }}
          resizeConfig={{ enabled: true }}
          onLayoutChange={handleLayoutChange}
          autoSize={true}
          width={containerRef.current?.offsetWidth || 1200}
        >
          {currentLayout.map((item) => {
            const meta = WIDGET_REGISTRY.find((w) => w.key === item.i);
            if (!meta) return null;
            const WidgetComponent = meta.component;
            return (
              <div key={item.i}>
                <WidgetWrapper
                  id={item.i}
                  title={meta.title}
                  subtitle={meta.subtitle}
                  onRemove={handleRemoveWidget}
                >
                  <WidgetComponent />
                </WidgetWrapper>
              </div>
            );
          })}
        </Responsive>
      )}

      {/* ── Modal de Adicionar Widget ──────────────────────────────────── */}
      {showModal && (
        <div
          className="nexus-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="nexus-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[#E8EDF2]">
                  Adicionar Widget
                </h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Escolha um widget para adicionar ao dashboard
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-md text-[#6B7280] hover:text-[#E8EDF2] hover:bg-[rgba(201,162,39,0.06)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Widget list */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {availableWidgets.length === 0 ? (
                <p className="text-sm text-[#6B7280] text-center py-8">
                  Todos os widgets já estão no dashboard.
                </p>
              ) : (
                availableWidgets.map((widget) => (
                  <button
                    key={widget.key}
                    onClick={() => handleAddWidget(widget.key)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-[rgba(201,162,39,0.08)] hover:border-[rgba(201,162,39,0.25)] hover:bg-[rgba(201,162,39,0.04)] transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.06)] flex items-center justify-center flex-shrink-0">
                      <LayoutGridIcon size={14} className="text-[#C9A227]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#E8EDF2]">
                        {widget.title}
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        {widget.subtitle}
                      </p>
                    </div>
                    <Plus
                      size={16}
                      className="text-[#6B7280] group-hover:text-[#C9A227] transition-colors flex-shrink-0"
                    />
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-[rgba(201,162,39,0.06)]">
              <p className="text-[10px] text-[#6B7280]">
                Widgets adicionados aparecem no final do dashboard. Arraste para
                reposicionar.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
