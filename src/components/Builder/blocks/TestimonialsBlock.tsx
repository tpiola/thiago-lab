'use client';
import { motion } from 'framer-motion';
import { useBuilderStore } from '../BuilderStore';
import type { BuilderBlock } from '../BuilderTypes';

export function TestimonialsBlock({ block }: { block: BuilderBlock }) {
  const { state } = useBuilderStore();
  const p = block.props as { title?: string; items?: Array<{ name: string; role: string; text: string }> };
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
      <h2 className="heading-lg text-center mb-10 text-ios-text">{p.title || 'Depoimentos'}</h2>
      <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="card-surface p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <p className="text-sm text-ios-text-secondary italic mb-3">&ldquo;{item.text || ''}&rdquo;</p>
            <div>
              <strong className="text-sm text-ios-text">{item.name || ''}</strong>
              <span className="text-xs text-ios-muted ml-2">{item.role || ''}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
