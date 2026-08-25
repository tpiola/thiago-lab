import Link from "next/link";

const operationalMap = [
  {
    number: "01",
    label: "Fonte",
    text: "Planilhas, APIs, formulários e sistemas entram com origem identificada.",
  },
  {
    number: "02",
    label: "Contexto",
    text: "Cada evento carrega regra, responsável e impacto esperado.",
  },
  {
    number: "03",
    label: "Ação",
    text: "O próximo passo é atribuído, registrado e pode ser automatizado.",
  },
  {
    number: "04",
    label: "Revisão",
    text: "A equipe enxerga o que aconteceu e ajusta o fluxo sem adivinhar.",
  },
];

const delivery = [
  {
    number: "01",
    title: "Leitura da operação",
    text: "Mapeamos fontes, decisões recorrentes, gargalos e exceções que hoje dependem de memória.",
    output: "Saída: mapa de dependências",
  },
  {
    number: "02",
    title: "Desenho do fluxo",
    text: "Definimos o que deve ser coletado, interpretado, encaminhado e registrado.",
    output: "Saída: arquitetura executável",
  },
  {
    number: "03",
    title: "Ativação",
    text: "Conectamos as ferramentas necessárias e colocamos o primeiro percurso em funcionamento.",
    output: "Saída: fluxo publicado",
  },
  {
    number: "04",
    title: "Ajuste por evidência",
    text: "Revisamos alertas, tempo de resposta e pontos de intervenção com base no uso real.",
    output: "Saída: lista de melhorias",
  },
];

