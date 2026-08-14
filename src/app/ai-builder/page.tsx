'use client';

/* ==========================================================================
   /ai-builder — Prompt-to-Site via IA
   Gera sites completos a partir de descrições em linguagem natural
   thiagolab.com
   ========================================================================== */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Terminal,
  Wand2,
  ArrowRight,
  RotateCcw,
  Loader2,
  ChevronDown,
  FileText,
  Eye,
  AlertCircle,
  Check,
} from 'lucide-react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { COMPONENT_META } from '@/components/Builder/BuilderTypes';
import type { BlockType, BuilderProject, BuilderBlock } from '@/components/Builder/BuilderTypes';

/* ─── Modelos Disponíveis ─── */
interface ModelOption {
  id: string;
  name: string;
  gatewayModel: string;
  color: string;
}

const MODELS: ModelOption[] = [
  { id: 'deepseek-v4', name: 'DeepSeek V4', gatewayModel: 'oc/deepseek-v4-flash-free', color: 'text-blue-400' },
  { id: 'claude-sonnet-5', name: 'Claude Sonnet 5', gatewayModel: 'oc/claude-sonnet-5-free', color: 'text-orange-400' },
  { id: 'gpt-5', name: 'GPT-5', gatewayModel: 'oc/gpt-5-free', color: 'text-emerald-400' },
];

/* ─── Exemplos de Prompt ─── */
const EXAMPLES = [
  'Site para farmácia de manipulação',
  'Landing page para startup de IA',
  'Portfolio de fotógrafo profissional',
  'Site institucional para clínica médica',
  'Loja virtual de artesanato',
  'Blog de tecnologia e programação',
];

/* ─── Block label map ─── */
const BLOCK_LABELS: Record<BlockType, string> = {
  hero: 'Hero',
  features: 'Recursos',
  pricing: 'Preços',
  testimonials: 'Depoimentos',
  faq: 'FAQ',
  cta: 'CTA',
  footer: 'Rodapé',
  stats: 'Estatísticas',
  gallery: 'Galeria',
  contact: 'Contato',
  whatsapp: 'WhatsApp CTA',
  localBusiness: 'LocalBusiness (SEO)',
};

