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
];

/* ═══════════════════════════════════════════════════════════════
   PRICING TIERS
   ═══════════════════════════════════════════════════════════════ */
const PRICING_TIERS = [
  {
    name: "Starter",
    price: "R$ 0",
    desc: "Para começar sua jornada digital",
    features: ["1 site com IA", "Agente WhatsApp básico", "Template pré-pronto", "Comunidade Discord", "Atualizações gratuitas"],
    cta: "Começar grátis",
    href: "/builder",
    highlight: false,
  },
  {
    name: "Sovereign Pro",
    price: "R$ 97",
    period: "/mês",
    desc: "Para profissionais que querem escala",
    features: ["Sites ilimitados com IA", "Agentes WhatsApp avançados", "Workflows n8n ilimitados", "Builder completo", "Intelligence OS completo", "Suporte prioritário", "API Key própria"],
    cta: "Assinar Pro",
    href: "/intelligence-os",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Sob medida",
    desc: "Para empresas com necessidades específicas",
    features: ["Tudo do Pro + personalização", "Agentes dedicados", "Infraestrutura dedicada", "SLA 99.9%", "Treinamento de equipe", "Consultoria estratégica", "Onboarding acelerado"],
    cta: "Falar com equipe",
    href: "/intelligence-os",
    highlight: false,
  },
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
  { text: "> ✓ Motores de IA carregados (8 engines)", delay: 1900, color: "#3DF5C5" },
  { text: "> ✓ Conectando repositórios... 146 repos sincronizados", delay: 2600, color: "#3DF5C5" },
  { text: "> ✓ Builder AI ativo — 24h operacional", delay: 3300, color: "#3DF5C5" },
  { text: "", delay: 4000, color: "#3DF5C5" },
  { text: "> Sistema pronto. Modo soberania ativado.", delay: 4200, color: "#6EE7B7" },
  { text: "> thiagolab run --deploy", delay: 4900, color: "#3DF5C5" },
  { text: "> [ OK ] Seu império digital está no ar.", delay: 5600, color: "#00C9A7" },
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
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
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
          <p className="text-white/40 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Escolha o plano ideal para seu momento. Todos incluem acesso ao Intelligence OS.
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
                  Thiago Lab Sovereign
                </span>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] font-['Clash_Display',system-ui,sans-serif]">
                  IA para criar{" "}
                  <span className="text-gradient-shift">
                    negócios digitais
                  </span>{" "}
                  com soberania.
                </h1>

                <p className="text-base sm:text-lg text-white/40 mt-5 max-w-lg leading-relaxed">
                  Do briefing ao deploy. Construa sites, agentes de IA, SaaS e automações.
                  Tudo com inteligência artificial e controle total dos seus dados.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap items-center gap-3 mt-8">
                  <Link
                    href="/builder"
                    className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-bold text-black transition-all hover:brightness-110"
                    style={{ background: "linear-gradient(135deg, #00C9A7, #00A88C)" }}
                  >
                    <Rocket size={16} />
                    Criar agora
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="#capacidades"
                    className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-medium text-white/60 hover:text-white border border-white/[0.08] hover:border-white/[0.15] transition-all"
                  >
                    Ver capacidades
                  </Link>
                </div>

                {/* Stats with Animated Counter */}
                <div className="flex items-center gap-6 sm:gap-8 mt-10">
                  {[
                    { value: 146, label: "Repositórios", suffix: "+" },
                    { value: 8, label: "Engines IA" },
                    { value: 24, label: "Operacional", suffix: "h" },
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
          PRICING
          ══════════════════════════════════════════════════════════ */}
      <PricingSection />

      {/* ══════════════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════════════ */}
      <FooterSection />
    </div>
  );
}
