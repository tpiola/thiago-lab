'use client';

/* ==========================================================================
   Preview — Preview em tempo real dos blocks
   Com viewport switcher: Mobile / Tablet / Desktop
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { useMemo, useState } from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { useBuilderStore } from './BuilderStore';
import type { BuilderBlock } from './BuilderTypes';
import { renderBlockHtml, escHtml } from '@/lib/generator/blockHtml';

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

const VIEWPORT_SIZES: Record<ViewportSize, { width: number; label: string }> = {
  mobile:  { width: 375, label: 'Mobile' },
  tablet:  { width: 768, label: 'Tablet' },
  desktop: { width: 100,  label: 'Desktop' },
};

const VIEWPORT_ICONS: Record<ViewportSize, React.ReactNode> = {
  mobile:  <Smartphone size={14} />,
  tablet:  <Tablet size={14} />,
  desktop: <Monitor size={14} />,
};

export function Preview() {
  const { state } = useBuilderStore();
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [isOpen, setIsOpen] = useState(false);

  const previewHtml = useMemo(() => {
    if (!state.project || state.project.blocks.length === 0) return '';
    return generatePreviewHtml(state.project.name, state.project.blocks);
  }, [state.project]);

  if (!state.project) return null;

  const currentVp = VIEWPORT_SIZES[viewport];
  const vpWidth = currentVp.width === 100 ? '100%' : `${currentVp.width}px`;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 bg-ios-accent text-ios-base text-sm font-semibold rounded-xl shadow-ios-glow-lg hover:shadow-ios-glow-md transition-all"
        title="Abrir Preview"
      >
        <Monitor size={16} />
        Preview
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ios-base/80 backdrop-blur-sm">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-4 py-2 bg-ios-surface border-b border-ios-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-ios-text">🔍 Preview</span>
          <span className="text-[11px] text-ios-muted font-mono">
            {state.project.blocks.length} blocos
          </span>
        </div>

        <div className="flex items-center gap-1 bg-ios-base rounded-lg p-0.5 border border-ios-border">
          {(Object.keys(VIEWPORT_SIZES) as ViewportSize[]).map((vp) => (
            <button
              key={vp}
              onClick={() => setViewport(vp)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-md transition-all ${
                viewport === vp
                  ? 'bg-ios-accent text-ios-base font-semibold'
                  : 'text-ios-muted hover:text-ios-text'
              }`}
            >
              {VIEWPORT_ICONS[vp]}
              {VIEWPORT_SIZES[vp].label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="px-3 py-1.5 text-xs text-ios-muted hover:text-ios-text transition-colors"
        >
          ✕ Fechar
        </button>
      </div>

      {/* ── Iframe ── */}
      <div className="flex-1 flex items-start justify-center overflow-auto p-4">
        <div
          className="bg-white rounded-xl overflow-hidden shadow-ios-modal transition-all duration-300"
          style={{
            width: vpWidth,
            maxWidth: '100%',
            height: viewport === 'desktop' ? '100%' : '812px',
          }}
        >
          {previewHtml ? (
            <iframe
              srcDoc={previewHtml}
              className="w-full h-full border-0"
              title="Preview do site"
              sandbox="allow-scripts"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-ios-muted text-sm">
              Adicione blocos para ver o preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Gerar HTML do preview ──────────────────────────────────────────── */

function generatePreviewHtml(name: string, blocks: BuilderBlock[]): string {
  const sections = blocks.map((b) => renderBlockHtml(b)).join('\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(name)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #06080C;
      color: #E8EDF2;
      -webkit-font-smoothing: antialiased;
    }
    a { transition: all 0.2s; text-decoration: none; }
    img { max-width: 100%; height: auto; }
    details summary { cursor: pointer; }
    details summary::-webkit-details-marker { color: #3DF5C5; }
  </style>
</head>
<body>
  ${sections}
</body>
</html>`;
}
