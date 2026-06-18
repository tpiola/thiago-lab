'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useBuilderStore } from './BuilderStore';
import type { Template } from './BuilderTypes';

export function TemplateCard({ template }: { template: Template }) {
  const router = useRouter();
  const { createProject, dispatch } = useBuilderStore();

  const handleUse = () => {
    const project = createProject(template.name, template.id);
    dispatch({ type: 'SET_PROJECT', project });
    router.push(`/builder/${project.id}`);
  };

  return (
    <motion.div
      className="card-surface overflow-hidden group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="aspect-video bg-ios-surface-2 flex items-center justify-center border-b border-ios-border overflow-hidden">
        <div className="text-5xl opacity-20 group-hover:scale-110 transition-transform duration-500">
          {template.category === 'Landing Pages' ? '◧' :
           template.category === 'Apps' ? '▦' :
           template.category === 'E-commerce' ? '🛒' :
           template.category === 'Portfolios' ? '👤' :
           template.category === 'Blogs' ? '📝' :
           template.category === 'Sites' ? '🌐' : '◧'}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-ios-accent/70 bg-ios-accent-dim rounded-full px-2 py-0.5">
            {template.category}
          </span>
        </div>
        <h3 className="font-semibold text-sm text-ios-text mb-1">{template.name}</h3>
        <p className="text-xs text-ios-text-secondary mb-3">{template.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ios-muted font-mono">{template.blocks.length} blocos</span>
          <div className="ml-auto">
            <button
              onClick={handleUse}
              className="btn-accent text-[11px] px-3 py-1.5 font-semibold"
            >
              Usar template
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
