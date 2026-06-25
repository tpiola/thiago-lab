"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  LayoutDashboard, BarChart3, Users, Bot, Workflow, Globe, GitBranch,
  BookOpen, HardDrive, Mail, Sparkles, MapPin, Copy, Crosshair, Megaphone,
  LayoutGrid, NotebookPen, AppWindow, TrendingUp, DollarSign, Target,
  Activity, Clock, Zap, Shield, ArrowRight, ChevronRight, Globe2,
  Code, Bolt, ChartLine, Cpu, Rocket, Check, Menu, X,
  Command, Search, ExternalLink, Layers, Eye, Star,
  Brain, Heart, MessageCircle, Lock,
} from "lucide-react";
import { GoldParticles } from "@/components/Hero/GoldParticles";
import { AnimatedCounter } from "@/components/AnimatedCounter";

/* ═══════════════════════════════════════════════════════════════
   PALETA — GREEN (#00C9A7)
   ═══════════════════════════════════════════════════════════════ */
const G = {
  primary: "#00C9A7",
  secondary: "#3DF5C5",
  dark: "#00A88C",
  light: "#6EE7B7",
  glow: "rgba(0, 201, 167, 0.15)",
  glowMd: "rgba(0, 201, 167, 0.25)",
  bg: "#030303",
  surface: "rgba(255,255,255,0.03)",
  glass: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.1)",
};

/* ═══════════════════════════════════════════════════════════════
   SCROLL REVEAL VARIANTS
   ═══════════════════════════════════════════════════════════════ */
const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: easeOut } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: easeOut } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: easeOut } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/* ═══════════════════════════════════════════════════════════════
   CAPACIDADES DATA
   ═══════════════════════════════════════════════════════════════ */
const CAPACIDADES = [
  { icon: Globe2, title: "Sites com IA", desc: "Landing pages, e-commerce e portais completos gerados por inteligência artificial em segundos." },
  { icon: Bot, title: "Agentes WhatsApp", desc: "Automação inteligente de vendas, suporte e onboarding via WhatsApp com IA generativa." },
  { icon: Code, title: "Automação n8n", desc: "Workflows complexos conectando APIs, CRMs, e-mail e mais sem escrever uma linha de código." },
  { icon: Bolt, title: "AI Site Builder", desc: "Do briefing ao deploy. Conte sua ideia e veja seu site ganhar vida com Next.js + IA." },
  { icon: Shield, title: "SaaS Prontos", desc: "MVPs, dashboards e plataformas SaaS com autenticação, pagamentos e analytics embutidos." },
  { icon: ChartLine, title: "Analytics & BI", desc: "Métricas em tempo real, dashboards customizados e insights acionáveis para seu negócio." },
];

/* ═══════════════════════════════════════════════════════════════
   TECH TAGS FOR MARQUEE
   ═══════════════════════════════════════════════════════════════ */
const TECH_TAGS = [
  "AI Site Builder", "WhatsApp Agents", "n8n", "Next.js", "React", "TypeScript",
  "Node.js", "Python", "PostgreSQL", "Supabase", "Tailwind CSS", "Framer Motion",
  "D3.js", "OpenAI", "Gemini", "Claude", "Stripe", "Vercel", "Docker",
  "LangChain", "Vector DB", "RAG", "WebSockets", "GraphQL",
];

/* ═══════════════════════════════════════════════════════════════
   PLATFORM DATA — Intelligence OS Modules (PRESERVED)
   ═══════════════════════════════════════════════════════════════ */
const PLATFORM_MODULES = [
  { icon: LayoutDashboard, label: "Dashboard Central", href: "/intelligence-os", desc: "Visão geral do ecossistema", color: "#00C9A7" },
  { icon: BarChart3, label: "Analytics & BI", href: "/intelligence-os/analytics", desc: "MRR, ARR, Churn, LTV, receita, cohort", color: "#60A5FA" },
  { icon: LayoutGrid, label: "Dashboards Customizáveis", href: "/intelligence-os/dashboards", desc: "Widgets arrastáveis com recharts", color: "#3DF5C5" },
  { icon: Crosshair, label: "Competidores", href: "/intelligence-os/competitors", desc: "SWOT, benchmarking, share of voice", color: "#A78BFA" },
  { icon: Megaphone, label: "Campanhas Ads", href: "/intelligence-os/ads", desc: "Google + Facebook Ads Manager", color: "#F97316" },
  { icon: Users, label: "Clientes", href: "/intelligence-os/clientes", desc: "CRM com pipeline de vendas", color: "#3DF5C5" },
  { icon: Bot, label: "AI Agents", href: "/intelligence-os/agents", desc: "Agentes de IA para automação", color: "#8B5CF6" },
  { icon: Workflow, label: "Automações", href: "/intelligence-os/automacoes", desc: "n8n + Make workflows", color: "#EC4899" },
  { icon: Globe, label: "Site Forge", href: "/intelligence-os/forge", desc: "Construtor de sites com IA", color: "#00C9A7" },
  { icon: Copy, label: "Site Cloner", href: "/intelligence-os/cloner", desc: "Clone qualquer site com IA", color: "#F59E0B" },
  { icon: GitBranch, label: "GitHub Sync", href: "/intelligence-os/github", desc: "Sincronização de repositórios", color: "#6B7280" },
  { icon: BookOpen, label: "Knowledge Base", href: "/intelligence-os/knowledge", desc: "Base de conhecimento inteligente", color: "#3B82F6" },
  { icon: MapPin, label: "Google Maps", href: "/intelligence-os/maps", desc: "My Business + relatórios locais", color: "#00C9A7" },
  { icon: Sparkles, label: "Google Gemini", href: "/intelligence-os/gemini", desc: "IA generativa do Google", color: "#A855F7" },
  { icon: NotebookPen, label: "NotebookLM", href: "/intelligence-os/notebook", desc: "Pesquisa com IA contextual", color: "#0EA5E9" },
  { icon: AppWindow, label: "Workspace", href: "/intelligence-os/workspace", desc: "Gmail, Drive, Calendar, Meet", color: "#84CC16" },
];

/* ═══════════════════════════════════════════════════════════════
   BUILDER TYPES
   ═══════════════════════════════════════════════════════════════ */
const BUILDER_TYPES = [
  { value: "site", label: "Site / Landing Page" },
  { value: "agent", label: "Agente de IA" },
  { value: "saas", label: "SaaS / Plataforma" },
  { value: "workflow", label: "Workflow / Automação" },
  { value: "repo", label: "Repositório / Template" },
  { value: "sovereign-agent", label: "Agente Soberano Pessoal" },
];

/* ═══════════════════════════════════════════════════════════════
   PRICING TIERS
   ═══════════════════════════════════════════════════════════════ */
const PRICING_TIERS = [
  {
    name: "Starter",
    price: "R$ 0",
    desc: "Sem cartão de crédito. Acesso vitalício ao plano gratuito.",
    features: [
      "1 site com IA (até 5 páginas)",
      "1 agente WhatsApp — 200 msgs/dia",
      "3 templates premium prontos",
      "Comunidade Discord com +500 membros",
      "Atualizações quinzenais",
      "Intelligence OS (modo leitura)",
    ],
    cta: "Começar agora — é grátis",
    href: "/builder",
    highlight: false,
  },
  {
    name: "Sovereign Pro",
    price: "R$ 97",
    period: "/mês",
    desc: "Soberania digital completa. Cancele quando quiser.",
    features: [
      "Sites ilimitados com IA (páginas ∞)",
      "5 agentes pessoais simultâneos",
      "3 agentes WhatsApp com 5.000 msgs/dia",
      "Workflows n8n ilimitados — sem rate limit",
      "Builder completo com exportação de código",
      "Intelligence OS com todos os módulos",
      "Suporte prioritário — resposta em até 4h",
      "API Key própria — 50k requests/mês",
    ],
    guarantee: "7 dias de reembolso total. Sem perguntas.",
    cta: "Quero soberania digital",
    href: "/intelligence-os",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Sob medida",
    desc: "Infraestrutura dedicada. Sua IA, suas regras.",
    features: [
      "Tudo do Pro + white label completo",
      "Agentes dedicados por departamento",
      "Servidor dedicado — nuvem BR, EU ou US",
      "SLA 99,9% com crédito de penalidade",
      "Treinamento de equipe — até 20 pessoas",
      "Consultoria estratégica mensal (2h)",
      "Onboarding completo em 72 horas",
      "SSO, SAML e RBAC customizado",
      "Suporte telefônico 24/7",
    ],
    cta: "Agendar demonstração",
    href: "/intelligence-os",
    highlight: false,
  },
];

/* ═══════════════════════════════════════════════════════════════
   ECOSYSTEM PORTAL DATA — cyan/coral/purple
   ═══════════════════════════════════════════════════════════════ */
const CYAN = "#00F5FF";
const CORAL = "#FF6B6B";
const PURPLE = "#C084FC";

const ECOSYSTEM_CATEGORIES = [
  { id: "agentes", label: "Agentes Pessoais", icon: "Brain", color: PURPLE },
  { id: "builder", label: "Builder IA", icon: "Rocket", color: CYAN },
  { id: "cursos", label: "Cursos", icon: "BookOpen", color: CORAL },
  { id: "biblioteca", label: "Biblioteca", icon: "BookMarked", color: CYAN },
  { id: "projetos", label: "Projetos", icon: "Code", color: PURPLE },
  { id: "comunidade", label: "Comunidade", icon: "Users", color: CORAL },
] as const;

