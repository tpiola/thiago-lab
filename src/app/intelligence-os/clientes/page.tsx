"use client";

import { useState, useMemo } from "react";
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
  RefreshCw,
  Database,
  Activity,
  Calendar,
} from "lucide-react";
import LeadForm from "./componentes/LeadForm";
import { useN8nLeads, type Cliente } from "./n8n-leads";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

const ITEMS_PER_PAGE = 8;

const STATUS_STYLES: Record<string, { dot: string; bg: string; color: string }> = {
  Ativo:   { dot: "active",   bg: "rgba(52,211,153,0.08)",  color: "#34D399" },
  Lead:    { dot: "lead",     bg: "rgba(251,191,36,0.08)",  color: "#FBBF24" },
  Inativo: { dot: "inactive", bg: "rgba(107,114,128,0.08)", color: "#6B7280" },
};

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
      <span className={`intelligence-os-status-dot ${s.dot}`} />
      {status}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LIVE BADGE (dados ao vivo vs simulados)
   ═══════════════════════════════════════════════════════════════════════════ */

function LiveBadge({ live, source }: { live: boolean; source: string }) {
  if (!live) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium bg-[rgba(251,191,36,0.08)] text-[#FBBF24] border border-[rgba(251,191,36,0.12)]">
        <Database size={10} />
        Dados Simulados
      </span>
    );
  }

  const sourceLabel = source === 'n8n' ? 'n8n' : 'Supabase';
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium bg-[rgba(52,211,153,0.08)] text-[#34D399] border border-[rgba(52,211,153,0.12)]">
      <Activity size={10} />
      Dados ao vivo — {sourceLabel}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CLIENTES PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ClientesPage() {
  const { leads, loading, live, source, refetch } = useN8nLeads();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(
    () =>
      leads.filter(
        (c) =>
          c.nome.toLowerCase().includes(search.toLowerCase()) ||
          c.empresa.toLowerCase().includes(search.toLowerCase()),
      ),
    [leads, search],
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset page when search changes
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const stats = useMemo(() => {
    const total = leads.length;
    const ativos = leads.filter((c) => c.status === "Ativo").length;
    const leadsCount = leads.filter((c) => c.status === "Lead").length;
    const conversao = total > 0 ? ((ativos / total) * 100).toFixed(0) : "0";

    // Leads de hoje
    const today = new Date().toLocaleDateString("pt-BR");
    const leadsHoje = leads.filter((c) => c.ultimoContato === today).length;

    return { total, ativos, leads: leadsCount, leadsHoje, conversao };
  }, [leads]);

  return (
    <div className="p-4 lg:p-6 min-h-full intelligence-os-grid-bg">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="intelligence-os-section-title text-2xl">Clientes</h1>
            <p className="intelligence-os-section-subtitle mt-1">
              Gerencie sua base de clientes e pacientes
            </p>
          </div>
          <div className="flex items-center gap-2 ml-auto sm:ml-3">
            <LiveBadge live={live} source={source} />
            <button
              onClick={refetch}
              disabled={loading}
              className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#E8EDF2] hover:bg-[rgba(201,162,39,0.06)] transition-all disabled:opacity-50"
              title="Atualizar dados"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
        <button className="intelligence-os-btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Novo Lead
        </button>
      </div>

      {/* ── Stats Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} className="text-[#C9A227]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Total</span>
          </div>
          <div className="intelligence-os-metric-value text-xl">{stats.total}</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck size={14} className="text-[#34D399]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Ativos</span>
          </div>
          <div className="intelligence-os-metric-value text-xl" style={{ color: "#34D399" }}>{stats.ativos}</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus size={14} className="text-[#FBBF24]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Leads</span>
          </div>
          <div className="intelligence-os-metric-value text-xl" style={{ color: "#FBBF24" }}>{stats.leads}</div>
        </div>
        <div className="intelligence-os-metric">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} className="text-[#C9A227]" />
            <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Leads Hoje</span>
          </div>
          <div className="intelligence-os-metric-value text-xl">{stats.leadsHoje}</div>
          <div className="mt-1 text-[10px] text-[#6B7280]">
            Taxa conversão: <span className="text-[#C9A227]">{stats.conversao}%</span>
          </div>
        </div>
      </div>

      {/* ── Search & Table ──────────────────────────────────────────────── */}
      <div className="intelligence-os-card">
        <div className="p-4 border-b border-[rgba(201,162,39,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Buscar por nome ou empresa..."
                className="intelligence-os-input w-full pl-9 pr-3 py-2 text-sm"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <span className="text-[11px] text-[#6B7280] hidden sm:block">
              {filtered.length} de {leads.length} clientes
            </span>
          </div>
        </div>

        {loading && leads.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw size={20} className="text-[#C9A227] animate-spin" />
            <span className="ml-3 text-sm text-[#6B7280]">Carregando clientes...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="intelligence-os-table">
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
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-[#6B7280] text-sm">
                      {search ? "Nenhum cliente encontrado para esta busca." : "Nenhum cliente cadastrado ainda."}
                    </td>
                  </tr>
                ) : (
                  paginated.map((c) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ──────────────────────────────────────────────────── */}
        {totalPages > 1 && !loading && (
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

      {/* ── Lead Form Modal ──────────────────────────────────────────────── */}
      <LeadForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          // Refetch leads after successful creation
          setTimeout(refetch, 500);
        }}
      />
    </div>
  );
}
