"use client";

import { useState } from "react";
import {
  Mail,
  HardDrive,
  Calendar,
  Video,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Users,
  BarChart3,
  RefreshCw,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TIPOS
   ═══════════════════════════════════════════════════════════════════════════ */
interface WorkspaceService {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  connected: boolean;
  stats?: { label: string; value: string }[];
  actions: { label: string; href: string }[];
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════ */
const SERVICES: WorkspaceService[] = [
  {
    id: "gmail",
    name: "Gmail",
    description: "Email corporativo integrado",
    icon: Mail,
    color: "#EA4335",
    connected: true,
    stats: [
      { label: "Total Emails", value: "1,247" },
      { label: "Não Lidos", value: "23" },
      { label: "Enviados Hoje", value: "12" },
    ],
    actions: [
      { label: "Ver Emails", href: "/intelligence-os/email" },
      { label: "Abrir Gmail", href: "https://mail.google.com" },
    ],
  },
  {
    id: "drive",
    name: "Google Drive",
    description: "Armazenamento em nuvem",
    icon: HardDrive,
    color: "#FBBC04",
    connected: true,
    stats: [
      { label: "Drive Used", value: "23.4 GB" },
      { label: "Arquivos", value: "847" },
      { label: "Pastas", value: "64" },
    ],
    actions: [
      { label: "Abrir Drive", href: "https://drive.google.com" },
      { label: "Ver no CRM", href: "/intelligence-os/drive" },
    ],
  },
  {
    id: "calendar",
    name: "Google Calendar",
    description: "Agenda e compromissos",
    icon: Calendar,
    color: "#4285F4",
    connected: true,
    stats: [
      { label: "Events Today", value: "3" },
      { label: "Essa Semana", value: "14" },
      { label: "Próximo", value: "14:30 - Reunião" },
    ],
    actions: [
      { label: "Criar Evento", href: "https://calendar.google.com/calendar/u/0/r/eventedit" },
      { label: "Abrir Agenda", href: "https://calendar.google.com" },
    ],
  },
  {
    id: "meet",
    name: "Google Meet",
    description: "Videoconferências",
    icon: Video,
    color: "#34A853",
    connected: false,
    actions: [
      { label: "Criar Reunião", href: "https://meet.google.com/new" },
    ],
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Assistente de IA Google",
    icon: Sparkles,
    color: "#C9A227",
    connected: false,
    actions: [
      { label: "Usar no CRM", href: "/intelligence-os/gemini" },
      { label: "Abrir Gemini", href: "https://gemini.google.com" },
    ],
  },
];

const INTEGRATION_STATS = [
  { label: "Total Emails", value: "1,247" },
  { label: "Drive Used", value: "23.4 GB" },
  { label: "Events Today", value: "3" },
  { label: "Serviços Conectados", value: "3/5" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   SERVICE CARD
   ═══════════════════════════════════════════════════════════════════════════ */
function ServiceCard({ service }: { service: WorkspaceService }) {
  const Icon = service.icon;

  return (
    <div
      className="rounded-xl p-5 transition-all duration-300 animate-fade-in-up"
      style={{
        background:
          "linear-gradient(135deg, rgba(12,15,21,0.9), rgba(5,13,26,0.8))",
        border: `1px solid ${
          service.connected
            ? "rgba(201,162,39,0.12)"
            : "rgba(30,36,51,0.4)"
        }`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: `${service.color}12`,
              border: `1px solid ${service.color}25`,
            }}
          >
            <Icon size={20} style={{ color: service.color }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#E8EDF2]">
              {service.name}
            </h3>
            <p className="text-xs text-[#6B7280]">{service.description}</p>
          </div>
        </div>
        {/* Status badge */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
            service.connected
              ? "bg-[rgba(52,211,153,0.08)] text-[#34D399] border border-[rgba(52,211,153,0.15)]"
              : "bg-[rgba(107,114,128,0.08)] text-[#6B7280] border border-[rgba(107,114,128,0.15)]"
          }`}
        >
          {service.connected ? (
            <>
              <CheckCircle2 size={10} />
              Conectado
            </>
          ) : (
            <>
              <XCircle size={10} />
              Desconectado
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      {service.stats && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {service.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg p-2.5 text-center"
              style={{
                background: "rgba(201,162,39,0.03)",
                border: "1px solid rgba(201,162,39,0.06)",
              }}
            >
              <div className="text-xs font-semibold text-[#E8EDF2]">
                {stat.value}
              </div>
              <div className="text-[9px] text-[#6B7280] mt-0.5 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {service.actions.map((action) => {
          const isExternal = action.href.startsWith("http");
          const isInternal = action.href.startsWith("/");
          return (
            <a
              key={action.label}
              href={action.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: "rgba(201,162,39,0.06)",
                border: "1px solid rgba(201,162,39,0.1)",
                color: "#C9A227",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "rgba(201,162,39,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "rgba(201,162,39,0.06)";
              }}
            >
              {action.label}
              {isExternal && <ExternalLink size={10} />}
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function WorkspacePage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="p-4 lg:p-6 min-h-full intelligence-os-grid-bg">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1
            className="text-2xl font-semibold text-[#E8EDF2]"
            style={{
              fontFamily:
                "var(--font-display, 'Clash Display', system-ui, sans-serif)",
            }}
          >
            Google Workspace
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Visão geral das ferramentas Google conectadas ao Intelligence OS
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border"
            style={{
              background: "rgba(201,162,39,0.06)",
              borderColor: "rgba(201,162,39,0.1)",
              color: "#C9A227",
            }}
          >
            <RefreshCw
              size={14}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Atualizando..." : "Atualizar Status"}
          </button>
        </div>
      </div>

      {/* ── Stats Overview ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {INTEGRATION_STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4"
            style={{
              background: "rgba(12,15,21,0.8)",
              border: "1px solid rgba(201,162,39,0.08)",
            }}
          >
            <div
              className="text-2xl font-bold text-[#E8EDF2] mb-1"
              style={{
                fontFamily:
                  "var(--font-display, 'Clash Display', system-ui, sans-serif)",
              }}
            >
              {stat.value}
            </div>
            <div className="text-xs text-[#6B7280]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#6B7280]">
          Ações Rápidas:
        </span>
        <a
          href="/intelligence-os/email"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: "rgba(234,67,53,0.08)",
            border: "1px solid rgba(234,67,53,0.15)",
            color: "#EA4335",
          }}
        >
          <Mail size={12} />
          Ver Emails
        </a>
        <a
          href="https://drive.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: "rgba(251,188,4,0.08)",
            border: "1px solid rgba(251,188,4,0.15)",
            color: "#FBBC04",
          }}
        >
          <HardDrive size={12} />
          Abrir Drive
        </a>
        <a
          href="https://calendar.google.com/calendar/u/0/r/eventedit"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: "rgba(66,133,244,0.08)",
            border: "1px solid rgba(66,133,244,0.15)",
            color: "#4285F4",
          }}
        >
          <Calendar size={12} />
          Criar Evento
        </a>
        <a
          href="https://meet.google.com/new"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: "rgba(52,168,83,0.08)",
            border: "1px solid rgba(52,168,83,0.15)",
            color: "#34A853",
          }}
        >
          <Video size={12} />
          Nova Reunião
        </a>
        <a
          href="/intelligence-os/gemini"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: "rgba(201,162,39,0.08)",
            border: "1px solid rgba(201,162,39,0.15)",
            color: "#C9A227",
          }}
        >
          <Sparkles size={12} />
          Gemini IA
        </a>
      </div>

      {/* ── Services Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {SERVICES.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* ── Integration Info ────────────────────────────────────────────── */}
      <div
        className="mt-6 rounded-xl p-4"
        style={{
          background: "rgba(201,162,39,0.03)",
          border: "1px solid rgba(201,162,39,0.08)",
        }}
      >
        <div className="flex items-start gap-3">
          <BarChart3 size={16} className="text-[#C9A227] mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-[#E8EDF2] mb-1">
              Sobre as Integrações Google
            </h4>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              O Intelligence OS CRM se integra com o ecossistema Google Workspace para oferecer
              uma experiência unificada. Conecte sua conta Google para acessar Gmail, Drive,
              Calendar e Meet diretamente do CRM. O Gemini está disponível como assistente IA
              interno com fallback para o OmniRoute Gateway.
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-[#6B7280]">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={10} className="text-[#34D399]" />
                Gmail conectado
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={10} className="text-[#34D399]" />
                Drive conectado
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={10} className="text-[#34D399]" />
                Calendar conectado
              </span>
              <span className="flex items-center gap-1">
                <XCircle size={10} className="text-[#6B7280]" />
                Meet desconectado
              </span>
              <span className="flex items-center gap-1">
                <XCircle size={10} className="text-[#6B7280]" />
                Gemini desconectado
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
