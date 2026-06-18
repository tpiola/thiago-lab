/* ── Página Inicial – Thiago Lab ────────────────────────────────
 *
 *  Seções: Nav, Hero, Stack Log, Manifesto, Método, Cases, Lab Lite, Footer
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
      {/* Navigation fixa com glassmorphism */}
      <Nav />

      {/* 1. Hero — Pipeline de validação visual */}
      <Hero />

      {/* 2. Prova de que entende de IA — Stack Log */}
      <div className="reveal-fade">
        <StackLog />
      </div>

      {/* 3. Manifesto — visão do laboratório */}
      <div className="reveal-fade">
        <Manifesto />
      </div>

      {/* 4. Método — Diagnóstico → Sistema → Automação → Produto */}
      <div className="reveal-fade">
        <Method />
      </div>

      {/* 5. Prova de utilidade — 3 Cases */}
      <div className="reveal-fade">
        <Cases />
      </div>

      {/* 6. Captura final — Lab Lite + Supabase */}
      <div className="reveal-fade">
        <LabLite />
      </div>

      {/* 7. Footer */}
      <Footer />
    </main>
  );
}
