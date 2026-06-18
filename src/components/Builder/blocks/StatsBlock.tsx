'use client';
import { motion } from 'framer-motion';
import { useBuilderStore } from '../BuilderStore';
import type { BuilderBlock } from '../BuilderTypes';

export function StatsBlock({ block }: { block: BuilderBlock }) {
  const { state } = useBuilderStore();
  const p = block.props as { title?: string; items?: Array<{ label: string; value: number }> };
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
      <h2 className="heading-lg text-center mb-10 text-ios-text">{p.title || 'Stats'}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-center">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="text-3xl font-bold text-ios-accent">{item.value || 0}</div>
            <div className="text-xs text-ios-muted mt-1">{item.label || ''}</div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
