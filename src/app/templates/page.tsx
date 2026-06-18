'use client';

/* ==========================================================================
   /templates — Galeria de Templates
   ========================================================================== */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid3X3, Layout, ShoppingCart, User, FileText, Globe } from 'lucide-react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { BuilderProvider } from '@/components/Builder/BuilderStore';
import { TemplateCard } from '@/components/Builder/TemplateCard';
import { TEMPLATES } from '@/components/Builder/BuilderTypes';

const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: Grid3X3 },
  { id: 'Sites', label: 'Sites', icon: Globe },
  { id: 'Apps', label: 'Apps', icon: Layout },
  { id: 'Landing Pages', label: 'Landing Pages', icon: Grid3X3 },
  { id: 'E-commerce', label: 'E-commerce', icon: ShoppingCart },
  { id: 'Portfolios', label: 'Portfolios', icon: User },
  { id: 'Blogs', label: 'Blogs', icon: FileText },
];

function TemplatesContent() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = TEMPLATES.filter((t) => {
    const matchCategory = activeCategory === 'all' || t.category === activeCategory;
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <main className="min-h-screen bg-ios-base">
      <Nav />

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-12 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_30%,rgba(61,245,197,0.04),transparent_70%)]" />
        <div className="container-ios relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-ios-accent/15 bg-ios-accent-dim px-4 py-1.5 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-ios-accent" />
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ios-accent">
                {TEMPLATES.length} Templates
              </span>
            </div>
            <h1 className="heading-display text-[clamp(2rem,5vw,3.5rem)] text-ios-text">
              Galeria de Templates
            </h1>
            <p className="mt-4 max-w-xl text-ios-text-secondary text-base leading-relaxed">
              Comece com um template pronto e personalize com o Builder visual.
            </p>
          </motion.div>

          {/* ── Search ── */}
          <motion.div
            className="mt-8 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ios-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar templates..."
                className="w-full bg-ios-surface border border-ios-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-ios-text placeholder:text-ios-muted/50 focus:border-ios-accent focus:outline-none transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Categorias ── */}
      <section className="px-6 pb-4">
        <div className="container-ios">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeCategory === cat.id
                      ? 'bg-ios-accent text-ios-base shadow-ios-glow-sm'
                      : 'bg-ios-surface border border-ios-border text-ios-text-secondary hover:border-ios-accent/30 hover:text-ios-text'
                  }`}
                >
                  <Icon size={14} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Grid de Templates ── */}
      <section className="py-8 px-6">
        <div className="container-ios">
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key={activeCategory + searchQuery}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {filtered.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="text-center py-20 border border-dashed border-ios-border rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-4xl mb-3 opacity-30">🔍</div>
                <p className="text-ios-muted text-sm">Nenhum template encontrado</p>
                <p className="text-xs text-ios-muted/60 mt-1">Tente ajustar a busca ou o filtro</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function TemplatesPage() {
  return (
    <BuilderProvider>
      <TemplatesContent />
    </BuilderProvider>
  );
}
