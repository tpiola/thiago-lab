'use client';
import { motion } from 'framer-motion';
import { useBuilderStore } from '../BuilderStore';
import type { BuilderBlock } from '../BuilderTypes';

export function GalleryBlock({ block }: { block: BuilderBlock }) {
  const { state } = useBuilderStore();
  const p = block.props as { title?: string; images?: Array<{ src: string; alt: string }> };
  const isSelected = state.selectedBlockId === block.id;
  const images = p.images || [];

  return (
    <motion.section
      layout
      className={`relative px-6 py-16 rounded-xl border-2 transition-colors ${isSelected ? 'border-ios-accent' : 'border-transparent'}`}
      style={{ background: '#0C0F15' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="heading-lg text-center mb-10 text-ios-text">{p.title || 'Galeria'}</h2>
      <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {images.map((img, i) => (
          <motion.div
            key={i}
            className="aspect-video rounded-lg bg-ios-surface-2 flex items-center justify-center border border-ios-border overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="text-4xl opacity-30">🖼</div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
