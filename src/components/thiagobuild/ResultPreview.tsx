"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Code, Copy, Check, Download, Rocket, X,
  ChevronLeft, FileText, ExternalLink,
} from "lucide-react";

/* ==========================================================================
   ResultPreview — preview generated sites with tabs
   Preview / Code views, Copy / Download / Deploy actions
   /thiagobuild — dark + gold accent
   ========================================================================== */

interface ResultPreviewProps {
  html: string;
  title?: string;
  onClose?: () => void;
  onRegenerate?: () => void;
}

export default function ResultPreview({
  html,
  title = "Site Preview",
  onClose,
  onRegenerate,
}: ResultPreviewProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = html;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeploy = () => {
    alert("🚀 Deploy será implementado em breve! O site será hospedado automaticamente.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-thiagobuild-gold/15 bg-thiagobuild-surface/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/30"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-thiagobuild-gold/10">
        <div className="flex items-center gap-3 min-w-0">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all"
              aria-label="Fechar preview"
            >
              <X size={16} />
            </button>
          )}
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-thiagobuild-gold/20 to-amber-900/20 flex items-center justify-center border border-thiagobuild-gold/20">
            <FileText size={14} className="text-thiagobuild-gold" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">
              {title}
            </h3>
            <span className="text-[10px] font-mono text-white/25">
              Resultado gerado por IA
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="hidden sm:flex items-center bg-thiagobuild-base/50 rounded-lg p-0.5 border border-thiagobuild-gold/10">
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "preview"
                ? "bg-thiagobuild-gold/15 text-thiagobuild-gold"
                : "text-white/40 hover:text-white"
            }`}
          >
            <Eye size={13} />
            Preview
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "code"
                ? "bg-thiagobuild-gold/15 text-thiagobuild-gold"
                : "text-white/40 hover:text-white"
            }`}
          >
            <Code size={13} />
            Código
          </button>
        </div>

        {/* Mobile tab selector */}
        <div className="sm:hidden">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as "preview" | "code")}
            className="bg-thiagobuild-base/50 text-xs text-white/70 border border-thiagobuild-gold/10 rounded-lg px-2 py-1.5 outline-none"
            aria-label="Selecionar visão"
          >
            <option value="preview">Preview</option>
            <option value="code">Código</option>
          </select>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab === "preview" ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white"
            >
              <iframe
                srcDoc={html}
                title={title}
                className="w-full border-0"
                style={{ height: "500px", maxHeight: "70vh" }}
                sandbox="allow-scripts"
              />
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <pre className="overflow-auto p-4 sm:p-5 text-xs leading-relaxed font-mono text-white/70 bg-thiagobuild-base/80 max-h-[70vh] scrollbar-thin">
                <code>{html}</code>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-thiagobuild-gold/10 bg-thiagobuild-base/30">
        <div className="flex items-center gap-2">
          {/* Copy */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-thiagobuild-gold hover:bg-thiagobuild-gold/10 transition-all border border-transparent hover:border-thiagobuild-gold/20"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-400" />
                Copiado!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copiar
              </>
            )}
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-thiagobuild-gold hover:bg-thiagobuild-gold/10 transition-all border border-transparent hover:border-thiagobuild-gold/20"
          >
            <Download size={14} />
            Download
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Deploy */}
          <button
            onClick={handleDeploy}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-thiagobuild-base bg-gradient-to-r from-thiagobuild-gold to-amber-600 hover:shadow-lg hover:shadow-thiagobuild-gold/25 transition-all active:scale-95"
          >
            <Rocket size={14} />
            <span className="hidden sm:inline">Deploy</span>
            <ExternalLink size={12} />
          </button>

          {/* Open in new tab */}
          <button
            onClick={() => {
              const w = window.open("", "_blank");
              if (w) {
                w.document.write(html);
                w.document.close();
              }
            }}
            className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Abrir em nova aba"
          >
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* ── Mobile tabs (repeated below for convenience) ── */}
      <div className="sm:hidden flex border-t border-thiagobuild-gold/10">
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all ${
            activeTab === "preview"
              ? "text-thiagobuild-gold bg-thiagobuild-gold/5"
              : "text-white/30"
          }`}
        >
          <Eye size={13} />
          Preview
        </button>
        <button
          onClick={() => setActiveTab("code")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all ${
            activeTab === "code"
              ? "text-thiagobuild-gold bg-thiagobuild-gold/5"
              : "text-white/30"
          }`}
        >
          <Code size={13} />
          Código
        </button>
      </div>
    </motion.div>
  );
}