const ECOSYSTEM_PRODUCTS = [
  {
    title: "TAM Omnichannel",
    desc: "Sistema completo de teleatendimento com IA integrada. Chat, voz e WhatsApp com agentes inteligentes.",
    category: "agentes",
    tags: ["WhatsApp", "Chat", "IA"],
    color: PURPLE,
    href: "/intelligence-os",
    badge: "🔥 Novo",
  },
  {
    title: "AI Site Builder",
    desc: "Construtor visual de sites e landing pages com IA generativa. Do briefing ao deploy em minutos.",
    category: "builder",
    tags: ["Next.js", "Tailwind", "Vercel"],
    color: CYAN,
    href: "/builder",
    badge: "Popular",
  },
  {
    title: "Programa de Afiliados",
    desc: "Sistema completo de afiliados com rastreamento, comissões automáticas e dashboard em tempo real.",
    category: "builder",
    tags: ["Stripe", "Dashboard", "API"],
    color: CYAN,
    href: "/intelligence-os",
    badge: "Novo",
  },
  {
    title: "Curso Sovereign AI",
    desc: "Aprenda a construir agentes soberanos do zero. Do prompt engineering ao deploy local.",
    category: "cursos",
    tags: ["IA", "Agentes", "Local-First"],
    color: CORAL,
    href: "/cursos",
    badge: "Lançamento",
  },
  {
    title: "Curso n8n Mastery",
    desc: "Domine automação com n8n. Workflows complexos conectando centenas de serviços.",
    category: "cursos",
    tags: ["n8n", "Workflows", "API"],
    color: CORAL,
    href: "/cursos",
    badge: "Best-seller",
  },
  {
    title: "Biblioteca de Prompts",
    desc: "Centenas de prompts curados para engenharia, desenvolvimento, marketing e criação.",
    category: "biblioteca",
    tags: ["Prompts", "Templates", "GPT"],
    color: CYAN,
    href: "/biblioteca",
    badge: "Gratuito",
  },
  {
    title: "Template SaaS Starter",
    desc: "Template Next.js completo com auth, pagamentos, dashboard e deploy automático.",
    category: "projetos",
    tags: ["Next.js", "Supabase", "Stripe"],
    color: PURPLE,
    href: "https://github.com/thiagolab",
    badge: "Open Source",
  },
  {
    title: "Comunidade Discord",
    desc: "Junte-se a centenas de builders, devs e empreendedores em nossa comunidade exclusiva.",
    category: "comunidade",
    tags: ["Discord", "Networking", "Suporte"],
    color: CORAL,
    href: "/comunidade",
    badge: "Ativa",
  },
  {
    title: "Agentes WhatsApp Kit",
    desc: "Kit completo para criar agentes de IA no WhatsApp com memória, CRM e vendas.",
    category: "agentes",
    tags: ["WhatsApp", "IA", "CRM"],
    color: PURPLE,
    href: "/intelligence-os/agents",
  },
  {
    title: "Life OS Starter",
    desc: "Sistema operacional pessoal com IA local. Decisão, carreira, finanças e relacionamentos.",
    category: "agentes",
    tags: ["Local-First", "E2E", "Privacidade"],
    color: PURPLE,
    href: "/intelligence-os",
    badge: "Premium",
  },
  {
    title: "Template Landing Page",
    desc: "Landing pages otimizadas para conversão com IA, SEO e analytics integrados.",
    category: "builder",
    tags: ["SEO", "Conversão", "IA"],
    color: CYAN,
    href: "/templates",
  },
  {
    title: "Dashboard Analytics Pro",
    desc: "Dashboard completo com métricas de negócio, BI e insights em tempo real.",
    category: "projetos",
    tags: ["Analytics", "BI", "Recharts"],
    color: PURPLE,
    href: "/intelligence-os/analytics",
  },
];

const LATEST_UPDATES = {
  cursos: [
    { title: "Sovereign AI - Módulo 4", desc: "Agentes com memória vetorial local", date: "22 Jun 2026", href: "/cursos" },
    { title: "n8n Mastery - Workflows Avançados", desc: "Integração com IA e webhooks complexos", date: "18 Jun 2026", href: "/cursos" },
    { title: "Next.js para Iniciantes", desc: "Do zero ao deploy em 8 horas", date: "15 Jun 2026", href: "/cursos" },
  ],
  projetos: [
    { title: "TAM 2.0 - Omnichannel", desc: "Nova versão com IA generativa integrada", date: "21 Jun 2026", href: "/projetos" },
    { title: "AgentKit WhatsApp v3", desc: "Suporte a múltiplos agentes simultâneos", date: "19 Jun 2026", href: "/projetos" },
    { title: "Life OS Mobile Beta", desc: "App mobile com criptografia E2E", date: "14 Jun 2026", href: "/projetos" },
  ],
  repositorio: [
    { title: "thiagolab/saas-starter", desc: "Template SaaS com auth e pagamentos", date: "22 Jun 2026", href: "https://github.com/thiagolab" },
    { title: "thiagolab/agentkit", desc: "SDK para agentes de IA soberanos", date: "20 Jun 2026", href: "https://github.com/thiagolab" },
    { title: "thiagolab/life-os", desc: "Sistema operacional pessoal open source", date: "16 Jun 2026", href: "https://github.com/thiagolab" },
  ],
};

const ECOSYSTEM_SKILLS = [
  { name: "Next.js 15", level: "Avançado", color: CYAN, icon: "Code" },
  { name: "TypeScript", level: "Avançado", color: CYAN, icon: "Code" },
  { name: "Tailwind CSS", level: "Avançado", color: CYAN, icon: "Layers" },
  { name: "n8n Workflows", level: "Avançado", color: CORAL, icon: "Workflow" },
  { name: "OpenAI / GPT-4o", level: "Avançado", color: PURPLE, icon: "Sparkles" },
  { name: "Gemini 2.0", level: "Avançado", color: PURPLE, icon: "Sparkles" },
  { name: "Claude 3.5", level: "Intermediário", color: PURPLE, icon: "Sparkles" },
  { name: "Supabase", level: "Avançado", color: CYAN, icon: "Database" },
  { name: "PostgreSQL", level: "Avançado", color: CYAN, icon: "Database" },
  { name: "Docker", level: "Intermediário", color: CORAL, icon: "Box" },
  { name: "Framer Motion", level: "Avançado", color: PURPLE, icon: "Layers" },
  { name: "D3.js", level: "Intermediário", color: CORAL, icon: "BarChart3" },
  { name: "Python", level: "Intermediário", color: CYAN, icon: "Code" },
  { name: "Vector DB / RAG", level: "Intermediário", color: PURPLE, icon: "Database" },
  { name: "Stripe", level: "Intermediário", color: CORAL, icon: "DollarSign" },
  { name: "Vercel", level: "Avançado", color: CYAN, icon: "Globe" },
];

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */
type BuilderType = (typeof BUILDER_TYPES)[number]["value"];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — Scroll Progress Bar
   ═══════════════════════════════════════════════════════════════ */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #00C9A7, #3DF5C5, #6EE7B7, #3DF5C5, #00C9A7)",
        backgroundSize: "200% 100%",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — Floating Orbs
   ═══════════════════════════════════════════════════════════════ */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle at center, rgba(0,201,167,0.3) 0%, transparent 70%)",
          animation: "floatOrb1 12s ease-in-out infinite",
        }}
      />
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle at center, rgba(61,245,197,0.25) 0%, transparent 70%)",
          animation: "floatOrb2 10s ease-in-out infinite 1s",
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle at center, rgba(0,201,167,0.2) 0%, transparent 70%)",
          animation: "floatOrb3 15s ease-in-out infinite 0.5s",
        }}
      />
      <div className="absolute -bottom-32 left-1/3 w-72 h-72 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle at center, rgba(110,231,183,0.15) 0%, transparent 70%)",
          animation: "floatOrb1 14s ease-in-out infinite 2s",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — Grid Background
   ═══════════════════════════════════════════════════════════════ */
function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <svg className="w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hero-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#00C9A7" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, rgba(3,3,3,0) 0%, rgba(3,3,3,1) 100%)",
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — TypeWriter Terminal
   ═══════════════════════════════════════════════════════════════ */
const TERMINAL_LINES = [
  { text: "> thiagolab init --sovereign", delay: 500, color: "#3DF5C5" },
  { text: "> Inicializando Intelligence OS...", delay: 1200, color: "#6EE7B7" },
  { text: "> ✓ Motores de IA carregados (3 engines)", delay: 1900, color: "#3DF5C5" },
  { text: "> ✓ Conectando repositórios... 5 projetos ativos", delay: 2600, color: "#3DF5C5" },
  { text: "> ✓ Builder AI ativo", delay: 3300, color: "#3DF5C5" },
  { text: "", delay: 4000, color: "#3DF5C5" },
  { text: "> Sistema pronto. Modo soberania ativado.", delay: 4200, color: "#6EE7B7" },
  { text: "> thiagolab run --deploy", delay: 4900, color: "#3DF5C5" },
  { text: "> [ OK ] Plataforma operacional.", delay: 5600, color: "#00C9A7" },
];

function TypeWriterTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [typedChars, setTypedChars] = useState<string[]>(["", "", "", "", "", "", "", "", ""]);

  useEffect(() => {
    TERMINAL_LINES.forEach((line, idx) => {
      setTimeout(() => {
        setVisibleLines((prev) => Math.max(prev, idx + 1));
        if (line.text) {
          let charIdx = 0;
          const typeInterval = setInterval(() => {
            charIdx++;
            setTypedChars((prev) => {
              const next = [...prev];
              next[idx] = line.text.slice(0, charIdx);
              return next;
            });
            if (charIdx >= line.text.length) {
              clearInterval(typeInterval);
            }
          }, 20 + Math.random() * 15);
        }
      }, line.delay);
    });
  }, []);

  return (
    <div
      className="relative w-full rounded-2xl border overflow-hidden font-mono text-xs sm:text-sm leading-relaxed"
      style={{
        borderColor: "rgba(0,201,167,0.1)",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 0 40px rgba(0,201,167,0.08)",
      }}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        <span className="text-[10px] text-white/30 ml-2 font-sans">terminal — thiagolab sovereign</span>
      </div>
      <div className="p-4 sm:p-5 min-h-[220px] sm:min-h-[280px]">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, idx) => (
          <div key={idx} className="mb-1.5">
            {line.text ? (
              <span style={{ color: line.color }}>
                {typedChars[idx]}
                {idx === visibleLines - 1 && idx < TERMINAL_LINES.length - 1 && (
                  <span className="inline-block w-2 h-4 ml-0.5 animate-pulse" style={{ background: G.primary }} />
                )}
              </span>
            ) : (
              <br />
            )}
          </div>
        ))}
        {visibleLines >= TERMINAL_LINES.length && (
          <span className="inline-block w-2 h-4 ml-0.5 animate-pulse" style={{ background: G.primary }} />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — Marquee (tech pills)
   ═══════════════════════════════════════════════════════════════ */
function TechMarquee() {
  return (
    <div className="relative overflow-hidden py-8 sm:py-10">
      <div className="flex gap-3 animate-marquee" style={{ width: "max-content" }}>
        {[...TECH_TAGS, ...TECH_TAGS, ...TECH_TAGS].map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap border"
            style={{
              borderColor: "rgba(0,201,167,0.1)",
              background: "rgba(0,201,167,0.06)",
              color: "#6EE7B7",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: G.primary }} />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — D3 Force-Directed Graph
   ═══════════════════════════════════════════════════════════════ */
function D3GraphSection() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<{ name: string; desc: string } | null>(null);
  const simulationRef = useRef<any>(null);
  const [d3Loaded, setD3Loaded] = useState(false);

  const graphData = {
    nodes: [
      { id: "thiagolab", name: "thiagolab.com", desc: "Plataforma soberana de negócios digitais com IA", group: 1, r: 22 },
      { id: "builder", name: "AI Builder", desc: "Construtor de sites, agentes e SaaS com IA", group: 1, r: 16 },
      { id: "agents", name: "WhatsApp Agents", desc: "Agentes inteligentes para automação de vendas", group: 2, r: 14 },
      { id: "n8n", name: "n8n Workflows", desc: "Automação visual com centenas de integrações", group: 2, r: 12 },
      { id: "nextjs", name: "Next.js", desc: "Framework React para produção com SSR e SSG", group: 3, r: 12 },
      { id: "supabase", name: "Supabase", desc: "Backend open-source com PostgreSQL e auth", group: 3, r: 12 },
      { id: "gemini", name: "Gemini AI", desc: "IA generativa multimodal do Google", group: 4, r: 14 },
      { id: "openai", name: "OpenAI", desc: "Modelos GPT para texto, código e análise", group: 4, r: 14 },
      { id: "analytics", name: "Analytics", desc: "Métricas em tempo real com dashboards BI", group: 1, r: 13 },
      { id: "stripe", name: "Stripe", desc: "Pagamentos online com suporte global", group: 3, r: 11 },
      { id: "vercel", name: "Vercel", desc: "Deploy serverless com edge functions", group: 3, r: 11 },
      { id: "python", name: "Python", desc: "Backend IA, scripts e automação", group: 4, r: 10 },
      { id: "docker", name: "Docker", desc: "Containerização e ambientes isolados", group: 3, r: 10 },
      { id: "rag", name: "RAG Pipeline", desc: "Retrieval-Augmented Generation para busca", group: 4, r: 11 },
      { id: "sovereign-agents", name: "Agentes Pessoais", desc: "Agentes soberanos com dados locais e criptografia E2E", group: 2, r: 15 },
      { id: "life-os", name: "Life OS", desc: "Sistema operacional pessoal com IA soberana", group: 1, r: 16 },
      { id: "privacy", name: "Privacidade & E2E", desc: "Criptografia ponta-a-ponta e soberania de dados", group: 5, r: 13 },
    ],
    links: [
      { source: "thiagolab", target: "builder" },
      { source: "thiagolab", target: "agents" },
      { source: "thiagolab", target: "analytics" },
      { source: "thiagolab", target: "n8n" },
      { source: "builder", target: "nextjs" },
      { source: "builder", target: "supabase" },
      { source: "agents", target: "openai" },
      { source: "agents", target: "gemini" },
      { source: "n8n", target: "python" },
      { source: "n8n", target: "docker" },
      { source: "analytics", target: "supabase" },
      { source: "analytics", target: "stripe" },
      { source: "nextjs", target: "vercel" },
      { source: "gemini", target: "rag" },
      { source: "openai", target: "rag" },
      { source: "supabase", target: "python" },
      { source: "thiagolab", target: "sovereign-agents" },
      { source: "thiagolab", target: "life-os" },
      { source: "sovereign-agents", target: "life-os" },
      { source: "sovereign-agents", target: "privacy" },
      { source: "life-os", target: "privacy" },
      { source: "privacy", target: "supabase" },
    ],
  };

  useEffect(() => {
    if ((window as any).d3) {
      setD3Loaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://d3js.org/d3.v7.min.js";
    script.async = true;
    script.onload = () => setD3Loaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!d3Loaded || !svgRef.current) return;
    const d3 = (window as any).d3;
    if (!d3) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth || 600;
    const height = svgRef.current.clientHeight || 400;

    svg.selectAll("*").remove();

    const g = svg.append("g");
    svg.call(
      d3.zoom()
        .scaleExtent([0.4, 3])
        .on("zoom", (event: any) => g.attr("transform", event.transform))
    );

    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => d.r + 10));

    simulationRef.current = simulation;

    const link = g.append("g")
      .selectAll("line")
      .data(graphData.links)
      .join("line")
      .attr("stroke", "rgba(0,201,167,0.2)")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.6);

    const node = g.append("g")
      .selectAll("g")
      .data(graphData.nodes)
      .join("g")
      .style("cursor", "pointer")
      .call(
        d3.drag()
          .on("start", (event: any, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event: any, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event: any, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    node.append("circle")
      .attr("r", (d: any) => d.r)
      .attr("fill", (d: any) => d.id === "thiagolab" ? "#00C9A7" : "rgba(0,201,167,0.15)")
      .attr("stroke", (d: any) => d.id === "thiagolab" ? "#3DF5C5" : "rgba(61,245,197,0.3)")
      .attr("stroke-width", (d: any) => d.id === "thiagolab" ? 3 : 1.5)
      .style("transition", "all 0.2s ease");

    node.append("text")
      .text((d: any) => d.name)
      .attr("x", 0)
      .attr("y", (d: any) => d.r + 14)
      .attr("text-anchor", "middle")
      .attr("fill", "#94A3B8")
      .attr("font-size", "9px")
      .attr("font-family", "var(--font-mono, monospace)")
      .style("pointer-events", "none");

    node.filter((d: any) => d.id === "thiagolab")
      .append("circle")
      .attr("r", 28)
      .attr("fill", "none")
      .attr("stroke", "rgba(0,201,167,0.15)")
      .attr("stroke-width", 2)
      .style("animation", "pulseGlowNode 2s ease-in-out infinite");

    node.on("click", (event: any, d: any) => {
      setSelectedNode({ name: d.name, desc: d.desc });
      node.selectAll("circle").attr("opacity", 0.3);
      d3.select(event.currentTarget).selectAll("circle").attr("opacity", 1);
      link.attr("stroke", (l: any) =>
        l.source.id === d.id || l.target.id === d.id
          ? "rgba(61,245,197,0.5)"
          : "rgba(0,201,167,0.08)"
      );
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [d3Loaded]);

  return (
    <section id="mapa" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <span className="section-label justify-center">Ecossistema</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-['Clash_Display',system-ui,sans-serif]">
            Mapa da{" "}
            <span className="text-gradient-shift">Soberania</span>
          </h2>
          <p className="text-white/40 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Explore o ecossistema de tecnologias e serviços que formam a plataforma.
            Clique em cada nó para descobrir mais.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scaleIn}
          className="relative rounded-2xl overflow-hidden border border-white/[0.06]"
          style={{
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(8px)",
            minHeight: "420px",
          }}
        >
          {!d3Loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 rounded-full animate-spin"
                  style={{ borderColor: "rgba(0,201,167,0.3)", borderTopColor: G.primary }} />
                <span className="text-white/40 text-sm">Carregando mapa...</span>
              </div>
            </div>
          )}
          <svg ref={svgRef} className="w-full" style={{ height: "420px", display: d3Loaded ? "block" : "none" }} />

          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:bottom-4 sm:w-64 rounded-xl p-4 border"
              style={{ background: "rgba(3,3,3,0.85)", backdropFilter: "blur(12px)", borderColor: "rgba(0,201,167,0.15)" }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold" style={{ color: G.primary }}>{selectedNode.name}</span>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-white/30 hover:text-white/60 transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-white/50">{selectedNode.desc}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — Local Orchestrator
   ═══════════════════════════════════════════════════════════════ */
function runLocalOrchestrator(type: BuilderType, briefing: string, audience: string, meta: string): string {
  const typeLabels: Record<BuilderType, string> = {
    site: "Site / Landing Page",
    agent: "Agente de IA",
    saas: "SaaS / Plataforma",
    workflow: "Workflow / Automação",
    repo: "Repositório / Template",
    "sovereign-agent": "Agente Soberano Pessoal",
  };

  const blueprints: Record<BuilderType, string[]> = {
    site: [
      "📄 Blueprint: Landing Page Premium",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      `🎯 Tipo: ${typeLabels[type]}`,
      `📝 Briefing: ${briefing.slice(0, 60)}${briefing.length > 60 ? "..." : ""}`,
      `👥 Audiência: ${audience}`,
      `🎯 Meta: ${meta}`,
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      "📦 Stack: Next.js 15 + Tailwind v4 + Framer Motion",
      "📦 SEO: next-seo + Open Graph + JSON-LD",
      "📦 Analytics: Vercel Analytics + GA4",
      "📦 Deploy: Vercel (auto-scaling, edge)",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      "✅ Estrutura gerada com sucesso!",
      "➜ /builder para visualizar e editar",
    ],
    agent: [
      "🤖 Blueprint: Agente de IA Inteligente",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      `🎯 Tipo: ${typeLabels[type]}`,
      `📝 Briefing: ${briefing.slice(0, 60)}${briefing.length > 60 ? "..." : ""}`,
      `👥 Audiência: ${audience}`,
      `🎯 Meta: ${meta}`,
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      "📦 Engine: OpenAI GPT-4o / Gemini 2.0",
      "📦 Canal: WhatsApp + Web + API",
      "📦 Memory: Vector DB (Pinecone/Supabase)",
      "📦 Tools: n8n + Webhooks + Stripe",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      "✅ Agente configurado com sucesso!",
      "➜ /agents para testar",
    ],
    saas: [
      "🏗️ Blueprint: Plataforma SaaS",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      `🎯 Tipo: ${typeLabels[type]}`,
      `📝 Briefing: ${briefing.slice(0, 60)}${briefing.length > 60 ? "..." : ""}`,
      `👥 Audiência: ${audience}`,
      `🎯 Meta: ${meta}`,
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      "📦 Frontend: Next.js + Tailwind + Recharts",
      "📦 Backend: Supabase + PostgreSQL + Edge Functions",
      "📦 Auth: Supabase Auth + Magic Links",
      "📦 Payments: Stripe + Webhooks",
      "📦 Deploy: Vercel + Docker",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      "✅ Plataforma gerada com sucesso!",
      "➜ /intelligence-os para monitorar",
    ],
    workflow: [
      "⚡ Blueprint: Workflow de Automação",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      `🎯 Tipo: ${typeLabels[type]}`,
      `📝 Briefing: ${briefing.slice(0, 60)}${briefing.length > 60 ? "..." : ""}`,
      `👥 Audiência: ${audience}`,
      `🎯 Meta: ${meta}`,
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      "📦 Engine: n8n (self-hosted ou cloud)",
      "📦 Triggers: Webhook + Schedule + Email",
      "📦 Actions: 200+ integrations",
      "📦 Storage: Supabase + S3",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      "✅ Workflow gerado com sucesso!",
      "➜ /intelligence-os/automacoes",
    ],
    repo: [
      "📦 Blueprint: Template / Repositório",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      `🎯 Tipo: ${typeLabels[type]}`,
      `📝 Briefing: ${briefing.slice(0, 60)}${briefing.length > 60 ? "..." : ""}`,
      `👥 Audiência: ${audience}`,
      `🎯 Meta: ${meta}`,
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      "📦 Stack: Definição baseada no briefing",
      "📦 CLI: thiagolab create --template",
      "📦 GitHub: Repositório automático",
      "📦 CI/CD: GitHub Actions + Vercel",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      "✅ Template gerado com sucesso!",
      "➜ /builder para customizar",
    ],
    "sovereign-agent": [
      "👑 Blueprint: Agente Soberano Pessoal",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      `🎯 Tipo: ${typeLabels[type]}`,
      `📝 Briefing: ${briefing.slice(0, 60)}${briefing.length > 60 ? "..." : ""}`,
      `👥 Audiência: ${audience}`,
      `🎯 Meta: ${meta}`,
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      "📦 Stack: Local-First + Criptografia E2E + SQLite/IndexedDB",
      "📦 Foco: [decisão/carreira/família/comunicação/relacionamentos/finanças]",
      "📦 Templates BR: carreira farmácia/vendas, finanças impostos/inflação",
      "📦 Comunicação: CNV — Comunicação Não-Violenta",
      "📦 Parentalidade: parentalidade positiva com IA local",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      "✅ Agente Soberano Pessoal configurado!",
      "➜ /life-os para gerenciar",
      "🔒 Seus dados nunca saem do seu dispositivo.",
    ],
  };

  return blueprints[type]?.join("\n") ?? "⚠️ Tipo não reconhecido. Tente novamente.";
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — Interactive Builder
   ═══════════════════════════════════════════════════════════════ */
function InteractiveBuilder() {
  const [type, setType] = useState<BuilderType>("site");
  const [briefing, setBriefing] = useState("");
  const [audience, setAudience] = useState("");
  const [meta, setMeta] = useState("");
  const [output, setOutput] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = useCallback(() => {
    if (!briefing.trim()) return;
    setGenerating(true);
    setOutput("");

    setTimeout(() => {
      const result = runLocalOrchestrator(type, briefing, audience, meta);
      let idx = 0;
      const lines = result.split("\n");
      const interval = setInterval(() => {
        if (idx < lines.length) {
          setOutput((prev) => prev + (prev ? "\n" : "") + lines[idx]);
          idx++;
        } else {
          clearInterval(interval);
          setGenerating(false);
        }
      }, 50);
    }, 800);
  }, [type, briefing, audience, meta]);

  return (
    <section id="builder" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <span className="section-label justify-center">Builder</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-['Clash_Display',system-ui,sans-serif]">
            Conte sua ideia.{" "}
            <span className="text-gradient-shift">Nós construímos.</span>
          </h2>
          <p className="text-white/40 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Selecione o tipo de projeto, descreva sua visão e veja o blueprint sendo gerado em tempo real.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scaleIn}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Input Panel */}
          <div className="rounded-2xl border border-white/[0.06] p-6 sm:p-8 card-3d"
            style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(8px)" }}
          >
            <div className="card-3d-inner space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">
                  Tipo de Projeto
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BUILDER_TYPES.map((bt) => (
                    <button
                      key={bt.value}
                      onClick={() => setType(bt.value as BuilderType)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                        type === bt.value
                          ? "text-emerald-300"
                          : "border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.12]"
                      }`}
                      style={{
                        borderColor: type === bt.value ? "rgba(0,201,167,0.4)" : undefined,
                        background: type === bt.value ? "rgba(0,201,167,0.1)" : "rgba(255,255,255,0.02)",
                      }}
                    >
                      {bt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">
                  Briefing
                </label>
                <textarea
                  value={briefing}
                  onChange={(e) => setBriefing(e.target.value)}
                  placeholder="Descreva seu projeto em detalhes. Quanto mais específico, melhor..."
                  rows={4}
                  className="w-full rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/20 resize-none focus:outline-none transition-colors font-mono"
                  style={{ borderColor: undefined, background: "rgba(0,0,0,0.4)" }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(0,201,167,0.3)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">
                  Público-alvo
                </label>
                <input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="Ex: Pequenos empreendedores, advogados, clínicas..."
                  className="w-full rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-colors"
                  style={{ background: "rgba(0,0,0,0.4)" }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(0,201,167,0.3)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">
                  Objetivo Principal
                </label>
                <input
                  value={meta}
                  onChange={(e) => setMeta(e.target.value)}
                  placeholder="Ex: Gerar leads, vender cursos, automatizar suporte..."
                  className="w-full rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-colors"
                  style={{ background: "rgba(0,0,0,0.4)" }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(0,201,167,0.3)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={!briefing.trim() || generating}
                className="w-full h-11 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                style={{
                  background: !briefing.trim() ? "rgba(0,201,167,0.15)" : "linear-gradient(135deg, #00C9A7, #00A88C)",
                  color: !briefing.trim() ? "rgba(255,255,255,0.3)" : "#fff",
                  cursor: !briefing.trim() ? "not-allowed" : "pointer",
                }}
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Gerando blueprint...
                  </>
                ) : (
                  <>
                    <Rocket size={15} />
                    Gerar Blueprint
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="rounded-2xl border border-white/[0.06] overflow-hidden card-3d"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
          >
            <div className="card-3d-inner">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
                <span className="text-[10px] font-mono" style={{ color: G.primary }}>Blueprint Output</span>
                <span className="text-[10px] text-white/20">—</span>
                <span className="text-[10px] text-white/30">{BUILDER_TYPES.find(bt => bt.value === type)?.label}</span>
                {output && (
                  <button
                    onClick={() => setOutput("")}
                    className="ml-auto text-[10px] text-white/30 hover:text-white/60 transition-colors"
                  >
                    Limpar
                  </button>
                )}
              </div>
              <div className="p-4 sm:p-5 min-h-[320px] max-h-[420px] overflow-y-auto font-mono text-xs leading-relaxed">
                {output ? (
                  output.split("\n").map((line, i) => (
                    <div key={i} className={`${
                      line.startsWith("✅") ? "text-emerald-400" :
                      line.startsWith("⚠️") ? "text-yellow-400" :
                      line.startsWith("📦") ? "text-emerald-300/70" :
                      line.startsWith("➜") ? "text-emerald-400/80" :
                      line.startsWith("━━") ? "text-white/20" :
                      line.startsWith("🎯") || line.startsWith("📝") || line.startsWith("👥") ? "text-white/60" :
                      "text-white/40"
                    }`}>
                      {line}
                    </div>
                  ))
                ) : (
                  <span className="text-white/20">
                    {generating ? "Gerando blueprint..." : "Preencha o briefing e clique em Gerar Blueprint para ver o resultado aqui."}
                    {generating && <span className="inline-block w-2 h-4 ml-1 animate-pulse" style={{ background: G.primary }} />}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — Product Cards
   ═══════════════════════════════════════════════════════════════ */
const PRODUCT_CARDS = [
  {
    icon: Cpu,
    title: "TAM / Teleatendimento",
    desc: "Centralize chamados, vendas e suporte com IA. Sistema omnichannel com agentes inteligentes que atendem 24h.",
    features: ["Chat + WhatsApp + Voz", "Agentes com memória", "Relatórios de desempenho"],
    color: "#00C9A7",
  },
  {
    icon: TrendingUp,
    title: "Programa de Afiliados",
    desc: "Sistema completo de afiliados com rastreamento, comissões e dashboard em tempo real para sua plataforma.",
    features: ["Links personalizados", "Comissões automáticas", "Painel para afiliados"],
    color: "#3DF5C5",
  },
  {
    icon: Bot,
    title: "WhatsApp AgentKit",
    desc: "Kit completo de agentes de IA para WhatsApp com respostas inteligentes, captura de leads e automação de vendas.",
    features: ["Integração API oficial", "Respostas com IA", "CRM embutido"],
    color: "#6EE7B7",
  },
  {
    icon: Heart,
    title: "Life OS",
    desc: "Agentes pessoais para decisão, carreira, família e finanças — soberania de dados garantida.",
    features: ["Decisões com IA local", "Carreira & Finanças", "Comunicação & Relacionamentos"],
    color: "#F43F5E",
  },
];

function ProductCards() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;
    const handleMouseMove = (e: MouseEvent) => {
      const cards = el.querySelectorAll('.product-card');
      cards.forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}%`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}%`);
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <span className="section-label justify-center">Soluções</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-['Clash_Display',system-ui,sans-serif]">
            Produtos{" "}
            <span className="text-gradient-shift">Soberanos</span>
          </h2>
        </motion.div>

        <motion.div
          ref={cardsRef}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {PRODUCT_CARDS.map((card, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className="product-card group relative rounded-2xl border border-white/[0.06] p-6 sm:p-8 transition-all duration-500 card-3d"
              style={{
                background: "rgba(255,255,255,0.02)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="card-3d-inner">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,201,167,0.06), transparent 60%)",
                  }}
                />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${card.color}15`, color: card.color }}>
                    <card.icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-['Clash_Display',system-ui,sans-serif]">
                    {card.title}
                  </h3>
                  <p className="text-sm text-white/50 mb-4 leading-relaxed">{card.desc}</p>
                  <ul className="space-y-2">
                    {card.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-white/40">
                        <Check size={12} className="shrink-0" style={{ color: G.primary }} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — Pricing
   ═══════════════════════════════════════════════════════════════ */
function PricingSection() {
  return (
            <section id="planos" className="relative py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <span className="section-label justify-center">Planos</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-['Clash_Display',system-ui,sans-serif]">
            Invista na sua{" "}
            <span className="text-gradient-shift">Soberania Digital</span>
          </h2>
          <p className="text-white/60 mt-3 max-w-2xl mx-auto text-sm sm:text-base font-medium">
            Planos com soberania real. Sem letra miúda. Cancele quando quiser.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto"
        >
          {PRICING_TIERS.map((tier, idx) => (
            <motion.div
              key={idx}
              variants={scaleIn}
              className={`relative rounded-2xl overflow-hidden transition-all duration-500 card-3d ${
                tier.highlight
                  ? "border border-emerald-500/30 scale-[1.02] md:scale-105"
                  : "border border-white/[0.06]"
              }`}
              style={{
                background: tier.highlight
                  ? "linear-gradient(180deg, rgba(0,201,167,0.1) 0%, rgba(3,3,3,0.8) 100%)"
                  : "rgba(255,255,255,0.02)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="card-3d-inner">
                {tier.highlight && (
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{
                    background: "linear-gradient(90deg, #00C9A7, #3DF5C5, #6EE7B7, #3DF5C5, #00C9A7)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 3s ease-in-out infinite",
                  }} />
                )}

                <div className="p-6 sm:p-8">
                  {tier.highlight && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-black mb-3"
                      style={{ background: "linear-gradient(135deg, #3DF5C5, #00C9A7)" }}>
                      Mais Popular
                    </span>
                  )}

                  <h3 className="text-lg font-bold text-white font-['Clash_Display',system-ui,sans-serif] mb-1">
                    {tier.name}
                  </h3>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white">{tier.price}</span>
                    {tier.period && (
                      <span className="text-sm text-white/40">{tier.period}</span>
                    )}
                  </div>

                  <p className="text-xs text-white/40 mb-6">{tier.desc}</p>

                  <ul className="space-y-2.5 mb-8">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-white/50">
                        <Check size={13} className="shrink-0 mt-0.5" style={{ color: G.primary }} />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {tier.guarantee && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4 text-[11px] font-medium"
                      style={{ background: "rgba(0,201,167,0.08)", color: G.primary, border: "1px solid rgba(0,201,167,0.15)" }}>
                      <Shield size={14} />
                      {tier.guarantee}
                    </div>
                  )}

                  <Link
                    href={tier.href}
                    className={`block w-full text-center py-3 rounded-xl text-sm font-bold transition-all ${
                      tier.highlight
                        ? "text-white hover:brightness-110"
                        : "text-white/60 hover:text-white border border-white/[0.1] hover:border-white/[0.2]"
                    }`}
                    style={{
                      background: tier.highlight ? "linear-gradient(135deg, #00C9A7, #00A88C)" : "rgba(255,255,255,0.03)",
                    }}
                  >
                    {tier.cta}
                  </Link>

                  {/* Urgency microcopy */}
                  {!tier.highlight && tier.name !== "Enterprise" && (
                    <p className="text-[10px] text-white/20 text-center mt-2">
                      Sem compromisso. Cancele a qualquer momento.
                    </p>
                  )}
                  {tier.highlight && (
                    <p className="text-[10px] text-emerald-400/60 text-center mt-2 font-medium">
                      ⚡ Oferta de lançamento — preço válido para os primeiros 100 assinantes
                    </p>
                  )}
                  {tier.name === "Enterprise" && (
                    <p className="text-[10px] text-white/20 text-center mt-2">
                      Resposta em até 2 horas úteis.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="mt-16 max-w-4xl mx-auto overflow-hidden rounded-2xl border border-white/[0.06]"
          style={{ background: "rgba(255,255,255,0.015)", backdropFilter: "blur(8px)" }}
        >
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h4 className="text-sm font-bold text-white font-['Clash_Display',system-ui,sans-serif]">
              Comparação detalhada
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-6 py-3 text-white/40 font-medium">Funcionalidade</th>
                  <th className="text-center px-4 py-3 text-white/40 font-medium w-28">Starter</th>
                  <th className="text-center px-4 py-3 font-medium w-28" style={{ color: G.primary }}>Sovereign Pro</th>
                  <th className="text-center px-4 py-3 text-white/40 font-medium w-28">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Sites com IA", starter: "1 (5 págs)", pro: "Ilimitados", enterprise: "Ilimitados" },
                  { label: "Agentes pessoais", starter: "—", pro: "5 simultâneos", enterprise: "Ilimitados" },
                  { label: "Agentes WhatsApp", starter: "1 (200/dia)", pro: "3 (5k/dia)", enterprise: "Customizado" },
                  { label: "Workflows n8n", starter: "—", pro: "Ilimitados", enterprise: "Ilimitados" },
                  { label: "Intelligence OS", starter: "Leitura", pro: "Completo", enterprise: "Completo" },
                  { label: "Suporte", starter: "Comunidade", pro: "Até 4h", enterprise: "Telefone 24/7" },
                  { label: "API Key", starter: "—", pro: "50k req/mês", enterprise: "Ilimitada" },
                  { label: "White Label", starter: "—", pro: "—", enterprise: "✓" },
                  { label: "Servidor dedicado", starter: "—", pro: "—", enterprise: "✓" },
                  { label: "Reembolso", starter: "Grátis", pro: "7 dias garantido", enterprise: "Sob consulta" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-2.5 text-white/50">{row.label}</td>
                    <td className="text-center px-4 py-2.5 text-white/30">{row.starter}</td>
                    <td className="text-center px-4 py-2.5 font-medium" style={{ color: G.primary }}>{row.pro}</td>
                    <td className="text-center px-4 py-2.5 text-white/30">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — Ecosystem Hero (cyan/coral/purple)
   ═══════════════════════════════════════════════════════════════ */
function EcosystemHero() {
  const [ecosystemSearch, setEcosystemSearch] = useState("");

  return (
    <section id="ecossistema" className="relative py-24 sm:py-32">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-10"
          style={{
            background: `radial-gradient(ellipse at center, ${CYAN}20 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[300px] rounded-full opacity-8"
          style={{
            background: `radial-gradient(ellipse at center, ${PURPLE}18 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <span className="section-label justify-center">
            Ecossistema
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-6xl font-bold font-['Clash_Display',system-ui,sans-serif] leading-[1.1]"
            style={{
              background: `linear-gradient(135deg, ${CYAN}, ${PURPLE}, ${CORAL})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Ecossistema de Inteligência Soberana
          </h2>
          <p className="text-white/40 mt-4 max-w-xl mx-auto text-sm sm:text-base">
            Agentes, cursos, biblioteca, projetos e comunidade — tudo em um só lugar.
            Explore o ecossistema completo da plataforma soberana.
          </p>
        </motion.div>

        {/* Central Search */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scaleIn}
          className="mt-10 relative max-w-2xl mx-auto"
        >
          <div
            className="relative rounded-2xl border overflow-hidden"
            style={{
              borderColor: `${CYAN}20`,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(12px)",
              boxShadow: `0 0 40px ${CYAN}08`,
            }}
          >
            <div className="flex items-center gap-3 px-5 py-4">
              <Search size={20} style={{ color: CYAN }} className="shrink-0" />
              <input
                type="text"
                value={ecosystemSearch}
                onChange={(e) => setEcosystemSearch(e.target.value)}
                placeholder="Buscar agentes, cursos, projetos, ferramentas..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none font-mono"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] text-white/20 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                <Command size={10} />K
              </kbd>
            </div>
            {ecosystemSearch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="border-t border-white/[0.04] px-5 py-3"
              >
                <div className="space-y-2">
                  {ECOSYSTEM_PRODUCTS.filter(
                    (p) =>
                      p.title.toLowerCase().includes(ecosystemSearch.toLowerCase()) ||
                      p.desc.toLowerCase().includes(ecosystemSearch.toLowerCase()) ||
                      p.tags.some((t) => t.toLowerCase().includes(ecosystemSearch.toLowerCase()))
                  ).slice(0, 5).map((p, i) => (
                    <Link
                      key={i}
                      href={p.href}
                      className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: p.color }}
                      />
                      <div className="text-left min-w-0">
                        <div className="text-sm font-medium text-white/80 group-hover:text-white truncate">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-white/30 truncate">{p.desc}</div>
                      </div>
                      {p.badge && (
                        <span
                          className="ml-auto shrink-0 text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ background: `${p.color}15`, color: p.color }}
                        >
                          {p.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — Category Navigation Pills
   ═══════════════════════════════════════════════════════════════ */
function CategoryNavigation({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <section className="relative pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-8"
        >
          <span className="section-label justify-center">Navegue por Categoria</span>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          <motion.button
            variants={scaleIn}
            onClick={() => onSelect("todos")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 border ${
              active === "todos"
                ? "text-white shadow-lg"
                : "text-white/40 hover:text-white/70 border-white/[0.06] hover:border-white/[0.12]"
            }`}
            style={{
              background: active === "todos" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)",
              borderColor: active === "todos" ? "rgba(255,255,255,0.15)" : undefined,
            }}
          >
            Todos
          </motion.button>
          {ECOSYSTEM_CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              variants={scaleIn}
              onClick={() => onSelect(active === cat.id ? "todos" : cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 border whitespace-nowrap ${
                active === cat.id
                  ? "text-white shadow-lg scale-105"
                  : "text-white/40 hover:text-white/70 border-white/[0.06] hover:border-white/[0.12]"
              }`}
              style={{
                background: active === cat.id ? `${cat.color}18` : "rgba(255,255,255,0.02)",
                borderColor: active === cat.id ? `${cat.color}40` : undefined,
                boxShadow: active === cat.id ? `0 0 20px ${cat.color}15` : undefined,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: cat.color }}
              />
              {cat.label}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — Ecosystem Product Grid
   ═══════════════════════════════════════════════════════════════ */
function EcosystemProductGrid({ filter }: { filter: string }) {
  const filtered = filter === "todos"
    ? ECOSYSTEM_PRODUCTS
    : ECOSYSTEM_PRODUCTS.filter((p) => p.category === filter);

  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <span className="section-label justify-center">Produtos & Serviços</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-['Clash_Display',system-ui,sans-serif]">
            Explore o{" "}
            <span style={{
              background: `linear-gradient(135deg, ${CYAN}, ${PURPLE})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Ecossistema
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
        >
          {filtered.map((product, idx) => (
            <motion.div
              key={`${product.title}-${idx}`}
              variants={fadeUp}
              layout
              className="group relative rounded-2xl border p-5 sm:p-6 transition-all duration-500 hover:scale-[1.02] card-3d"
              style={{
                borderColor: `${product.color}15`,
                background: "rgba(255,255,255,0.015)",
              }}
            >
              <div className="card-3d-inner h-full flex flex-col">
                {/* Top row: Badge + Category Tag */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: `${product.color}15`, color: product.color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: product.color }} />
                    {ECOSYSTEM_CATEGORIES.find((c) => c.id === product.category)?.label}
                  </span>
                  {product.badge && (
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        background: `${product.color}12`,
                        color: product.color,
                        border: `1px solid ${product.color}25`,
                      }}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white mb-2 font-['Clash_Display',system-ui,sans-serif] group-hover:text-opacity-100 transition-colors">
                  {product.title}
                </h3>
                <p className="text-xs text-white/40 leading-relaxed mb-4 flex-1">
                  {product.desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-medium px-2 py-0.5 rounded-full border"
                      style={{
                        borderColor: `${product.color}20`,
                        color: `${product.color}aa`,
                        background: `${product.color}08`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA Link */}
                <Link
                  href={product.href}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold transition-all group/link"
                  style={{ color: product.color }}
                >
                  Acessar
                  <ArrowRight size={12} className="transition-transform group-hover/link:translate-x-1" />
                </Link>

                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 1px 0 ${product.color}15, 0 4px 20px ${product.color}08`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-white/30 text-sm">Nenhum produto encontrado nesta categoria.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — Latest Updates (3-column: Cursos, Projetos, Repositório)
   ═══════════════════════════════════════════════════════════════ */
function LatestUpdates() {
  const columns = [
    { key: "cursos" as const, label: "Cursos", icon: BookOpen, color: CORAL, items: LATEST_UPDATES.cursos },
    { key: "projetos" as const, label: "Projetos", icon: Code, color: PURPLE, items: LATEST_UPDATES.projetos },
    { key: "repositorio" as const, label: "Repositório", icon: GitBranch, color: CYAN, items: LATEST_UPDATES.repositorio },
  ];

  return (
    <section className="relative py-24 sm:py-32 border-y border-white/[0.03]">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-5"
          style={{
            background: `radial-gradient(circle at center, ${CORAL}30 0%, transparent 70%)`,
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <span className="section-label justify-center">Em Movimento</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-['Clash_Display',system-ui,sans-serif]">
            Últimas{" "}
            <span style={{
              background: `linear-gradient(135deg, ${CYAN}, ${CORAL}, ${PURPLE})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Atualizações
            </span>
          </h2>
          <p className="text-white/40 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Acompanhe as novidades do ecossistema em tempo real.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
        >
          {columns.map((col) => {
            const ColIcon = col.icon;
            return (
              <motion.div
                key={col.key}
                variants={scaleIn}
                className="rounded-2xl border overflow-hidden relative card-3d"
                style={{
                  borderColor: `${col.color}15`,
                  background: "rgba(255,255,255,0.015)",
                }}
              >
                <div className="card-3d-inner">
                  {/* Column header */}
                  <div
                    className="flex items-center gap-3 px-5 py-4 border-b"
                    style={{ borderColor: `${col.color}12` }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: `${col.color}15`, color: col.color }}
                    >
                      <ColIcon size={17} />
                    </div>
                    <span className="font-bold text-white font-['Clash_Display',system-ui,sans-serif]">
                      {col.label}
                    </span>
                    <span
                      className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full"
                      style={{ background: `${col.color}15`, color: col.color }}
                    >
                      {col.items.length} itens
                    </span>
                  </div>

                  {/* Items */}
                  <div className="divide-y" style={{ borderColor: `${col.color}08` }}>
                    {col.items.map((item, i) => (
                      <Link
                        key={i}
                        href={item.href}
                        className="block px-5 py-4 hover:bg-white/[0.02] transition-colors group/item"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-white/80 group-hover/item:text-white transition-colors truncate">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-white/35 mt-1 line-clamp-1">
                              {item.desc}
                            </p>
                          </div>
                          <span
                            className="shrink-0 text-[10px] font-mono mt-0.5"
                            style={{ color: col.color }}
                          >
                            {item.date}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* View all link */}
                  <div
                    className="px-5 py-3 border-t"
                    style={{ borderColor: `${col.color}12` }}
                  >
                    <Link
                      href={col.items[0].href}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold transition-all hover:gap-2"
                      style={{ color: col.color }}
                    >
                      Ver todos
                      <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — Skills Grid with Badges
   ═══════════════════════════════════════════════════════════════ */
function SkillsGrid() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <span className="section-label justify-center">Tech Stack</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-['Clash_Display',system-ui,sans-serif]">
            Skills do{" "}
            <span style={{
              background: `linear-gradient(135deg, ${CYAN}, ${PURPLE}, ${CORAL})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Ecossistema
            </span>
          </h2>
          <p className="text-white/40 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Tecnologias e ferramentas que dominamos para construir sua plataforma soberana.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          {ECOSYSTEM_SKILLS.map((skill, idx) => (
            <motion.div
              key={skill.name}
              variants={scaleIn}
              className="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 hover:scale-105 cursor-default"
              style={{
                borderColor: `${skill.color}20`,
                background: `${skill.color}06`,
              }}
            >
              {/* Color dot */}
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: skill.color }}
              />
              <span className="text-sm font-semibold text-white/70 group-hover:text-white transition-colors">
                {skill.name}
              </span>
              <span
                className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full ml-1"
                style={{
                  background: `${skill.color}15`,
                  color: skill.color,
                  border: `1px solid ${skill.color}25`,
                }}
              >
                {skill.level}
              </span>

              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: `0 0 15px ${skill.color}10, inset 0 1px 0 ${skill.color}10`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Legend */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex items-center justify-center gap-6 mt-8"
        >
          {[
            { color: CYAN, label: "Core Tech" },
            { color: PURPLE, label: "IA & ML" },
            { color: CORAL, label: "Infra & Tools" },
          ].map((leg) => (
            <div key={leg.label} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: leg.color }} />
              <span className="text-[10px] text-white/30 uppercase tracking-wider">{leg.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — Intelligence OS CTA (cyan/coral/purple)
   ═══════════════════════════════════════════════════════════════ */
function IntelligenceOSCTA() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle at 30% 40%, ${CYAN}25 0%, transparent 70%)`,
            filter: "blur(80px)",
            animation: "floatOrb1 15s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-8"
          style={{
            background: `radial-gradient(circle at 60% 60%, ${PURPLE}20 0%, transparent 70%)`,
            filter: "blur(80px)",
            animation: "floatOrb2 12s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5"
          style={{
            background: `radial-gradient(circle at center, ${CORAL}15 0%, transparent 70%)`,
            filter: "blur(100px)",
            animation: "floatOrb3 18s ease-in-out infinite",
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          {/* Badge */}
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border mb-6"
            style={{
              borderColor: `${PURPLE}30`,
              background: `${PURPLE}10`,
              color: PURPLE,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PURPLE }} />
            Intelligence OS
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold font-['Clash_Display',system-ui,sans-serif] leading-[1.1]">
            <span style={{
              background: `linear-gradient(135deg, ${CYAN} 0%, ${PURPLE} 50%, ${CORAL} 100%)`,
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 4s ease-in-out infinite",
            }}>
              Intelligence OS
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-white/40 mt-5 max-w-2xl mx-auto leading-relaxed">
            O sistema operacional completo para sua soberania digital.
            Dashboard central, analytics, agentes de IA, CRM, automações
            e muito mais — tudo em um só lugar.
          </p>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 max-w-2xl mx-auto"
        >
          {[
            { icon: LayoutDashboard, label: "Dashboard", color: CYAN },
            { icon: Bot, label: "AI Agents", color: PURPLE },
            { icon: Workflow, label: "Automações", color: CORAL },
            { icon: BarChart3, label: "Analytics", color: CYAN },
          ].map((feat) => {
            const FeatIcon = feat.icon;
            return (
              <motion.div
                key={feat.label}
                variants={scaleIn}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 hover:scale-105"
                style={{
                  borderColor: `${feat.color}15`,
                  background: "rgba(255,255,255,0.015)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${feat.color}15`, color: feat.color }}
                >
                  <FeatIcon size={18} />
                </div>
                <span className="text-[11px] font-semibold text-white/60">{feat.label}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
        >
          <Link
            href="/intelligence-os"
            className="inline-flex items-center gap-2 h-13 px-8 rounded-xl text-sm font-bold text-black transition-all hover:brightness-110"
            style={{ background: `linear-gradient(135deg, ${CYAN}, ${PURPLE})` }}
          >
            <Rocket size={17} />
            Acessar Intelligence OS
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 h-13 px-8 rounded-xl text-sm font-medium text-white/60 hover:text-white border transition-all"
            style={{ borderColor: `${CORAL}25`, background: `${CORAL}05` }}
          >
            <Sparkles size={16} />
            Criar com Builder IA
          </Link>
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-[11px] text-white/20 mt-6"
        >
          16 módulos integrados • Criptografia E2E • Dados 100% locais • Open source
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — Command Center Modal
   ═══════════════════════════════════════════════════════════════ */
function CommandCenter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const COMMANDS = [
    { icon: LayoutDashboard, label: "Dashboard Central", href: "/intelligence-os", shortcut: "⌘D" },
    { icon: Rocket, label: "AI Builder", href: "/builder", shortcut: "⌘B" },
    { icon: BarChart3, label: "Analytics & BI", href: "/intelligence-os/analytics", shortcut: "⌘A" },
    { icon: Bot, label: "AI Agents", href: "/intelligence-os/agents", shortcut: "⌘G" },
    { icon: Users, label: "Clientes CRM", href: "/intelligence-os/clientes", shortcut: "⌘C" },
    { icon: Globe, label: "Site Forge", href: "/intelligence-os/forge", shortcut: "⌘F" },
    { icon: BookOpen, label: "Biblioteca de Prompts", href: "/biblioteca", shortcut: "⌘L" },
    { icon: Star, label: "INEMA VIP", href: "/inema", shortcut: "⌘I" },
    { icon: Sparkles, label: "LLM Gateway", href: "/ia", shortcut: "⌘M" },
    { icon: Copy, label: "Site Cloner", href: "/intelligence-os/cloner", shortcut: "⌘O" },
  ];

  const filtered = query.trim()
    ? COMMANDS.filter((cmd) =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
      )
    : COMMANDS;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setActiveIdx(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIdx]) {
      window.location.href = filtered[activeIdx].href;
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="command-center-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2, ease: easeOut }}
        className="command-center-panel"
      >
        <div className="flex items-center gap-3 px-4 border-b border-white/[0.06]">
          <Search size={16} className="text-white/30 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Comandos, páginas, ferramentas..."
            className="command-center-input"
          />
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <kbd className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10">ESC</kbd>
          </button>
        </div>

        <div className="command-center-list">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-white/30 text-sm">Nenhum resultado encontrado</div>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              return (
                <Link
                  key={cmd.label}
                  href={cmd.href}
                  onClick={onClose}
                  className={`command-center-item ${idx === activeIdx ? 'active' : ''}`}
                >
                  <Icon size={16} className="shrink-0" style={{ color: G.primary }} />
                  <span>{cmd.label}</span>
                  <kbd>{cmd.shortcut}</kbd>
                </Link>
              );
            })
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-white/[0.04] flex items-center gap-4 text-[10px] text-white/20">
          <span>↑↓ Navegar</span>
          <span>↵ Selecionar</span>
          <span className="ml-auto">⌘K Abrir</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — Footer
   ═══════════════════════════════════════════════════════════════ */
function FooterSection() {
  return (
    <footer className="relative border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Intelligence OS Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="mb-16"
        >
          <span className="section-label">Intelligence OS</span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-['Clash_Display',system-ui,sans-serif] mb-8">
            Módulos da{" "}
            <span className="text-gradient-shift">Plataforma</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {PLATFORM_MODULES.map((mod) => {
              const IconComp = mod.icon;
              return (
                <Link
                  key={mod.label}
                  href={mod.href}
                  className="group flex items-center gap-3 rounded-xl border border-white/[0.04] p-3 transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.02]"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      background: `${mod.color}12`,
                      color: mod.color,
                    }}
                  >
                    <IconComp size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-white/70 group-hover:text-white transition-colors truncate">
                      {mod.label}
                    </div>
                    <p className="text-[10px] text-white/30 truncate mt-0.5">{mod.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00C9A7, #00A88C)" }}>
              <Zap size={16} className="text-black" />
            </div>
            <div>
              <span className="text-sm font-bold text-white font-['Clash_Display',system-ui,sans-serif]">Thiago Lab</span>
              <p className="text-[10px] text-white/30">IA para criar negócios digitais com soberania.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs text-white/30">
            <Link href="/intelligence-os" className="hover:text-white/60 transition-colors">Dashboard</Link>
            <Link href="/builder" className="hover:text-white/60 transition-colors">Builder</Link>
            <Link href="/ia" className="hover:text-white/60 transition-colors">IA</Link>
            <span>&copy; {new Date().getFullYear()} Thiago Lab</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE — thiagolab.com Landing
   ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [ecosystemFilter, setEcosystemFilter] = useState("todos");

  // Parallax hook on hero section
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 600], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.6]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut for Command Center
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
      if (e.key === "Escape" && commandOpen) {
        setCommandOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandOpen]);

  return (
    <div className="min-h-screen" style={{ background: G.bg }}>
      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Command Center Modal */}
      <CommandCenter isOpen={commandOpen} onClose={() => setCommandOpen(false)} />

      {/* Inject custom keyframes */}
      <style>{`
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, -30px) scale(1.08); }
          66% { transform: translate(20px, 25px) scale(0.92); }
        }
        @keyframes floatOrb3 {
          0%, 100% { transform: translate(-50%, 0) scale(1); }
          33% { transform: translate(-50%, -25px) scale(1.1); }
          66% { transform: translate(-50%, 15px) scale(0.9); }
        }
        @keyframes pulseGlowNode {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════
          NAV — Sticky, Glass, Green
          ══════════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "border-b border-white/[0.04]" : "border-b border-transparent"
        }`}
        style={{
          background: scrolled ? "rgba(3,3,3,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(1.3)" : "none",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-shadow"
                style={{
                  background: "linear-gradient(135deg, #00C9A7, #00A88C)",
                  boxShadow: "0 0 16px rgba(0,201,167,0.1)",
                }}>
                <Zap size={18} className="text-black" />
              </div>
              <div>
                <span className="text-base font-bold text-white font-['Clash_Display',system-ui,sans-serif]">
                  Thiago Lab
                </span>
                <span className="hidden sm:inline text-[10px] text-white/30 ml-2 font-medium uppercase tracking-widest">
                  Sovereign
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { label: "Capacidades", href: "#capacidades" },
                { label: "Mapa", href: "#mapa" },
                { label: "Builder", href: "#builder" },
                { label: "Planos", href: "#planos" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3 py-1.5 text-xs font-medium text-white/50 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Command Center Trigger */}
              <button
                onClick={() => setCommandOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-[11px] font-medium text-white/50 hover:text-white border border-white/[0.06] hover:border-white/[0.12] transition-all"
              >
                <Command size={13} />
                <span className="hidden lg:inline">Comandos</span>
                <kbd className="text-[9px] text-white/20 bg-white/5 px-1 rounded border border-white/10">⌘K</kbd>
              </button>

              <Link
                href="/intelligence-os"
                className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-[11px] font-medium text-white/60 hover:text-white border border-white/[0.08] hover:border-white/[0.15] transition-all"
              >
                <LayoutDashboard size={13} />
                Abrir OS
              </Link>
              <Link
                href="/builder"
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-[11px] font-bold text-black transition-all hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #00C9A7, #00A88C)" }}
              >
                <Rocket size={13} />
                Criar agora
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden ml-1 w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-white/[0.04]"
            style={{ background: "rgba(3,3,3,0.98)", backdropFilter: "blur(20px)" }}
          >
            <div className="px-4 py-4 space-y-1">
              {[
                { label: "Capacidades", href: "#capacidades" },
                { label: "Mapa", href: "#mapa" },
                { label: "Builder", href: "#builder" },
                { label: "Planos", href: "#planos" },
                { label: "Intelligence OS", href: "/intelligence-os" },
                { label: "Comandos", href: "#", onClick: () => { setMobileMenuOpen(false); setCommandOpen(true); } },
              ].map((item: any) => (
                <Link
                  key={item.label}
                  href={item.href || "#"}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (item.onClick) item.onClick();
                  }}
                  className="block px-3 py-2.5 text-sm font-medium text-white/60 hover:text-white rounded-xl hover:bg-white/[0.04] transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </header>

      {/* ══════════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <GoldParticles />
        <GridBackground />
        <FloatingOrbs />

        {/* Scanline subtle */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,201,167,0.1) 2px, rgba(0,201,167,0.1) 3px)",
          }}
        />

        <motion.div
          style={{ y: heroParallax, opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-20 sm:py-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Badge */}
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest border mb-6"
                  style={{
                    borderColor: "rgba(0,201,167,0.2)",
                    background: "rgba(0,201,167,0.08)",
                    color: G.primary,
                  }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: G.primary }} />
                  INTELLIGENCE OS V2.0 • LOCAL-FIRST
                </span>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] font-['Clash_Display',system-ui,sans-serif]">
                  Sua inteligência,{" "}
                  <span className="text-gradient-shift">
                    suas regras.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-white/40 mt-5 max-w-lg leading-relaxed">
                                Do briefing ao deploy. Construa sites, agentes de IA, SaaS e automações.
                                Tudo com inteligência artificial e controle total dos seus dados.
                </p>

                {/* USP bullets */}
                <div className="flex flex-wrap items-center gap-4 mt-5">
                  {[
                    { icon: Shield, text: "100% local-first" },
                    { icon: Lock, text: "Criptografia ponta a ponta" },
                    { icon: HardDrive, text: "Seus dados, seu dispositivo" },
                  ].map((usp) => (
                    <div key={usp.text} className="flex items-center gap-1.5 text-xs text-white/50">
                      <usp.icon size={13} style={{ color: G.primary }} />
                      <span>{usp.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="flex flex-wrap items-center gap-3 mt-8">
                  <Link
                    href="/builder"
                    className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-bold text-black transition-all hover:brightness-110"
                    style={{ background: "linear-gradient(135deg, #00C9A7, #00A88C)" }}
                  >
                    <Rocket size={16} />
                    Começar grátis
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="#agentes-soberanos"
                    className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-medium text-white/60 hover:text-white border border-white/[0.08] hover:border-white/[0.15] transition-all"
                  >
                    Conhecer agentes
                  </Link>
                </div>

                {/* Stats with Animated Counter */}
                <div className="flex items-center gap-6 sm:gap-8 mt-10">
                  {[
                    { value: 146, label: "Repositórios", suffix: "+" },
                    { value: 8, label: "Engines IA" },
                    { value: 0, label: "Dados Vazados" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-xl sm:text-2xl font-extrabold text-white font-['Clash_Display',system-ui,sans-serif] count-up-number">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix || ""} />
                      </div>
                      <div className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right — Terminal */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-3xl opacity-20"
                style={{
                  background: "radial-gradient(circle at center, rgba(0,201,167,0.15) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />
              <TypeWriterTerminal />
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-white/20 uppercase tracking-widest">Scroll</span>
          <div className="w-4 h-7 rounded-full border border-white/15 flex justify-center pt-1.5">
            <div className="w-1 h-1.5 rounded-full animate-bounce" style={{ background: G.primary }} />
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MARQUEE
          ══════════════════════════════════════════════════════════ */}
      <section className="relative border-y border-white/[0.03]">
        <TechMarquee />
      </section>

      {/* ══════════════════════════════════════════════════════════
          CAPACIDADES
          ══════════════════════════════════════════════════════════ */}
      <section id="capacidades" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <span className="section-label justify-center">Capacidades</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-['Clash_Display',system-ui,sans-serif]">
              Tudo que você precisa para{" "}
              <span className="text-gradient-shift">
                construir e escalar
              </span>
            </h2>
            <p className="text-white/40 mt-3 max-w-xl mx-auto text-sm sm:text-base">
              Um ecossistema completo de ferramentas, agentes e infraestrutura para criar negócios digitais soberanos.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          >
            {CAPACIDADES.map((cap, idx) => {
              const IconComp = cap.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="group relative rounded-2xl border border-white/[0.04] p-5 sm:p-6 transition-all duration-500 hover:border-emerald-500/15 hover:bg-white/[0.02] card-3d"
                  style={{
                    background: "rgba(255,255,255,0.015)",
                  }}
                >
                  <div className="card-3d-inner">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3.5 transition-all duration-300 group-hover:scale-110"
                      style={{ background: "rgba(0,201,167,0.1)", color: "#3DF5C5" }}>
                      <IconComp size={20} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1.5 font-['Clash_Display',system-ui,sans-serif]">
                      {cap.title}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed">{cap.desc}</p>

                    {/* Hover indicator */}
                    <div className="absolute bottom-0 left-4 right-4 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                      style={{ background: "linear-gradient(90deg, #00C9A7, transparent)" }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          AGENTES SOBERANOS PESSOAIS
          ══════════════════════════════════════════════════════════ */}
      <section id="agentes-soberanos" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <span className="section-label justify-center">Soberania Pessoal</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-['Clash_Display',system-ui,sans-serif]">
              Agentes de IA que{" "}
              <span className="text-gradient-shift">vivem no seu dispositivo</span>
            </h2>
            <p className="text-white/40 mt-3 max-w-xl mx-auto text-sm sm:text-base">
              Não na nuvem de big tech. Cada agente roda localmente, com seus dados, suas regras.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          >
            {[
              { icon: Brain, title: "Tomada de Decisão", desc: "Análise de cenários, prós e contras, simulações de resultados para escolhas mais inteligentes no dia a dia.", tag: "Disponível" },
              { icon: TrendingUp, title: "Carreira BR", desc: "Saúde, vendas, farmácia e setores locais. Oportunidades, tendências e insights do mercado brasileiro.", tag: "Disponível" },
              { icon: Heart, title: "Parenting & Família", desc: "Rotinas, educação, saúde familiar e organização doméstica com recomendações personalizadas.", tag: "Em breve" },
              { icon: MessageCircle, title: "Comunicação", desc: "E-mails, mensagens, apresentações e respostas inteligentes que mantêm sua voz e tom pessoal.", tag: "Disponível" },
              { icon: Users, title: "Relacionamentos", desc: "Networking, follow-ups, lembretes de datas importantes e gestão de conexões profissionais.", tag: "Em breve" },
              { icon: DollarSign, title: "Finanças Pessoais", desc: "Inflação, impostos, investimentos locais e planejamento financeiro com dados do mercado brasileiro.", tag: "Disponível" },
            ].map((agent, idx) => {
              const AgentIcon = agent.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="group relative rounded-2xl border border-white/[0.04] p-5 sm:p-6 transition-all duration-500 hover:border-emerald-500/15 hover:bg-white/[0.02] card-3d"
                  style={{ background: "rgba(255,255,255,0.015)" }}
                >
                  <div className="card-3d-inner">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{ background: "rgba(0,201,167,0.1)", color: "#3DF5C5" }}>
                        <AgentIcon size={20} />
                      </div>
                      <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        agent.tag === "Disponível"
                          ? "text-emerald-400 bg-emerald-500/10"
                          : "text-amber-400 bg-amber-500/10"
                      }`}>
                        {agent.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1.5 font-['Clash_Display',system-ui,sans-serif]">
                      {agent.title}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed">{agent.desc}</p>

                    {/* Hover indicator */}
                    <div className="absolute bottom-0 left-4 right-4 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                      style={{ background: "linear-gradient(90deg, #00C9A7, transparent)" }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PROVA SOCIAL
          ══════════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20 border-y border-white/[0.03]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <span className="section-label justify-center">Por que escolher soberania</span>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto"
          >
            {[
              { icon: Shield, value: "0", label: "Dados vazados", desc: "Criptografia ponta a ponta. Ninguém acessa seus dados além de você." },
              { icon: HardDrive, value: "100%", label: "Local-first", desc: "Tudo processado no seu dispositivo. Nada sobe para servidores de terceiros." },
              { icon: Lock, value: "E2E", label: "Criptografia", desc: "Criptografia ponta a ponta em todas as comunicações e armazenamento." },
            ].map((item, idx) => {
              const ItemIcon = item.icon;
              return (
                <motion.div
                  key={idx}
                  variants={scaleIn}
                  className="group relative rounded-2xl border border-white/[0.04] p-6 sm:p-8 text-center transition-all duration-500 hover:border-emerald-500/10 hover:bg-white/[0.02] card-3d"
                  style={{ background: "rgba(255,255,255,0.015)" }}
                >
                  <div className="card-3d-inner">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110"
                      style={{ background: "rgba(0,201,167,0.1)", color: G.primary }}>
                      <ItemIcon size={22} />
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white font-['Clash_Display',system-ui,sans-serif] mb-1"
                      style={{ background: "linear-gradient(135deg, #00C9A7, #3DF5C5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {item.value}
                    </div>
                    <div className="text-sm font-semibold text-white mb-2">{item.label}</div>
                    <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>

                    {/* Hover indicator */}
                    <div className="absolute bottom-0 left-4 right-4 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"
                      style={{ background: "linear-gradient(90deg, transparent, #00C9A7, transparent)" }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          D3 GRAPH
          ══════════════════════════════════════════════════════════ */}
      <D3GraphSection />

      {/* ══════════════════════════════════════════════════════════
          BUILDER
          ══════════════════════════════════════════════════════════ */}
      <InteractiveBuilder />

      {/* ══════════════════════════════════════════════════════════
          PRODUCT CARDS
          ══════════════════════════════════════════════════════════ */}
      <ProductCards />

      {/* ══════════════════════════════════════════════════════════
          ECOSSYSTEM PORTAL — NOVO: Hero + Search
          ══════════════════════════════════════════════════════════ */}
      <EcosystemHero />

      {/* ══════════════════════════════════════════════════════════
          ECOSSYSTEM PORTAL — NOVO: Category Navigation
          ══════════════════════════════════════════════════════════ */}
      <CategoryNavigation active={ecosystemFilter} onSelect={setEcosystemFilter} />

      {/* ══════════════════════════════════════════════════════════
          ECOSSYSTEM PORTAL — NOVO: Product Grid with Tags
          ══════════════════════════════════════════════════════════ */}
      <EcosystemProductGrid filter={ecosystemFilter} />

      {/* ══════════════════════════════════════════════════════════
          ECOSSYSTEM PORTAL — NOVO: Latest Updates (3 columns)
          ══════════════════════════════════════════════════════════ */}
      <LatestUpdates />

      {/* ══════════════════════════════════════════════════════════
          ECOSSYSTEM PORTAL — NOVO: Skills Grid
          ══════════════════════════════════════════════════════════ */}
      <SkillsGrid />

      {/* ══════════════════════════════════════════════════════════
          PRICING
          ══════════════════════════════════════════════════════════ */}
      <PricingSection />

      {/* ══════════════════════════════════════════════════════════
          ECOSSYSTEM PORTAL — NOVO: Intelligence OS CTA
          ══════════════════════════════════════════════════════════ */}
      <IntelligenceOSCTA />

      {/* ══════════════════════════════════════════════════════════
          CTA FINAL
          ══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-15"
            style={{
              background: "radial-gradient(circle at center, rgba(0,201,167,0.2) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-['Clash_Display',system-ui,sans-serif] leading-[1.15]">
            Sua vida,{" "}
            <span className="text-gradient-shift">seus dados,</span>
            <br />
            suas regras.
          </h2>

          <p className="text-white/40 mt-5 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Assuma o controle da sua vida digital. Agentes soberanos que trabalham para você,
            no seu dispositivo, com privacidade total.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-xl text-sm font-bold text-black transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #00C9A7, #00A88C)" }}
            >
              <Rocket size={16} />
              Começar grátis
              <ArrowRight size={14} />
            </Link>
            <Link
              href="#planos"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-xl text-sm font-medium text-white/60 hover:text-white border border-white/[0.08] hover:border-white/[0.15] transition-all"
            >
              Ver planos
            </Link>
          </div>

          <p className="text-[11px] text-white/20 mt-6">
            Sem cartão de crédito • Cancele quando quiser • Dados 100% locais
          </p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════════════ */}
      <FooterSection />
    </div>
  );
}
