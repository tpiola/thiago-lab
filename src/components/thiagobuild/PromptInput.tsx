"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Loader2, ChevronDown } from "lucide-react";

/* ==========================================================================
   PromptInput — spotlight/alfred-style bar with animated placeholder
   Auto-resize, rotating placeholder text, suggestions dropdown
   /thiagobuild — dark + gold accent
   ========================================================================== */

const PLACEHOLDER_TEXTS = [
  "Landing page para startup de IA...",
  "Site institucional para clínica médica...",
  "Portfolio de fotógrafo profissional...",
  "Loja virtual de artesanato...",
  "Blog de tecnologia e programação...",
  "Site para restaurante italiano...",
  "Dashboard para analytics SaaS...",
];

const SUGGESTIONS = [
  "Landing page moderna com hero, features e CTA",
  "Site institucional com blog e contato",
  "Portfolio criativo com galeria de projetos",
  "E-commerce minimalista com carrinho",
];

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function PromptInput({
  onGenerate,
  loading = false,
  disabled = false,
}: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ── Rotating placeholder ── */
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_TEXTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  /* ── Auto-resize ── */
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [prompt, autoResize]);

  const handleSubmit = () => {
    const text = prompt.trim();
    if (!text || loading || disabled) return;
    onGenerate(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
      textareaRef.current?.blur();
    }
  };

  const applySuggestion = (suggestion: string) => {
    setPrompt(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* ── Input wrapper ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`relative group transition-all duration-300 ${
          focused
            ? "shadow-2xl shadow-thiagobuild-gold/15"
            : "shadow-xl shadow-black/20"
        }`}
      >
        {/* Glow border */}
        <div
          className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-thiagobuild-gold/30 via-thiagobuild-gold/10 to-thiagobuild-gold/30 opacity-0 transition-opacity duration-500 ${
            focused ? "opacity-100" : "group-hover:opacity-50"
          }`}
        />

        <div className="relative flex items-end gap-3 bg-thiagobuild-surface/90 backdrop-blur-xl rounded-2xl border border-thiagobuild-gold/15 p-3 sm:p-4">
          {/* Icon */}
          <div className="shrink-0 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-thiagobuild-gold/20 to-amber-900/20 flex items-center justify-center border border-thiagobuild-gold/20">
              <Sparkles
                size={18}
                className={`text-thiagobuild-gold transition-opacity ${
                  loading ? "opacity-0" : "opacity-100"
                }`}
              />
              {loading && (
                <Loader2
                  size={18}
                  className="absolute text-thiagobuild-gold animate-spin"
                />
              )}
            </div>
          </div>

          {/* Textarea */}
          <div className="flex-1 min-w-0 relative">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => {
                setFocused(true);
                setShowSuggestions(true);
              }}
              onBlur={() => {
                setFocused(false);
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDER_TEXTS[placeholderIndex]}
              rows={1}
              disabled={loading || disabled}
              className="w-full resize-none bg-transparent text-base sm:text-lg text-white placeholder:text-white/20 font-sans outline-none leading-relaxed py-2 max-h-[200px] disabled:opacity-50"
              aria-label="Descreva o site que você quer criar"
            />
            {/* Character count */}
            {prompt.length > 0 && (
              <span className="absolute right-2 bottom-2 text-[10px] font-mono text-white/15">
                {prompt.length}
              </span>
            )}
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || loading || disabled}
            className="shrink-0 mb-1 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-thiagobuild-gold to-amber-600 text-thiagobuild-base disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-thiagobuild-gold/25 transition-all active:scale-95"
            aria-label="Gerar site"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>

        {/* Helper text */}
        <div className="flex items-center justify-between mt-2.5 px-1">
          <span className="text-[11px] text-white/25 font-mono">
            {focused ? "Enter para gerar · Shift+Enter para nova linha" : "Descreva seu site em linguagem natural"}
          </span>
          {!focused && (
            <span className="text-[11px] text-thiagobuild-gold/40 font-mono">
              thiagobuild
            </span>
          )}
        </div>
      </motion.div>

      {/* ── Suggestions ── */}
      <AnimatePresence>
        {showSuggestions && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="mt-2 rounded-xl border border-thiagobuild-gold/10 bg-thiagobuild-surface/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-3 py-2.5 border-b border-white/5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                Sugestões de prompt
              </span>
            </div>
            <div className="p-1.5 space-y-0.5">
              {SUGGESTIONS.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => applySuggestion(suggestion)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left text-sm text-white/50 hover:text-white hover:bg-thiagobuild-gold/5 transition-all group"
                >
                  <ChevronDown
                    size={12}
                    className="text-thiagobuild-gold/30 group-hover:text-thiagobuild-gold/60 transition-colors shrink-0 -rotate-90"
                  />
                  <span className="truncate">{suggestion}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
