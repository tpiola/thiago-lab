"use client";

import { useState } from "react";
import {
  HardDrive,
  Folder,
  FileText,
  FileImage,
  FileSpreadsheet,
  File,
  Users,
  ChevronRight,
  Home,
  Download,
  BarChart3,
  Clock,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */
interface DriveFile {
  name: string;
  type: "pdf" | "image" | "sheet" | "doc";
  size: string;
  modified: string;
}

interface DriveFolder {
  id: string;
  name: string;
  icon: typeof Folder;
  size: string;
  files: number;
  lastFile: string;
  color: string;
  description: string;
  recentFiles: DriveFile[];
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════ */
const FOLDERS: DriveFolder[] = [
  {
    id: "clientes",
    name: "Clientes",
    icon: Users,
    size: "8.2 GB",
    files: 128,
    lastFile: "Proposta Acme Corp.pdf",
    color: "#60A5FA",
    description: "Documentos, contratos e propostas de clientes",
    recentFiles: [
      { name: "Proposta Acme Corp.pdf", type: "pdf", size: "2.4 MB", modified: "2h atrás" },
      { name: "Contrato TechStart.docx", type: "doc", size: "1.1 MB", modified: "1 dia atrás" },
      { name: "Logo MegaCorp.png", type: "image", size: "3.5 MB", modified: "3 dias atrás" },
    ],
  },
  {
    id: "financeiro",
    name: "Financeiro",
    icon: BarChart3,
    size: "4.7 GB",
    files: 89,
    lastFile: "Planilha custos.xlsx",
    color: "#34D399",
    description: "Planilhas, notas fiscais e relatórios financeiros",
    recentFiles: [
      { name: "Planilha custos.xlsx", type: "sheet", size: "856 KB", modified: "5h atrás" },
      { name: "NF 2026-06.pdf", type: "pdf", size: "234 KB", modified: "1 dia atrás" },
      { name: "Relatório mensal.pdf", type: "pdf", size: "1.8 MB", modified: "1 semana atrás" },
    ],
  },
  {
    id: "conteudo",
    name: "Conteúdo",
    icon: FileText,
    size: "5.1 GB",
    files: 67,
    lastFile: "Post Instagram - Produto.mp4",
    color: "#C9A227",
    description: "Posts, vídeos, artigos e materiais de marketing",
    recentFiles: [
      { name: "Post Instagram - Produto.mp4", type: "image", size: "45 MB", modified: "3h atrás" },
      { name: "Artigo SEO - NEXUS.docx", type: "doc", size: "2.1 MB", modified: "1 dia atrás" },
      { name: "Banner campanha.png", type: "image", size: "5.3 MB", modified: "2 dias atrás" },
    ],
  },
  {
    id: "templates",
    name: "Templates",
    icon: File,
    size: "2.8 GB",
    files: 34,
    lastFile: "Proposta comercial.pptx",
    color: "#A78BFA",
    description: "Modelos de documentos, apresentações e planilhas",
    recentFiles: [
      { name: "Proposta comercial.pptx", type: "doc", size: "3.2 MB", modified: "1 semana atrás" },
      { name: "Template relatório.xlsx", type: "sheet", size: "456 KB", modified: "2 semanas atrás" },
      { name: "Contrato padrão.docx", type: "doc", size: "189 KB", modified: "1 mês atrás" },
    ],
  },
  {
    id: "assets",
    name: "Assets",
    icon: FileImage,
    size: "2.6 GB",
    files: 56,
    lastFile: "Logo thiagolab.svg",
    color: "#F97316",
    description: "Imagens, ícones, fontes e assets de design",
    recentFiles: [
      { name: "Logo thiagolab.svg", type: "image", size: "45 KB", modified: "2 dias atrás" },
      { name: "Favicon pack.zip", type: "doc", size: "234 KB", modified: "5 dias atrás" },
      { name: "Mockup site.psd", type: "image", size: "128 MB", modified: "1 semana atrás" },
    ],
  },
];

const FILE_ICONS: Record<string, typeof File> = {
  pdf: FileText,
  image: FileImage,
  sheet: FileSpreadsheet,
  doc: FileText,
};

/* ═══════════════════════════════════════════════════════════════════════════
   FOLDER CARD
   ═══════════════════════════════════════════════════════════════════════════ */
function FolderCard({
  folder,
  onOpen,
}: {
  folder: DriveFolder;
  onOpen: (f: DriveFolder) => void;
}) {
  const Icon = folder.icon;

  return (
    <div
      className="nexus-card p-4 cursor-pointer hover:border-[rgba(201,162,39,0.15)] transition-all duration-200 group"
      onClick={() => onOpen(folder)}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${folder.color}12`, border: `1px solid ${folder.color}20` }}
        >
          <Icon size={20} style={{ color: folder.color }} />
        </div>
        <span className="text-xs text-[#6B7280] font-mono">{folder.size}</span>
      </div>

      <h3 className="text-sm font-semibold text-[#E8EDF2] mb-1">{folder.name}</h3>
      <p className="text-xs text-[#6B7280] mb-3">{folder.description}</p>

      <div className="flex items-center justify-between text-[11px] pt-3 border-t border-[rgba(201,162,39,0.06)]">
        <span className="text-[#6B7280]">{folder.files} arquivos</span>
        <span className="text-[#6B7280] flex items-center gap-1">
          <Clock size={10} />
          {folder.lastFile.length > 20 ? folder.lastFile.slice(0, 18) + "..." : folder.lastFile}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FOLDER DETAIL
   ═══════════════════════════════════════════════════════════════════════════ */
function FolderDetail({
  folder,
  onBack,
}: {
  folder: DriveFolder | null;
  onBack: () => void;
}) {
  if (!folder) return null;

  const totalSize = FOLDERS.reduce((acc, f) => {
    const num = parseFloat(f.size.replace(" GB", ""));
    return acc + num;
  }, 0);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-4">
        <button onClick={onBack} className="hover:text-[#C9A227] transition-colors">
          <Home size={14} />
        </button>
        <ChevronRight size={12} />
        <span style={{ color: folder.color }} className="font-medium">
          {folder.name}
        </span>
      </div>

      {/* Folder Header */}
      <div className="nexus-card p-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: `${folder.color}12`, border: `1px solid ${folder.color}20` }}
          >
            <folder.icon size={24} style={{ color: folder.color }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#E8EDF2] font-['Clash_Display',system-ui,sans-serif]">
              {folder.name}
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {folder.files} arquivos · {folder.size}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Files */}
      <h3 className="text-sm font-semibold text-[#E8EDF2] mb-3">Arquivos Recentes</h3>
      <div className="space-y-2">
        {folder.recentFiles.map((file, i) => {
          const FileIcon = FILE_ICONS[file.type] || File;
          return (
            <div
              key={i}
              className="nexus-card p-3 flex items-center justify-between hover:border-[rgba(201,162,39,0.12)] transition-all"
            >
              <div className="flex items-center gap-3">
                <FileIcon size={16} className="text-[#6B7280]" />
                <div>
                  <p className="text-sm text-[#E8EDF2]">{file.name}</p>
                  <p className="text-[10px] text-[#6B7280]">{file.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#6B7280]">{file.modified}</span>
                <button className="p-1 text-[#6B7280] hover:text-[#C9A227] transition-colors">
                  <Download size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DRIVE PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function DrivePage() {
  const [selectedFolder, setSelectedFolder] = useState<DriveFolder | null>(null);

  const totalSize = FOLDERS.reduce((acc, f) => {
    const num = parseFloat(f.size.replace(" GB", ""));
    return acc + num;
  }, 0);

  const totalFiles = FOLDERS.reduce((acc, f) => acc + f.files, 0);

  return (
    <div className="p-4 lg:p-6 min-h-full nexus-grid-bg">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="nexus-section-title text-2xl">Google Drive</h1>
          <p className="nexus-section-subtitle mt-1">
            Todos os seus arquivos e documentos centralizados
          </p>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="nexus-metric">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive size={14} className="text-[#C9A227]" />
            <span className="nexus-metric-label" style={{ margin: 0 }}>Total</span>
          </div>
          <div className="nexus-metric-value text-xl">{totalSize.toFixed(1)} GB</div>
        </div>
        <div className="nexus-metric">
          <div className="flex items-center gap-2 mb-2">
            <Folder size={14} className="text-[#60A5FA]" />
            <span className="nexus-metric-label" style={{ margin: 0 }}>Pastas</span>
          </div>
          <div className="nexus-metric-value text-xl" style={{ color: "#60A5FA" }}>{FOLDERS.length}</div>
        </div>
        <div className="nexus-metric">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-[#34D399]" />
            <span className="nexus-metric-label" style={{ margin: 0 }}>Arquivos</span>
          </div>
          <div className="nexus-metric-value text-xl text-[#34D399]">{totalFiles}+</div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      {selectedFolder ? (
        <FolderDetail folder={selectedFolder} onBack={() => setSelectedFolder(null)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FOLDERS.map((folder) => (
            <FolderCard key={folder.id} folder={folder} onOpen={setSelectedFolder} />
          ))}
        </div>
      )}
    </div>
  );
}
