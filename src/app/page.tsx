/* ── Página Inicial – Thiago Lab ────────────────────────────────
 *
 *  Seções: Nav, Hero, Stack Log, Manifesto, Método, Cases, Lab Lite, Footer
 *  Animações: parallax bg, scroll-driven reveal, split text, counters, GSAP
 */

import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { StackLog } from "@/components/StackLog";
import { Manifesto } from "@/components/Manifesto";
import { Method } from "@/components/Method";
import { Cases } from "@/components/Cases";
import { LabLite } from "@/components/LabLite";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      {/* Global progress bar */}
      <div className="progress-bar-global" />

      {/* Navigation fixa com glassmorphism */}
      <Nav />

      {/* 1. Hero — with parallax bg layer */}
      <div className="parallax-bg">
        <div className="parallax-layer" style={{ backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(61,245,197,0.04), transparent 70%)' }} />
        <Hero />
      </div>

      {/* 2. Prova de que entende de IA — Stack Log */}
      <div className="scroll-reveal">
        <StackLog />
      </div>

      {/* 3. Manifesto — visão do laboratório */}
      <div className="scroll-reveal-left">
        <Manifesto />
      </div>

      {/* 4. Método — Diagnóstico → Sistema → Automação → Produto */}
      <div className="scroll-reveal-scale">
        <Method />
      </div>

      {/* 5. Prova de utilidade — 3 Cases */}
      <div className="scroll-reveal-right">
        <Cases />
      </div>

      {/* 6. Captura final — Lab Lite + Supabase */}
      <div className="scroll-reveal">
        <LabLite />
      </div>

      {/* 7. Footer */}
      <Footer />
    </main>
  );
}
