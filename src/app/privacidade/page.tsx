import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacidade | Thiago Lab",
  description: "Como o Thiago Lab trata dados de navegação, cadastro e uso da plataforma.",
  alternates: { canonical: "/privacidade" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F5F2E9] px-5 py-16 text-[#122024] md:px-8 md:py-24">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#087F70]">
          ← Voltar ao Thiago Lab
        </Link>
        <p className="mt-14 font-mono text-xs uppercase tracking-[0.18em] text-[#087F70]">
          Documento operacional
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.045em] md:text-7xl">
          Privacidade
        </h1>
        <p className="mt-6 text-lg leading-8 text-[#526066]">
          Este aviso descreve os dados necessários para operar o site e a área autenticada.
        </p>

        <div className="mt-14 border-t border-[#6F756F]">
          {[
            {
              title: "Preferência no navegador",
              text: "O site usa armazenamento local para registrar que o aviso de privacidade foi lido. Essa informação fica no próprio navegador.",
            },
            {
              title: "Cadastro e autenticação",
              text: "Quando uma conta é criada, dados como nome, e-mail e identificadores de autenticação são processados para permitir acesso e proteger a sessão.",
            },
            {
              title: "Dados enviados à plataforma",
              text: "Informações inseridas nos fluxos são usadas para executar os recursos solicitados. Não devem ser enviados dados sensíveis sem necessidade e base adequada.",
            },
            {
              title: "Controle e exclusão",
              text: "Pedidos de acesso, correção ou exclusão devem ser feitos pelo canal informado dentro da área autenticada, com dados suficientes para confirmar a identidade.",
            },
          ].map((section) => (
            <section key={section.title} className="grid gap-4 border-b border-[#A9A49A] py-8 md:grid-cols-[12rem_1fr]">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="leading-7 text-[#526066]">{section.text}</p>
            </section>
          ))}
        </div>
        <p className="mt-10 font-mono text-xs text-[#526066]">Última revisão: 25 de agosto de 2026.</p>
      </article>
    </main>
  );
}
