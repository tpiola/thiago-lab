/* ── Página Inicial – Thiago Lab ────────────────────────────────
 *
 *  Seções: Hero, Stack Log, Manifesto, Método, Cases, Lab Lite, Footer
 */

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
      <Hero />

      {/* 2. Prova de que entende de IA — Stack Log */}
      <StackLog />

      {/* 3. Manifesto */}
      <Manifesto />

      {/* 4. Método — Diagnóstico → Sistema → Automação → Produto */}
      <Method />

      {/* 5. Prova de utilidade — 3 Cases */}
      <Cases />

      {/* 6. Captura final — Lab Lite + Supabase */}
      <LabLite />

      {/* 7. Footer */}
      <Footer />
    </main>
  );
}
