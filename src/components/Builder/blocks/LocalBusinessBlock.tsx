'use client';
import { motion } from 'framer-motion';
import { useBuilderStore } from '../BuilderStore';
import type { BuilderBlock } from '../BuilderTypes';

export function LocalBusinessBlock({ block }: { block: BuilderBlock }) {
  const { state } = useBuilderStore();
  const p = block.props as {
    businessName?: string;
    addressLocality?: string;
    addressRegion?: string;
    phone?: string;
    openingHours?: string;
    areaServed?: string;
    ratingValue?: string;
    reviewCount?: string;
  };
  const isSelected = state.selectedBlockId === block.id;

  return (
    <motion.section
      layout
      className={`relative px-6 py-12 rounded-xl border-2 transition-colors text-center ${isSelected ? 'border-ios-accent' : 'border-transparent'}`}
      style={{ background: '#0C0F15' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="inline-block mb-2 rounded-full border border-ios-accent/20 bg-ios-accent-dim px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-ios-accent">
        Schema.org · LocalBusiness
      </span>
      <h3 className="text-lg font-semibold text-ios-text mb-3">{p.businessName || 'Nome do Negócio'}</h3>
      <div className="max-w-sm mx-auto space-y-1.5 text-sm text-ios-text-secondary">
        {(p.addressLocality || p.addressRegion) && (
          <p>📍 {[p.addressLocality, p.addressRegion].filter(Boolean).join(', ')}</p>
        )}
        {p.phone && <p>📞 {p.phone}</p>}
        {p.openingHours && <p>🕒 {p.openingHours}</p>}
        {p.areaServed && <p className="text-ios-muted text-xs">Atendemos: {p.areaServed}</p>}
        {p.ratingValue && (
          <p className="text-ios-accent font-semibold">★ {p.ratingValue} ({p.reviewCount || 0} avaliações)</p>
        )}
      </div>
    </motion.section>
  );
}
