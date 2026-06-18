'use client';
import { motion } from 'framer-motion';
import { useBuilderStore } from '../BuilderStore';
import type { BuilderBlock } from '../BuilderTypes';

export function PricingBlock({ block }: { block: BuilderBlock }) {
  const { state } = useBuilderStore();
  const p = block.props as { title?: string; monthly?: boolean; plans?: Array<{ name: string; price: number; features: string[]; featured?: boolean }> };
  const isSelected = state.selectedBlockId === block.id;
  const plans = p.plans || [];

  return (
    <motion.section
      layout
      className={`relative px-6 py-16 rounded-xl border-2 transition-colors ${isSelected ? 'border-ios-accent' : 'border-transparent'}`}
      style={{ background: '#06080C' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="heading-lg text-center mb-10 text-ios-text">{p.title || 'Planos'}</h2>
      <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            className={`rounded-xl p-6 text-center border ${plan.featured ? 'border-ios-accent/50 shadow-ios-glow-sm' : 'border-ios-border'} bg-ios-surface-2`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <h3 className="font-semibold text-ios-text mb-1">{plan.name}</h3>
            <div className="text-3xl font-bold text-ios-accent my-3">
              R${plan.price}<span className="text-sm text-ios-muted">/mês</span>
            </div>
            <ul className="text-left space-y-2 mb-6">
              {(plan.features || []).map((f, j) => (
                <li key={j} className="text-sm text-ios-text-secondary flex items-center gap-2">
                  <span className="text-ios-accent">✓</span> {f}
                </li>
              ))}
            </ul>
            <span className={`inline-block px-5 py-2 rounded-md text-sm font-semibold ${plan.featured ? 'btn-accent' : 'btn-outline'}`}>
              Escolher
            </span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
