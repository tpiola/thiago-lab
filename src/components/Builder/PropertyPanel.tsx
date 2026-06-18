'use client';
import { motion } from 'framer-motion';
import { useBuilderStore } from './BuilderStore';
import { COMPONENT_META } from './BuilderTypes';
import type { BlockType } from './BuilderTypes';

export function PropertyPanel() {
  const { state, dispatch } = useBuilderStore();
  const selectedBlock = state.project?.blocks.find(b => b.id === state.selectedBlockId);

  if (!selectedBlock) {
    return (
      <div className="w-72 flex-shrink-0 bg-ios-surface border-l border-ios-border overflow-y-auto h-full">
        <div className="p-4 border-b border-ios-border">
          <h3 className="text-xs font-semibold text-ios-muted uppercase tracking-wider">Propriedades</h3>
        </div>
        <div className="p-4 text-center text-xs text-ios-muted mt-8">
          Selecione um componente para editar
        </div>
      </div>
    );
  }

  const meta = COMPONENT_META[selectedBlock.type as BlockType];
  const props = selectedBlock.props as Record<string, unknown>;

  const updateProp = (key: string, value: unknown) => {
    dispatch({
      type: 'UPDATE_BLOCK_PROPS',
      blockId: selectedBlock.id,
      props: { [key]: value },
    });
  };

  const handleRemove = () => {
    dispatch({ type: 'REMOVE_BLOCK', blockId: selectedBlock.id });
  };

  const handleMoveUp = () => {
    dispatch({ type: 'MOVE_BLOCK', blockId: selectedBlock.id, direction: 'up' });
  };

  const handleMoveDown = () => {
    dispatch({ type: 'MOVE_BLOCK', blockId: selectedBlock.id, direction: 'down' });
  };

  return (
    <div className="w-72 flex-shrink-0 bg-ios-surface border-l border-ios-border overflow-y-auto h-full">
      <div className="p-4 border-b border-ios-border flex items-center justify-between">
        <h3 className="text-xs font-semibold text-ios-muted uppercase tracking-wider">
          {meta?.label || 'Componente'}
        </h3>
        <div className="flex gap-1">
          <button onClick={handleMoveUp} className="p-1 text-ios-muted hover:text-ios-text text-xs" title="Mover para cima">↑</button>
          <button onClick={handleMoveDown} className="p-1 text-ios-muted hover:text-ios-text text-xs" title="Mover para baixo">↓</button>
          <button onClick={handleRemove} className="p-1 text-ios-error hover:text-red-400 text-xs" title="Remover">✕</button>
        </div>
      </div>
      <div className="p-3 space-y-3">
        {Object.entries(props).map(([key, value]) => (
          <PropertyField key={key} label={key} value={value} onChange={(v) => updateProp(key, v)} />
        ))}
      </div>
    </div>
  );
}

function PropertyField({ label, value, onChange }: { label: string; value: unknown; onChange: (v: unknown) => void }) {
  const displayLabel = label.charAt(0).toUpperCase() + label.slice(1).replace(/([A-Z])/g, ' $1');

  if (Array.isArray(value)) {
    return (
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wider text-ios-muted font-semibold">{displayLabel}</label>
        <div className="text-[11px] text-ios-text-secondary bg-ios-base rounded p-2 border border-ios-border">
          {value.length} item(ns) — edição avançada em breve
        </div>
      </div>
    );
  }

  if (typeof value === 'object' && value !== null) {
    return (
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wider text-ios-muted font-semibold">{displayLabel}</label>
        <div className="text-[11px] text-ios-text-secondary bg-ios-base rounded p-2 border border-ios-border">
          Objeto — edição avançada em breve
        </div>
      </div>
    );
  }

  const strValue = String(value ?? '');

  if (strValue.startsWith('#')) {
    return (
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wider text-ios-muted font-semibold">{displayLabel}</label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-ios-border bg-transparent"
          />
          <input
            type="text"
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-ios-base border border-ios-border rounded px-2 py-1.5 text-xs text-ios-text font-mono"
          />
        </div>
      </div>
    );
  }

  if (label === 'cta' || label === 'buttonText' || label === 'title' || label === 'subtitle' || label === 'copyright') {
    return (
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wider text-ios-muted font-semibold">{displayLabel}</label>
        <input
          type="text"
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-ios-base border border-ios-border rounded px-2 py-1.5 text-xs text-ios-text"
        />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase tracking-wider text-ios-muted font-semibold">{displayLabel}</label>
      <input
        type="text"
        value={strValue}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-ios-base border border-ios-border rounded px-2 py-1.5 text-xs text-ios-text"
      />
    </div>
  );
}
