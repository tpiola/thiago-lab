'use client';
import React, { useCallback, useRef, type DragEvent, type ReactNode } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useBuilderStore } from './BuilderStore';
import type { BuilderBlock, BlockType } from './BuilderTypes';
import { COMPONENT_META } from './BuilderTypes';
import { HeroBlock } from './blocks/HeroBlock';
import { FeaturesBlock } from './blocks/FeaturesBlock';
import { PricingBlock } from './blocks/PricingBlock';
import { TestimonialsBlock } from './blocks/TestimonialsBlock';
import { FAQBlock } from './blocks/FAQBlock';
import { CTABlock } from './blocks/CTABlock';
import { FooterBlock } from './blocks/FooterBlock';
import { StatsBlock } from './blocks/StatsBlock';
import { GalleryBlock } from './blocks/GalleryBlock';
import { ContactBlock } from './blocks/ContactBlock';

const BLOCK_RENDERERS: Record<BlockType, (props: { block: BuilderBlock }) => ReactNode> = {
  hero: HeroBlock,
  features: FeaturesBlock,
  pricing: PricingBlock,
  testimonials: TestimonialsBlock,
  faq: FAQBlock,
  cta: CTABlock,
  footer: FooterBlock,
  stats: StatsBlock,
  gallery: GalleryBlock,
  contact: ContactBlock,
};

function BlockRenderer({ block, onSelect }: { block: BuilderBlock; onSelect: (id: string) => void }) {
  const Renderer = BLOCK_RENDERERS[block.type];
  if (!Renderer) return null;
  return (
    <div onClick={() => onSelect(block.id)} className="cursor-pointer">
      <Renderer block={block} />
    </div>
  );
}

export function BuilderCanvas() {
  const { state, dispatch } = useBuilderStore();
  const dragItem = useRef<number | null>(null);

  const handleSelect = useCallback((id: string) => {
    dispatch({ type: 'SELECT_BLOCK', blockId: id });
  }, [dispatch]);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('blockType') as BlockType;
    if (type && COMPONENT_META[type]) {
      const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
      dispatch({
        type: 'ADD_BLOCK',
        block: { id, type, props: { ...COMPONENT_META[type].defaultProps } },
      });
    }
  }, [dispatch]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  if (!state.project) {
    return (
      <div className="flex-1 flex items-center justify-center bg-ios-base">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-30">◧</div>
          <p className="text-ios-muted">Selecione ou crie um projeto</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto bg-ios-base"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        {state.project.blocks.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-ios-border rounded-xl">
            <p className="text-ios-muted mb-2">Arraste componentes aqui</p>
            <p className="text-xs text-ios-muted/60">Use o painel esquerdo para adicionar blocos</p>
          </div>
        )}
        <Reorder.Group
          axis="y"
          values={state.project.blocks}
          onReorder={(blocks) => dispatch({ type: 'REORDER_BLOCKS', blocks })}
          className="space-y-4"
        >
          {state.project.blocks.map((block) => (
            <Reorder.Item key={block.id} value={block}>
              <BlockRenderer block={block} onSelect={handleSelect} />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
}
