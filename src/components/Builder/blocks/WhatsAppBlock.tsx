'use client';
import { motion } from 'framer-motion';
import { useBuilderStore } from '../BuilderStore';
import type { BuilderBlock } from '../BuilderTypes';

export function WhatsAppBlock({ block }: { block: BuilderBlock }) {
  const { state } = useBuilderStore();
  const p = block.props as { phone?: string; message?: string; source?: string };
  const isSelected = state.selectedBlockId === block.id;
  const digits = String(p.phone ?? '').replace(/\D/g, '');

  return (
    <motion.section
      layout
      className={`relative px-6 py-6 rounded-xl border-2 transition-colors ${isSelected ? 'border-ios-accent' : 'border-transparent'}`}
      style={{ background: '#0C0F15' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between gap-4 max-w-md mx-auto rounded-full px-5 py-3" style={{ background: '#25D366', color: '#06080C' }}>
        <span className="text-sm font-semibold">💬 Falar no WhatsApp</span>
        <span className="text-[11px] font-mono opacity-70">+55 {digits || '(ddd) 9####-####'}</span>
      </div>
      <p className="mt-3 text-center text-[11px] text-ios-muted">
        Botão flutuante fixo no canto inferior direito · UTM: <span className="font-mono">{p.source || 'site'}</span>
      </p>
    </motion.section>
  );
}
