'use client';

/* ==========================================================================
   /builder — Dashboard do Builder Visual
   ========================================================================== */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LayoutGrid, Plus, FileText, BarChart3, ArrowRight } from 'lucide-react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { BuilderProvider, useBuilderStore } from '@/components/Builder/BuilderStore';
import { TemplateCard } from '@/components/Builder/TemplateCard';
import { TEMPLATES } from '@/components/Builder/BuilderTypes';

function BuilderDashboardContent() {
  const router = useRouter();
  const { state, createProject, dispatch } = useBuilderStore();
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(undefined);

  const stats = {
    totalProjects: state.projects.length,
    totalTemplates: TEMPLATES.length,
    recentProjects: state.projects.slice(0, 6),
  };

  const handleCreateProject = () => {
    const name = projectName.trim() || `Projeto ${new Date().toLocaleDateString('pt-BR')}`;
    const project = createProject(name, selectedTemplate);
    dispatch({ type: 'SET_PROJECT', project });
    setShowModal(false);
    setProjectName('');
    setSelectedTemplate(undefined);
    router.push(`/builder/${project.id}`);
  };

  const handleOpenProject = (id: string) => {
    const project = state.projects.find(p => p.id === id);
    if (project) {
      dispatch({ type: 'SET_PROJECT', project });
      router.push(`/builder/${id}`);
    }
  };

  return (
    <main className="min-h-screen bg-ios-base">
      <Nav />

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-16 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_30%,rgba(61,245,197,0.04),transparent_70%)]" />
        <div className="container-ios relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-ios-accent/15 bg-ios-accent-dim px-4 py-1.5 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-ios-accent" />
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ios-accent">Builder · v1.0</span>
            </div>
            <h1 className="heading-display text-[clamp(2rem,5vw,3.5rem)] text-ios-text max-w-3xl">
              Construa seu site visualmente
            </h1>
            <p className="mt-4 max-w-xl text-ios-text-secondary text-base leading-relaxed">
              Arraste e solte componentes, edite propriedades e exporte HTML limpo.
              Sem código, sem complicação.
            </p>
          </motion.div>

          {/* ── Stats ── */}
          <motion.div
            className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {[
              { icon: <FileText size={18} />, label: 'Projetos criados', value: stats.totalProjects },
              { icon: <LayoutGrid size={18} />, label: 'Templates disponíveis', value: stats.totalTemplates },
              { icon: <BarChart3 size={18} />, label: 'Componentes', value: 10 },
            ].map((stat, i) => (
              <div key={i} className="card-surface p-4 flex items-center gap-3">
                <div className="text-ios-accent/70">{stat.icon}</div>
                <div>
                  <div className="text-lg font-bold text-ios-text">{stat.value}</div>
                  <div className="text-[10px] text-ios-muted uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Ações ── */}
      <section className="py-8 px-6">
        <div className="container-ios">
          <motion.button
            onClick={() => setShowModal(true)}
            className="btn-accent gap-2 px-6 py-3 text-sm font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} />
            Criar novo projeto
          </motion.button>
        </div>
      </section>

      {/* ── Projetos Recentes ── */}
      <section className="py-8 px-6">
        <div className="container-ios">
          <h2 className="heading-md text-ios-text mb-6">Projetos Recentes</h2>
          {stats.recentProjects.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {stats.recentProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  className="card-surface p-4 cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleOpenProject(project.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-ios-accent/10 flex items-center justify-center text-ios-accent text-sm">◧</div>
                    <ArrowRight size={14} className="text-ios-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-sm font-semibold text-ios-text mb-1">{project.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-ios-muted font-mono">
                    <span>{project.blocks.length} blocos</span>
                    <span>·</span>
                    <span>{new Date(project.updatedAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-ios-border rounded-xl">
              <p className="text-ios-muted text-sm">Nenhum projeto ainda. Crie seu primeiro projeto!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Templates em Destaque ── */}
      <section className="py-12 px-6">
        <div className="container-ios">
          <h2 className="heading-md text-ios-text mb-6">Templates em Destaque</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.slice(0, 6).map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Modal Criar Projeto ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-ios-surface border border-ios-border rounded-xl max-w-md w-full p-6 shadow-ios-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <h3 className="font-display text-lg font-semibold text-ios-text mb-4">Criar Novo Projeto</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-ios-muted font-medium mb-1">Nome do projeto</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Meu projeto incrível"
                    className="w-full bg-ios-base border border-ios-border rounded-lg px-3 py-2 text-sm text-ios-text placeholder:text-ios-muted/50 focus:border-ios-accent focus:outline-none"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs text-ios-muted font-medium mb-2">Template inicial (opcional)</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    <button
                      onClick={() => setSelectedTemplate(undefined)}
                      className={`p-2 rounded-lg border text-xs text-left transition-colors ${!selectedTemplate ? 'border-ios-accent bg-ios-accent/10 text-ios-accent' : 'border-ios-border text-ios-text-secondary hover:border-ios-accent/30'}`}
                    >
                      <div className="font-semibold mb-0.5">Vazio</div>
                      <div className="text-[10px] text-ios-muted">Começar do zero</div>
                    </button>
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTemplate(t.id)}
                        className={`p-2 rounded-lg border text-xs text-left transition-colors ${selectedTemplate === t.id ? 'border-ios-accent bg-ios-accent/10 text-ios-accent' : 'border-ios-border text-ios-text-secondary hover:border-ios-accent/30'}`}
                      >
                        <div className="font-semibold mb-0.5 truncate">{t.name}</div>
                        <div className="text-[10px] text-ios-muted truncate">{t.category}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6 justify-end">
                <button onClick={() => setShowModal(false)} className="btn-outline px-4 py-2 text-xs">
                  Cancelar
                </button>
                <button onClick={handleCreateProject} className="btn-accent px-4 py-2 text-xs font-semibold">
                  Criar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

export default function BuilderPage() {
  return (
    <BuilderProvider>
      <BuilderDashboardContent />
    </BuilderProvider>
  );
}
