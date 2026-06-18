"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Plus,
  TrendingUp,
  DollarSign,
  Eye,
  MousePointerClick,
  Target,
  PieChart,
  Sliders,
  Search,
  Users,
  Image,
  X,
  ChevronDown,
  BarChart3,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Smartphone,
  Monitor,
  Hash,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════════════════════════════ */
const theme = {
  bg: "#06080C",
  surface: "#0C0F15",
  text: "#E8EDF2",
  muted: "#7A8694",
  accent: "#3DF5C5",
  accentDim: "rgba(61, 245, 197, 0.1)",
  glass: "rgba(12, 15, 21, 0.8)",
  border: "rgba(61, 245, 197, 0.08)",
};

/* ═══════════════════════════════════════════════════════════════════════════
   REUSABLE COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

function GlassCard({ children, className = "", delay = 0, ...props }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.19, 1, 0.22, 1] }}
      className={`rounded-2xl border backdrop-blur-xl ${className}`}
      style={{
        background: theme.glass,
        borderColor: theme.border,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: theme.accentDim }}
      >
        <Icon size={18} style={{ color: theme.accent }} />
      </div>
      <div>
        <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs" style={{ color: theme.muted }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  positive,
}: {
  label: string;
  value: string;
  change?: string;
  icon: any;
  positive?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-4 border backdrop-blur-xl"
      style={{
        background: theme.glass,
        borderColor: theme.border,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: theme.muted }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: theme.accentDim }}
        >
          <Icon size={15} style={{ color: theme.accent }} />
        </div>
      </div>
      <div className="text-2xl font-bold" style={{ color: theme.text }}>
        {value}
      </div>
      {change && (
        <div
          className="flex items-center gap-1 mt-1 text-xs font-medium"
          style={{ color: theme.accent }}
        >
          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change} vs mês anterior
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════ */

const SPEND_SUMMARY = {
  thisMonth: "R$ 47.850",
  lastMonth: "R$ 42.300",
  variation: "+13.1%",
  positive: true,
};

const ACTIVE_CAMPAIGNS = [
  {
    name: "Brand Search",
    platform: "Google Ads",
    type: "Search",
    budget: 12000,
    spend: 8940,
    impressions: 284500,
    clicks: 12450,
    ctr: 4.38,
    conversions: 847,
    roas: 4.2,
    status: "Ativa",
  },
  {
    name: "Display Pro",
    platform: "Google Ads",
    type: "Display",
    budget: 8000,
    spend: 6120,
    impressions: 892000,
    clicks: 14200,
    ctr: 1.59,
    conversions: 312,
    roas: 2.8,
    status: "Ativa",
  },
  {
    name: "Shopping Feed",
    platform: "Google Ads",
    type: "Shopping",
    budget: 15000,
    spend: 11450,
    impressions: 156000,
    clicks: 8900,
    ctr: 5.71,
    conversions: 523,
    roas: 5.1,
    status: "Ativa",
  },
  {
    name: "Awareness Video",
    platform: "Facebook Ads",
    type: "Video",
    budget: 6000,
    spend: 4200,
    impressions: 654000,
    clicks: 8900,
    ctr: 1.36,
    conversions: 145,
    roas: 1.9,
    status: "Ativa",
  },
  {
    name: "Retargeting Web",
    platform: "Facebook Ads",
    type: "Display",
    budget: 5000,
    spend: 3810,
    impressions: 345000,
    clicks: 11200,
    ctr: 3.25,
    conversions: 278,
    roas: 3.4,
    status: "Ativa",
  },
  {
    name: "Lead Gen Pro",
    platform: "Facebook Ads",
    type: "Lead",
    budget: 4000,
    spend: 3200,
    impressions: 198000,
    clicks: 7800,
    ctr: 3.94,
    conversions: 412,
    roas: 6.2,
    status: "Ativa",
  },
];

const GOOGLE_ADS_CAMPAIGNS = ACTIVE_CAMPAIGNS.filter((c) => c.platform === "Google Ads");
const FACEBOOK_ADS_CAMPAIGNS = ACTIVE_CAMPAIGNS.filter((c) => c.platform === "Facebook Ads");

