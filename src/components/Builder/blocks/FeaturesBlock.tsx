'use client';
import { motion } from 'framer-motion';
import { useBuilderStore } from '../BuilderStore';
import type { BuilderBlock } from '../BuilderTypes';

export function FeaturesBlock({ block }: { block: BuilderBlock }) {
  const { state } = useBuilderStore();
  const p = block.props as { title?: string; columns?: number; items?: Array<{ icon: string; title: string; desc: string }> };
  const isSelected = state.selectedBlockId === block.id;
  const items = p.items || [];

  return (
    <motion.section
      layout
      className={`relative px-6 py-16 rounded-xl border-2 transition-colors ${isSelected ? 'border-ios-accent' : 'border-transparent'}`}
      style={{ background: '#0C0F15' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="heading-lg text-center mb-10 text-ios-text">{p.title || 'Features'}</h2>
      <div
        className="grid gap-4 max-w-4xl mx-auto"
        style={{ gridTemplateColumns: `repeat(${Math.min(p.columns || 3, 4)}, 1fr)` }}
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="card-surface p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="text-2xl mb-2">{item.icon || '⚡'}</div>
            <h3 className="font-semibold text-sm text-ios-text mb-1">{item.title || ''}</h3>
            <p className="text-xs text-ios-text-secondary">{item.desc || ''}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
