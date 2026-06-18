'use client';
import { motion } from 'framer-motion';
import { useBuilderStore } from '../BuilderStore';
import type { BuilderBlock } from '../BuilderTypes';

export function CTABlock({ block }: { block: BuilderBlock }) {
  const { state } = useBuilderStore();
  const p = block.props as { title?: string; subtitle?: string; buttonText?: string };
  const isSelected = state.selectedBlockId === block.id;

  return (
    <motion.section
      layout
      className={`relative px-6 py-16 rounded-xl border-2 transition-colors text-center ${isSelected ? 'border-ios-accent' : 'border-transparent'}`}
      style={{ background: 'linear-gradient(135deg, #1A1F2B 0%, #0C0F15 100%)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="heading-lg text-ios-text mb-2">{p.title || 'Pronto para começar?'}</h2>
      <p className="text-ios-text-secondary max-w-lg mx-auto mb-8">{p.subtitle || ''}</p>
      <span className="btn-accent px-6 py-2.5 text-sm font-semibold inline-block">
        {p.buttonText || 'Fale conosco'}
      </span>
    </motion.section>
  );
}
