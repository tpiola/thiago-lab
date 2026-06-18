'use client';

import { useEffect, useRef } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

/* ─── Pipeline Steps ─── */
const PIPELINE_STEPS = [
  {
    number: '01',
    title: 'Prompt validado',
    desc: 'Testamos sua pergunta contra milhares de variações para garantir respostas precisas e acionáveis.',
  },
  {
    number: '02',
    title: 'Workflow guiado',
    desc: 'Desenhamos o fluxo ideal — ferramentas, gatilhos, decisões — com supervisão humana em cada etapa crítica.',
  },
  {
    number: '03',
    title: 'Miniapp útil',
    desc: 'Entregamos um aplicativo mínimo que resolve exatamente um problema, sem bloatware nem assinatura mensal.',
  },
  {
    number: '04',
    title: 'Estudo de caso',
    desc: 'Documentamos todo o processo — o que funcionou, o que não funcionou e o ROI real — público e auditável.',
  },
];

/* ─── Component ─── */
export function Hero() {
  const cursorRef = useRef<HTMLSpanElement>(null);

  /* Ensures the terminal cursor class is active */
  useEffect(() => {
    if (!cursorRef.current) return;
    cursorRef.current.classList.add('terminal-cursor');
    return () => cursorRef.current?.classList.remove('terminal-cursor');
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-ios-base"
    >
      {/* ── Background Gradient ── */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_40%,rgba(61,245,197,0.04),transparent_70%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ios-accent/3 blur-[120px]" />

      <div className="container-ios relative z-10 flex flex-col items-center py-28 text-center sm:py-36">
        {/* ── Badge ── */}
        <div className="reveal animate-fade-in-up mb-6 flex items-center gap-2 rounded-full border border-ios-accent/15 bg-ios-accent-dim px-4 py-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-ios-accent shadow-ios-glow-sm" />
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ios-accent">
            Intelligence OS · v1.0
          </span>
        </div>

        {/* ── Title ── */}
        <h1 className="heading-display animate-fade-in-up text-balance max-w-4xl text-[clamp(2rem,6vw,4rem)] leading-[1.05] tracking-tight text-ios-text">
          Thiago Lab&nbsp;
          <span className="inline-flex items-baseline gap-1 text-gradient-accent">
            · Intelligence OS
            <span
              ref={cursorRef}
              className="inline-block h-[0.85em] w-[3px] translate-y-[1px] bg-ios-accent align-middle"
              style={{
                animation: 'terminalCursor 1s step-end infinite',
              }}
            />
          </span>
        </h1>

        {/* ── Subtitle ── */}
        <p className="animate-fade-in-up mt-6 max-w-2xl text-balance text-base leading-relaxed text-ios-text-secondary sm:text-lg">
          IA aplicada para transformar perguntas em decisões, sistemas e
          resultados.
        </p>

        {/* ── Description ── */}
        <p className="animate-fade-in-up mt-4 max-w-xl text-sm leading-relaxed text-ios-muted sm:text-base">
          Da validação ao deploy em produção. Cada projeto começa com uma
          pergunta e termina com um sistema funcionando — mensurável,
          documentado e seu.
        </p>

        {/* ── CTA Buttons ── */}
        <div className="animate-fade-in-up mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#biblioteca"
            className="btn-accent group gap-2 px-6 py-2.5 text-sm font-semibold"
          >
            Explorar biblioteca
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
          <a
            href="#metodo"
            className="btn-outline group gap-2 px-6 py-2.5 text-sm font-medium"
          >
            Ver método
            <ChevronRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
        </div>

        {/* ── Pipeline Grid 2×2 ── */}
        <div className="animate-fade-in-up mt-20 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          {PIPELINE_STEPS.map((step, i) => (
            <div
              key={step.number}
              className="reveal card-surface group flex flex-col gap-2 p-5 text-left sm:p-6"
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ios-accent/60">
                  {step.number}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-ios-accent/10 to-transparent" />
              </div>
              <h3 className="font-mono text-sm font-semibold tracking-tight text-ios-text">
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed text-ios-text-secondary sm:text-sm">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom gradient fade ── */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ios-base to-transparent" />
    </section>
  );
}

export default Hero;
