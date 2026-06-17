'use client';

import { useEffect, useRef, useState } from 'react';
import { Terminal, Code, Cpu } from 'lucide-react';

/* ─── Component ─── */
export function Manifesto() {
  const [showCursor, setShowCursor] = useState(true);

  /* Blink cursor independently */
  useEffect(() => {
    const id = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="manifesto"
      className="relative overflow-hidden border-t border-ios-border/40 py-24 sm:py-32"
    >
      {/* ── Background ── */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_70%_50%,rgba(61,245,197,0.02),transparent)]" />

      <div className="container-ios relative">
        {/* ── Section Label ── */}
        <div className="reveal mb-6 flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-ios-accent/20 bg-ios-accent-dim px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-widest text-ios-accent">
            <Terminal size={12} />
            manifesto
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-ios-accent/20 to-transparent" />
        </div>

        {/* ── Terminal Banner ── */}
        <div className="reveal relative overflow-hidden rounded-2xl border border-ios-border bg-ios-surface/60 backdrop-blur-sm">
          {/* Terminal top bar */}
          <div className="flex items-center gap-2 border-b border-ios-border/50 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-ios-error/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-ios-warning/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-ios-accent/60" />
            <span className="ml-3 font-mono text-[10px] uppercase tracking-widest text-ios-muted">
              manifesto.sh
            </span>
          </div>

          {/* Terminal body */}
          <div className="flex flex-col gap-1 px-5 py-6 font-mono text-sm leading-relaxed sm:px-8 sm:py-8 sm:text-base">
            {/* Line 1 — Prompt */}
            <div className="flex items-start gap-2">
              <span className="shrink-0 text-ios-accent/70">$</span>
              <span className="text-ios-text-secondary/60">cat manifesto.md</span>
            </div>

            {/* Line 2 — Empty */}
            <div className="h-2" />

            {/* Line 3 — Core message */}
            <div className="flex items-start gap-2">
              <span className="shrink-0 text-ios-accent/70">&gt;</span>
              <span className="font-semibold text-ios-text">
                Não é blog.{' '}
                <span className="text-ios-accent">Não é curso.</span>{' '}
                É um{' '}
                <span className="text-gradient-accent font-semibold">
                  laboratório de aplicação.
                </span>
              </span>
              {showCursor && (
                <span className="inline-block h-[1em] w-[2px] animate-terminal-cursor bg-ios-accent" />
              )}
            </div>

            {/* Line 4 */}
            <div className="flex items-start gap-2">
              <span className="shrink-0 text-ios-accent/70">&gt;</span>
              <span className="text-ios-text-secondary">
                Aqui não se aprende IA — se{' '}
                <span className="text-ios-accent">aplica IA</span>.
              </span>
            </div>

            {/* Empty */}
            <div className="h-2" />

            {/* Line 5 — Result */}
            <div className="flex items-start gap-2">
              <span className="shrink-0 text-ios-accent/70">$</span>
              <span className="text-ios-muted">
                echo &quot;pronto para construir?&quot;
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 text-ios-accent/70">&gt;</span>
              <span className="text-ios-accent/80">&gt; yes</span>
            </div>
          </div>
        </div>

        {/* ── Manifesto Badges Row ── */}
        <div className="reveal mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              icon: Code,
              label: 'Código &gt; PowerPoint',
              desc: 'Nada de decks bonitos. Só pipeline rodando.',
            },
            {
              icon: Cpu,
              label: 'Aplicação &gt; Teoria',
              desc: 'Framework nenhum vale um miniapp que resolve.',
            },
            {
              icon: Terminal,
              label: 'Resultado &gt; Promessa',
              desc: 'Mensurável, documentado, auditável e seu.',
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="card-surface flex items-start gap-3 p-4"
                style={{ animationDelay: `${0.1 + i * 0.06}s` }}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ios-accent-dim">
                  <Icon size={15} className="text-ios-accent" />
                </div>
                <div>
                  <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-ios-text">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ios-text-secondary">
                    {item.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Manifesto;
