'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Target, Loader2, X, CheckCircle,
  TrendingUp, TrendingDown, AlertTriangle,
  ArrowUp, ArrowDown, Building2, MapPin, Globe,
  Lightbulb, Shield, BarChart3,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface AnalysisResult {
  company: string;
  industry: string;
  location: string;
  swot: SWOT;
  overallScore: number;
  marketPosition: string;
  keyInsights: string[];
  recommendations: string[];
  source: string;
  analyzedAt: string;
}

const SWOT_CONFIG = [
  { key: 'strengths' as const, label: 'Forças', icon: ArrowUp, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { key: 'weaknesses' as const, label: 'Fraquezas', icon: ArrowDown, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  { key: 'opportunities' as const, label: 'Oportunidades', icon: TrendingUp, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { key: 'threats' as const, label: 'Ameaças', icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   ANALYZE FORM COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

interface AnalyzeFormProps {
  open: boolean;
  onClose: () => void;
}

export default function AnalyzeForm({ open, onClose }: AnalyzeFormProps) {
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/cie/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: company.trim(),
          industry: industry.trim() || undefined,
          location: location.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao analisar concorrente');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCompany('');
    setIndustry('');
    setLocation('');
    setResult(null);
    setError('');
  };

  const getPositionColor = (score: number) => {
    if (score >= 80) return '#3DF5C5';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getPositionLabel = (pos: string) => {
    const map: Record<string, string> = {
      leader: 'Líder de Mercado',
      challenger: 'Desafiante',
      niche: 'Nicho',
      emerging: 'Emergente',
    };
    return map[pos] || pos;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl overflow-y-auto rounded-2xl border shadow-2xl"
            style={{
              background: '#0C0F15',
              borderColor: 'rgba(61,245,197,0.08)',
              maxHeight: '90vh',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-6" style={{ borderColor: 'rgba(61,245,197,0.08)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[rgba(61,245,197,0.1)] border border-[rgba(61,245,197,0.08)] flex items-center justify-center">
                  <Target size={20} className="text-[#3DF5C5]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#E8EDF2]">Nova Análise de Concorrente</h2>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    Análise SWOT completa via CIE Platform + IA
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-[#6B7280] hover:text-[#E8EDF2] hover:bg-white/5 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form or Results */}
            {!result ? (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#9BA3B8] mb-1.5 flex items-center gap-2">
                    <Building2 size={14} className="text-[#3DF5C5]" />
                    Nome da Empresa *
                  </label>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Ex: DataPulse AI, NeuralStack..."
                    required
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-[#6B7280]/50"
                    style={{
                      background: '#06080C',
                      borderColor: 'rgba(61,245,197,0.1)',
                      color: '#E8EDF2',
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9BA3B8] mb-1.5 flex items-center gap-2">
                      <Globe size={14} className="text-[#3DF5C5]" />
                      Setor
                    </label>
                    <input
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="Ex: IA Generativa, SaaS..."
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-[#6B7280]/50"
                      style={{
                        background: '#06080C',
                        borderColor: 'rgba(61,245,197,0.1)',
                        color: '#E8EDF2',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9BA3B8] mb-1.5 flex items-center gap-2">
                      <MapPin size={14} className="text-[#3DF5C5]" />
                      Localização
                    </label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ex: San Francisco, Brasil..."
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-[#6B7280]/50"
                      style={{
                        background: '#06080C',
                        borderColor: 'rgba(61,245,197,0.1)',
                        color: '#E8EDF2',
                      }}
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl px-4 py-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400">
                    {error}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
                    style={{ borderColor: 'rgba(61,245,197,0.1)', color: '#6B7280' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!company.trim() || loading}
                    className="rounded-xl px-6 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    style={{
                      background: loading ? 'rgba(61,245,197,0.1)' : '#3DF5C5',
                      color: loading ? '#3DF5C5' : '#06080C',
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Search size={16} />
                        Analisar Concorrente
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Results */
              <div className="p-6 space-y-6">
                {/* Company Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#E8EDF2]">{result.company}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-[#6B7280]">
                      {result.industry && <span>{result.industry}</span>}
                      {result.location && <span>· {result.location}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-3xl font-bold"
                      style={{ color: getPositionColor(result.overallScore) }}
                    >
                      {result.overallScore}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold">
                      Score Geral
                    </div>
                  </div>
                </div>

                {/* Market Position */}
                <div
                  className="rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{
                    background: `${getPositionColor(result.overallScore)}10`,
                    border: `1px solid ${getPositionColor(result.overallScore)}20`,
                  }}
                >
                  <Shield size={20} style={{ color: getPositionColor(result.overallScore) }} />
                  <div>
                    <span className="font-semibold text-[#E8EDF2]">
                      {getPositionLabel(result.marketPosition)}
                    </span>
                    <span className="text-sm text-[#6B7280] ml-2">
                      · Análise via {result.source === 'omniroute-ai' ? 'OmniRoute IA' : result.source === 'cie-platform' ? 'CIE Platform' : 'Dados de Mercado'}
                    </span>
                  </div>
                </div>

                {/* SWOT Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SWOT_CONFIG.map((cat) => (
                    <div
                      key={cat.key}
                      className="rounded-xl p-4 border"
                      style={{
                        background: cat.bg,
                        borderColor: `${cat.color}20`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <cat.icon size={16} color={cat.color} />
                        <h4 className="font-semibold text-sm" style={{ color: cat.color }}>
                          {cat.label}
                        </h4>
                      </div>
                      <ul className="space-y-1.5">
                        {result.swot[cat.key].map((item, i) => (
                          <li key={i} className="text-xs text-[#9BA3B8] flex items-start gap-2">
                            <span className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Key Insights */}
                <div>
                  <h4 className="text-sm font-semibold text-[#E8EDF2] mb-3 flex items-center gap-2">
                    <Lightbulb size={14} className="text-[#3DF5C5]" />
                    Insights Principais
                  </h4>
                  <div className="space-y-2">
                    {result.keyInsights.map((insight, i) => (
                      <div
                        key={i}
                        className="rounded-xl px-4 py-3 text-sm border"
                        style={{
                          background: 'rgba(61,245,197,0.04)',
                          borderColor: 'rgba(61,245,197,0.08)',
                          color: '#9BA3B8',
                        }}
                      >
                        <span className="font-semibold text-[#3DF5C5] mr-2">#{i + 1}</span>
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="text-sm font-semibold text-[#E8EDF2] mb-3 flex items-center gap-2">
                    <BarChart3 size={14} className="text-[#3DF5C5]" />
                    Recomendações
                  </h4>
                  <div className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm border"
                        style={{
                          background: 'rgba(59,130,246,0.04)',
                          borderColor: 'rgba(59,130,246,0.08)',
                          color: '#9BA3B8',
                        }}
                      >
                        <CheckCircle size={16} className="text-[#3b82f6] flex-shrink-0 mt-0.5" />
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: 'rgba(61,245,197,0.08)' }}>
                  <span className="text-[10px] text-[#6B7280]">
                    Analisado em {new Date(result.analyzedAt).toLocaleString('pt-BR')}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={reset}
                      className="rounded-xl border px-5 py-2 text-xs font-medium transition-colors hover:bg-white/5"
                      style={{ borderColor: 'rgba(61,245,197,0.1)', color: '#6B7280' }}
                    >
                      Nova Análise
                    </button>
                    <button
                      onClick={onClose}
                      className="rounded-xl px-5 py-2 text-xs font-semibold"
                      style={{ background: '#3DF5C5', color: '#06080C' }}
                    >
                      Concluir
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
