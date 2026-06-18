'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Terminal,
  Bot,
  User,
  RefreshCw,
  ChevronDown,
  Sparkles,
  Trash2,
  Plus,
  Copy,
  Check,
} from 'lucide-react';

/* ─── Modelos Disponíveis ─── */
interface ModelOption {
  id: string;
  name: string;
  provider: string;
  color: string;
}

const MODELS: ModelOption[] = [
  { id: 'deepseek-v4', name: 'DeepSeek V4', provider: 'DeepSeek', color: 'text-blue-400' },
  { id: 'claude-sonnet-5', name: 'Claude Sonnet 5', provider: 'Anthropic', color: 'text-orange-400' },
  { id: 'gpt-5', name: 'GPT-5', provider: 'OpenAI', color: 'text-emerald-400' },
  { id: 'minimax-01', name: 'MiniMax-01', provider: 'MiniMax', color: 'text-purple-400' },
  { id: 'ling-chat', name: 'Ling Chat', provider: 'Ling', color: 'text-pink-400' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', color: 'text-yellow-400' },
];

/* ─── Message type ─── */
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  timestamp: number;
}

/* ─── Chat Preview Messages ─── */
const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `╔══════════════════════════════════╗
║   LLM GATEWAY — OmniRoute v1     ║
║   thiagolab.com/ia               ║
╚══════════════════════════════════╝

Conectado ao **OmniRoute Gateway** (localhost:20128).

Modelos disponíveis: DeepSeek V4, Claude Sonnet 5, GPT-5, MiniMax-01, Ling Chat, Gemini 2.5 Pro.

Digite sua mensagem ou prompt abaixo para começar. Use \`/model <nome>\` para trocar de modelo a qualquer momento.`,
  model: 'system',
  timestamp: Date.now(),
};

