'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';
import {
  Plus, X, Target, Zap, Shield, Eye, Search,
  TrendingUp, TrendingDown, Activity, DollarSign,
  Globe, Star, Users, Share2, BarChart3,
  AlertTriangle, ArrowUp, ArrowDown, CheckCircle,
  ExternalLink, Menu, GripVertical, Loader2,
  WifiOff,
} from 'lucide-react';
import AnalyzeForm from './analyze-form';

/* ==================== CONSTANTS ==================== */

const COLORS = {
  bg: '#06080C',
  surface: '#0C0F15',
  text: '#E8EDF2',
  muted: '#7A8694',
  accent: '#3DF5C5',
  accentDim: 'rgba(61, 245, 197, 0.15)',
  glass: 'rgba(12, 15, 21, 0.7)',
  glassBorder: 'rgba(255,255,255,0.06)',
  glassBorderHover: 'rgba(61, 245, 197, 0.2)',
};

const SWOT_CATEGORIES = [
  { key: 'strengths', label: 'Strengths', icon: ArrowUp, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { key: 'weaknesses', label: 'Weaknesses', icon: ArrowDown, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  { key: 'opportunities', label: 'Opportunities', icon: TrendingUp, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { key: 'threats', label: 'Threats', icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
];

const PIE_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ec4899'];

const GAP_ANALYSIS = [
  { area: 'Automação Multi-Agente', yourScore: 9, marketAvg: 5, priority: 'high' as const },
  { area: 'Preços Flexíveis', yourScore: 8, marketAvg: 4, priority: 'high' as const },
  { area: 'Onboarding Intuitivo', yourScore: 7, marketAvg: 6, priority: 'medium' as const },
  { area: 'Integrações Nativas', yourScore: 6, marketAvg: 8, priority: 'high' as const },
  { area: 'Analytics Avançado', yourScore: 8, marketAvg: 6, priority: 'medium' as const },
  { area: 'Suporte 24/7', yourScore: 5, marketAvg: 3, priority: 'low' as const },
];

/* ==================== TYPES ==================== */

interface Competitor {
  id: string;
  name: string;
  logo: string;
  color: string;
  price: string;
  features: number;
  traffic: string;
  rating: number;
  social: string;
  seo: number; ads: number; content: number; socialMedia: number;
  swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
  threats: { type: string; label: string; date: string; severity: string }[];
  position: { price: number; quality: number };
  shareOfVoice: number;
  industry?: string;
  location?: string;
}

/* ==================== COMPONENTS ==================== */

function GlassCard({ children, className = '', style = {}, ...props }: any) {
  return (
    <div
      className={`rounded-2xl border backdrop-blur-xl ${className}`}
      style={{
        background: COLORS.glass,
        borderColor: COLORS.glassBorder,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-6 flex items-start gap-4"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ background: COLORS.accentDim, color: COLORS.accent }}
      >
        <Icon size={24} />
      </div>
      <div>
        <h2 className="text-2xl font-bold" style={{ color: COLORS.text }}>
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('');
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAnalyzeForm, setShowAnalyzeForm] = useState(false);

  // Fetch real data from API
  useEffect(() => {
    fetch('/api/cie/competitors')
      .then((r) => r.json())
      .then((data) => {
        const comps = data.competitors || [];
        setCompetitors(comps);
        setDataSource(data.source || 'unknown');
        if (comps.length > 0) setSelectedCompetitor(comps[0]);
      })
      .catch(() => {
        // Should never happen since API always returns mock fallback
      })
      .finally(() => setLoading(false));
  }, []);

  type SwotKey = 'strengths' | 'weaknesses' | 'opportunities' | 'threats';

  const [swotItems, setSwotItems] = useState(() =>
    SWOT_CATEGORIES.map((cat) => ({ category: cat.key, items: [] as string[] })),
  );

  // Update swotItems when selectedCompetitor changes
  useEffect(() => {
    if (selectedCompetitor) {
      setSwotItems(
        SWOT_CATEGORIES.map((cat) => ({
          category: cat.key,
          items: [...selectedCompetitor.swot[cat.key as keyof typeof selectedCompetitor.swot]],
        })),
      );
    }
  }, [selectedCompetitor]);

  const handleCompetitorChange = (id: string) => {
    const comp = competitors.find((c) => c.id === id);
    if (comp) {
      setSelectedCompetitor(comp);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-4 md:p-8 flex items-center justify-center" style={{ background: COLORS.bg, color: COLORS.text }}>
        <div className="text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-4" style={{ color: COLORS.accent }} />
          <p className="text-lg font-medium" style={{ color: COLORS.muted }}>Carregando dados de concorrentes...</p>
          <p className="text-sm mt-1" style={{ color: COLORS.muted }}>
            Conectando à CIE Platform e OmniRoute
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen p-4 md:p-8"
      style={{ background: COLORS.bg, color: COLORS.text }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-extrabold md:text-4xl">
            Competitive Intelligence
          </h1>
          <p className="mt-2 flex items-center gap-2" style={{ color: COLORS.muted }}>
            <span>Monitore, analise e supere seus concorrentes com análises profundas de mercado</span>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{
                background: dataSource === 'mock-fallback' ? 'rgba(245,158,11,0.1)' : 'rgba(52,211,153,0.1)',
                color: dataSource === 'mock-fallback' ? '#f59e0b' : '#34D399',
              }}
            >
              {dataSource === 'mock-fallback' ? <WifiOff size={10} /> : <CheckCircle size={10} />}
              {dataSource === 'mock-fallback' ? 'Fallback' : 'CIE Live'}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalyzeForm(true)}
            className="flex items-center gap-2 rounded-xl px-5 py-3 font-semibold transition-colors"
            style={{
              background: 'rgba(61,245,197,0.1)',
              color: COLORS.accent,
              border: `1px solid ${COLORS.accent}30`,
            }}
          >
            <Search size={18} />
            Nova Análise
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-colors"
            style={{
              background: COLORS.accent,
              color: COLORS.bg,
            }}
          >
            <Plus size={20} />
            Adicionar Concorrente
          </motion.button>
        </div>
      </motion.div>

      {/* Data source indicator */}
      {competitors.length === 0 ? (
        <div className="text-center py-20">
          <WifiOff size={40} className="mx-auto mb-4" style={{ color: COLORS.muted }} />
          <h2 className="text-xl font-bold mb-2">Nenhum concorrente encontrado</h2>
          <p className="text-sm" style={{ color: COLORS.muted }}>
            Clique em "Nova Análise" para começar a monitorar concorrentes
          </p>
        </div>
      ) : (
        <>
          {/* ========== 1. SWOT ANALYSIS ========== */}
          {selectedCompetitor && (
            <section className="mb-16">
              <SectionTitle icon={Target} title="Análise SWOT" subtitle="Arraste os cards para reordenar as prioridades" />
              <div className="mb-4 flex flex-wrap gap-2">
                {competitors.map((comp) => (
                  <motion.button
                    key={comp.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCompetitorChange(comp.id)}
                    className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all"
                    style={{
                      background: selectedCompetitor.id === comp.id ? comp.color + '30' : COLORS.surface,
                      borderColor: selectedCompetitor.id === comp.id ? comp.color : COLORS.glassBorder,
                      color: selectedCompetitor.id === comp.id ? comp.color : COLORS.muted,
                    }}
                  >
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold"
                      style={{ background: comp.color + '30', color: comp.color }}
                    >
                      {comp.logo}
                    </span>
                    {comp.name}
                  </motion.button>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {SWOT_CATEGORIES.map((cat) => {
                  const currentItems = swotItems.find((s) => s.category === cat.key);
                  return (
                    <GlassCard key={cat.key} className="p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: cat.bg }}>
                          <cat.icon size={20} color={cat.color} />
                        </div>
                        <h3 className="text-lg font-bold" style={{ color: cat.color }}>{cat.label}</h3>
                      </div>
                      <Reorder.Group
                        axis="y"
                        values={currentItems?.items || []}
                        onReorder={(newOrder) => {
                          setSwotItems((prev) =>
                            prev.map((s) => (s.category === cat.key ? { ...s, items: newOrder } : s)),
                          );
                        }}
                        className="flex flex-col gap-2"
                      >
                        <AnimatePresence>
                          {(currentItems?.items || []).map((item, idx) => (
                            <Reorder.Item
                              key={item}
                              value={item}
                              as="div"
                              className="flex cursor-grab items-center gap-3 rounded-xl border p-3 text-sm active:cursor-grabbing"
                              style={{ background: cat.bg, borderColor: cat.color + '30', color: COLORS.text }}
                              whileDrag={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                            >
                              <GripVertical size={14} style={{ color: COLORS.muted }} />
                              <span
                                className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold"
                                style={{ background: cat.color + '30', color: cat.color }}
                              >
                                {idx + 1}
                              </span>
                              {item}
                            </Reorder.Item>
                          ))}
                        </AnimatePresence>
                      </Reorder.Group>
                    </GlassCard>
                  );
                })}
              </div>
            </section>
          )}

          {/* ========== 2. BENCHMARKING TABLE ========== */}
          <section className="mb-16">
            <SectionTitle icon={BarChart3} title="Benchmarking de Concorrentes" subtitle="Comparação direta das principais métricas" />
            <GlassCard className="overflow-x-auto p-4">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr style={{ color: COLORS.muted, borderBottom: `1px solid ${COLORS.glassBorder}` }}>
                    <th className="py-4 pr-4 font-semibold">Empresa</th>
                    <th className="py-4 px-3 font-semibold">Preço</th>
                    <th className="py-4 px-3 font-semibold">Features</th>
                    <th className="py-4 px-3 font-semibold">Tráfego</th>
                    <th className="py-4 px-3 font-semibold">Avaliação</th>
                    <th className="py-4 pl-3 font-semibold">Redes Sociais</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((comp, idx) => (
                    <motion.tr
                      key={comp.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08 }}
                      className="transition-colors hover:opacity-90"
                      style={{ borderBottom: `1px solid ${COLORS.glassBorder}` }}
                    >
                      <td className="flex items-center gap-3 py-4 pr-4">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold"
                          style={{ background: comp.color + '30', color: comp.color }}
                        >
                          {comp.logo}
                        </span>
                        <span className="font-semibold">{comp.name}</span>
                      </td>
                      <td className="py-4 px-3 font-medium" style={{ color: COLORS.accent }}>{comp.price}</td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full" style={{ background: COLORS.surface }}>
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: Math.min((comp.features / 50) * 100, 100) + '%',
                                background: `linear-gradient(90deg, ${comp.color}, ${COLORS.accent})`,
                              }}
                            />
                          </div>
                          <span className="text-xs" style={{ color: COLORS.muted }}>{comp.features}</span>
                        </div>
                      </td>
                      <td className="py-4 px-3 font-medium">{comp.traffic}</td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-1">
                          <Star size={14} fill={COLORS.accent} color={COLORS.accent} />
                          <span>{comp.rating}</span>
                        </div>
                      </td>
                      <td className="py-4 pl-3">
                        <div className="flex items-center gap-1">
                          <Users size={14} style={{ color: COLORS.muted }} />
                          <span>{comp.social}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          </section>

          {/* ========== 3. DIGITAL STRATEGY ========== */}
          <section className="mb-16">
            <SectionTitle icon={Search} title="Análise de Estratégia Digital" subtitle="SEO, Ads, Conteúdo e Social Media — score consolidado" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {competitors.map((comp, idx) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <GlassCard className="group p-5 transition-all duration-300 hover:border-[#3DF5C5]/20">
                    <div className="mb-5 flex items-center gap-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold"
                        style={{ background: comp.color + '30', color: comp.color }}
                      >
                        {comp.logo}
                      </span>
                      <div>
                        <h3 className="font-bold">{comp.name}</h3>
                        <span className="flex items-center gap-1 text-xs" style={{ color: COLORS.muted }}>
                          <Globe size={10} /> Score médio: {((comp.seo + comp.ads + comp.content + comp.socialMedia) / 4).toFixed(0)}
                        </span>
                      </div>
                    </div>
                    {[
                      { label: 'SEO', value: comp.seo, icon: Search },
                      { label: 'Ads', value: comp.ads, icon: DollarSign },
                      { label: 'Conteúdo', value: comp.content, icon: Activity },
                      { label: 'Social Media', value: comp.socialMedia, icon: Share2 },
                    ].map((metric) => (
                      <div key={metric.label} className="mb-3 last:mb-0">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1" style={{ color: COLORS.muted }}>
                            <metric.icon size={12} /> {metric.label}
                          </span>
                          <span className="font-semibold" style={{ color: COLORS.accent }}>{metric.value}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: COLORS.surface }}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: metric.value + '%' }}
                            viewport={{ once: true }}
                            className="h-1.5 rounded-full transition-all"
                            style={{
                              background: `linear-gradient(90deg, ${comp.color}, ${metric.value > 80 ? COLORS.accent : comp.color})`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ========== 4. MARKET POSITIONING ========== */}
          <section className="mb-16">
            <SectionTitle icon={Shield} title="Market Positioning" subtitle="Posicionamento Preço × Qualidade" />
            <GlassCard className="relative overflow-hidden p-4 md:p-6">
              <div className="mb-2 flex justify-between text-xs" style={{ color: COLORS.muted }}>
                <span>Preço Baixo</span>
                <span className="font-semibold" style={{ color: COLORS.text }}>Preço →</span>
                <span>Preço Alto</span>
              </div>
              <div className="relative h-[320px] w-full overflow-hidden rounded-xl border"
                style={{ background: `linear-gradient(135deg, ${COLORS.surface} 0%, #0a0e1a 100%)`, borderColor: COLORS.glassBorder }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <div key={`h${i}`} className="absolute left-0 right-0 border-t border-dashed"
                    style={{ top: `${i * 25}%`, borderColor: COLORS.glassBorder }} />
                ))}
                {[0, 1, 2, 3].map((i) => (
                  <div key={`v${i}`} className="absolute top-0 bottom-0 border-l border-dashed"
                    style={{ left: `${i * 25}%`, borderColor: COLORS.glassBorder }} />
                ))}
                <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
                  style={{ background: COLORS.accent }} />
                <div className="absolute -right-24 top-1/2 -mt-20 origin-center -rotate-90 text-xs tracking-widest"
                  style={{ color: COLORS.muted }}>QUALIDADE →</div>
                {competitors.map((comp) => {
                  const left = (comp.position.price / 100) * 100;
                  const top = 100 - (comp.position.quality / 100) * 100;
                  return (
                    <motion.div
                      key={comp.id}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      className="absolute flex flex-col items-center"
                      style={{ left: `${left}%`, top: `${top}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.3, boxShadow: `0 0 20px ${comp.color}60` }}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-sm font-bold shadow-lg transition-all"
                        style={{
                          background: `radial-gradient(circle, ${comp.color}40, ${comp.color})`,
                          color: '#fff',
                          boxShadow: `0 0 0 4px ${comp.color}20`,
                        }}
                      >
                        {comp.logo}
                      </motion.div>
                      <span
                        className="mt-1 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm"
                        style={{ background: COLORS.glass, border: `1px solid ${COLORS.glassBorder}`, color: COLORS.text }}
                      >
                        {comp.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-3 flex justify-between text-xs" style={{ color: COLORS.muted }}>
                <span>Qualidade Baixa</span>
                <span className="font-semibold" style={{ color: COLORS.text }}>Qualidade →</span>
                <span>Qualidade Alta</span>
              </div>
            </GlassCard>
          </section>

          {/* ========== 5. THREAT MONITOR ========== */}
          <section className="mb-16">
            <SectionTitle icon={AlertTriangle} title="Threat Monitor" subtitle="Alertas de mudanças nos concorrentes" />
            <div className="space-y-3">
              {competitors.flatMap((comp) =>
                comp.threats.map((threat, idx) => {
                  const severityColor =
                    threat.severity === 'critical' ? '#ef4444'
                    : threat.severity === 'high' ? '#f59e0b'
                    : threat.severity === 'medium' ? '#3b82f6'
                    : '#7A8694';
                  const TypeIcon =
                    threat.type === 'redesign' ? Eye
                    : threat.type === 'funding' ? DollarSign
                    : threat.type === 'feature' ? Zap
                    : AlertTriangle;
                  return (
                    <motion.div
                      key={`${comp.id}-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <GlassCard className="flex items-center gap-4 p-4 transition-all hover:border-[#3DF5C5]/20">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full"
                          style={{ background: severityColor + '20' }}>
                          <TypeIcon size={18} color={severityColor} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded text-[8px] font-bold"
                              style={{ background: comp.color + '30', color: comp.color }}>
                              {comp.logo}
                            </span>
                            <h4 className="truncate font-semibold">{threat.label}</h4>
                            <span className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase"
                              style={{ background: severityColor + '20', color: severityColor }}>
                              {threat.severity}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs" style={{ color: COLORS.muted }}>
                            {comp.name} · {threat.date}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="rounded-lg p-2 transition-colors hover:bg-white/5"
                        >
                          <ExternalLink size={16} style={{ color: COLORS.muted }} />
                        </motion.button>
                      </GlassCard>
                    </motion.div>
                  );
                }),
              )}
            </div>
          </section>

          {/* ========== 6. SHARE OF VOICE ========== */}
          <section className="mb-16">
            <SectionTitle icon={Activity} title="Share of Voice" subtitle="Distribuição de menções na web" />
            <div className="grid gap-6 md:grid-cols-2">
              <GlassCard className="p-6">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={competitors.map((c) => ({ name: c.name, value: c.shareOfVoice }))}
                      cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                      paddingAngle={4} dataKey="value"
                    >
                      {competitors.map((comp, idx) => (
                        <Cell key={comp.id} fill={PIE_COLORS[idx] || comp.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: COLORS.surface, border: `1px solid ${COLORS.glassBorder}`, borderRadius: 12, color: COLORS.text }} />
                    <Legend formatter={(value: string) => (<span style={{ color: COLORS.text }}>{value}</span>)} />
                  </PieChart>
                </ResponsiveContainer>
              </GlassCard>
              <div className="flex flex-col justify-center gap-3">
                {competitors.map((comp, idx) => (
                  <motion.div
                    key={comp.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="h-3 w-3 rounded-full" style={{ background: PIE_COLORS[idx] || comp.color }} />
                    <span className="flex-1 font-medium">{comp.name}</span>
                    <span className="text-sm font-bold" style={{ color: COLORS.accent }}>{comp.shareOfVoice}%</span>
                    <div className="h-2 w-24 overflow-hidden rounded-full" style={{ background: COLORS.surface }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: comp.shareOfVoice + '%' }}
                        viewport={{ once: true }}
                        className="h-2 rounded-full"
                        style={{ background: PIE_COLORS[idx] || comp.color }}
                      />
                    </div>
                  </motion.div>
                ))}
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="mt-3 text-xs" style={{ color: COLORS.muted }}
                >
                  * Baseado em menções em blogs, redes sociais, fóruns e notícias nos últimos 30 dias
                </motion.p>
              </div>
            </div>
          </section>

          {/* ========== 7. GAP ANALYSIS ========== */}
          <section className="mb-16">
            <SectionTitle icon={Zap} title="Gap Analysis" subtitle="Onde seu negócio pode se destacar" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {GAP_ANALYSIS.map((gap, idx) => {
                const gapScore = gap.yourScore - gap.marketAvg;
                const barColor = gapScore > 0 ? COLORS.accent : '#ef4444';
                return (
                  <motion.div
                    key={gap.area}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <GlassCard className="p-5 transition-all duration-300 hover:border-[#3DF5C5]/20">
                      <div className="mb-3 flex items-start justify-between">
                        <h3 className="font-semibold">{gap.area}</h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                          gap.priority === 'high' ? 'bg-red-500/20 text-red-400'
                          : gap.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {gap.priority}
                        </span>
                      </div>
                      <div className="mb-2 space-y-1">
                        <div className="flex justify-between text-xs" style={{ color: COLORS.muted }}>
                          <span>Seu Score</span>
                          <span className="font-bold" style={{ color: COLORS.accent }}>{gap.yourScore}/10</span>
                        </div>
                        <div className="h-2 w-full rounded-full" style={{ background: COLORS.surface }}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: (gap.yourScore / 10) * 100 + '%' }}
                            viewport={{ once: true }}
                            className="h-2 rounded-full"
                            style={{ background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accent}80)` }}
                          />
                        </div>
                      </div>
                      <div className="mb-3 space-y-1">
                        <div className="flex justify-between text-xs" style={{ color: COLORS.muted }}>
                          <span>Média do Mercado</span>
                          <span className="font-bold">{gap.marketAvg}/10</span>
                        </div>
                        <div className="h-2 w-full rounded-full" style={{ background: COLORS.surface }}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: (gap.marketAvg / 10) * 100 + '%' }}
                            viewport={{ once: true }}
                            className="h-2 rounded-full"
                            style={{ background: COLORS.muted + '60' }}
                          />
                        </div>
                      </div>
                      <div
                        className="flex items-center gap-1 rounded-lg p-2 text-xs font-medium"
                        style={{
                          background: gapScore > 0 ? 'rgba(61,245,197,0.08)' : 'rgba(239,68,68,0.08)',
                          color: barColor,
                        }}
                      >
                        {gapScore > 0 ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                        {gapScore > 0
                          ? `Vantagem de ${gapScore} pontos — sua fortaleza`
                          : `Gap de ${Math.abs(gapScore)} pontos — priorizar melhoria`}
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* ========== ADD COMPETITOR MODAL ========== */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl"
              style={{ background: COLORS.surface, borderColor: COLORS.glassBorder }}
            >
              <div className="flex items-center justify-between border-b p-6" style={{ borderColor: COLORS.glassBorder }}>
                <div>
                  <h2 className="text-xl font-bold">Adicionar Concorrente</h2>
                  <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
                    Insira os dados do novo concorrente para monitoramento
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-2 transition-colors hover:bg-white/5"
                >
                  <X size={20} />
                </motion.button>
              </div>
              <div className="space-y-4 p-6">
                {[
                  { label: 'Nome da Empresa', placeholder: 'Ex: TechCorp AI' },
                  { label: 'Website', placeholder: 'https://exemplo.com', type: 'url' },
                  { label: 'Segmento', placeholder: 'Ex: IA Generativa' },
                  { label: 'Preço Base', placeholder: 'Ex: $199/mês' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="mb-1.5 block text-sm font-medium" style={{ color: COLORS.muted }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type || 'text'}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-[#7A8694]/50 focus:border-[#3DF5C5]/40"
                      style={{ background: COLORS.bg, borderColor: COLORS.glassBorder, color: COLORS.text }}
                    />
                  </div>
                ))}
                <div>
                  <label className="mb-1.5 block text-sm font-medium" style={{ color: COLORS.muted }}>
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Breve descrição do concorrente..."
                    className="w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-[#7A8694]/50 focus:border-[#3DF5C5]/40"
                    style={{ background: COLORS.bg, borderColor: COLORS.glassBorder, color: COLORS.text }}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t p-6" style={{ borderColor: COLORS.glassBorder }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
                  style={{ borderColor: COLORS.glassBorder, color: COLORS.muted }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors"
                  style={{ background: COLORS.accent, color: COLORS.bg }}
                >
                  Adicionar Concorrente
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Analysis Form */}
      <AnalyzeForm open={showAnalyzeForm} onClose={() => setShowAnalyzeForm(false)} />

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-16 border-t pt-8 text-center text-sm"
        style={{ borderColor: COLORS.glassBorder, color: COLORS.muted }}
      >
        <p className="flex items-center justify-center gap-2">
          <Activity size={14} style={{ color: COLORS.accent }} />
          Competitive Intelligence Platform ·{' '}
          {dataSource === 'mock-fallback' ? 'Modo Fallback — dados estáticos' : `Conectado à CIE Platform (${dataSource})`}
        </p>
      </motion.footer>
    </main>
  );
}