const PERFORMANCE_DAILY = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}/${6}/2026`,
  dayShort: `${i + 1}`,
  impressions: Math.floor(30000 + Math.random() * 45000),
  clicks: Math.floor(400 + Math.random() * 1200),
  conversoes: Math.floor(10 + Math.random() * 60),
}));

const ROAS_BY_CAMPAIGN = ACTIVE_CAMPAIGNS.map((c) => ({
  name: c.name,
  ROAS: c.roas,
  spend: c.spend,
}));

const KEYWORDS = [
  { keyword: "crm imobiliário", cpc: 4.85, volume: 5400, competicao: "Alta" },
  { keyword: "software corretor", cpc: 3.2, volume: 8200, competicao: "Alta" },
  { keyword: "automação vendas", cpc: 2.75, volume: 3800, competicao: "Média" },
  { keyword: "gestão leads", cpc: 3.9, volume: 2900, competicao: "Média" },
  { keyword: "plataforma imobiliária", cpc: 5.1, volume: 1800, competicao: "Baixa" },
  { keyword: "app corretores", cpc: 1.95, volume: 12000, competicao: "Alta" },
  { keyword: "relatórios vendas", cpc: 2.3, volume: 1600, competicao: "Baixa" },
  { keyword: "integração whatsapp", cpc: 3.65, volume: 4200, competicao: "Média" },
];

const AUDIENCE_INSIGHTS = {
  gender: [
    { label: "Masculino", pct: 58 },
    { label: "Feminino", pct: 42 },
  ],
  age: [
    { label: "18–24", pct: 12 },
    { label: "25–34", pct: 35 },
    { label: "35–44", pct: 28 },
    { label: "45–54", pct: 17 },
    { label: "55+", pct: 8 },
  ],
  devices: [
    { label: "Mobile", pct: 72 },
    { label: "Desktop", pct: 22 },
    { label: "Tablet", pct: 6 },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   CUSTOM TOOLTIP
   ═══════════════════════════════════════════════════════════════════════════ */

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm border backdrop-blur-xl"
      style={{
        background: "rgba(12, 15, 21, 0.95)",
        borderColor: theme.border,
        color: theme.text,
      }}
    >
      <p className="text-xs font-medium mb-2" style={{ color: theme.muted }}>
        Dia {label}
      </p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2 text-xs">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span style={{ color: theme.muted }}>{entry.name}:</span>
          <span className="font-medium" style={{ color: theme.text }}>
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODAL — Nova Campanha
   ═══════════════════════════════════════════════════════════════════════════ */

function NovaCampanhaModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nome: "",
    plataforma: "Google Ads",
    tipo: "Search",
    objetivo: "Conversões",
    budgetDiario: 200,
    dataInicio: "",
    dataFim: "",
  });

  if (!open) return null;

  const update = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(6, 8, 12, 0.85)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 30 }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-2xl border backdrop-blur-xl p-6"
          style={{
            background: theme.surface,
            borderColor: theme.border,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold" style={{ color: theme.text }}>
                Nova Campanha
              </h3>
              <p className="text-xs mt-0.5" style={{ color: theme.muted }}>
                Etapa {step} de 3
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <X size={16} style={{ color: theme.muted }} />
            </button>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="flex-1 h-1.5 rounded-full transition-colors duration-300"
                style={{
                  background: s <= step ? theme.accent : theme.border,
                }}
              />
            ))}
          </div>

          {/* Step 1 — Info Básica */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: theme.muted }}>
                  Nome da Campanha
                </label>
                <input
                  value={form.nome}
                  onChange={(e) => update("nome", e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none transition-colors"
                  style={{
                    background: theme.bg,
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                  placeholder="Ex: Campanha Verão 2026"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: theme.muted }}>
                    Plataforma
                  </label>
                  <select
                    value={form.plataforma}
                    onChange={(e) => update("plataforma", e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none"
                    style={{
                      background: theme.bg,
                      borderColor: theme.border,
                      color: theme.text,
                    }}
                  >
                    <option>Google Ads</option>
                    <option>Facebook Ads</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: theme.muted }}>
                    Tipo
                  </label>
                  <select
                    value={form.tipo}
                    onChange={(e) => update("tipo", e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none"
                    style={{
                      background: theme.bg,
                      borderColor: theme.border,
                      color: theme.text,
                    }}
                  >
                    <option>Search</option>
                    <option>Display</option>
                    <option>Shopping</option>
                    <option>Video</option>
                    <option>Lead</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: theme.muted }}>
                  Objetivo
                </label>
                <select
                  value={form.objetivo}
                  onChange={(e) => update("objetivo", e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none"
                  style={{
                    background: theme.bg,
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                >
                  <option>Conversões</option>
                  <option>Tráfego</option>
                  <option>Reconhecimento</option>
                  <option>Leads</option>
                  <option>Vendas</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2 — Orçamento */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: theme.muted }}>
                  Orçamento Diário: R$ {form.budgetDiario}
                </label>
                <input
                  type="range"
                  min={50}
                  max={2000}
                  step={10}
                  value={form.budgetDiario}
                  onChange={(e) => update("budgetDiario", Number(e.target.value))}
                  className="w-full accent-green-400"
                  style={{ accentColor: theme.accent }}
                />
                <div className="flex justify-between text-[10px] mt-1" style={{ color: theme.muted }}>
                  <span>R$ 50</span>
                  <span>R$ 2.000</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: theme.muted }}>
                    Data Início
                  </label>
                  <input
                    type="date"
                    value={form.dataInicio}
                    onChange={(e) => update("dataInicio", e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none"
                    style={{
                      background: theme.bg,
                      borderColor: theme.border,
                      color: theme.text,
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: theme.muted }}>
                    Data Fim
                  </label>
                  <input
                    type="date"
                    value={form.dataFim}
                    onChange={(e) => update("dataFim", e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none"
                    style={{
                      background: theme.bg,
                      borderColor: theme.border,
                      color: theme.text,
                    }}
                  />
                </div>
              </div>
              <div
                className="rounded-xl p-4 border"
                style={{ background: theme.accentDim, borderColor: theme.border }}
              >
                <div className="text-xs font-medium" style={{ color: theme.accent }}>
                  Resumo do Orçamento
                </div>
                <div className="text-sm mt-2 space-y-1" style={{ color: theme.muted }}>
                  <div className="flex justify-between">
                    <span>Orçamento Diário</span>
                    <span style={{ color: theme.text }}>R$ {form.budgetDiario}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Orçamento Mensal Estimado</span>
                    <span style={{ color: theme.text }}>
                      R$ {(form.budgetDiario * 30).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Revisão */}
          {step === 3 && (
            <div className="space-y-3">
              <div
                className="rounded-xl p-4 border space-y-2"
                style={{ background: theme.bg, borderColor: theme.border }}
              >
                <ReviewRow label="Nome" value={form.nome || "—"} />
                <ReviewRow label="Plataforma" value={form.plataforma} />
                <ReviewRow label="Tipo" value={form.tipo} />
                <ReviewRow label="Objetivo" value={form.objetivo} />
                <ReviewRow label="Orçamento Diário" value={`R$ ${form.budgetDiario}`} />
                <ReviewRow label="Data Início" value={form.dataInicio || "—"} />
                <ReviewRow label="Data Fim" value={form.dataFim || "—"} />
              </div>
              <p className="text-xs text-center" style={{ color: theme.muted }}>
                Ao criar a campanha, você concorda com os termos de serviço.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t" style={{ borderColor: theme.border }}>
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              className="px-4 py-2 text-sm font-medium rounded-xl transition-all"
              style={{
                color: theme.muted,
                background: "transparent",
              }}
            >
              Voltar
            </button>
            <div className="flex items-center gap-2">
              {step === 3 ? (
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-sm font-semibold rounded-xl transition-all"
                  style={{
                    background: theme.accent,
                    color: theme.bg,
                  }}
                >
                  Criar Campanha
                </button>
              ) : (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2 text-sm font-semibold rounded-xl transition-all"
                  style={{
                    background: theme.accent,
                    color: theme.bg,
                  }}
                >
                  Próximo
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: theme.muted }}>
        {label}
      </span>
      <span className="text-sm font-medium" style={{ color: theme.text }}>
        {value}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CAMPAIGN CARD
   ═══════════════════════════════════════════════════════════════════════════ */

function CampaignCard({ campaign, delay = 0 }: { campaign: typeof ACTIVE_CAMPAIGNS[0]; delay?: number }) {
  return (
    <GlassCard delay={delay} className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
              {campaign.name}
            </h3>
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{
                background: theme.accentDim,
                color: theme.accent,
                border: `1px solid ${theme.border}`,
              }}
            >
              {campaign.type}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: theme.muted }}>
            {campaign.platform}
          </p>
        </div>
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(61, 245, 197, 0.08)",
            color: theme.accent,
          }}
        >
          ● {campaign.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <Metric label="Budget" value={`R$ ${campaign.budget.toLocaleString()}`} />
        <Metric label="Spend" value={`R$ ${campaign.spend.toLocaleString()}`} />
        <Metric label="Impressions" value={campaign.impressions.toLocaleString()} />
        <Metric label="Clicks" value={campaign.clicks.toLocaleString()} />
        <Metric label="CTR" value={`${campaign.ctr}%`} />
        <Metric label="Conversões" value={campaign.conversions.toLocaleString()} />
      </div>

      <div
        className="mt-4 pt-3 border-t flex items-center justify-between"
        style={{ borderColor: theme.border }}
      >
        <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: theme.muted }}>
          ROAS
        </span>
        <span className="text-lg font-bold" style={{ color: theme.accent }}>
          {campaign.roas}x
        </span>
      </div>
    </GlassCard>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider" style={{ color: theme.muted }}>
        {label}
      </div>
      <div className="text-sm font-medium mt-0.5" style={{ color: theme.text }}>
        {value}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUDGET SLIDER
   ═══════════════════════════════════════════════════════════════════════════ */

function BudgetSlider({
  label,
  value,
  max,
  color,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  onChange: (v: number) => void;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium" style={{ color: theme.text }}>
          {label}
        </span>
        <span className="font-semibold" style={{ color }}>
          R$ {value.toLocaleString()}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} ${pct}%, rgba(255,255,255,0.06) ${pct}%)`,
          accentColor: color,
        }}
      />
      <div className="flex justify-between text-[10px]" style={{ color: theme.muted }}>
        <span>R$ 0</span>
        <span>{pct}% do orçamento</span>
        <span>R$ {max.toLocaleString()}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AD CREATIVE PREVIEWS
   ═══════════════════════════════════════════════════════════════════════════ */

