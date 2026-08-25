import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de uso | Thiago Lab",
  description: "Condições para acesso e uso dos recursos do Thiago Lab.",
  alternates: { canonical: "/termos" },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F5F2E9] px-5 py-16 text-[#122024] md:px-8 md:py-24">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#087F70]">
          ← Voltar ao Thiago Lab
        </Link>
        <h1 className="mt-14 text-5xl font-semibold tracking-[-0.045em] md:text-7xl">
          Termos de uso
        </h1>
        <div className="mt-14 border-t border-[#6F756F]">
          {[
            ["Uso da plataforma", "O acesso deve respeitar a finalidade dos recursos, a legislação aplicável e os limites técnicos informados na interface."],
            ["Conta e segurança", "Cada pessoa é responsável por manter seus meios de acesso protegidos e por comunicar uso indevido assim que identificá-lo."],
            ["Dados e conteúdo", "Quem envia conteúdo deve ter autorização para tratá-lo. A plataforma não substitui validação profissional ou decisão humana em assuntos críticos."],
            ["Disponibilidade", "Recursos podem ser ajustados para manutenção, segurança ou melhoria. Interrupções relevantes serão tratadas conforme a capacidade operacional do serviço."],
          ].map(([title, text]) => (
            <section key={title} className="grid gap-4 border-b border-[#A9A49A] py-8 md:grid-cols-[12rem_1fr]">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="leading-7 text-[#526066]">{text}</p>
            </section>
          ))}
        </div>
        <p className="mt-10 font-mono text-xs text-[#526066]">Última revisão: 25 de agosto de 2026.</p>
      </article>
    </main>
  );
}
