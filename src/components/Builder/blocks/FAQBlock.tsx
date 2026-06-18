'use client';
import { motion } from 'framer-motion';
import { useBuilderStore } from '../BuilderStore';
import type { BuilderBlock } from '../BuilderTypes';

export function FAQBlock({ block }: { block: BuilderBlock }) {
  const { state } = useBuilderStore();
  const p = block.props as { title?: string; items?: Array<{ q: string; a: string }> };
  const isSelected = state.selectedBlockId === block.id;
  const items = p.items || [];

  return (
    <motion.section
      layout
      className={`relative px-6 py-16 rounded-xl border-2 transition-colors ${isSelected ? 'border-ios-accent' : 'border-transparent'}`}
      style={{ background: '#06080C' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="heading-lg text-center mb-10 text-ios-text">{p.title || 'FAQ'}</h2>
      <div className="max-w-2xl mx-auto space-y-3">
        {items.map((item, i) => (
          <motion.details
            key={i}
            className="card-surface p-4 cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <summary className="font-semibold text-sm text-ios-text list-none flex items-center justify-between">
              {item.q || ''}
              <span className="text-ios-accent transform transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="text-sm text-ios-text-secondary mt-3">{item.a || ''}</p>
          </motion.details>
        ))}
      </div>
    </motion.section>
  );
}
