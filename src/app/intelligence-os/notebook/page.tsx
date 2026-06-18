"use client";

import { useState } from "react";
import {
  BookOpen,
  Search,
  FileText,
  Plus,
  Send,
  Sparkles,
  Loader2,
  AlertCircle,
  ChevronRight,
  Lightbulb,
  ExternalLink,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TIPOS
   ═══════════════════════════════════════════════════════════════════════════ */
interface Notebook {
  id: string;
  name: string;
  description: string;
  icon: string;
  documents: string[];
  questions: { q: string; a: string }[];
}

interface QAPair {
  q: string;
  a: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA — Cadernos
   ═══════════════════════════════════════════════════════════════════════════ */
const NOTEBOOKS: Notebook[] = [
  {
    id: "projetos",
    name: "Projetos",
    description: "Documentação e insights de projetos em andamento",
    icon: "🚀",
    documents: [
      "Plano Estratégico 2025.pdf",
      "Roadmap Produto v3.2.pdf",
      "Análise de Concorrência.docx",
      "Metas Q3 - OKRs.pdf",
    ],
    questions: [
      {
        q: "Quais são as principais metas do Q3?",
        a: "Com base nos documentos analisados, as principais metas do Q3 são:\n\n1. **Aumentar receita recorrente** em 35% (de R$120k para R$162k)\n2. **Expandir base de clientes** — aquisição de 50 novos contratos enterprise\n3. **Reduzir churn** de 8% para 4% através de melhorias no onboarding\n4. **Lançar 3 novas features** do produto principal\n\n*Fonte: Metas Q3 - OKRs.pdf*",
      },
      {
        q: "Qual o prazo estimado para o lançamento do novo módulo?",
        a: "O novo módulo de automação avançada está planejado para **Setembro de 2025**, com beta testing em Agosto. O roadmap indica que 70% do desenvolvimento já foi concluído.",
      },
    ],
  },
  {
    id: "pesquisas",
    name: "Pesquisas",
    description: "Pesquisas de mercado e tendências",
    icon: "🔬",
    documents: [
      "Pesquisa Satisfação Clientes 2025.pdf",
      "Tendências CRM 2025.pdf",
      "Benchmark Concorrentes.xlsx",
      "Relatório IA Generativa.pdf",
    ],
    questions: [
      {
        q: "Quais as principais tendências de CRM para 2025?",
        a: "As principais tendências identificadas:\n\n1. **IA Generativa no CRM** — 78% das empresas planejam integrar IA\n2. **Automação omnichannel** — unificação de canais de atendimento\n3. **Analytics preditivo** — previsão de churn e oportunidades\n4. **CRM conversacional** — interfaces baseadas em chat/voice\n\n*Fonte: Tendências CRM 2025.pdf*",
      },
    ],
  },
  {
    id: "clientes",
    name: "Clientes",
    description: "Documentos e análises de clientes",
    icon: "🤝",
    documents: [
      "Contrato - TechStart.pdf",
      "Briefing - Acme Corp.pdf",
      "Proposta Comercial - GlobalTech.pdf",
      "NPS Dashboard - Junho 2025.pdf",
    ],
    questions: [
      {
        q: "Qual o NPS médio dos clientes?",
        a: "O NPS médio apurado em Junho de 2025 é de **72** (zona de excelência). Os principais destaques positivos são:\n\n- **Suporte técnico**: 8.5/10\n- **Facilidade de uso**: 8.2/10\n- **Pontos de melhoria**: tempo de onboarding e integrações\n\n*Fonte: NPS Dashboard - Junho 2025.pdf*",
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   OMNIROUTE HELPER
   ═══════════════════════════════════════════════════════════════════════════ */
async function askOmniRoute(
  question: string,
  notebookName: string,
  documents: string[]
): Promise<string> {
  const context = documents.map((d) => `- ${d}`).join("\n");
  const prompt = `
Contexto — Caderno "${notebookName}"
Documentos disponíveis:
${context}

Pergunta do usuário:
${question}

Com base nos documentos do caderno "${notebookName}", responda de forma clara e direta em português.
  `.trim();

  const res = await fetch("http://localhost:20128/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente de pesquisa do NotebookLM do Intelligence OS. Responda com markdown simples, seja conciso e cite as fontes dos documentos.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`OmniRoute ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return (
    data.choices?.[0]?.message?.content ??
    "Desculpe, não consegui processar sua pergunta."
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function NotebookPage() {
  const [activeNotebook, setActiveNotebook] = useState(NOTEBOOKS[0]);
  const [qaHistory, setQaHistory] = useState<QAPair[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async () => {
    const q = question.trim();
    if (!q || loading) return;
    setQuestion("");
    setError(null);
    setLoading(true);

    try {
      const answer = await askOmniRoute(
        q,
        activeNotebook.name,
        activeNotebook.documents
      );
      setQaHistory((prev) => [...prev, { q, a: answer }]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao consultar Notebook"
      );
    } finally {
      setLoading(false);
    }
  };

  // Combina perguntas mock + as feitas na sessão
  const allQuestions = [...activeNotebook.questions, ...qaHistory];

  return (
    <div className="flex flex-col h-full intelligence-os-grid-bg">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(201,162,39,0.06)] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(201,162,39,0.15), rgba(184,145,30,0.08))",
              border: "1px solid rgba(201,162,39,0.2)",
            }}
          >
            <BookOpen size={18} className="text-[#C9A227]" />
          </div>
          <div>
            <h1
              className="text-lg font-semibold text-[#E8EDF2]"
              style={{
                fontFamily:
                  "var(--font-display, 'Clash Display', system-ui, sans-serif)",
              }}
            >
              NotebookLM
            </h1>
            <p className="text-xs text-[#6B7280]">
              Pesquise documentos com IA via OmniRoute
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ══════════════════════════════════════════════════════════════════
            SIDEBAR — Cadernos
            ══════════════════════════════════════════════════════════════════ */}
        <aside
          className="w-64 flex-shrink-0 border-r border-[rgba(201,162,39,0.06)] p-4 overflow-y-auto intelligence-os-scrollbar hidden md:block"
          style={{ background: "rgba(5, 13, 26, 0.5)" }}
        >
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-[#6B7280] mb-3">
            Cadernos
          </h2>
          <div className="space-y-1">
            {NOTEBOOKS.map((nb) => (
              <button
                key={nb.id}
                onClick={() => {
                  setActiveNotebook(nb);
                  setQaHistory([]);
                  setError(null);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm ${
                  activeNotebook.id === nb.id
                    ? "bg-[rgba(201,162,39,0.1)] text-[#C9A227] border border-[rgba(201,162,39,0.15)]"
                    : "text-[#6B7280] hover:text-[#E8EDF2] hover:bg-[rgba(201,162,39,0.04)] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{nb.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{nb.name}</div>
                    <div className="text-[10px] text-[#6B7280] truncate">
                      {nb.documents.length} documentos
                    </div>
                  </div>
                  {activeNotebook.id === nb.id && (
                    <ChevronRight size={14} className="text-[#C9A227] flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Documentos do caderno ativo */}
          <div className="mt-6">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[#6B7280] mb-3">
              Documentos
            </h3>
            <div className="space-y-1">
              {activeNotebook.documents.map((doc) => (
                <div
                  key={doc}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#6B7280] rounded"
                >
                  <FileText size={12} className="text-[#C9A227]/60" />
                  <span className="truncate">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3 rounded-lg" style={{
            background: "rgba(201,162,39,0.04)",
            border: "1px solid rgba(201,162,39,0.08)",
          }}>
            <div className="flex items-start gap-2">
              <Lightbulb size={14} className="text-[#C9A227] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#6B7280]">
                Faça perguntas sobre os documentos deste caderno. A IA responde com base no conteúdo analisado.
              </p>
            </div>
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════════════════
            MAIN — Conteúdo
            ══════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* ── Notebook Info ────────────────────────────────────────────── */}
          <div className="px-6 py-4 border-b border-[rgba(201,162,39,0.04)] flex-shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{activeNotebook.icon}</span>
              <h2 className="text-base font-semibold text-[#E8EDF2]">
                {activeNotebook.name}
              </h2>
            </div>
            <p className="text-xs text-[#6B7280]">
              {activeNotebook.description}
            </p>
          </div>

          {/* ── Q&A Area ──────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-6 py-4 intelligence-os-scrollbar">
            {allQuestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(201,162,39,0.06)",
                    border: "1px solid rgba(201,162,39,0.1)",
                  }}
                >
                  <Search size={28} className="text-[#C9A227]" />
                </div>
                <h3 className="text-base font-semibold text-[#E8EDF2] mb-1">
                  Faça uma pergunta
                </h3>
                <p className="text-xs text-[#6B7280] max-w-xs">
                  Pergunte sobre os documentos do caderno &quot;{activeNotebook.name}&quot;
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {allQuestions.map((item, i) => (
                  <div key={i}>
                    {/* Pergunta */}
                    <div className="flex gap-3 mb-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(201,162,39,0.15), rgba(184,145,30,0.08))",
                          border: "1px solid rgba(201,162,39,0.2)",
                        }}
                      >
                        <Search size={13} className="text-[#C9A227]" />
                      </div>
                      <div
                        className="rounded-xl px-4 py-3 text-sm"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(201,162,39,0.06), rgba(184,145,30,0.03))",
                          border: "1px solid rgba(201,162,39,0.1)",
                          color: "#E8EDF2",
                        }}
                      >
                        {item.q}
                      </div>
                    </div>
                    {/* Resposta */}
                    <div className="flex gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: "rgba(201,162,39,0.08)",
                          border: "1px solid rgba(201,162,39,0.12)",
                        }}
                      >
                        <Sparkles size={13} className="text-[#C9A227]" />
                      </div>
                      <div
                        className="rounded-xl px-4 py-3 text-sm leading-relaxed flex-1"
                        style={{
                          background: "rgba(12, 15, 21, 0.8)",
                          border: "1px solid rgba(30, 36, 51, 0.5)",
                          color: "#D4D8E0",
                        }}
                      >
                        <div className="whitespace-pre-line">{item.a}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex gap-3 mt-6">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(201,162,39,0.08)",
                    border: "1px solid rgba(201,162,39,0.12)",
                  }}
                >
                  <Loader2 size={13} className="text-[#C9A227] animate-spin" />
                </div>
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: "rgba(12, 15, 21, 0.8)",
                    border: "1px solid rgba(30, 36, 51, 0.5)",
                    color: "#6B7280",
                  }}
                >
                  Analisando documentos...
                </div>
              </div>
            )}

            {error && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-lg mt-4 text-sm"
                style={{
                  background: "rgba(255,77,106,0.08)",
                  border: "1px solid rgba(255,77,106,0.15)",
                  color: "#FF4D6A",
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* ── Input ────────────────────────────────────────────────────── */}
          <div className="px-6 py-4 border-t border-[rgba(201,162,39,0.06)] flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAsk();
                  }}
                  placeholder={`Pergunte sobre "${activeNotebook.name}"...`}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "rgba(12, 15, 21, 0.8)",
                    border: "1px solid rgba(30, 36, 51, 0.5)",
                    color: "#E8EDF2",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(201,162,39,0.3)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(30, 36, 51, 0.5)";
                  }}
                />
              </div>
              <button
                onClick={handleAsk}
                disabled={!question.trim() || loading}
                className="flex items-center justify-center w-10 h-10 rounded-xl transition-all flex-shrink-0 disabled:opacity-40"
                style={{
                  background:
                    !question.trim() || loading
                      ? "rgba(201,162,39,0.06)"
                      : "linear-gradient(135deg, #C9A227, #B8911E)",
                  border: "1px solid rgba(201,162,39,0.15)",
                  color:
                    !question.trim() || loading ? "#6B7280" : "#050D1A",
                }}
              >
                <Send size={15} />
              </button>
            </div>
            <p className="text-[10px] text-[#6B7280] mt-2">
              As respostas são geradas por IA via OmniRoute Gateway • Sempre verifique informações críticas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
