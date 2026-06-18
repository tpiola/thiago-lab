"use client";

import { useState } from "react";
import {
  Mail,
  Search,
  Star,
  Trash2,
  Paperclip,
  Clock,
  Inbox,
  Send,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */
interface Email {
  id: number;
  from: string;
  email: string;
  avatar: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  important: boolean;
  hasAttachment: boolean;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════ */
const EMAILS: Email[] = [
  {
    id: 1,
    from: "Ana Costa",
    email: "ana@techstart.com",
    avatar: "AC",
    subject: "Proposta comercial - TechStart",
    preview: "Olá Thiago, conforme conversamos, estou enviando a proposta para a implantação do CRM...",
    date: "10:32",
    read: false,
    important: true,
    hasAttachment: true,
  },
  {
    id: 2,
    from: "GitHub",
    email: "noreply@github.com",
    avatar: "GH",
    subject: "[intelligence-os-crm] Pull request #42 merged",
    preview: "O pull request 'feat: adiciona página de automações' foi merged na branch main...",
    date: "09:15",
    read: false,
    important: false,
    hasAttachment: false,
  },
  {
    id: 3,
    from: "Roberto Alves",
    email: "roberto@acme.com",
    avatar: "RA",
    subject: "Reunião de alinhamento - Acme Corp",
    preview: "Thiago, podemos marcar uma reunião para alinhar os próximos passos da parceria?...",
    date: "Ontem",
    read: false,
    important: true,
    hasAttachment: false,
  },
  {
    id: 4,
    from: "Vercel",
    email: "noreply@vercel.app",
    avatar: "V",
    subject: "Deploy bem-sucedido - intelligence-os-crm",
    preview: "Seu deploy do projeto intelligence-os-crm na branch main foi concluído com sucesso...",
    date: "Ontem",
    read: true,
    important: false,
    hasAttachment: false,
  },
  {
    id: 5,
    from: "Maria Silva",
    email: "maria@email.com",
    avatar: "MS",
    subject: "Lead qualificado - Potencial parceria",
    preview: "Encontrei seu trabalho e tenho interesse em saber mais sobre o Intelligence OS CRM...",
    date: "2 dias atrás",
    read: true,
    important: false,
    hasAttachment: false,
  },
  {
    id: 6,
    from: "Fernanda Torres",
    email: "fernanda@megacorp.com",
    avatar: "FT",
    subject: "Contrato - MegaCorp",
    preview: "Segue em anexo o contrato assinado para a parceria. Favor confirmar recebimento...",
    date: "2 dias atrás",
    read: true,
    important: false,
    hasAttachment: true,
  },
  {
    id: 7,
    from: "Carlos Silva",
    email: "carlos@xyz.com",
    avatar: "CS",
    subject: "Dúvidas sobre implementação",
    preview: "Thiago, estamos com algumas dúvidas sobre a integração com o sistema atual...",
    date: "3 dias atrás",
    read: true,
    important: false,
    hasAttachment: false,
  },
  {
    id: 8,
    from: "LinkedIn",
    email: "messages@linkedin.com",
    avatar: "LI",
    subject: "Novas oportunidades para você",
    preview: "Com base no seu perfil, encontramos 5 novas oportunidades que podem ser do seu...",
    date: "4 dias atrás",
    read: true,
    important: false,
    hasAttachment: false,
  },
];

const FILTERS = ["Todos", "Não Lidos", "Importantes"] as const;
type FilterLabel = (typeof FILTERS)[number];

/* ═══════════════════════════════════════════════════════════════════════════
   EMAIL ROW
   ═══════════════════════════════════════════════════════════════════════════ */
function EmailRow({ email }: { email: Email }) {
  return (
    <div
      className={`flex items-start gap-3 p-4 border-b border-[rgba(201,162,39,0.06)] hover:bg-[rgba(201,162,39,0.02)] transition-colors cursor-pointer ${
        !email.read ? "bg-[rgba(201,162,39,0.03)]" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
          !email.read
            ? "bg-[#C9A227] text-[#050D1A]"
            : "bg-[rgba(201,162,39,0.1)] text-[#6B7280]"
        }`}
      >
        {email.avatar}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${
                !email.read ? "font-semibold text-[#E8EDF2]" : "font-medium text-[#9BA3B8]"
              }`}
            >
              {email.from}
            </span>
            {email.important && <Star size={12} className="text-[#C9A227] fill-[#C9A227]" />}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#6B7280] flex-shrink-0">
            {email.hasAttachment && <Paperclip size={11} />}
            {email.date}
          </div>
        </div>

        <p
          className={`text-xs truncate mb-0.5 ${
            !email.read ? "text-[#E8EDF2]" : "text-[#6B7280]"
          }`}
        >
          {email.subject}
        </p>
        <p className="text-[11px] text-[#6B7280] truncate">{email.preview}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EMAIL PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function EmailPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterLabel>("Todos");

  const filteredEmails = EMAILS.filter((e) => {
    const matchesSearch =
      e.from.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase()) ||
      e.preview.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "Não Lidos") return !e.read;
    if (filter === "Importantes") return e.important;
    return true;
  });

  const unreadCount = EMAILS.filter((e) => !e.read).length;
  const importantCount = EMAILS.filter((e) => e.important).length;

  return (
    <div className="flex flex-col h-full intelligence-os-grid-bg">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="p-4 lg:p-6 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="intelligence-os-section-title text-2xl">Email & Inbox</h1>
            <p className="intelligence-os-section-subtitle mt-1">
              Gerencie suas mensagens e comunicações
            </p>
          </div>
        </div>

        {/* ── Stats ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="intelligence-os-metric">
            <div className="flex items-center gap-2 mb-2">
              <Inbox size={14} className="text-[#C9A227]" />
              <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Total</span>
            </div>
            <div className="intelligence-os-metric-value text-xl">{EMAILS.length}</div>
          </div>
          <div className="intelligence-os-metric">
            <div className="flex items-center gap-2 mb-2">
              <Mail size={14} className="text-[#FBBF24]" />
              <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Não Lidos</span>
            </div>
            <div className="intelligence-os-metric-value text-xl" style={{ color: "#FBBF24" }}>{unreadCount}</div>
          </div>
          <div className="intelligence-os-metric">
            <div className="flex items-center gap-2 mb-2">
              <Star size={14} className="text-[#C9A227]" />
              <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Importantes</span>
            </div>
            <div className="intelligence-os-metric-value text-xl" style={{ color: "#C9A227" }}>{importantCount}</div>
          </div>
          <div className="intelligence-os-metric">
            <div className="flex items-center gap-2 mb-2">
              <Send size={14} className="text-[#34D399]" />
              <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Enviados Hoje</span>
            </div>
            <div className="intelligence-os-metric-value text-xl text-[#34D399]">12</div>
          </div>
        </div>
      </div>

      {/* ── Email List ───────────────────────────────────────────────────── */}
      <div className="flex-1 px-4 lg:px-6 pb-4 overflow-y-auto intelligence-os-scrollbar">
        <div className="intelligence-os-card overflow-hidden">
          {/* Search & Filters */}
          <div className="p-4 border-b border-[rgba(201,162,39,0.06)] space-y-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Buscar emails..."
                className="intelligence-os-input w-full pl-9 pr-3 py-2 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === f
                      ? "bg-[rgba(201,162,39,0.1)] text-[#C9A227] border border-[rgba(201,162,39,0.15)]"
                      : "text-[#6B7280] hover:text-[#E8EDF2] hover:bg-[rgba(201,162,39,0.04)] border border-transparent"
                  }`}
                >
                  {f}
                  {f === "Não Lidos" && unreadCount > 0 && (
                    <span className="ml-1.5 text-[10px] bg-[#C9A227] text-[#050D1A] px-1.5 py-0.5 rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Emails */}
          {filteredEmails.length > 0 ? (
            <div>
              {filteredEmails.map((email) => (
                <EmailRow key={email.id} email={email} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Inbox size={40} className="text-[#6B7280] mb-3" />
              <p className="text-sm text-[#6B7280]">Nenhum email encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