const faq = [
  {
    question: "Preciso trocar as ferramentas que já uso?",
    answer:
      "Não por padrão. O diagnóstico começa pelas fontes atuais e só propõe troca quando a integração ou o custo operacional justificam.",
  },
  {
    question: "O sistema decide sozinho?",
    answer:
      "Os fluxos podem executar tarefas definidas, mas decisões críticas mantêm responsável, regra e registro de contexto.",
  },
  {
    question: "Quanto tempo leva para colocar o primeiro fluxo no ar?",
    answer:
      "O prazo depende das integrações e do acesso aos dados. A estimativa é fechada depois do mapa inicial, sem prometer cronograma antes de conhecer a operação.",
  },
  {
    question: "Serve para uma equipe pequena?",
    answer:
      "Sim. O recorte é feito pelo custo do problema, não pelo tamanho da empresa. Muitas vezes um único fluxo bem escolhido já remove bastante retrabalho.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#E9E5DA] text-[#122024]">
      <header className="sticky top-0 z-40 border-b border-[#9E9A90] bg-[#E9E5DA]">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 font-semibold tracking-tight"
            aria-label="Thiago Lab — início"
          >
            <span className="grid h-9 w-9 place-items-center border border-[#122024] font-mono text-xs">
              TL/
            </span>
            <span>Thiago Lab</span>
          </Link>

          <nav
            className="hidden items-center gap-7 text-sm font-medium md:flex"
            aria-label="Navegação principal"
          >
            <Link href="#arquitetura" className="hover:text-[#087F70]">
              Arquitetura
            </Link>
            <Link href="#entrega" className="hover:text-[#087F70]">
              Entrega
            </Link>
            <Link href="#duvidas" className="hover:text-[#087F70]">
              Dúvidas
            </Link>
          </nav>

          <Link
            href="/login"
            className="inline-flex min-h-10 items-center border border-[#122024] bg-[#122024] px-4 text-sm font-semibold text-[#F5F2E9] hover:bg-[#087F70]"
          >
            Abrir diagnóstico
          </Link>
        </div>
      </header>

      <main>
        <section className="border-b border-[#9E9A90]">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[1.18fr_0.82fr] lg:items-start">
            <article>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#087F70]">
                Operações digitais / caderno 01
              </p>
              <h1 className="mt-6 max-w-[12ch] text-[clamp(3.5rem,8vw,7rem)] font-semibold leading-[0.88] tracking-[-0.055em]">
                Dados sem contexto só aumentam o ruído.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-[#445156]">
                O Thiago Lab conecta fontes, regras e responsáveis para que alertas
                terminem em uma ação verificável — e não em mais um painel que ninguém revisa.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Link
                  href="/login"
                  className="inline-flex min-h-12 items-center border border-[#087F70] bg-[#087F70] px-6 font-semibold text-white hover:bg-[#122024]"
                >
                  Mapear minha operação <span aria-hidden="true" className="ml-3">→</span>
                </Link>
                <Link
                  href="#arquitetura"
                  className="inline-flex min-h-12 items-center border-b border-[#122024] font-semibold"
                >
                  Ver o percurso
                </Link>
              </div>
            </article>

            <aside className="border border-[#6F756F]" aria-labelledby="map-title">
              <div className="flex items-center justify-between border-b border-[#6F756F] bg-[#122024] px-5 py-4 text-[#F5F2E9]">
                <h2 id="map-title" className="font-mono text-xs uppercase tracking-[0.16em]">
                  Mapa operacional
                </h2>
                <span className="font-mono text-xs text-[#A9B5B1]">TL / 01</span>
              </div>
              <ol>
                {operationalMap.map((item) => (
                  <li
                    key={item.number}
                    className="grid grid-cols-[3rem_1fr] gap-3 border-b border-[#A9A49A] px-5 py-5 last:border-b-0"
                  >
                    <span className="font-mono text-xs text-[#087F70]">{item.number}</span>
                    <div>
                      <h3 className="font-semibold">{item.label}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#526066]">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>

        <section id="arquitetura" className="border-b border-[#9E9A90] bg-[#F5F2E9]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#087F70]">
                  O recorte
                </p>
                <h2 className="mt-4 max-w-[12ch] text-4xl font-semibold leading-[0.98] tracking-[-0.035em] md:text-6xl">
                  Menos ferramenta. Mais continuidade.
                </h2>
              </div>

              <div className="border-t border-[#6F756F]">
                <div className="grid gap-4 border-b border-[#A9A49A] py-6 sm:grid-cols-[11rem_1fr]">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em]">
                    O que entra
                  </h3>
                  <p className="text-lg leading-8 text-[#445156]">
                    Fontes existentes, regras de negócio, decisões recorrentes, exceções e
                    o caminho percorrido até alguém agir.
                  </p>
                </div>
                <div className="grid gap-4 border-b border-[#A9A49A] py-6 sm:grid-cols-[11rem_1fr]">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em]">
                    O que sai
                  </h3>
                  <p className="text-lg leading-8 text-[#445156]">
                    Um fluxo nomeado, com responsáveis, registros e automações apenas onde
                    elas reduzem trabalho sem esconder a decisão.
                  </p>
                </div>
                <div className="grid gap-4 py-6 sm:grid-cols-[11rem_1fr]">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em]">
                    O que não entra
                  </h3>
                  <p className="text-lg leading-8 text-[#445156]">
                    Métricas decorativas, promessas sem medição e integrações criadas só
                    para aumentar a lista de recursos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="entrega" className="border-b border-[#9E9A90]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
            <div className="flex flex-col justify-between gap-6 border-b border-[#6F756F] pb-8 md:flex-row md:items-end">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#087F70]">
                  Sequência de trabalho
                </p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] md:text-6xl">
                  Do mapa ao uso real.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-[#526066]">
                Cada etapa termina em um artefato que pode ser revisado. Nada avança
                apenas porque parece pronto em uma apresentação.
              </p>
            </div>

            <ol>
              {delivery.map((item) => (
                <li
                  key={item.number}
                  className="grid gap-5 border-b border-[#A9A49A] py-8 md:grid-cols-[5rem_0.7fr_1.3fr]"
                >
                  <span className="font-mono text-sm text-[#087F70]">{item.number}</span>
                  <h3 className="text-2xl font-semibold tracking-[-0.02em]">{item.title}</h3>
                  <div>
                    <p className="leading-7 text-[#526066]">{item.text}</p>
                    <p className="mt-3 font-mono text-xs font-semibold uppercase tracking-[0.12em]">
                      {item.output}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="duvidas" className="border-b border-[#9E9A90] bg-[#F5F2E9]">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#087F70]">
                Antes de começar
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] md:text-6xl">
                Perguntas que mudam o escopo.
              </h2>
            </div>
            <div className="border-t border-[#6F756F]">
              {faq.map((item) => (
                <details key={item.question} className="group border-b border-[#A9A49A]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-semibold">
                    {item.question}
                    <span aria-hidden="true" className="font-mono text-[#087F70] group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-6 leading-7 text-[#526066]">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#122024] text-[#F5F2E9]">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:px-8 md:py-24 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#85C7B7]">
                Próximo passo
              </p>
              <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-6xl">
                Comece pelo ponto onde a operação perde contexto.
              </h2>
              <p className="mt-6 max-w-2xl leading-7 text-[#B9C4C1]">
                O diagnóstico organiza o problema antes de escolher ferramenta, integração
                ou automação.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center border border-[#85C7B7] bg-[#85C7B7] px-6 font-semibold text-[#122024] hover:bg-white"
            >
              Abrir diagnóstico <span aria-hidden="true" className="ml-3">→</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#2C3A3D] bg-[#122024] text-[#B9C4C1]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-8 text-sm md:flex-row md:px-8">
          <p>Thiago Lab — contexto antes da automação.</p>
          <Link href="/privacidade" className="underline underline-offset-4 hover:text-white">
            Privacidade
          </Link>
        </div>
      </footer>
    </div>
  );
}
