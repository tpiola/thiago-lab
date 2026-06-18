'use client';
import { motion } from 'framer-motion';
import { COMPONENT_META } from './BuilderTypes';
import type { BlockType } from './BuilderTypes';
import { useBuilderStore } from './BuilderStore';

const BLOCK_TYPES: BlockType[] = ['hero', 'features', 'pricing', 'testimonials', 'faq', 'cta', 'stats', 'gallery', 'contact', 'footer'];

const ICON_MAP: Record<string, string> = {
  Layout: '◧',
  Grid3x3: '⊞',
  DollarSign: '$',
  MessageSquare: '💬',
  HelpCircle: '?',
  Target: '◎',
  Copyright: '©',
  BarChart3: '📊',
  Image: '🖼',
  Mail: '✉',
};

export function ComponentPalette() {
  const { dispatch, state } = useBuilderStore();

  const handleAddBlock = (type: BlockType) => {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
    const meta = COMPONENT_META[type];
    dispatch({
      type: 'ADD_BLOCK',
      block: { id, type, props: { ...meta.defaultProps } },
    });
  };

  return (
    <div className="w-64 flex-shrink-0 bg-ios-surface border-r border-ios-border overflow-y-auto h-full">
      <div className="p-4 border-b border-ios-border">
        <h3 className="text-xs font-semibold text-ios-muted uppercase tracking-wider">Componentes</h3>
      </div>
      <div className="p-2 space-y-1">
        {BLOCK_TYPES.map((type, i) => {
          const meta = COMPONENT_META[type];
          return (
            <motion.button
              key={type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => handleAddBlock(type)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ios-text-secondary hover:bg-ios-accent/5 hover:text-ios-text transition-all text-left border border-transparent hover:border-ios-accent/20"
            >
              <span className="text-base w-6 text-center">{ICON_MAP[meta.icon] || '▣'}</span>
              <span className="font-medium">{meta.label}</span>
              <span className="ml-auto text-xs text-ios-muted">+</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
