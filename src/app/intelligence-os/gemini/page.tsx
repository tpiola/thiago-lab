"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Trash2,
  AlertCircle,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { chat, type ChatMessage } from "@/lib/gemini";

/* ═══════════════════════════════════════════════════════════════════════════
   SUGESTÕES DE PERGUNTAS
   ═══════════════════════════════════════════════════════════════════════════ */
const SUGGESTIONS = [
  "Analise os leads do último mês",
  "Crie um pipeline de vendas otimizado",
  "Sugira melhorias para minha taxa de conversão",
  "O que podemos fazer para reduzir churn?",
];

/* ═══════════════════════════════════════════════════════════════════════════
   MARKDOWN RENDERIZADOR SIMPLES
   ═══════════════════════════════════════════════════════════════════════════ */
function renderMarkdown(text: string) {
  // Código em bloco ``` ... ```
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const code = part.replace(/```\w*\n?/, "").replace(/```$/, "");
      return (
        <pre
          key={i}
          className="my-3 p-3 rounded-lg overflow-x-auto text-sm leading-relaxed"
          style={{
            background: "rgba(201,162,39,0.04)",
            border: "1px solid rgba(201,162,39,0.1)",
            color: "#D4D8E0",
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          }}
        >
          <code>{code}</code>
        </pre>
      );
    }
    // Inline code `...`
    const inlineParts = part.split(/(`[^`]+`)/g);
    return (
      <span key={i}>
        {inlineParts.map((seg, j) => {
          if (seg.startsWith("`") && seg.endsWith("`")) {
            return (
              <code
                key={j}
                className="px-1.5 py-0.5 rounded text-sm"
                style={{
                  background: "rgba(201,162,39,0.08)",
                  border: "1px solid rgba(201,162,39,0.12)",
                  color: "#C9A227",
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                }}
              >
                {seg.slice(1, -1)}
              </code>
            );
          }
          // Bold **text**
          const boldParts = seg.split(/(\*\*[^*]+\*\*)/g);
          return (
            <span key={j}>
              {boldParts.map((b, k) => {
                if (b.startsWith("**") && b.endsWith("**")) {
                  return (
                    <strong key={k} className="font-semibold text-[#E8EDF2]">
                      {b.slice(2, -2)}
                    </strong>
                  );
                }
                // Italic *text*
                const italicParts = b.split(/(\*[^*]+\*)/g);
                return (
                  <span key={k}>
                    {italicParts.map((it, l) => {
                      if (it.startsWith("*") && it.endsWith("*") && !it.startsWith("**")) {
                        return <em key={l} className="italic text-[#B0B8C4]">{it.slice(1, -1)}</em>;
                      }
                      // List items
                      if (it.match(/^[\d]+\.\s/) || it.startsWith("- ") || it.startsWith("* ")) {
                        return (
                          <span key={l} className="block ml-4 text-[#D4D8E0]">
                            {it}
                          </span>
                        );
                      }
                      return it;
                    })}
                  </span>
                );
              })}
            </span>
          );
        })}
      </span>
    );
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   CHAT MESSAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
function ChatBubble({ msg }: { msg: ChatMessage & { timestamp?: Date } }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 mb-4 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
        style={{
          background: isUser
            ? "linear-gradient(135deg, rgba(201,162,39,0.15), rgba(184,145,30,0.08))"
            : "rgba(201,162,39,0.08)",
          border: `1px solid ${isUser ? "rgba(201,162,39,0.2)" : "rgba(201,162,39,0.12)"}`,
        }}
      >
        {isUser ? (
          <User size={14} className="text-[#C9A227]" />
        ) : (
          <Bot size={14} className="text-[#C9A227]" />
        )}
      </div>
      <div
        className={`max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-sm"
            : "rounded-tl-sm"
        }`}
        style={{
          background: isUser
            ? "linear-gradient(135deg, rgba(201,162,39,0.08), rgba(184,145,30,0.04))"
            : "rgba(12, 15, 21, 0.8)",
          border: `1px solid ${
            isUser ? "rgba(201,162,39,0.12)" : "rgba(30, 36, 51, 0.5)"
          }`,
          color: isUser ? "#E8EDF2" : "#D4D8E0",
        }}
      >
        {isUser ? (
          <p>{msg.content}</p>
        ) : (
          <div className="space-y-1">{renderMarkdown(msg.content)}</div>
        )}
        {msg.timestamp && (
          <p
            className="text-[10px] mt-2 opacity-50"
            style={{ color: isUser ? "#C9A227" : "#6B7280" }}
          >
            {msg.timestamp.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GEMINI PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function GeminiPage() {
  const [messages, setMessages] = useState<
    (ChatMessage & { timestamp: Date })[]
  >([
    {
      role: "assistant",
      content:
        "Olá! 👋 Sou o **Gemini**, assistente de IA do Intelligence OS. Posso ajudar com:\n\n- 📊 Análise de dados e leads\n- 🚀 Otimização de pipelines\n- 💡 Insights de negócio\n- 🤖 Automações inteligentes\n\nComo posso ajudar hoje?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError(null);

    const userMsg: ChatMessage & { timestamp: Date } = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Converte para o formato ChatMessage
      const chatMessages: ChatMessage[] = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const result = await chat(chatMessages);

      const assistantMsg: ChatMessage & { timestamp: Date } = {
        role: "assistant",
        content:
          result.source === "error"
            ? `❌ ${result.text}`
            : result.text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao processar mensagem"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "🧹 Chat limpo. Pronto para novas perguntas!",
        timestamp: new Date(),
      },
    ]);
    setError(null);
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    // Auto-focus no input
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full intelligence-os-grid-bg">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(201,162,39,0.06)] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(201,162,39,0.15), rgba(184,145,30,0.08))",
              border: "1px solid rgba(201,162,39,0.2)",
            }}
          >
            <Sparkles size={18} className="text-[#C9A227]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#E8EDF2]" style={{ fontFamily: "var(--font-display, 'Clash Display', system-ui, sans-serif)" }}>
              Gemini
            </h1>
            <p className="text-xs text-[#6B7280]">Assistente IA com fallback via OmniRoute</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#6B7280] hover:text-[#E8EDF2] rounded-lg hover:bg-[rgba(201,162,39,0.04)] transition-colors border border-[rgba(201,162,39,0.06)]"
          >
            <Trash2 size={14} />
            Limpar Chat
          </button>
        </div>
      </div>

      {/* ── Chat Messages ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 intelligence-os-scrollbar">
        {messages.map((msg, i) => (
          <ChatBubble key={i} msg={msg} />
        ))}

        {loading && (
          <div className="flex gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
              style={{
                background: "rgba(201,162,39,0.08)",
                border: "1px solid rgba(201,162,39,0.12)",
              }}
            >
              <RefreshCw size={14} className="text-[#C9A227] animate-spin" />
            </div>
            <div
              className="rounded-xl px-4 py-3 text-sm"
              style={{
                background: "rgba(12, 15, 21, 0.8)",
                border: "1px solid rgba(30, 36, 51, 0.5)",
                color: "#6B7280",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-lg mb-4 text-sm"
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

        {/* Sugestões (só no início) */}
        {messages.length <= 2 && !loading && (
          <div className="mt-6">
            <p className="text-xs text-[#6B7280] mb-3 flex items-center gap-1.5">
              <ChevronDown size={12} />
              Sugestões de perguntas
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="px-3 py-1.5 text-xs rounded-lg transition-colors"
                  style={{
                    background: "rgba(201,162,39,0.04)",
                    border: "1px solid rgba(201,162,39,0.08)",
                    color: "#9BA3B8",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(201,162,39,0.08)";
                    e.currentTarget.style.borderColor = "rgba(201,162,39,0.15)";
                    e.currentTarget.style.color = "#E8EDF2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(201,162,39,0.04)";
                    e.currentTarget.style.borderColor = "rgba(201,162,39,0.08)";
                    e.currentTarget.style.color = "#9BA3B8";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ────────────────────────────────────────────────────────── */}
      <div className="px-4 lg:px-6 py-4 border-t border-[rgba(201,162,39,0.06)] flex-shrink-0">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              rows={1}
              className="w-full px-4 py-3 pr-12 rounded-xl text-sm resize-none outline-none transition-all"
              style={{
                background: "rgba(12, 15, 21, 0.8)",
                border: "1px solid rgba(30, 36, 51, 0.5)",
                color: "#E8EDF2",
                minHeight: "44px",
                maxHeight: "120px",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(201,162,39,0.3)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(30, 36, 51, 0.5)";
              }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="flex items-center justify-center w-11 h-11 rounded-xl transition-all flex-shrink-0 disabled:opacity-40"
            style={{
              background: !input.trim() || loading
                ? "rgba(201,162,39,0.06)"
                : "linear-gradient(135deg, #C9A227, #B8911E)",
              border: "1px solid rgba(201,162,39,0.15)",
              color: !input.trim() || loading ? "#6B7280" : "#050D1A",
            }}
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-[#6B7280] mt-2 text-center">
          Gemini → OmniRoute (fallback automático) •
          {loading ? " Processando..." : " Pressione Enter para enviar"}
        </p>
      </div>
    </div>
  );
}
