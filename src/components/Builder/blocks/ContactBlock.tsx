'use client';
import { motion } from 'framer-motion';
import { useBuilderStore } from '../BuilderStore';
import type { BuilderBlock } from '../BuilderTypes';

export function ContactBlock({ block }: { block: BuilderBlock }) {
  const { state } = useBuilderStore();
  const p = block.props as { title?: string; email?: string; phone?: string; address?: string };
  const isSelected = state.selectedBlockId === block.id;

  return (
    <motion.section
      layout
      className={`relative px-6 py-16 rounded-xl border-2 transition-colors text-center ${isSelected ? 'border-ios-accent' : 'border-transparent'}`}
      style={{ background: '#06080C' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="heading-lg mb-8 text-ios-text">{p.title || 'Contato'}</h2>
      <div className="max-w-sm mx-auto space-y-3">
        {p.email && <p className="text-sm text-ios-text-secondary">✉ {p.email}</p>}
        {p.phone && <p className="text-sm text-ios-text-secondary">📞 {p.phone}</p>}
        {p.address && <p className="text-sm text-ios-text-secondary">📍 {p.address}</p>}
      </div>
    </motion.section>
  );
}
