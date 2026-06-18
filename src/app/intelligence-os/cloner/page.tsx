"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Globe,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  History,
  FileCode,
  Eye,
  Zap,
  Link2,
  ChevronRight,
  Code,
  Layout,
  Trash2,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface ClonerBlock {
  type: string;
  props: Record<string, unknown>;
}

interface ClonerResult {
  name: string;
  url: string;
  blocks: ClonerBlock[];
  html: string;
  reactCode: string;
  analyzedAt: string;
}

interface CloneHistory {
  id: string;
  name: string;
  url: string;
  analyzedAt: string;
  blocksCount: number;
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT — Block Preview
   ═══════════════════════════════════════════════════════════════════════════ */

const BLOCK_ICONS: Record<string, typeof Layout> = {
  hero: Eye,
  features: Layout,
  footer: Layout,
  nav: Layout,
  header: Layout,
  section: Layout,
  cta: Zap,
};

function BlockPreview({ block, index }: { block: ClonerBlock; index: number }) {
  const Icon = BLOCK_ICONS[block.type] || Layout;
  const p = block.props;

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[rgba(201,162,39,0.04)] border border-[rgba(201,162,39,0.06)] hover:border-[rgba(201,162,39,0.15)] transition-all">
      <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.06)] flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-[#C9A227]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#E8EDF2] uppercase tracking-wider">
            {block.type}
          </span>
          <span className="text-[10px] text-[#6B7280]">#{index + 1}</span>
        </div>
        <p className="text-[11px] text-[#6B7280] truncate">
          {String(p.title || p.name || `${block.type} block`)}
        </p>
      </div>
      <div className="flex items-center gap-1 text-[10px] text-[#6B7280]">
        {Object.keys(p).length} props
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT — Clone History Item
   ═══════════════════════════════════════════════════════════════════════════ */

function CloneHistoryItem({
  item,
  onRestore,
  onDelete,
}: {
  item: CloneHistory;
  onRestore: (url: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[rgba(201,162,39,0.02)] border border-[rgba(201,162,39,0.04)] hover:border-[rgba(201,162,39,0.1)] transition-all group">
      <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,39,0.06)] border border-[rgba(201,162,39,0.04)] flex items-center justify-center flex-shrink-0">
        <History size={14} className="text-[#6B7280]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[#E8EDF2] truncate">{item.name}</p>
        <p className="text-[10px] text-[#6B7280] truncate">{item.url}</p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onRestore(item.url)}
          className="p-1 text-[#6B7280] hover:text-[#C9A227] rounded transition-colors"
          title="Clonar novamente"
        >
          <Copy size={12} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-1 text-[#6B7280] hover:text-[#EF4444] rounded transition-colors"
          title="Remover"
        >
          <Trash2 size={12} />
        </button>
      </div>
      <span className="text-[10px] text-[#6B7280] whitespace-nowrap">
        {item.blocksCount} blocos
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SITE CLONER PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ClonerPage() {
  const [url, setUrl] = useState("");
  const [cloning, setCloning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClonerResult | null>(null);
  const [history, setHistory] = useState<CloneHistory[]>([]);
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  /* ── Load history from localStorage ── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cloner_history");
      if (saved) setHistory(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const saveHistory = useCallback((h: CloneHistory[]) => {
    setHistory(h);
    try {
      localStorage.setItem("cloner_history", JSON.stringify(h));
    } catch { /* ignore */ }
  }, []);

  /* ── Clone Site ── */
  const handleClone = async () => {
    if (!url.trim()) return;

    setCloning(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/cloner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || `Erro ${res.status}`);
        return;
      }

      setResult(data);

      // Add to history
      const entry: CloneHistory = {
        id: `clone-${Date.now()}`,
        name: data.name,
        url: data.url,
        analyzedAt: data.analyzedAt,
        blocksCount: data.blocks?.length || 0,
      };

      const updated = [entry, ...history.filter((h) => h.url !== data.url)].slice(0, 20);
      saveHistory(updated);
    } catch (e) {
      setError(`Erro de conexão: ${(e as Error).message}`);
    } finally {
      setCloning(false);
    }
  };

  /* ── Handle keypress ── */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !cloning) handleClone();
  };

  /* ── Copy code ── */
  const handleCopyCode = async () => {
    if (!result?.reactCode) return;
    try {
      await navigator.clipboard.writeText(result.reactCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  /* ── Export ZIP ── */
  const handleExportZip = async () => {
    if (!result) return;

    // Dynamic import JSZip
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    // Create component files
    const src = zip.folder("cloned-site")!;
    src.file("package.json", JSON.stringify({
      name: result.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      version: "0.1.0",
      private: true,
      scripts: { dev: "next dev", build: "next build", start: "next start" },
      dependencies: {
        next: "16.2.9",
        react: "^19.2.7",
        "react-dom": "^19.2.7",
        "lucide-react": "^1.20.0",
      },
      devDependencies: {
        "@types/react": "^19",
        "@types/react-dom": "^19",
        tailwindcss: "^4",
        typescript: "^6",
      },
    }, null, 2));

    src.file("tsconfig.json", JSON.stringify({
      compilerOptions: {
        target: "ES2017",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        module: "esnext",
        moduleResolution: "bundler",
        jsx: "preserve",
        strict: true,
        paths: { "@/*": ["./src/*"] },
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
    }, null, 2));

    src.file("next.config.ts", `import type { NextConfig } from "next";\nconst config: NextConfig = {};\nexport default config;\n`);

    const appDir = src.folder("src")!.folder("app")!;
    appDir.file("layout.tsx", `import type { Metadata } from "next";\nimport "./globals.css";\n\nexport const metadata: Metadata = {\n  title: "${result.name}",\n  description: "Cloned from ${result.url}",\n};\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="pt-BR">\n      <body>{children}</body>\n    </html>\n  );\n}\n`);
    appDir.file("globals.css", "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\nbody { font-family: system-ui, sans-serif; }\n");
    appDir.file("page.tsx", result.reactCode);

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Calculate stats ── */
  const totalClones = history.length;
  const lastClone = result
    ? new Date(result.analyzedAt).toLocaleString("pt-BR")
    : history.length > 0
    ? new Date(history[0].analyzedAt).toLocaleString("pt-BR")
    : "—";

  return (
    <div className="p-4 lg:p-6 min-h-full intelligence-os-grid-bg">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="intelligence-os-section-title text-2xl">Site Cloner</h1>
          <p className="intelligence-os-section-subtitle mt-1">
            Clone qualquer site e converta para React + Tailwind CSS
          </p>
        </div>
        <div className="flex items-center gap-2">
          {result && (
            <>
              <button
                onClick={handleExportZip}
                className="intelligence-os-btn-outline"
              >
                <Download size={16} />
                Exportar Código
              </button>
              <a
                href={`/builder?clone=${encodeURIComponent(result.name)}`}
                className="intelligence-os-btn-primary"
              >
                <Layout size={16} />
                Abrir no Builder
              </a>
            </>
          )}
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <Copy size={14} className="text-[#C9A227]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Sites Clonados</span>
          </div>
          <div className="intelligence-os-metric-value text-xl">{totalClones}</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <FileCode size={14} className="text-[#34D399]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Componentes</span>
          </div>
          <div className="intelligence-os-metric-value text-xl">
            {result ? result.blocks.length : 0}
          </div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-[#FBBF24]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Último Clone</span>
          </div>
          <div className="intelligence-os-metric-value text-lg" style={{ color: "#FBBF24" }}>
            {lastClone}
          </div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-[#60A5FA]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Status</span>
          </div>
          <div className="intelligence-os-metric-value text-lg flex items-center gap-1" style={{ color: cloning ? "#FBBF24" : result ? "#34D399" : "#6B7280" }}>
            <span className={`w-2 h-2 rounded-full ${cloning ? "bg-[#FBBF24] animate-pulse" : result ? "bg-[#34D399]" : "bg-[#6B7280]"}`} />
            {cloning ? "Clonando..." : result ? "Pronto" : "Aguardando"}
          </div>
        </div>
      </div>

      {/* ── Input URL ──────────────────────────────────────────────────────── */}
      <div className="intelligence-os-card p-5 mb-6">
        <label className="block text-sm font-medium text-[#E8EDF2] mb-3">
          URL do site para clonar
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://exemplo.com"
              className="intelligence-os-input w-full pl-10 pr-3 py-2.5 text-sm"
              disabled={cloning}
            />
          </div>
          <button
            onClick={handleClone}
            disabled={cloning || !url.trim()}
            className="intelligence-os-btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cloning ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Clonando...
              </>
            ) : (
              <>
                <Copy size={16} />
                Clonar Site
              </>
            )}
          </button>
        </div>
        {error && (
          <div className="mt-3 flex items-center gap-2 text-xs text-[#EF4444] bg-[rgba(239,68,68,0.08)] px-3 py-2 rounded-lg">
            <AlertCircle size={12} />
            {error}
          </div>
        )}
      </div>

      {/* ── Results ──────────────────────────────────────────────────────── */}
      {result && (
        <div className="space-y-6">
          {/* Site Info */}
          <div className="intelligence-os-card p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.06)] flex items-center justify-center flex-shrink-0">
                <Globe size={20} className="text-[#C9A227]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-[#E8EDF2]">{result.name}</h2>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#6B7280] hover:text-[#C9A227] flex items-center gap-1 mt-0.5"
                >
                  {result.url}
                  <ExternalLink size={10} />
                </a>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                <CheckCircle size={12} className="text-[#34D399]" />
                {result.blocks.length} blocos
              </div>
            </div>
          </div>

          {/* Tabs: Preview / Code */}
          <div className="intelligence-os-card overflow-hidden">
            <div className="flex border-b border-[rgba(201,162,39,0.06)]">
              <button
                onClick={() => setTab("preview")}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium transition-colors ${
                  tab === "preview"
                    ? "text-[#C9A227] border-b-2 border-[#C9A227]"
                    : "text-[#6B7280] hover:text-[#E8EDF2]"
                }`}
              >
                <Eye size={14} />
                Preview
              </button>
              <button
                onClick={() => setTab("code")}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium transition-colors ${
                  tab === "code"
                    ? "text-[#C9A227] border-b-2 border-[#C9A227]"
                    : "text-[#6B7280] hover:text-[#E8EDF2]"
                }`}
              >
                <FileCode size={14} />
                Código React
              </button>
            </div>

            <div className="p-4">
              {tab === "preview" ? (
                <div className="space-y-2">
                  {result.blocks.map((block, i) => (
                    <BlockPreview key={i} block={block} index={i} />
                  ))}
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={handleCopyCode}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-[rgba(201,162,39,0.1)] text-[#C9A227] hover:bg-[rgba(201,162,39,0.2)] transition-colors z-10"
                    title="Copiar código"
                  >
                    {copied ? <CheckCircle size={14} /> : <Code size={14} />}
                  </button>
                  <pre className="text-[11px] font-mono text-[#B0B8C4] bg-[#06080C] rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap">
                    {result.reactCode}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button onClick={handleExportZip} className="intelligence-os-btn-primary">
              <Download size={16} />
              Exportar Código (ZIP)
            </button>
            <a
              href={`/builder?clone=${encodeURIComponent(result.name)}`}
              className="intelligence-os-btn-outline"
            >
              <Layout size={16} />
              Abrir no Builder
            </a>
            <button
              onClick={handleCopyCode}
              className="intelligence-os-btn-outline"
            >
              {copied ? (
                <><CheckCircle size={16} /> Copiado!</>
              ) : (
                <><Code size={16} /> Copiar Código</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── History ──────────────────────────────────────────────────────── */}
      {history.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#E8EDF2] flex items-center gap-2">
              <History size={14} className="text-[#C9A227]" />
              Histórico de Clones
            </h3>
            <span className="text-[10px] text-[#6B7280]">
              {history.length} clones
            </span>
          </div>
          <div className="space-y-1.5">
            {history.slice(0, 10).map((item) => (
              <CloneHistoryItem
                key={item.id}
                item={item}
                onRestore={(u) => { setUrl(u); handleClone(); }}
                onDelete={(id) => saveHistory(history.filter((h) => h.id !== id))}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
