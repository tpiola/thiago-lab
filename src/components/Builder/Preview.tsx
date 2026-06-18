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
  const sections = blocks.map((b) => renderPreviewBlock(b)).join('\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(name)}</title>
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

function renderPreviewBlock(block: BuilderBlock): string {
  const p = block.props as Record<string, unknown>;
  const id = block.id;

  switch (block.type) {
    case 'hero': {
      const title = esc(String(p.title ?? ''));
      const subtitle = esc(String(p.subtitle ?? ''));
      const cta = esc(String(p.cta ?? ''));
      const bgColor = String(p.bgColor ?? '#06080C');
      const accentColor = String(p.accentColor ?? '#3DF5C5');
      return `<section id="${id}" style="background:${bgColor};color:#E8EDF2;padding:6rem 1.5rem;text-align:center;min-height:80vh;display:flex;flex-direction:column;justify-content:center;align-items:center">
        <h1 style="font-size:clamp(2rem,6vw,4rem);font-weight:700;max-width:800px;margin:0 auto 1rem;line-height:1.1">${title}</h1>
        <p style="font-size:1.25rem;color:#B0B8C4;max-width:600px;margin:0 auto 2rem">${subtitle}</p>
        <a href="#" style="display:inline-block;background:${accentColor};color:#06080C;padding:0.75rem 2rem;border-radius:8px;font-weight:600;font-size:1rem">${cta}</a>
      </section>`;
    }
    case 'features': {
      const title = esc(String(p.title ?? 'Recursos'));
      const items = (p.items as Array<Record<string, string>>) || [];
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#0C0F15">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;max-width:1200px;margin:0 auto">
          ${items.map((item) =>
            `<div style="background:#12161E;border:1px solid #1E2433;border-radius:12px;padding:1.5rem">
              ${item.icon ? `<div style="font-size:2rem;margin-bottom:0.5rem">${item.icon}</div>` : ''}
              <h3 style="color:#E8EDF2;margin:0 0 0.5rem">${esc(item.title ?? '')}</h3>
              <p style="color:#7A8694;margin:0">${esc(item.desc ?? '')}</p>
            </div>`
          ).join('\n          ')}
        </div>
      </section>`;
    }
    case 'pricing': {
      const title = esc(String(p.title ?? 'Planos'));
      const plans = (p.plans as Array<Record<string, unknown>>) || [];
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#06080C">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;max-width:1000px;margin:0 auto">
          ${plans.map((plan) => {
            const name = esc(String(plan.name ?? ''));
            const price = String(plan.price ?? '');
            const featured = !!plan.featured;
            const features = (plan.features as string[]) || [];
            return `<div style="background:#12161E;border:1px solid ${featured ? '#3DF5C5' : '#1E2433'};border-radius:12px;padding:2rem;text-align:center">
              <h3 style="color:#E8EDF2;margin:0 0 0.5rem">${name}</h3>
              <div style="font-size:2.5rem;font-weight:700;color:#3DF5C5;margin:1rem 0">R$${price}<span style="font-size:1rem;color:#7A8694">/mês</span></div>
              <ul style="list-style:none;padding:0;margin:1.5rem 0;color:#B0B8C4">
                ${features.map((f) => `<li style="padding:0.375rem 0">✓ ${esc(f)}</li>`).join('\n                ')}
              </ul>
              <a href="#" style="display:inline-block;background:${featured ? '#3DF5C5' : 'transparent'};color:${featured ? '#06080C' : '#E8EDF2'};border:1px solid ${featured ? '#3DF5C5' : '#1E2433'};padding:0.75rem 2rem;border-radius:8px;font-weight:600">Escolher</a>
            </div>`;
          }).join('\n          ')}
        </div>
      </section>`;
    }
    case 'testimonials': {
      const title = esc(String(p.title ?? 'Depoimentos'));
      const items = (p.items as Array<Record<string, string>>) || [];
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#0C0F15">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;max-width:1000px;margin:0 auto">
          ${items.map((item) =>
            `<div style="background:#12161E;border:1px solid #1E2433;border-radius:12px;padding:1.5rem">
              <p style="color:#B0B8C4;font-style:italic;margin:0 0 1rem">"${esc(item.text ?? '')}"</p>
              <div><strong style="color:#E8EDF2">${esc(item.name ?? '')}</strong><span style="color:#7A8694;margin-left:0.5rem">${esc(item.role ?? '')}</span></div>
            </div>`
          ).join('\n          ')}
        </div>
      </section>`;
    }
    case 'faq': {
      const title = esc(String(p.title ?? 'FAQ'));
      const items = (p.items as Array<Record<string, string>>) || [];
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#06080C">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="max-width:700px;margin:0 auto">
          ${items.map((item) =>
            `<details style="background:#12161E;border:1px solid #1E2433;border-radius:12px;margin-bottom:0.75rem;padding:1rem">
              <summary style="color:#E8EDF2;font-weight:600;cursor:pointer">${esc(item.q ?? '')}</summary>
              <p style="color:#7A8694;margin-top:0.75rem">${esc(item.a ?? '')}</p>
            </details>`
          ).join('\n          ')}
        </div>
      </section>`;
    }
    case 'cta': {
      const title = esc(String(p.title ?? ''));
      const subtitle = esc(String(p.subtitle ?? ''));
      const buttonText = esc(String(p.buttonText ?? ''));
      return `<section id="${id}" style="padding:4rem 1.5rem;text-align:center;background:linear-gradient(135deg,#1A1F2B,#0C0F15)">
        <h2 style="font-size:2rem;color:#E8EDF2;margin:0 0 0.5rem">${title}</h2>
        <p style="color:#B0B8C4;margin:0 0 2rem">${subtitle}</p>
        <a href="#" style="display:inline-block;background:#3DF5C5;color:#06080C;padding:0.75rem 2rem;border-radius:8px;font-weight:600">${buttonText}</a>
      </section>`;
    }
    case 'footer': {
      const copyright = esc(String(p.copyright ?? ''));
      const links = (p.links as Array<Record<string, string>>) || [];
      return `<footer id="${id}" style="padding:2rem 1.5rem;background:#06080C;border-top:1px solid #1E2433;text-align:center">
        <p style="color:#7A8694;margin:0 0 1rem">${copyright}</p>
        <div style="display:flex;justify-content:center;gap:1.5rem">
          ${links.map((link) =>
            `<a href="${esc(link.href ?? '#')}" style="color:#B0B8C4;text-decoration:none;font-size:0.875rem">${esc(link.label ?? '')}</a>`
          ).join('\n          ')}
        </div>
      </footer>`;
    }
    case 'stats': {
      const title = esc(String(p.title ?? ''));
      const items = (p.items as Array<Record<string, unknown>>) || [];
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#0C0F15">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem;max-width:800px;margin:0 auto;text-align:center">
          ${items.map((item) =>
            `<div>
              <div style="font-size:2.5rem;font-weight:700;color:#3DF5C5">${String(item.value ?? 0)}</div>
              <div style="color:#7A8694;margin-top:0.25rem">${esc(String(item.label ?? ''))}</div>
            </div>`
          ).join('\n          ')}
        </div>
      </section>`;
    }
    case 'gallery': {
      const title = esc(String(p.title ?? 'Galeria'));
      const images = (p.images as Array<Record<string, string>>) || [];
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#06080C">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;max-width:1000px;margin:0 auto">
          ${images.map((img) =>
            `<div style="border-radius:12px;overflow:hidden;background:#12161E;aspect-ratio:16/10">
              <img src="${esc(img.src ?? '/placeholder.svg')}" alt="${esc(img.alt ?? '')}" style="width:100%;height:100%;object-fit:cover" />
            </div>`
          ).join('\n          ')}
        </div>
      </section>`;
    }
    case 'contact': {
      const title = esc(String(p.title ?? 'Contato'));
      const email = esc(String(p.email ?? ''));
      const phone = esc(String(p.phone ?? ''));
      const address = esc(String(p.address ?? ''));
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#06080C">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="max-width:500px;margin:0 auto;text-align:center">
          ${email ? `<p style="color:#B0B8C4;margin:0.5rem 0">✉ ${email}</p>` : ''}
          ${phone ? `<p style="color:#B0B8C4;margin:0.5rem 0">📞 ${phone}</p>` : ''}
          ${address ? `<p style="color:#B0B8C4;margin:0.5rem 0">📍 ${address}</p>` : ''}
        </div>
      </section>`;
    }
    default:
      return '';
  }
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