/* ─── Mini Preview de um bloco ─── */
function MiniBlockPreview({ block }: { block: BuilderBlock }) {
  const meta = COMPONENT_META[block.type];
  const props = block.props as Record<string, unknown>;

  const getPreview = () => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="space-y-1">
            <div className="text-xs font-bold text-white truncate">
              {String(props.title || meta?.defaultProps?.title || '')}
            </div>
            <div className="text-[9px] text-ios-muted truncate">
              {String(props.subtitle || meta?.defaultProps?.subtitle || '')}
            </div>
          </div>
        );
      case 'features': {
        const items = (props.items || meta?.defaultProps?.items || []) as Array<Record<string, string>>;
        return (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-white truncate">
              {String(props.title || 'Recursos')}
            </div>
            <div className="flex gap-1 flex-wrap">
              {items.slice(0, 3).map((item, i) => (
                <span key={i} className="text-[8px] bg-ios-accent/10 text-ios-accent px-1.5 py-0.5 rounded">
                  {item.title || item.icon}
                </span>
              ))}
            </div>
          </div>
        );
      }
      case 'pricing': {
        const plans = (props.plans || meta?.defaultProps?.plans || []) as Array<Record<string, unknown>>;
        return (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-white truncate">
              {String(props.title || 'Planos')}
            </div>
            <div className="flex gap-1 flex-wrap">
              {plans.slice(0, 3).map((plan, i) => (
                <span key={i} className="text-[8px] bg-ios-accent/10 text-ios-accent px-1.5 py-0.5 rounded">
                  {String(plan.name)}: R${String(plan.price)}
                </span>
              ))}
            </div>
          </div>
        );
      }
      case 'testimonials': {
        const items = (props.items || meta?.defaultProps?.items || []) as Array<Record<string, string>>;
        return (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-white truncate">
              {String(props.title || 'Depoimentos')}
            </div>
            <div className="space-y-0.5">
              {items.slice(0, 2).map((item, i) => (
                <div key={i} className="text-[9px] text-ios-text-secondary truncate">
                  "{item.name}: {item.text?.slice(0, 40)}"
                </div>
              ))}
            </div>
          </div>
        );
      }
      case 'faq': {
        const items = (props.items || meta?.defaultProps?.items || []) as Array<Record<string, string>>;
        return (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-white truncate">
              {String(props.title || 'FAQ')}
            </div>
            <div className="space-y-0.5">
              {items.slice(0, 2).map((item, i) => (
                <div key={i} className="text-[9px] text-ios-text-secondary truncate">
                  Q: {item.q}
                </div>
              ))}
            </div>
          </div>
        );
      }
      case 'cta':
        return (
          <div className="space-y-1">
            <div className="text-xs font-bold text-white truncate">
              {String(props.title || meta?.defaultProps?.title || '')}
            </div>
            <div className="text-[9px] text-ios-muted truncate">
              {String(props.subtitle || '')}
            </div>
            <div className="inline-block text-[8px] bg-ios-accent text-black px-2 py-0.5 rounded font-semibold mt-1">
              {String(props.buttonText || 'CTA')}
            </div>
          </div>
        );
      case 'stats': {
        const items = (props.items || meta?.defaultProps?.items || []) as Array<Record<string, unknown>>;
        return (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-white truncate">
              {String(props.title || 'Estatísticas')}
            </div>
            <div className="flex gap-2">
              {items.slice(0, 4).map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-[10px] font-bold text-ios-accent">{String(item.value)}</div>
                  <div className="text-[7px] text-ios-muted">{String(item.label)}</div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case 'gallery': {
        const images = (props.images || meta?.defaultProps?.images || []) as Array<Record<string, string>>;
        return (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-white truncate">
              {String(props.title || 'Galeria')}
            </div>
            <div className="flex gap-1">
              {images.slice(0, 3).map((img, i) => (
                <div key={i} className="w-4 h-4 rounded bg-ios-accent/20 flex items-center justify-center text-[6px] text-ios-muted">
                  📷
                </div>
              ))}
            </div>
          </div>
        );
      }
      case 'contact':
        return (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-white truncate">
              {String(props.title || 'Contato')}
            </div>
            <div className="text-[9px] text-ios-muted truncate">
              {String(props.email || '')}
            </div>
          </div>
        );
      case 'footer':
        return (
          <div className="text-[9px] text-ios-muted truncate">
            {String(props.copyright || meta?.defaultProps?.copyright || '')}
          </div>
        );
      default:
        return (
          <div className="text-[10px] text-ios-muted">
            {block.type}
          </div>
        );
    }
  };

  return (
    <div className="border border-ios-border/60 rounded-lg bg-ios-surface/50 p-2.5 min-h-[48px] flex items-start gap-2">
      <div className="shrink-0 w-5 h-5 rounded flex items-center justify-center bg-ios-accent/10 text-ios-accent text-[9px] font-mono font-bold">
        {block.type === 'hero' ? 'H' :
         block.type === 'footer' ? 'F' :
         block.type === 'features' ? 'F' :
         block.type === 'pricing' ? 'P' :
         block.type === 'testimonials' ? 'T' :
         block.type === 'faq' ? 'Q' :
         block.type === 'cta' ? 'C' :
         block.type === 'stats' ? 'S' :
         block.type === 'gallery' ? 'G' :
         block.type === 'contact' ? 'E' : 'B'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[9px] font-mono font-medium text-ios-muted uppercase tracking-wider mb-0.5">
          {BLOCK_LABELS[block.type] || block.type}
        </div>
        {getPreview()}
      </div>
    </div>
  );
}

/* ─── Loading Animation ─── */
function LoadingAnimation() {
  const [step, setStep] = useState(0);
  const steps = [
    'Interpretando seu prompt...',
    'Gerando estrutura do site...',
    'Criando blocos e conteúdo...',
    'Validando layout...',
    'Quase lá...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="relative mb-8">
        <Loader2 size={32} className="text-ios-accent animate-spin" />
        <div className="absolute inset-0 animate-pulse rounded-full bg-ios-accent/20 blur-xl" />
      </div>
      <div className="font-mono text-sm text-ios-text mb-2">
        <span className="text-ios-accent">$</span> building_site.sh
      </div>
      <div className="h-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="font-mono text-[11px] text-ios-muted"
          >
            {`> ${steps[step]}`}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-6 flex gap-1">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-ios-accent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>
      <div className="mt-8 w-64 h-1 rounded-full bg-ios-border overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-ios-accent"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 15, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function AiBuilderPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BuilderProject | null>(null);

  /* Gerar site via IA */
  const handleGenerate = async () => {
    const text = prompt.trim();
    if (!text || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/ai-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          model: selectedModel.gatewayModel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao gerar site');
      }

      setResult(data.project);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  /* Salvar projeto e redirecionar para o editor */
  const handleOpenInEditor = () => {
    if (!result) return;

    // Store in sessionStorage temporarily (will be loaded by builder page)
    const existing = JSON.parse(sessionStorage.getItem('ai-builder-projects') || '{}');
    existing[result.id] = result;
    sessionStorage.setItem('ai-builder-projects', JSON.stringify(existing));

    router.push(`/builder/${result.id}?from=ai-builder`);
  };

  /* Regenerar */
  const handleRegenerate = () => {
    setResult(null);
    handleGenerate();
  };

  return (
    <main className="min-h-screen bg-ios-base">
      <Nav />

      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 opacity-20 bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(61,245,197,0.06),transparent_70%)]" aria-hidden="true" />

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-12 px-6">
        <div className="container-ios">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-ios-accent/15 bg-ios-accent-dim px-4 py-1.5 mb-6">
              <Sparkles size={12} className="text-ios-accent" />
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ios-accent">AI Builder · Prompt-to-Site</span>
            </div>
            <h1 className="heading-display text-[clamp(1.8rem,4vw,3rem)] text-ios-text max-w-2xl">
              Crie sites com <span className="text-ios-accent">inteligência artificial</span>
            </h1>
            <p className="mt-4 max-w-xl text-ios-text-secondary text-base leading-relaxed">
              Descreva seu site em linguagem natural e a IA gera blocos prontos para editar no Builder visual.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Prompt Input ── */}
      <section className="px-6 pb-8">
        <div className="container-ios">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto"
          >
            {/* Model Selector + Input */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <button
                  onClick={() => setModelMenuOpen(!modelMenuOpen)}
                  className="flex items-center gap-2 rounded-lg border border-ios-border bg-ios-surface px-3 py-2 font-mono text-[11px] font-medium text-ios-text transition-all hover:border-ios-accent/30"
                >
                  <Sparkles size={12} className={selectedModel.color} />
                  {selectedModel.name}
                  <ChevronDown size={12} className={`text-ios-muted transition-transform ${modelMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {modelMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-1 w-44 overflow-hidden rounded-lg border border-ios-border bg-ios-surface shadow-ios-modal z-50"
                    >
                      {MODELS.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => { setSelectedModel(model); setModelMenuOpen(false); }}
                          className={`flex w-full items-center gap-3 px-3 py-2.5 text-left font-mono text-xs transition-colors hover:bg-ios-accent/5 ${
                            selectedModel.id === model.id ? 'bg-ios-accent/10 text-ios-accent' : 'text-ios-text-secondary'
                          }`}
                        >
                          <Sparkles size={12} className={model.color} />
                          <span className="flex-1">{model.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <span className="font-mono text-[10px] text-ios-muted">
                OmniRoute Gateway · {selectedModel.name}
              </span>
            </div>

            {/* Input */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Descreva seu site em detalhes..."
                rows={4}
                className="w-full resize-none rounded-xl border border-ios-border bg-ios-surface p-4 font-mono text-sm text-ios-text placeholder:text-ios-muted/50 transition-all focus:border-ios-accent/40 focus:outline-none focus:ring-1 focus:ring-ios-accent/20"
                disabled={loading}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span className="font-mono text-[9px] text-ios-muted">
                  {prompt.length} caracteres
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading}
                className="btn-accent gap-2 px-6 py-3 text-sm font-semibold disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Wand2 size={16} />
                    Gerar Site
                  </>
                )}
              </button>

              {result && (
                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  className="btn-outline gap-2 px-4 py-3 text-sm"
                >
                  <RotateCcw size={14} />
                  Gerar novamente
                </button>
              )}
            </div>

            {/* Examples */}
            {!result && !loading && (
              <div className="mt-6">
                <p className="font-mono text-[10px] text-ios-muted uppercase tracking-wider mb-2">Exemplos</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLES.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(ex)}
                      className="rounded-full border border-ios-border/60 px-3 py-1.5 font-mono text-[10px] text-ios-text-secondary transition-all hover:border-ios-accent/30 hover:text-ios-accent hover:bg-ios-accent/5"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Loading State ── */}
      {loading && (
        <section className="px-6 pb-16">
          <div className="container-ios">
            <div className="max-w-2xl mx-auto">
              <div className="border border-ios-border/60 rounded-xl bg-ios-surface/30 p-8">
                <LoadingAnimation />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Error State ── */}
      {error && (
        <section className="px-6 pb-16">
          <div className="container-ios">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="border border-red-500/30 rounded-xl bg-red-500/5 p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm text-red-400 mb-1">Erro ao gerar site</h3>
                    <p className="font-mono text-[11px] text-red-300/80">{error}</p>
                    <button
                      onClick={handleGenerate}
                      className="mt-3 text-xs text-red-400 hover:text-red-300 underline underline-offset-2"
                    >
                      Tentar novamente
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Result Preview ── */}
      {result && !loading && (
        <section className="px-6 pb-20">
          <div className="container-ios">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-ios-accent/10 flex items-center justify-center">
                    <FileText size={16} className="text-ios-accent" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm text-ios-text">{result.name}</h2>
                    <div className="font-mono text-[10px] text-ios-muted">
                      {result.blocks.length} blocos · {result.blocks.filter(b => b.type !== 'footer').length} seções
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenInEditor}
                    className="btn-accent gap-2 px-4 py-2 text-xs font-semibold"
                  >
                    <Eye size={14} />
                    Abrir no Editor
                  </button>
                </div>
              </div>

              {/* Block previews */}
              <div className="space-y-2">
                {result.blocks.map((block) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MiniBlockPreview block={block} />
                  </motion.div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={handleOpenInEditor}
                  className="btn-accent gap-2 px-6 py-3 text-sm font-semibold flex-1 justify-center"
                >
                  <Eye size={16} />
                  Abrir no Editor Visual
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  className="btn-outline gap-2 px-4 py-3 text-sm"
                >
                  <RotateCcw size={14} />
                  Regenerar
                </button>
              </div>

              {/* Tip */}
              <div className="mt-6 p-4 rounded-xl bg-ios-accent/5 border border-ios-accent/10">
                <div className="flex items-start gap-2">
                  <Terminal size={14} className="text-ios-accent shrink-0 mt-0.5" />
                  <div className="text-[11px] text-ios-text-secondary leading-relaxed">
                    <span className="text-ios-accent font-semibold">Dica:</span> Você pode editar cada bloco no editor visual — trocar textos, cores, imagens e reorganizar a ordem. O projeto é totalmente personalizável.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
