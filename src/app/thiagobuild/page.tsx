'use client';

/* ==========================================================================
   /thiagobuild — Gerador de Sites via IA (v0/Framer-like)
   Prompt → Site React + Tailwind completo.
   Design escuro premium, preview inline, cópia de código.
   thiagolab.com
   ========================================================================== */

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Icons (inline SVGs to avoid deps) ──────────────────────────────────────

const IconSparkles = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const IconWand = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const IconCopy = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const IconLoader = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const IconEye = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// ─── Types ─────────────────────────────────────────────────────────────────

interface GenerateResult {
  success: boolean;
  data?: {
    html: string;
    sections: string[];
    colors: Record<string, string>;
    fonts: { name: string; display: string; body: string };
    prompt_analysis: {
      siteName: string;
      type: string;
      industry: string;
      tone: string;
      sections: string[];
    };
    rawCode: string;
    generationTime: number;
    timing?: {
      interpretation: number;
      generation: number;
      total: number;
    };
  };
  error?: string;
}

// ─── Examples ───────────────────────────────────────────────────────────────

const EXAMPLES = [
  'Crie uma landing page para uma clínica de estética avançada em São Paulo',
  'Site para startup de IA que automatiza atendimento ao cliente',
  'Landing page premium para imobiliária de alto padrão no Rio',
  'Portfolio de fotógrafo de casamentos com estilo luxuoso',
  'Site institucional para restaurante japonês em Brasília',
  'Landing page dark mode para agência de marketing digital',
];

// ─── Analyze Display ────────────────────────────────────────────────────────

function AnalyzeBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
      <span className="text-[10px] font-medium uppercase tracking-wider text-white/40">{label}</span>
      <span className="text-xs font-semibold text-white/80">{value}</span>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function ThaigoBuildPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResult['data'] | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const previewRef = useRef<HTMLIFrameElement>(null);

  const handleGenerate = useCallback(async () => {
    const text = prompt.trim();
    if (!text || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

    try {
      const res = await fetch('/api/generator/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });

      const data: GenerateResult = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro ao gerar site');
      }

      setResult(data.data!);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [prompt, loading]);

  const handleCopyCode = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = result.html;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  }, [handleGenerate]);

  return (
    <main className="min-h-screen bg-[#08080A] text-white overflow-x-hidden">
      {/* ── Background ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(212,175,55,0.08),transparent_70%)]" />
        <div className="absolute top-40 left-20 w-96 h-96 bg-[#D4AF37]/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-40 right-20 w-[500px] h-[500px] bg-[#6C3BF7]/[0.02] rounded-full blur-[150px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ── Header ── */}
      <header className="relative z-10 border-b border-white/[0.06] backdrop-blur-sm bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#C9A94E] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                <span className="text-black font-bold text-xs">TB</span>
              </div>
              <div>
                <span className="font-semibold text-sm text-white">ThiagoBuild</span>
                <span className="ml-2 text-[10px] font-mono text-white/30 uppercase tracking-wider">v0 · AI Generator</span>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <a
                href="https://thiagolab.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                thiagolab.com
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 pt-16 pb-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-6">
              <IconSparkles />
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#D4AF37]">
                AI Site Generator · Prompt to Code
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Crie sites completos com{' '}
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#F5E6A3] to-[#C9A94E] bg-clip-text text-transparent">
                inteligência artificial
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              Descreva seu site em linguagem natural. A IA interpreta, gera o design, e produz código React + Tailwind premium.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Prompt Input ── */}
      <section className="relative z-10 px-4 sm:px-6 pb-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Ex: "Crie uma landing page dark mode para uma clínica de estética avançada..."'
                rows={4}
                disabled={loading}
                className="w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-5 pr-24 font-mono text-sm text-white/90 placeholder:text-white/20 transition-all focus:border-[#D4AF37]/30 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/10 disabled:opacity-50"
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <span className="hidden sm:inline font-mono text-[10px] text-white/20">
                  ⌘+Enter
                </span>
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#D4AF37] to-[#C9A94E] text-black hover:opacity-90 transition-all disabled:opacity-30 shadow-lg shadow-[#D4AF37]/10"
                >
                  {loading ? (
                    <>
                      <IconLoader />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <IconWand />
                      Gerar
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Examples */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/20 mt-0.5">Exemplos:</span>
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(ex)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg text-[11px] text-white/40 bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:text-white/70 transition-all disabled:opacity:30"
                >
                  {ex.slice(0, 40)}...
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Error ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 mb-6"
          >
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
              ❌ {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading ── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <IconLoader />
                <div className="absolute inset-0 animate-pulse rounded-full bg-[#D4AF37]/10 blur-lg" />
              </div>
              <div className="font-mono text-sm text-white/60">
                <span className="text-[#D4AF37]">$</span> thiagobuild generate
              </div>
              <div className="space-y-1">
                {['Interpretando prompt...', 'Selecionando design tokens...', 'Montando seções...', 'Gerando código...'].map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.8 }}
                    className="font-mono text-[11px] text-white/30"
                  >
                    {'>'} {step}
                  </motion.div>
                ))}
              </div>
              <div className="w-48 h-1 rounded-full bg-white/[0.06] overflow-hidden mt-2">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C9A94E]"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 12, ease: 'linear' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Result ── */}
      <AnimatePresence>
        {result && !loading && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 px-4 sm:px-6 pb-20"
          >
            <div className="max-w-7xl mx-auto">
              {/* Analysis Bar */}
              <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <AnalyzeBadge label="Site" value={result.prompt_analysis.siteName} />
                <AnalyzeBadge label="Tipo" value={result.prompt_analysis.type} />
                <AnalyzeBadge label="Setor" value={result.prompt_analysis.industry} />
                <AnalyzeBadge label="Tom" value={result.prompt_analysis.tone} />
                <AnalyzeBadge label="Seções" value={`${result.sections.length}`} />
                <AnalyzeBadge label="Tempo" value={`${(result.generationTime / 1000).toFixed(1)}s`} />
                <AnalyzeBadge label="Paleta" value={result.fonts.name} />
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setShowPreview(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    showPreview
                      ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20'
                      : 'text-white/40 hover:text-white/70 border border-transparent'
                  }`}
                >
                  <IconEye />
                  Preview
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    !showPreview
                      ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20'
                      : 'text-white/40 hover:text-white/70 border border-transparent'
                  }`}
                >
                  <IconCopy />
                  Código
                </button>
                <div className="flex-1" />
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-white/70 hover:text-white transition-all border border-white/[0.06]"
                >
                  {copied ? (
                    <>
                      <IconCheck />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <IconCopy />
                      Copiar código
                    </>
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-black/60 backdrop-blur-sm">
                {showPreview ? (
                  <div className="aspect-[16/9] w-full">
                    <iframe
                      ref={previewRef}
                      srcDoc={result.html}
                      className="w-full h-full bg-white"
                      title="Site Preview"
                      sandbox="allow-scripts"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <pre className="p-6 overflow-auto max-h-[70vh] text-xs leading-relaxed font-mono text-white/80">
                      <code>{result.html}</code>
                    </pre>
                    <div className="absolute top-0 right-0 p-3">
                      <button
                        onClick={handleCopyCode}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-white/[0.08] hover:bg-white/[0.12] text-white/50 hover:text-white/80 transition-all"
                      >
                        {copied ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="mt-4 flex items-center gap-4 text-[11px] text-white/30 font-mono">
                <span>HTML gerado: {(result.html.length / 1024).toFixed(1)} KB</span>
                <span>·</span>
                <span>Seções: {result.sections.length}</span>
                <span>·</span>
                <span>Interpretação: {(result.timing?.interpretation || 0) / 1000}s</span>
                <span>·</span>
                <span>Geração: {(result.timing?.generation || 0) / 1000}s</span>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.04] py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            ThiagoBuild AI · Gerador de Sites via IA · © {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-white/20">Next.js · Tailwind · OmniRoute</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span className="text-[10px] text-white/20">v0-like · Premium Templates</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
