"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Users,
  TrendingUp,
  UserCheck,
  UserPlus,
  Phone,
  Mail,
  Building2,
  MoreHorizontal,
  X,
  Check,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */
interface Cliente {
  id: number;
  nome: string;
  empresa: string;
  telefone: string;
  email: string;
  status: "Ativo" | "Lead" | "Inativo";
  ultimoContato: string;
  valor: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════ */
const CLIENTES_MOCK: Cliente[] = [
  { id: 1, nome: "Carlos Silva", empresa: "Empresa XYZ", telefone: "(11) 99999-0001", email: "carlos@xyz.com", status: "Ativo", ultimoContato: "18/06/2026", valor: "R$ 12.000" },
  { id: 2, nome: "Ana Costa", empresa: "TechStart", telefone: "(11) 99999-0002", email: "ana@techstart.com", status: "Lead", ultimoContato: "17/06/2026", valor: "R$ 8.500" },
  { id: 3, nome: "Pedro Santos", empresa: "GlobalWeb", telefone: "(21) 99999-0003", email: "pedro@globalweb.com", status: "Ativo", ultimoContato: "16/06/2026", valor: "R$ 22.000" },
  { id: 4, nome: "Julia Lima", empresa: "NovaTech", telefone: "(31) 99999-0004", email: "julia@novatech.com", status: "Lead", ultimoContato: "15/06/2026", valor: "R$ 5.000" },
  { id: 5, nome: "Roberto Alves", empresa: "Acme Corp", telefone: "(11) 99999-0005", email: "roberto@acme.com", status: "Ativo", ultimoContato: "17/06/2026", valor: "R$ 35.000" },
  { id: 6, nome: "Marina Dias", empresa: "BetaTech", telefone: "(41) 99999-0006", email: "marina@betatech.com", status: "Lead", ultimoContato: "16/06/2026", valor: "R$ 18.000" },
  { id: 7, nome: "Lucas Nunes", empresa: "Sigma Soluções", telefone: "(51) 99999-0007", email: "lucas@sigma.com", status: "Inativo", ultimoContato: "14/06/2026", valor: "R$ 9.000" },
  { id: 8, nome: "Fernanda Torres", empresa: "MegaCorp", telefone: "(11) 99999-0008", email: "fernanda@megacorp.com", status: "Ativo", ultimoContato: "16/06/2026", valor: "R$ 65.000" },
  { id: 9, nome: "Rafael Costa", empresa: "DataFlow", telefone: "(21) 99999-0009", email: "rafael@dataflow.com", status: "Ativo", ultimoContato: "15/06/2026", valor: "R$ 28.000" },
  { id: 10, nome: "Camila Rocha", empresa: "WebDev Ltda", telefone: "(31) 99999-0010", email: "camila@webdev.com", status: "Ativo", ultimoContato: "10/06/2026", valor: "R$ 42.000" },
  { id: 11, nome: "Thiago Martins", empresa: "Startup A", telefone: "(11) 99999-0011", email: "thiago@startupa.com", status: "Inativo", ultimoContato: "12/06/2026", valor: "R$ 15.000" },
  { id: 12, nome: "Amanda Oliveira", empresa: "InovaTech", telefone: "(61) 99999-0012", email: "amanda@inovatech.com", status: "Lead", ultimoContato: "11/06/2026", valor: "R$ 7.500" },
];

const ITEMS_PER_PAGE = 8;

const STATUS_STYLES: Record<string, { dot: string; bg: string; color: string }> = {
  Ativo:   { dot: "active",   bg: "rgba(52,211,153,0.08)",  color: "#34D399" },
  Lead:    { dot: "lead",     bg: "rgba(251,191,36,0.08)",  color: "#FBBF24" },
  Inativo: { dot: "inactive", bg: "rgba(107,114,128,0.08)", color: "#6B7280" },
};

/* ═══════════════════════════════════════════════════════════════════════════
   NOVO CLIENTE MODAL
   ═══════════════════════════════════════════════════════════════════════════ */
function NovoClienteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="nexus-modal-overlay" onClick={onClose}>
      <div className="nexus-modal" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#E8EDF2] font-['Clash_Display',system-ui,sans-serif]">
            Novo Cliente
          </h2>
          <button onClick={onClose} className="p-1 text-[#6B7280] hover:text-[#E8EDF2] rounded transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Nome Completo</label>
            <input className="nexus-input w-full" placeholder="Ex: João Silva" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Empresa</label>
            <input className="nexus-input w-full" placeholder="Ex: TechStart" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Telefone</label>
              <input className="nexus-input w-full" placeholder="(11) 99999-0000" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Email</label>
              <input className="nexus-input w-full" placeholder="email@exemplo.com" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Valor Potencial</label>
            <input className="nexus-input w-full" placeholder="R$ 0,00" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-[rgba(201,162,39,0.06)]">
          <button onClick={onClose} className="nexus-btn-outline text-xs px-4 py-2">Cancelar</button>
          <button className="nexus-btn-primary text-xs px-4 py-2">
            <Check size={14} />
            Salvar Cliente
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATUS BADGE
   ═══════════════════════════════════════════════════════════════════════════ */
function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES["Inativo"];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      <span className={`nexus-status-dot ${s.dot}`} />
      {status}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CLIENTES PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function ClientesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = CLIENTES_MOCK.filter(
    (c) =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.empresa.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const stats = {
    total: CLIENTES_MOCK.length,
    ativos: CLIENTES_MOCK.filter((c) => c.status === "Ativo").length,
    novos: CLIENTES_MOCK.filter((c) => c.status === "Lead").length,
    conversao: ((CLIENTES_MOCK.filter((c) => c.status === "Ativo").length / CLIENTES_MOCK.length) * 100).toFixed(0),
  };

  return (
    <div className="p-4 lg:p-6 min-h-full nexus-grid-bg">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="nexus-section-title text-2xl">Clientes</h1>
          <p className="nexus-section-subtitle mt-1">
            Gerencie sua base de clientes e pacientes
          </p>
        </div>
        <button className="nexus-btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Novo Cliente
        </button>
      </div>

      {/* ── Stats Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="nexus-metric">
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} className="text-[#C9A227]" />
            <span className="nexus-metric-label" style={{ margin: 0 }}>Total</span>
          </div>
          <div className="nexus-metric-value text-xl">{stats.total}</div>
        </div>
        <div className="nexus-metric">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck size={14} className="text-[#34D399]" />
            <span className="nexus-metric-label" style={{ margin: 0 }}>Ativos</span>
          </div>
          <div className="nexus-metric-value text-xl" style={{ color: "#34D399" }}>{stats.ativos}</div>
        </div>
        <div className="nexus-metric">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus size={14} className="text-[#FBBF24]" />
            <span className="nexus-metric-label" style={{ margin: 0 }}>Novos (Leads)</span>
          </div>
          <div className="nexus-metric-value text-xl" style={{ color: "#FBBF24" }}>{stats.novos}</div>
        </div>
        <div className="nexus-metric">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-[#C9A227]" />
            <span className="nexus-metric-label" style={{ margin: 0 }}>Taxa Conversão</span>
          </div>
          <div className="nexus-metric-value text-xl">{stats.conversao}%</div>
        </div>
      </div>

      {/* ── Search & Table ──────────────────────────────────────────────── */}
      <div className="nexus-card">
        <div className="p-4 border-b border-[rgba(201,162,39,0.06)]">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Buscar por nome ou empresa..."
              className="nexus-input w-full sm:w-80 pl-9 pr-3 py-2 text-sm"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="nexus-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Empresa</th>
                <th className="hidden md:table-cell">Telefone</th>
                <th className="hidden sm:table-cell">Email</th>
                <th>Status</th>
                <th className="hidden lg:table-cell">Último Contato</th>
                <th className="hidden sm:table-cell">Valor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c) => (
                <tr key={c.id} className="transition-colors">
                  <td className="font-medium">{c.nome}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <Building2 size={12} className="text-[#6B7280] flex-shrink-0" />
                      <span className="text-[#9BA3B8]">{c.empresa}</span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} className="text-[#6B7280] flex-shrink-0" />
                      <span className="text-[#9BA3B8]">{c.telefone}</span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} className="text-[#6B7280] flex-shrink-0" />
                      <span className="text-[#9BA3B8] text-xs">{c.email}</span>
                    </div>
                  </td>
                  <td><StatusBadge status={c.status} /></td>
                  <td className="hidden lg:table-cell text-[#9BA3B8] text-xs">{c.ultimoContato}</td>
                  <td className="hidden sm:table-cell text-sm font-medium">{c.valor}</td>
                  <td>
                    <button className="p-1 text-[#6B7280] hover:text-[#E8EDF2] rounded transition-colors">
                      <MoreHorizontal size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ──────────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(201,162,39,0.06)]">
            <span className="text-xs text-[#6B7280]">
              Página {page} de {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                className="p-1.5 rounded text-[#6B7280] hover:text-[#E8EDF2] hover:bg-[rgba(201,162,39,0.04)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                    p === page
                      ? "bg-[rgba(201,162,39,0.1)] text-[#C9A227]"
                      : "text-[#6B7280] hover:text-[#E8EDF2] hover:bg-[rgba(201,162,39,0.04)]"
                  }`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="p-1.5 rounded text-[#6B7280] hover:text-[#E8EDF2] hover:bg-[rgba(201,162,39,0.04)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Novo Cliente Modal ────────────────────────────────────────────── */}
      <NovoClienteModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
