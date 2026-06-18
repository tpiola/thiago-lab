'use client';
import { motion } from 'framer-motion';
import { useBuilderStore } from '../BuilderStore';
import type { BuilderBlock } from '../BuilderTypes';

export function FooterBlock({ block }: { block: BuilderBlock }) {
  const { state } = useBuilderStore();
  const p = block.props as { copyright?: string; links?: Array<{ label: string; href: string }> };
  const isSelected = state.selectedBlockId === block.id;
  const links = p.links || [];

  return (
    <motion.footer
      layout
      className={`relative px-6 py-8 rounded-xl border-2 transition-colors text-center ${isSelected ? 'border-ios-accent' : 'border-transparent'}`}
      style={{ background: '#06080C' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-xs text-ios-muted mb-3">{p.copyright || '© 2025'}</p>
      <div className="flex justify-center gap-4">
        {links.map((link, i) => (
          <a key={i} href={link.href || '#'} className="text-xs text-ios-text-secondary hover:text-ios-accent transition-colors">
            {link.label || ''}
          </a>
        ))}
      </div>
    </motion.footer>
  );
}