function GoogleAdPreview() {
  return (
    <div
      className="rounded-xl p-4 border"
      style={{ background: theme.bg, borderColor: theme.border }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
        <span className="text-[10px] font-medium" style={{ color: theme.muted }}>
          google.com
        </span>
        <span className="text-[10px]" style={{ color: theme.muted }}>
          • Anúncio
        </span>
      </div>
      <p className="text-sm font-semibold mb-1" style={{ color: theme.accent }}>
        CRM Imobiliário Inteligente | Intelligence OS
      </p>
      <p className="text-xs mb-1" style={{ color: theme.muted }}>
        https://www.intelligence-os.com/crm-imobiliario
      </p>
      <p className="text-xs leading-relaxed" style={{ color: theme.text }}>
        Gerencie leads, automatize vendas e feche mais negócios. Plataforma completa com integração WhatsApp e relatórios em tempo real. Teste grátis por 14 dias.
      </p>
      <div className="flex items-center gap-2 mt-3">
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: theme.accentDim, color: theme.accent }}>
          Chamada
        </span>
        <span className="text-[10px]" style={{ color: theme.muted }}>
          Teste Grátis
        </span>
      </div>
    </div>
  );
}

function FacebookAdPreview() {
  return (
    <div
      className="rounded-xl p-4 border"
      style={{ background: theme.bg, borderColor: theme.border }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
          IO
        </div>
        <div>
          <div className="text-xs font-medium" style={{ color: theme.text }}>
            Intelligence OS
          </div>
          <div className="text-[10px]" style={{ color: theme.muted }}>
            Patrocinado
          </div>
        </div>
      </div>
      <p className="text-sm mb-2 leading-relaxed" style={{ color: theme.text }}>
        Transforme sua imobiliária com automação inteligente. ⚡ Capture leads, nutra relacionamentos e feche mais vendas com o poder da IA.
      </p>
      <div
        className="rounded-lg h-24 flex items-center justify-center mb-2"
        style={{ background: theme.accentDim }}
      >
        <Image size={24} style={{ color: theme.accent }} />
      </div>
      <div
        className="rounded-lg border p-3"
        style={{ borderColor: theme.border, background: theme.glass }}
      >
        <p className="text-xs font-semibold" style={{ color: theme.text }}>
          CRM com IA para Imobiliárias
        </p>
        <p className="text-[10px]" style={{ color: theme.muted }}>
          intelligence-os.com
        </p>
      </div>
      <button
        className="w-full mt-2 rounded-lg py-2 text-xs font-semibold transition-all"
        style={{
          background: theme.accent,
          color: theme.bg,
        }}
      >
        Saiba Mais
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function AdsCampaignManager() {
  const [modalOpen, setModalOpen] = useState(false);
  const [budgetGoogle, setBudgetGoogle] = useState(30000);
  const [budgetFacebook, setBudgetFacebook] = useState(18000);
  const totalBudget = 50000;

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
  };

  return (
    <div
      className="min-h-screen p-4 md:p-6 lg:p-8"
      style={{ background: theme.bg, color: theme.text }}
    >
      {/* ═══ HEADER ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold" style={{ color: theme.text }}>
            Ads Campaign Manager
          </h1>
          <p className="text-sm mt-1" style={{ color: theme.muted }}>
            Gerencie todas as suas campanhas de anúncios em um só lugar
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all"
          style={{
            background: theme.accent,
            color: theme.bg,
          }}
        >
          <Plus size={16} />
          Nova Campanha
        </motion.button>
      </motion.div>

      {/* ═══ SPEND SUMMARY ═══ */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        <GlassCard delay={0} className="p-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: theme.accentDim }}
            >
              <DollarSign size={18} style={{ color: theme.accent }} />
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider" style={{ color: theme.muted }}>
                Este Mês
              </div>
              <div className="text-xl font-bold mt-0.5" style={{ color: theme.text }}>
                {SPEND_SUMMARY.thisMonth}
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.05} className="p-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: theme.accentDim }}
            >
              <BarChart3 size={18} style={{ color: theme.accent }} />
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider" style={{ color: theme.muted }}>
                Último Mês
              </div>
              <div className="text-xl font-bold mt-0.5" style={{ color: theme.text }}>
                {SPEND_SUMMARY.lastMonth}
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.1} className="p-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: theme.accentDim }}
            >
              <TrendingUp size={18} style={{ color: theme.accent }} />
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider" style={{ color: theme.muted }}>
                Variação
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                {SPEND_SUMMARY.positive ? (
                  <ArrowUpRight size={16} style={{ color: theme.accent }} />
                ) : (
                  <ArrowDownRight size={16} style={{ color: "#EF4444" }} />
                )}
                <span
                  className="text-xl font-bold"
                  style={{ color: SPEND_SUMMARY.positive ? theme.accent : "#EF4444" }}
                >
                  {SPEND_SUMMARY.variation}
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* ═══ QUICK STATS ═══ */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      >
        <StatCard
          label="Impressões Totais"
          value="2.5M"
          change="+18.4%"
          positive
          icon={Eye}
        />
        <StatCard
          label="Cliques Totais"
          value="63.4K"
          change="+12.8%"
          positive
          icon={MousePointerClick}
        />
        <StatCard
          label="Conversões"
          value="2.517"
          change="+22.3%"
          positive
          icon={Target}
        />
        <StatCard
          label="ROAS Médio"
          value="3.9x"
          change="+7.2%"
          positive
          icon={TrendingUp}
        />
      </motion.div>

      {/* ═══ CAMPAIGN DASHBOARD ═══ */}
      <GlassCard className="p-5 mb-6">
        <SectionTitle icon={Layers} title="Campanhas Ativas" subtitle={`${ACTIVE_CAMPAIGNS.length} campanhas em execução`} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {ACTIVE_CAMPAIGNS.map((c, idx) => (
            <CampaignCard key={c.name} campaign={c} delay={idx * 0.04} />
          ))}
        </div>
      </GlassCard>

      {/* ═══ GOOGLE ADS SECTION ═══ */}
      <GlassCard className="p-5 mb-6">
        <SectionTitle icon={Monitor} title="Google Ads" subtitle="Gerenciador de campanhas simuladas" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GOOGLE_ADS_CAMPAIGNS.map((c, idx) => (
            <CampaignCard key={c.name} campaign={c} delay={idx * 0.04} />
          ))}
        </div>
      </GlassCard>

      {/* ═══ FACEBOOK ADS SECTION ═══ */}
      <GlassCard className="p-5 mb-6">
        <SectionTitle icon={Smartphone} title="Facebook Ads" subtitle="Gerenciador de campanhas simuladas" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FACEBOOK_ADS_CAMPAIGNS.map((c, idx) => (
            <CampaignCard key={c.name} campaign={c} delay={idx * 0.04} />
          ))}
        </div>
      </GlassCard>

      {/* ═══ CHARTS ROW ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Performance LineChart */}
        <GlassCard className="p-5">
          <SectionTitle icon={Activity} title="Performance Diária" subtitle="Impressões, cliques e conversões" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PERFORMANCE_DAILY}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="dayShort"
                  tick={{ fill: theme.muted, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fill: theme.muted, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="impressions"
                  name="Impressões"
                  stroke={theme.accent}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: theme.accent }}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  name="Cliques"
                  stroke="#60A5FA"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#60A5FA" }}
                />
                <Line
                  type="monotone"
                  dataKey="conversoes"
                  name="Conversões"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#F59E0B" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* ROAS BarChart */}
        <GlassCard className="p-5">
          <SectionTitle icon={BarChart3} title="ROAS por Campanha" subtitle="Retorno sobre investimento em anúncios" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ROAS_BY_CAMPAIGN}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: theme.muted, fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: theme.muted, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                  domain={[0, 8]}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload) return null;
                    return (
                      <div
                        className="rounded-xl px-4 py-3 text-sm border backdrop-blur-xl"
                        style={{
                          background: "rgba(12, 15, 21, 0.95)",
                          borderColor: theme.border,
                          color: theme.text,
                        }}
                      >
                        <p className="text-xs font-medium mb-1" style={{ color: theme.muted }}>
                          {label}
                        </p>
                        {payload.map((entry: any, idx: number) => (
                          <div key={idx} className="text-xs">
                            <span style={{ color: theme.muted }}>ROAS: </span>
                            <span className="font-semibold" style={{ color: entry.color }}>
                              {entry.value}x
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="ROAS"
                  fill={theme.accent}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* ═══ BUDGET PLANNER ═══ */}
      <GlassCard className="p-5 mb-6">
        <SectionTitle icon={Sliders} title="Budget Planner" subtitle="Alocação de orçamento entre plataformas" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <BudgetSlider
            label="Google Ads"
            value={budgetGoogle}
            max={totalBudget}
            color={theme.accent}
            onChange={setBudgetGoogle}
          />
          <BudgetSlider
            label="Facebook Ads"
            value={budgetFacebook}
            max={totalBudget}
            color="#60A5FA"
            onChange={setBudgetFacebook}
          />
        </div>

        {/* Allocation pie visual */}
        <div
          className="rounded-xl p-5 border"
          style={{ background: theme.bg, borderColor: theme.border }}
        >
          <div className="text-xs font-medium mb-4" style={{ color: theme.muted }}>
            Distribuição Atual
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="4"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={theme.accent}
                  strokeWidth="4"
                  strokeDasharray={`${(budgetGoogle / totalBudget) * 100} ${100 - (budgetGoogle / totalBudget) * 100}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold" style={{ color: theme.accent }}>
                  {Math.round((budgetGoogle / totalBudget) * 100)}%
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: theme.accent }} />
                  <span style={{ color: theme.text }}>Google Ads</span>
                </div>
                <span className="font-semibold" style={{ color: theme.text }}>
                  R$ {budgetGoogle.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: "#60A5FA" }}
                  />
                  <span style={{ color: theme.text }}>Facebook Ads</span>
                </div>
                <span className="font-semibold" style={{ color: theme.text }}>
                  R$ {budgetFacebook.toLocaleString()}
                </span>
              </div>
              <div
                className="pt-2 mt-2 border-t flex items-center justify-between text-sm"
                style={{ borderColor: theme.border }}
              >
                <span className="font-medium" style={{ color: theme.muted }}>
                  Total
                </span>
                <span className="font-bold" style={{ color: theme.text }}>
                  R$ {(budgetGoogle + budgetFacebook).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ═══ KEYWORD PERFORMANCE ═══ */}
      <GlassCard className="p-5 mb-6">
        <SectionTitle icon={Search} title="Keyword Performance" subtitle="Análise de palavras-chave por CPC, volume e concorrência" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wider" style={{ borderColor: theme.border, color: theme.muted }}>
                <th className="text-left py-3 px-2 font-medium">Palavra-Chave</th>
                <th className="text-right py-3 px-2 font-medium">CPC</th>
                <th className="text-right py-3 px-2 font-medium">Volume</th>
                <th className="text-right py-3 px-2 font-medium">Concorrência</th>
              </tr>
            </thead>
            <tbody>
              {KEYWORDS.map((kw, idx) => (
                <motion.tr
                  key={kw.keyword}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="border-b transition-colors hover:bg-white/[0.02]"
                  style={{ borderColor: theme.border }}
                >
                  <td className="py-3 px-2" style={{ color: theme.text }}>
                    <span className="font-medium">{kw.keyword}</span>
                  </td>
                  <td className="py-3 px-2 text-right font-medium" style={{ color: theme.text }}>
                    R$ {kw.cpc.toFixed(2)}
                  </td>
                  <td className="py-3 px-2 text-right" style={{ color: theme.text }}>
                    {kw.volume.toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background:
                          kw.competicao === "Alta"
                            ? "rgba(239, 68, 68, 0.1)"
                            : kw.competicao === "Média"
                            ? "rgba(245, 158, 11, 0.1)"
                            : "rgba(61, 245, 197, 0.1)",
                        color:
                          kw.competicao === "Alta"
                            ? "#EF4444"
                            : kw.competicao === "Média"
                            ? "#F59E0B"
                            : theme.accent,
                      }}
                    >
                      {kw.competicao}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ═══ AUDIENCE INSIGHTS ═══ */}
      <GlassCard className="p-5 mb-6">
        <SectionTitle icon={Users} title="Audience Insights" subtitle="Dados demográficos da audiência" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gender */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: theme.muted }}>
              Gênero
            </h4>
            <div className="space-y-2">
              {AUDIENCE_INSIGHTS.gender.map((g) => (
                <div key={g.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span style={{ color: theme.text }}>{g.label}</span>
                    <span style={{ color: theme.muted }}>{g.pct}%</span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${g.pct}%` }}
                      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                      className="h-full rounded-full"
                      style={{ background: theme.accent }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: theme.muted }}>
              Idade
            </h4>
            <div className="space-y-2">
              {AUDIENCE_INSIGHTS.age.map((a) => (
                <div key={a.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span style={{ color: theme.text }}>{a.label}</span>
                    <span style={{ color: theme.muted }}>{a.pct}%</span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${a.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
                      className="h-full rounded-full"
                      style={{ background: "#60A5FA" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Devices */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: theme.muted }}>
              Dispositivos
            </h4>
            <div className="space-y-2">
              {AUDIENCE_INSIGHTS.devices.map((d) => (
                <div key={d.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span style={{ color: theme.text }}>{d.label}</span>
                    <span style={{ color: theme.muted }}>{d.pct}%</span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                      className="h-full rounded-full"
                      style={{ background: "#F59E0B" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ═══ AD CREATIVE ═══ */}
      <GlassCard className="p-5 mb-6">
        <SectionTitle icon={Image} title="Ad Creative Preview" subtitle="Visualização de anúncios Google Ads e Facebook Ads" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: theme.muted }}>
              Google Ads
            </h4>
            <GoogleAdPreview />
          </div>
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: theme.muted }}>
              Facebook Ads
            </h4>
            <FacebookAdPreview />
          </div>
        </div>
      </GlassCard>

      {/* ═══ NOVA CAMPANHA MODAL ═══ */}
      <NovaCampanhaModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ═══ FOOTER ═══ */}
      <div className="text-center py-6 text-[10px] uppercase tracking-widest" style={{ color: theme.muted }}>
        Intelligence OS — Ads Campaign Manager v1.0
      </div>
    </div>
  );
}

/* ── Extra icon used in charts ── */
function Activity({ size, style }: { size?: number; style?: React.CSSProperties }) {
  return <BarChart3 size={size} style={style} />;
}
