'use client';
import { motion } from 'framer-motion';
import { useBuilderStore } from '../BuilderStore';
import type { BuilderBlock } from '../BuilderTypes';

export function HeroBlock({ block }: { block: BuilderBlock }) {
  const { state } = useBuilderStore();
  const p = block.props as { title?: string; subtitle?: string; cta?: string; bgColor?: string; accentColor?: string };
  const isSelected = state.selectedBlockId === block.id;

  return (
    <motion.section
      layout
      className={`relative min-h-[50vh] flex items-center justify-center px-6 py-20 text-center overflow-hidden rounded-xl border-2 transition-colors ${isSelected ? 'border-ios-accent' : 'border-transparent'}`}
      style={{ background: p.bgColor || '#06080C' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_40%,rgba(61,245,197,0.04),transparent_70%)]" />
      <div className="relative z-10 max-w-3xl">
        <motion.h1
          className="heading-display text-balance text-[clamp(1.5rem,4vw,2.5rem)] leading-[1.05] text-ios-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {p.title || 'Hero Title'}
        </motion.h1>
        <motion.p
          className="mt-4 max-w-xl mx-auto text-balance text-base leading-relaxed text-ios-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {p.subtitle || 'Subtitle'}
        </motion.p>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="btn-accent px-6 py-2.5 text-sm font-semibold inline-block">
            {p.cta || 'CTA Button'}
          </span>
        </motion.div>
      </div>
    </motion.section>
  );
}