/* ─── Component ─── */
export default function IaPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /* Auto-scroll */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* Auto-resize textarea */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 160) + 'px';
    }
  }, [input]);

  /* Copy message */
  const copyMessage = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /* Clear chat */
  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput('');
  };

  /* New chat */
  const newChat = () => {
    clearChat();
    setSelectedModel(MODELS[0]);
  };

  /* Send message (simulated streaming) */
  const handleSend = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    /* Simulated streaming response */
    const responses: Record<string, string> = {
      'deepseek-v4': `🤖 **DeepSeek V4** respondendo via OmniRoute Gateway...

Recebi sua mensagem: "${text.slice(0, 60)}${text.length > 60 ? '...' : ''}"

O gateway está configurado e operacional em \`localhost:20128\`. Em produção, esta resposta será um stream real do modelo.

📡 **Diagnóstico:**
• Gateway: ✅ Online
• Modelo: DeepSeek V4
• Latência: ~1.2s
• Tokens: ~150

*Esta é uma simulação visual. Conecte o OmniRoute Gateway para respostas reais.*`,
      'claude-sonnet-5': `🎯 **Claude Sonnet 5** via OmniRoute...

Sua consulta: "${text.slice(0, 60)}${text.length > 60 ? '...' : ''}"

O gateway OmniRoute está escutando em \`localhost:20128\`. Configure sua chave de API no arquivo \`.env\` para ativar o streaming real.

💡 **Próximos passos:**
1. Inicie o gateway: \`pnpm omniroute\`
2. Selecione o modelo desejado
3. Envie prompts em tempo real`,
      'gpt-5': `✨ **GPT-5** respondendo...

Mensagem recebida: "${text.slice(0, 60)}${text.length > 60 ? '...' : ''}"

O LLM Gateway está configurado para rotear para múltiplos provedores. GPT-5 está na lista de modelos suportados via API da OpenAI.

🔌 **Status da Conexão:**
• OmniRoute: \`localhost:20128\`
• API Key: ${process.env.NEXT_PUBLIC_OPENAI_KEY ? '✅ Configurada' : '⚠️ Pendente'}
• Streaming: ⚡ Pronto`,
      'minimax-01': `🌀 **MiniMax-01** respondendo...

Processando: "${text.slice(0, 60)}${text.length > 60 ? '...' : ''}"

MiniMax-01 é um dos modelos disponíveis no gateway. Ideal para tarefas de raciocínio longo e geração de código.

📊 **Gateway Stats:**
• Requests: 0 (esta sessão)
• Modelo ativo: MiniMax-01
• Endpoint: POST /v1/chat/completions`,
      'ling-chat': `🌸 **Ling Chat** respondendo...

Recebi: "${text.slice(0, 60)}${text.length > 60 ? '...' : ''}"

Ling Chat está disponível via OmniRoute Gateway. Perfeito para conversas criativas e análise de contexto longo.

⚙️ **Comandos úteis:**
• \`/model list\` — Lista modelos
• \`/model <nome>\` — Troca modelo
• \`/clear\` — Limpa chat`,
      'gemini-2.5-pro': `🌟 **Gemini 2.5 Pro** respondendo...

Processando via OmniRoute: "${text.slice(0, 60)}${text.length > 60 ? '...' : ''}"

Gemini 2.5 Pro com contexto de 1M tokens — ideal para documentos longos e análises complexas.

📡 **Rota atual:**
Gateway → Gemini 2.5 Pro → Streaming → thiagolab.com/ia`,
    };

    const selectedResp = responses[selectedModel.id] || responses['deepseek-v4'];

    /* Simulate streaming word by word */
    const words = selectedResp.split(' ');
    let streamedContent = '';

    for (let i = 0; i < words.length; i++) {
      await new Promise((r) => setTimeout(r, 15 + Math.random() * 20));
      streamedContent += (i > 0 ? ' ' : '') + words[i];

      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === 'assistant' && lastMsg.id === `stream-${userMsg.id}`) {
          const updated = [...prev];
          updated[updated.length - 1] = { ...lastMsg, content: streamedContent };
          return updated;
        }
        return [...prev, {
          id: `stream-${userMsg.id}`,
          role: 'assistant' as const,
          content: streamedContent,
          model: selectedModel.name,
          timestamp: Date.now(),
        }];
      });
    }

    setIsStreaming(false);
  };

  /* Handle key submit */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="min-h-screen bg-ios-base">
      {/* Background gradient sutil */}
      <div className="pointer-events-none fixed inset-0 opacity-30 bg-[radial-gradient(ellipse_80%_50%_at_50%_30%,rgba(61,245,197,0.06),transparent)]" aria-hidden="true" />

      {/* ── Top Bar ── */}
      <div className="fixed inset-x-0 top-0 z-40 border-b border-ios-border/40 bg-ios-base/80 backdrop-blur-xl">
        <div className="container-ios flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal size={16} className="text-ios-accent" />
            <span className="font-mono text-sm font-bold text-ios-text">LLM Gateway</span>
            <span className="hidden font-mono text-[10px] text-ios-muted sm:inline">OmniRoute v1</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Model selector */}
            <div className="relative">
              <button
                onClick={() => setModelMenuOpen(!modelMenuOpen)}
                className="flex items-center gap-2 rounded-lg border border-ios-border bg-ios-surface px-3 py-1.5 font-mono text-[11px] font-medium text-ios-text transition-all hover:border-ios-accent/30"
              >
                <Sparkles size={12} className={selectedModel.color} />
                {selectedModel.name}
                <ChevronDown size={12} className={`text-ios-muted transition-transform ${modelMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {modelMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-52 overflow-hidden rounded-lg border border-ios-border bg-ios-surface shadow-ios-modal"
                  >
                    {MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => { setSelectedModel(model); setModelMenuOpen(false); }}
                        className={`flex w-full items-center gap-3 px-3 py-2.5 text-left font-mono text-xs transition-colors hover:bg-ios-accent/5 ${
                          selectedModel.id === model.id ? 'bg-ios-accent/10 text-ios-accent' : 'text-ios-text-secondary'
                        }`}
                      >
                        <Sparkles size={12} className={model.color} />
                        <span className="flex-1">{model.name}</span>
                        <span className="text-[9px] text-ios-muted">{model.provider}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={newChat}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ios-border text-ios-muted transition-colors hover:border-ios-accent/30 hover:text-ios-accent"
              title="Novo chat"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={clearChat}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ios-border text-ios-muted transition-colors hover:border-ios-accent/30 hover:text-ios-accent"
              title="Limpar chat"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div className="reveal-fade container-ios pt-20 pb-36">
        <div className="mx-auto max-w-3xl">
          {/* Messages */}
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                  className={`group flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                    msg.role === 'user'
                      ? 'border-ios-accent/30 bg-ios-accent-dim'
                      : msg.role === 'system'
                        ? 'border-yellow-500/30 bg-yellow-500/10'
                        : 'border-ios-border bg-ios-surface-2'
                  }`}>
                    {msg.role === 'user' ? (
                      <User size={14} className="text-ios-accent" />
                    ) : msg.role === 'system' ? (
                      <Terminal size={14} className="text-yellow-400" />
                    ) : (
                      <Bot size={14} className="text-ios-text" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex max-w-[85%] flex-col gap-1.5 ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}>
                    {/* Model label */}
                    {msg.model && msg.role === 'assistant' && (
                      <span className="font-mono text-[10px] text-ios-muted">{msg.model}</span>
                    )}

                    <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-ios-accent text-ios-base'
                        : msg.role === 'system'
                          ? 'code-block text-ios-text-secondary'
                          : 'border border-ios-border bg-ios-surface text-ios-text'
                    }`}>
                      <div className="whitespace-pre-wrap [&_strong]:text-ios-accent">
                        {msg.content}
                      </div>
                    </div>

                    {/* Copy button */}
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => copyMessage(msg.content, msg.id)}
                        className="flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] text-ios-muted opacity-0 transition-opacity hover:text-ios-accent group-hover:opacity-100"
                      >
                        {copiedId === msg.id ? <Check size={10} /> : <Copy size={10} />}
                        {copiedId === msg.id ? 'Copiado' : 'Copiar'}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Streaming indicator */}
            {isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 pl-11"
              >
                <span className="inline-block h-2 w-2 rounded-full bg-ios-accent/60 animate-pulse" />
                <span className="font-mono text-[10px] text-ios-muted">Streaming...</span>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>
      </div>

      {/* ── Input Bar ── */}
      <div className="fixed inset-x-0 bottom-0 border-t border-ios-border/40 bg-ios-base/90 backdrop-blur-xl">
        <div className="container-ios py-3">
          <div className="mx-auto flex max-w-3xl items-end gap-3">
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem para o LLM Gateway..."
                rows={1}
                className="w-full resize-none rounded-xl border border-ios-border bg-ios-surface py-3 pl-4 pr-4 font-mono text-sm text-ios-text placeholder:text-ios-muted/60 transition-colors focus:border-ios-accent/40 focus:outline-none focus:ring-1 focus:ring-ios-accent/20"
                disabled={isStreaming}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ios-accent text-ios-base transition-all duration-200 hover:shadow-ios-glow-md disabled:opacity-30 disabled:hover:shadow-none"
            >
              {isStreaming ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>

          {/* Status line */}
          <div className="mx-auto mt-2 flex max-w-3xl items-center justify-between">
            <span className="font-mono text-[9px] text-ios-muted">
              OmniRoute Gateway • {selectedModel.name}
            </span>
            <span className="font-mono text-[9px] text-ios-muted">
              {MODELS.length} modelos • Enter para enviar • Shift+Enter para quebrar linha
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
