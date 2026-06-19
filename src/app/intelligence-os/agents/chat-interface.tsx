'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Bot, User, Brain, Loader2,
  MessageSquare, Sparkles, Zap, Code,
  FileText, Search, Globe, BarChart3,
  X, Trash2, ChevronDown,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  timestamp: Date;
  model?: string;
}

interface Model {
  id: string;
  name: string;
  owned_by: string;
  context_length: number;
  capabilities: Record<string, boolean>;
}

interface ChatInterfaceProps {
  onClose?: () => void;
  embedded?: boolean;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROMPT TEMPLATES
   ═══════════════════════════════════════════════════════════════════════════ */

const PROMPT_TEMPLATES = [
  {
    icon: BarChart3,
    label: 'Analytics',
    prompt: 'Me mostre um resumo das principais métricas de analytics e BI disponíveis no Intelligence OS.',
    color: '#3DF5C5',
  },
  {
    icon: Search,
    label: 'Competidores',
    prompt: 'Faça uma análise SWOT dos principais concorrentes no mercado de IA generativa.',
    color: '#6366f1',
  },
  {
    icon: FileText,
    label: 'Relatório',
    prompt: 'Gere um relatório executivo sobre o estado atual do mercado de AI Agents.',
    color: '#f59e0b',
  },
  {
    icon: Code,
    label: 'Código',
    prompt: 'Explique como conectar o Intelligence OS com APIs externas usando Next.js.',
    color: '#10b981',
  },
  {
    icon: Globe,
    label: 'Mercado',
    prompt: 'Qual o market share dos principais players de IA atualmente?',
    color: '#ec4899',
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   CHAT INTERFACE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ChatInterface({ onClose, embedded = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('tllm/deepseek_v4');
  const [models, setModels] = useState<Model[]>([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [showTemplates, setShowTemplates] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load models on mount
  useEffect(() => {
    fetch('/api/omniroute/models')
      .then((r) => r.json())
      .then((data) => {
        if (data.models && data.models.length > 0) {
          setModels(data.models);
          // Select first available non-video model
          const defaultModel = data.models.find((m: Model) => !m.id.includes('veo')) || data.models[0];
          if (defaultModel) setSelectedModel(defaultModel.id);
        }
      })
      .catch(() => {})
      .finally(() => setModelsLoading(false));
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setShowTemplates(false);

    try {
      const res = await fetch('/api/omniroute/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
          stream: false,
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Desculpe, não consegui processar sua mensagem.',
        reasoning: data.reasoning,
        timestamp: new Date(),
        model: data.model || selectedModel,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: 'Erro de conexão com o OmniRoute. Usando fallback offline.',
          timestamp: new Date(),
          model: 'fallback',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowTemplates(true);
  };

  const useTemplate = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: '#06080C' }}>
      {/* Header */}
      {!embedded && (
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(61,245,197,0.08)', background: '#0C0F15' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[rgba(61,245,197,0.1)] flex items-center justify-center">
              <Bot size={16} className="text-[#3DF5C5]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#E8EDF2]">Chat OmniRoute</h3>
              <p className="text-[10px] text-[#6B7280]">{selectedModel.split('/').pop()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="p-2 rounded-lg text-[#6B7280] hover:text-[#E8EDF2] hover:bg-[rgba(255,255,255,0.05)] transition-all"
              title="Limpar chat"
            >
              <Trash2 size={16} />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-[#6B7280] hover:text-[#E8EDF2] hover:bg-[rgba(255,255,255,0.05)] transition-all"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && showTemplates && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[rgba(61,245,197,0.08)] border border-[rgba(61,245,197,0.1)] flex items-center justify-center">
              <Sparkles size={28} className="text-[#3DF5C5]" />
            </div>
            <h3 className="text-lg font-semibold text-[#E8EDF2] mb-1">Chat com IA</h3>
            <p className="text-sm text-[#6B7280] mb-6">
              Conectado ao OmniRoute Gateway — {models.length > 0 ? `${models.length} modelos disponíveis` : 'carregando modelos...'}
            </p>

            {/* Model selector */}
            <div className="max-w-xs mx-auto mb-6">
              <label className="block text-[10px] uppercase tracking-wider text-[#6B7280] mb-2 font-semibold">
                Modelo Ativo
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all"
                style={{
                  background: '#0C0F15',
                  borderColor: 'rgba(61,245,197,0.15)',
                  color: '#E8EDF2',
                }}
              >
                {modelsLoading ? (
                  <option>Carregando modelos...</option>
                ) : (
                  models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.owned_by})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Templates */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-lg mx-auto">
              {PROMPT_TEMPLATES.map((tpl) => (
                <motion.button
                  key={tpl.label}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => useTemplate(tpl.prompt)}
                  className="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all hover:border-opacity-50"
                  style={{
                    background: `${tpl.color}08`,
                    borderColor: `${tpl.color}20`,
                    color: tpl.color,
                  }}
                >
                  <tpl.icon size={14} />
                  {tpl.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-[rgba(61,245,197,0.1)] border border-[rgba(61,245,197,0.08)] flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={16} className="text-[#3DF5C5]" />
                </div>
              )}

              <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                {msg.role === 'assistant' && msg.model && (
                  <div className="text-[10px] text-[#6B7280] mb-1 font-medium">
                    {msg.model.split('/').pop()} ·{msg.model === 'fallback' ? ' Fallback' : ' OmniRoute'}
                  </div>
                )}

                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#3DF5C5] text-[#06080C]'
                      : 'border text-[#E8EDF2]'
                  }`}
                  style={
                    msg.role === 'assistant'
                      ? { background: '#0C0F15', borderColor: 'rgba(61,245,197,0.1)' }
                      : {}
                  }
                >
                  {msg.content || (msg.role === 'assistant' && loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Pensando...
                    </span>
                  ) : null)}
                </div>

                {msg.reasoning && (
                  <details className="mt-1">
                    <summary className="text-[10px] text-[#6B7280] cursor-pointer hover:text-[#9BA3B8] flex items-center gap-1">
                      <ChevronDown size={10} />
                      Raciocínio
                    </summary>
                    <p className="text-[11px] text-[#6B7280] mt-1 pl-2 border-l-2 border-[rgba(61,245,197,0.2)]">
                      {msg.reasoning}
                    </p>
                  </details>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-[rgba(201,162,39,0.1)] border border-[rgba(201,162,39,0.08)] flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={16} className="text-[#C9A227]" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && messages[messages.length - 1]?.role === 'user' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-[rgba(61,245,197,0.1)] border border-[rgba(61,245,197,0.08)] flex items-center justify-center flex-shrink-0">
              <Brain size={16} className="text-[#3DF5C5]" />
            </div>
            <div className="rounded-2xl px-4 py-3 border text-sm" style={{ background: '#0C0F15', borderColor: 'rgba(61,245,197,0.1)' }}>
              <span className="flex items-center gap-2 text-[#6B7280]">
                <Loader2 size={14} className="animate-spin" />
                Processando via {selectedModel.split('/').pop()}...
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t" style={{ borderColor: 'rgba(61,245,197,0.08)', background: '#0C0F15' }}>
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)"
              rows={1}
              className="w-full rounded-xl border px-4 py-3 pr-12 text-sm outline-none resize-none transition-all placeholder:text-[#6B7280]/50"
              style={{
                background: '#06080C',
                borderColor: 'rgba(61,245,197,0.1)',
                color: '#E8EDF2',
                minHeight: 44,
                maxHeight: 120,
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: input.trim() && !loading ? '#3DF5C5' : 'rgba(61,245,197,0.1)',
              color: input.trim() && !loading ? '#06080C' : '#6B7280',
            }}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
        <p className="text-[10px] text-[#6B7280] mt-2 text-center">
          Conectado ao OmniRoute Gateway · Modelo: {selectedModel.split('/').pop()}
        </p>
      </div>
    </div>
  );
}
