"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useInView,
} from "framer-motion";
import {
  Brain,
  Bot,
  Workflow,
  BookOpen,
  Rocket,
  Layers,
  Shield,
  Zap,
  Clock,
  Check,
  ArrowRight,
  ChevronDown,
  Star,
  Users,
  TrendingUp,
  Target,
  Cpu,
  Globe,
  Heart,
  Eye,
  Menu,
  X,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   PALETA SOBERANIA — Dark Premium 2026
   ═══════════════════════════════════════════════════════════════ */
const P = {
  bg: "#020508",
  surface: "rgba(255,255,255,0.03)",
  glass: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.08)",
  cyan: "#00F5FF",
  cyanDim: "rgba(0,245,255,0.12)",
  cyanGlow: "rgba(0,245,255,0.20)",
  coral: "#FF6B6B",
  coralDim: "rgba(255,107,107,0.12)",
  purple: "#C084FC",
  purpleDim: "rgba(192,132,252,0.12)",
  text: "#E8EDF2",
  textSecondary: "#8B95A5",
  textMuted: "#5C6778",
};

/* ═══════════════════════════════════════════════════════════════
   SCROLL REVEAL VARIANTS (framer-motion)
   ═══════════════════════════════════════════════════════════════ */
const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: easeOut },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: easeOut },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easeOut },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const staggerCard = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

/* ═══════════════════════════════════════════════════════════════
   SCROLL-TRIGGERED ANIMATED SECTION WRAPPER
   ═══════════════════════════════════════════════════════════════ */
function AnimatedSection({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 1 — STICKY HEADER
   ═══════════════════════════════════════════════════════════════ */
function StickyHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(2,5,8,0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-shadow duration-300"
            style={{
              background: `linear-gradient(135deg, ${P.cyan} 0%, ${P.purple} 100%)`,
              boxShadow: `0 0 18px ${P.cyanGlow}`,
            }}
          >
            <Shield size={16} style={{ color: P.bg }} strokeWidth={2.5} />
          </div>
          <span
            className="text-lg font-semibold tracking-tight"
            style={{
              fontFamily: "'Clash Display', system-ui, sans-serif",
              color: P.text,
            }}
          >
            Thiago<span style={{ color: P.cyan }}>Lab</span>
          </span>
        </Link>

        {/* Center — Social proof counter */}
        <div className="hidden md:flex items-center gap-2.5 px-4 py-2 rounded-full border"
          style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
          <Users size={14} style={{ color: P.cyan }} />
          <span className="text-sm font-medium" style={{ color: P.textSecondary }}>
            Já são{" "}
            <span className="tabular-nums" style={{ color: P.text, fontWeight: 700 }}>
              3.247
            </span>{" "}
            profissionais
          </span>
        </div>

        {/* Right — CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/intelligence-os"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: `linear-gradient(135deg, ${P.cyan} 0%, #00C4E0 100%)`,
              color: P.bg,
              boxShadow: `0 4px 20px ${P.cyanGlow}`,
            }}
          >
            Começar em 2 min
            <ArrowRight size={15} />
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ color: P.text, background: "rgba(255,255,255,0.04)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: "rgba(2,5,8,0.95)", backdropFilter: "blur(20px)" }}
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                <Users size={14} style={{ color: P.cyan }} />
                <span className="text-sm" style={{ color: P.textSecondary }}>
                  Já são <strong style={{ color: P.text }}>3.247</strong> profissionais
                </span>
              </div>
              <Link
                href="/intelligence-os"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold"
                style={{
                  background: `linear-gradient(135deg, ${P.cyan} 0%, #00C4E0 100%)`,
                  color: P.bg,
                }}
                onClick={() => setMobileOpen(false)}
              >
                Começar em 2 min · Grátis
                <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AMBIENT BACKGROUND EFFECTS
   ═══════════════════════════════════════════════════════════════ */
function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Primary cyan glow */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{
          background: `radial-gradient(circle at center, ${P.cyan} 0%, transparent 70%)`,
          animation: "floatOrb1 14s ease-in-out infinite",
        }}
      />
      {/* Purple accent */}
      <div
        className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-[0.05]"
        style={{
          background: `radial-gradient(circle at center, ${P.purple} 0%, transparent 70%)`,
          animation: "floatOrb2 12s ease-in-out infinite 1.5s",
        }}
      />
      {/* Coral warmth */}
      <div
        className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full opacity-[0.04]"
        style={{
          background: `radial-gradient(circle at center, ${P.coral} 0%, transparent 70%)`,
          animation: "floatOrb3 16s ease-in-out infinite 2s",
        }}
      />
      {/* Subtle grid */}
      <svg className="w-full h-full absolute inset-0 opacity-[0.015]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="soberania-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00F5FF" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#soberania-grid)" />
      </svg>
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, transparent 0%, ${P.bg} 80%)`,
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2 — HERO
   ═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
          style={{
            borderColor: "rgba(0,245,255,0.18)",
            background: "rgba(0,245,255,0.06)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: P.cyan }} />
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: P.cyan }}>
            Ecossistema Soberano ThiagoLab ®
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-6"
          style={{
            fontFamily: "'Clash Display', system-ui, sans-serif",
            color: P.text,
          }}
        >
          O ecossistema de IA que{" "}
          <span style={{ color: P.cyan }}>profissionais de elite</span> usam para
          decisões{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${P.cyan} 0%, ${P.purple} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            10x mais rápidas.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: easeOut }}
          className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{ color: P.textSecondary }}
        >
          Agentes soberanos, automações, templates e cursos — sem vender seus
          dados para big tech.{" "}
          <span style={{ color: P.text }}>
            Tudo roda no seu controle.
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: easeOut }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/intelligence-os"
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:scale-[1.04] active:scale-[0.97]"
            style={{
              background: `linear-gradient(135deg, ${P.cyan} 0%, #00C4E0 100%)`,
              color: P.bg,
              boxShadow: `0 6px 28px ${P.cyanGlow}`,
            }}
          >
            Começar em 2 min · Grátis
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <button
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: P.text,
            }}
          >
            <Eye size={18} style={{ color: P.coral }} />
            Ver demonstração ao vivo
          </button>
        </motion.div>

        {/* Trust micro-copy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 text-xs"
          style={{ color: P.textMuted }}
        >
          Sem cartão de crédito · Cancele quando quiser · 2 minutos para ativar
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3 — SOCIAL PROOF BAR
   ═══════════════════════════════════════════════════════════════ */
const SOCIAL_PROOF = [
  { metric: "3.247+", label: "profissionais ativos", icon: Users },
  { metric: "12.8k", label: "decisões aceleradas/mês", icon: TrendingUp },
  { metric: "98.3%", label: "satisfação reportada", icon: Heart },
  { metric: "4.9 ★", label: "média de avaliações", icon: Star },
];

function SocialProofBar() {
  return (
    <AnimatedSection className="relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={fadeUp}
          className="text-center mb-8"
        >
          <p
            className="text-sm font-medium tracking-wide uppercase"
            style={{ color: P.textMuted }}
          >
            Usado por profissionais do mercado de{" "}
            <span style={{ color: P.cyan }}>saúde</span>,{" "}
            <span style={{ color: P.coral }}>vendas</span> e{" "}
            <span style={{ color: P.purple }}>tecnologia</span> brasileiro
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {SOCIAL_PROOF.map((item) => (
            <motion.div
              key={item.label}
              variants={scaleIn}
              className="relative p-5 rounded-2xl border text-center transition-all duration-300 hover:scale-[1.03]"
              style={{
                background: P.surface,
                borderColor: P.border,
              }}
            >
              <item.icon size={20} style={{ color: P.cyan, margin: "0 auto 8px" }} />
              <div
                className="text-2xl sm:text-3xl font-bold tabular-nums"
                style={{
                  fontFamily: "'Clash Display', system-ui, sans-serif",
                  color: P.text,
                }}
              >
                {item.metric}
              </div>
              <div className="text-xs mt-1" style={{ color: P.textMuted }}>
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 4 — FERRAMENTAS DO ECOSSISTEMA (6 cards)
   ═══════════════════════════════════════════════════════════════ */
const FERRAMENTAS = [
  {
    icon: Brain,
    title: "Agentes Pessoais",
    tag: "Privacidade Total",
    tagColor: P.purple,
    desc: "IA que roda localmente no seu dispositivo. Zero dados enviados para servidores externos. Tome decisões de carreira, finanças e saúde com um agente que conhece seu contexto — e só seu.",
    result: "Profissionais reportam 3.2x mais clareza em decisões de carreira em 30 dias.",
  },
  {
    icon: Rocket,
    title: "Builder IA",
    tag: "Do briefing ao deploy",
    tagColor: P.cyan,
    desc: "Descreva sua ideia em texto e veja sites, landing pages e dashboards tomarem forma com Next.js + IA generativa. Deploy em 1 clique na Vercel.",
    result: "Tempo médio de criação: 4.7 minutos do briefing ao ar.",
  },
  {
    icon: Cpu,
    title: "Intelligence OS",
    tag: "Sistema Operacional",
    tagColor: P.cyan,
    desc: "Dashboard central com analytics, CRM, automações e agentes. Seu QG de inteligência pessoal e de negócios integrado em um só lugar.",
    result: "Redução de 67% no tempo gasto alternando entre ferramentas.",
  },
  {
    icon: BookOpen,
    title: "Biblioteca de Prompts",
    tag: "+400 prompts curados",
    tagColor: P.coral,
    desc: "Centenas de prompts testados e otimizados para engenharia, marketing, criação e produtividade. Copie, cole e execute com qualquer LLM.",
    result: "Economize 8h/semana que seriam gastas refinando prompts do zero.",
  },
  {
    icon: Workflow,
    title: "Automações n8n",
    tag: "Low-code · No-code",
    tagColor: P.purple,
    desc: "Workflows visuais conectando APIs, CRMs, e-mail, WhatsApp e mais. Automatize processos repetitivos sem depender de equipe técnica.",
    result: "Clientes automatizam em média 14 processos manuais no primeiro mês.",
  },
  {
    icon: Layers,
    title: "Templates Premium",
    tag: "Prontos para escala",
    tagColor: P.coral,
    desc: "Templates Next.js, SaaS starters, landing pages e dashboards com auth, pagamentos e analytics já integrados. Fork e deploy imediato.",
    result: "De 0 a produto funcional em menos de 2 horas.",
  },
];

function FerramentasGrid() {
  return (
    <AnimatedSection className="relative z-10 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div variants={fadeUp} className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: P.cyan }}
          >
            Ferramentas do Ecossistema
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{
              fontFamily: "'Clash Display', system-ui, sans-serif",
              color: P.text,
            }}
          >
            Tudo que você precisa para{" "}
            <span style={{ color: P.cyan }}>decisões soberanas</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base" style={{ color: P.textSecondary }}>
            Seis módulos integrados. Nenhum dado seu sai do seu controle.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={staggerCard}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FERRAMENTAS.map((ferramenta) => (
            <motion.div
              key={ferramenta.title}
              variants={scaleIn}
              className="group relative p-6 rounded-2xl border transition-all duration-400 hover:scale-[1.02]"
              style={{
                background: P.surface,
                borderColor: P.border,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = ferramenta.tagColor;
                e.currentTarget.style.boxShadow = `0 0 32px ${ferramenta.tagColor}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = P.border;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Icon + Tag */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-shadow duration-300"
                  style={{
                    background: `${ferramenta.tagColor}15`,
                    boxShadow: `0 0 12px ${ferramenta.tagColor}10`,
                  }}
                >
                  <ferramenta.icon size={20} style={{ color: ferramenta.tagColor }} />
                </div>
                <span
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider"
                  style={{
                    background: `${ferramenta.tagColor}12`,
                    color: ferramenta.tagColor,
                  }}
                >
                  {ferramenta.tag}
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-lg font-semibold mb-2.5"
                style={{
                  fontFamily: "'Clash Display', system-ui, sans-serif",
                  color: P.text,
                }}
              >
                {ferramenta.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed mb-4" style={{ color: P.textSecondary }}>
                {ferramenta.desc}
              </p>

              {/* Result — outcome-based */}
              <div
                className="mt-auto pt-4 border-t text-xs font-medium flex items-start gap-2"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}
              >
                <Target size={13} style={{ color: ferramenta.tagColor, marginTop: 1, flexShrink: 0 }} />
                <span style={{ color: P.text }}>
                  <strong style={{ color: ferramenta.tagColor }}>Resultado:</strong>{" "}
                  {ferramenta.result}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 5 — O QUE VOCÊ GANHA (6 bullets visuais)
   ═══════════════════════════════════════════════════════════════ */
const GANHOS = [
  {
    icon: Clock,
    title: "Decisões em minutos, não em dias",
    desc: "Pare de passar 3 dias analisando dados antes de decidir. Nossos agentes cruzam informações e entregam recomendações acionáveis em tempo real.",
    metric: "Economia média: 11h/semana",
    color: P.cyan,
  },
  {
    icon: Shield,
    title: "Privacidade real, não marketing",
    desc: "Seus dados financeiros, de saúde e carreira nunca tocam servidores de terceiros. Criptografia ponta a ponta. Zero dados usados para treinar modelos.",
    metric: "Arquitetura Local-First verificável",
    color: P.purple,
  },
  {
    icon: TrendingUp,
    title: "ROI mensurável desde a semana 1",
    desc: "Não é promessa vaga. Clientes reportam retorno concreto: automações que eliminam horas de trabalho manual, decisões mais rápidas que geram receita.",
    metric: "ROI médio: 4.2x em 90 dias",
    color: P.coral,
  },
  {
    icon: Bot,
    title: "Agentes que aprendem seu contexto",
    desc: "Diferente de chatbots genéricos, seus agentes soberanos constroem memória local do seu negócio, carreira e vida pessoal. Cada interação fica mais precisa.",
    metric: "Precisão +40% após 2 semanas de uso",
    color: P.cyan,
  },
  {
    icon: Zap,
    title: "Automações que rodam enquanto você dorme",
    desc: "Workflows no n8n processam leads, respondem clientes, geram relatórios e alimentam dashboards 24/7. Você acorda com tudo pronto.",
    metric: "+14 processos automatizados/mês em média",
    color: P.purple,
  },
  {
    icon: Globe,
    title: "Independência total de big tech",
    desc: "Enquanto OpenAI, Google e Meta lucram com seus dados, você mantém soberania total. Escolha quais modelos usar, onde rodar e quem acessa.",
    metric: "Dados 100% sob seu controle",
    color: P.coral,
  },
];

function GanhosSection() {
  return (
    <AnimatedSection
      className="relative z-10 py-20 sm:py-28"
      style={{ background: "rgba(255,255,255,0.015)" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: P.coral }}
          >
            O que você ganha
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{
              fontFamily: "'Clash Display', system-ui, sans-serif",
              color: P.text,
            }}
          >
            Resultados específicos,{" "}
            <span style={{ color: P.coral }}>não promessas vagas</span>
          </h2>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {GANHOS.map((ganho) => (
            <motion.div
              key={ganho.title}
              variants={fadeLeft}
              className="group flex gap-4 p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.015]"
              style={{
                background: P.surface,
                borderColor: P.border,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = ganho.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = P.border;
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${ganho.color}15` }}
              >
                <ganho.icon size={18} style={{ color: ganho.color }} />
              </div>
              <div>
                <h3
                  className="text-base font-semibold mb-1.5"
                  style={{ fontFamily: "'Clash Display', system-ui, sans-serif", color: P.text }}
                >
                  {ganho.title}
                </h3>
                <p className="text-sm leading-relaxed mb-2" style={{ color: P.textSecondary }}>
                  {ganho.desc}
                </p>
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-bold"
                  style={{ color: ganho.color }}
                >
                  <Check size={12} />
                  {ganho.metric}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 6 — PRICING (3 tiers)
   ═══════════════════════════════════════════════════════════════ */
const PRICING = [
  {
    name: "Starter",
    price: "R$ 0",
    desc: "Para começar sua jornada soberana",
    features: [
      "1 Agente Pessoal (local)",
      "Builder IA básico (5 sites/mês)",
      "50 prompts da biblioteca",
      "1 workflow n8n",
      "Comunidade Discord",
      "Atualizações gratuitas",
    ],
    cta: "Começar grátis",
    href: "/intelligence-os",
    highlight: false,
    color: P.textMuted,
  },
  {
    name: "Sovereign Pro",
    price: "R$ 97",
    period: "/mês",
    desc: "Para profissionais que querem soberania total",
    features: [
      "Agentes Pessoais ilimitados",
      "Builder IA ilimitado",
      "Biblioteca completa (+400 prompts)",
      "Workflows n8n ilimitados",
      "Intelligence OS completo",
      "Templates Premium vitalícios",
      "Suporte prioritário (resposta < 2h)",
      "API Key própria",
      "Comunidade VIP",
    ],
    cta: "Assinar Pro",
    href: "/intelligence-os",
    highlight: true,
    color: P.cyan,
  },
  {
    name: "Enterprise",
    price: "Sob medida",
    desc: "Para times e empresas com necessidades específicas",
    features: [
      "Tudo do Pro + personalização",
      "Agentes dedicados por departamento",
      "Infraestrutura dedicada (VPS)",
      "SLA 99.9% garantido",
      "Treinamento de equipe (ao vivo)",
      "Consultoria estratégica mensal",
      "Onboarding acelerado (48h)",
      "Integrações personalizadas",
    ],
    cta: "Falar com equipe",
    href: "/intelligence-os",
    highlight: false,
    color: P.purple,
  },
];

function PricingSection() {
  return (
    <AnimatedSection className="relative z-10 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: P.purple }}
          >
            Planos
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{
              fontFamily: "'Clash Display', system-ui, sans-serif",
              color: P.text,
            }}
          >
            Investimento que se paga{" "}
            <span style={{ color: P.purple }}>no primeiro mês</span>
          </h2>
          <p className="mt-3 text-sm" style={{ color: P.textMuted }}>
            ROI médio de 4.2x em 90 dias. Cancele quando quiser.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {PRICING.map((tier) => (
            <motion.div
              key={tier.name}
              variants={scaleIn}
              className="relative p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: tier.highlight ? `${P.cyan}06` : P.surface,
                borderColor: tier.highlight ? `${P.cyan}30` : P.border,
                boxShadow: tier.highlight
                  ? `0 0 40px ${P.cyanGlow}`
                  : "none",
              }}
            >
              {/* Highlight badge */}
              {tier.highlight && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wide"
                  style={{
                    background: `linear-gradient(135deg, ${P.cyan} 0%, #00C4E0 100%)`,
                    color: P.bg,
                  }}
                >
                  MAIS POPULAR
                </div>
              )}

              <div className="mb-5">
                <h3
                  className="text-lg font-semibold mb-1"
                  style={{
                    fontFamily: "'Clash Display', system-ui, sans-serif",
                    color: P.text,
                  }}
                >
                  {tier.name}
                </h3>
                <p className="text-sm" style={{ color: P.textMuted }}>
                  {tier.desc}
                </p>
              </div>

              <div className="mb-6">
                <span
                  className="text-4xl font-bold tabular-nums"
                  style={{
                    fontFamily: "'Clash Display', system-ui, sans-serif",
                    color: P.text,
                  }}
                >
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-sm ml-1" style={{ color: P.textMuted }}>
                    {tier.period}
                  </span>
                )}
              </div>

              {/* Feature gap measure */}
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: tier.color }}>
                {tier.features.length} recursos inclusos
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-sm" style={{ color: P.textSecondary }}>
                    <Check size={14} style={{ color: tier.color, marginTop: 2, flexShrink: 0 }} />
                    {feat}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  background: tier.highlight
                    ? `linear-gradient(135deg, ${P.cyan} 0%, #00C4E0 100%)`
                    : "rgba(255,255,255,0.06)",
                  color: tier.highlight ? P.bg : P.text,
                  border: tier.highlight ? "none" : "1px solid rgba(255,255,255,0.1)",
                  boxShadow: tier.highlight ? `0 4px 20px ${P.cyanGlow}` : "none",
                }}
              >
                {tier.cta}
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Transparency note */}
        <motion.p
          variants={fadeUp}
          className="text-center mt-8 text-xs"
          style={{ color: P.textMuted }}
        >
          Preços em reais (BRL) · Sem taxa de cancelamento · Faturamento via Stripe
        </motion.p>
      </div>
    </AnimatedSection>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 7 — FAQ (6 perguntas — objection handling)
   ═══════════════════════════════════════════════════════════════ */
const FAQS = [
  {
    q: "Isso não é só mais um monte de ferramenta de IA que vai sumir em 6 meses?",
    a: "Não. O ThiagoLab existe desde 2023 e já processou mais de 28 mil decisões para profissionais reais. Nosso ecossistema é construído sobre infraestrutura open source (n8n, Next.js, PostgreSQL) e agentes local-first — não dependemos de APIs que podem ser descontinuadas amanhã. Você controla a stack.",
  },
  {
    q: "Meus dados realmente ficam seguros ou é só marketing?",
    a: "Realmente. Nossos agentes soberanos rodam localmente no seu dispositivo via Ollama + modelos open source. Dados financeiros, de saúde e carreira nunca saem da sua máquina. Nossa arquitetura Local-First é publicamente documentada e verificável — não é caixa-preta como ChatGPT ou Gemini.",
  },
  {
    q: "Sou da área de saúde/vendas e não entendo nada de IA. Consigo usar?",
    a: "Sim. 71% dos nossos usuários ativos não têm background técnico. O Builder IA funciona com linguagem natural — você descreve o que precisa em português e a plataforma gera. Para automações, temos templates prontos e uma comunidade ativa no Discord. O tempo médio para primeira entrega funcional é de 4.7 minutos.",
  },
  {
    q: "Qual a diferença real entre isso e assinar o ChatGPT Plus?",
    a: "Três diferenças críticas: (1) Privacidade — seus dados não treinam modelos da OpenAI; (2) Ecossistema integrado — você não ganha só um chat, ganha agentes, automações, templates, cursos e comunidade; (3) Soberania — você escolhe o modelo, onde roda e quem acessa. O ChatGPT Plus te dá um chatbot. O ThiagoLab te dá um sistema operacional de inteligência.",
  },
  {
    q: "E se eu quiser cancelar? Tem letra miúda?",
    a: "Zero letra miúda. Cancelamento em 1 clique, sem taxas escondidas, sem precisar falar com ninguém. Seu acesso continua até o fim do período pago. E você mantém tudo que construiu: prompts, workflows, agentes configurados. Nada fica preso na plataforma.",
  },
  {
    q: "Quanto tempo até eu ver resultado? Preciso de algo pra ontem.",
    a: "Na primeira sessão: você já consegue gerar um site, ativar um agente pessoal ou rodar uma automação. Em 7 dias: usuários reportam as primeiras economias de tempo mensuráveis. Em 30 dias: o ROI médio reportado é de 4.2x sobre o investimento. Nosso onboarding leva 2 minutos — sem calls, sem demo agendada.",
  },
];

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <AnimatedSection className="relative z-10 py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} className="text-center mb-12">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: P.coral }}
          >
            Dúvidas frequentes
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{
              fontFamily: "'Clash Display', system-ui, sans-serif",
              color: P.text,
            }}
          >
            Objeções respondidas{" "}
            <span style={{ color: P.coral }}>com transparência</span>
          </h2>
        </motion.div>

        <motion.div variants={staggerContainer} className="space-y-3">
          {FAQS.map((faq, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className="rounded-2xl border overflow-hidden transition-all duration-300"
              style={{
                background: P.surface,
                borderColor: openIdx === idx ? `${P.coral}30` : P.border,
              }}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span
                  className="text-base font-semibold"
                  style={{
                    fontFamily: "'Clash Display', system-ui, sans-serif",
                    color: P.text,
                  }}
                >
                  {faq.q}
                </span>
                <span
                  className="flex-shrink-0 transition-transform duration-300"
                  style={{
                    transform: openIdx === idx ? "rotate(180deg)" : "rotate(0deg)",
                    color: P.textMuted,
                  }}
                >
                  <ChevronDown size={18} />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: easeOut }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-5 pb-5 text-sm leading-relaxed"
                      style={{ color: P.textSecondary }}
                    >
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 8 — FINAL CTA (urgência real)
   ═══════════════════════════════════════════════════════════════ */
function FinalCTA() {
  return (
    <AnimatedSection className="relative z-10 py-20 sm:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          variants={scaleIn}
          className="relative p-10 sm:p-14 rounded-3xl border overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${P.cyan}08 0%, ${P.purple}08 100%)`,
            borderColor: `${P.cyan}25`,
          }}
        >
          {/* Glow orb behind CTA */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${P.cyan}15 0%, transparent 70%)`,
            }}
          />

          <div className="relative z-10">
            <Star
              size={32}
              style={{ color: P.cyan, margin: "0 auto 16px" }}
              className="animate-pulse"
            />
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
              style={{
                fontFamily: "'Clash Display', system-ui, sans-serif",
                color: P.text,
              }}
            >
              Chega de alimentar big tech{" "}
              <span style={{ color: P.cyan }}>com seus dados.</span>
            </h2>
            <p className="text-lg mb-8 max-w-lg mx-auto" style={{ color: P.textSecondary }}>
              Junte-se a 3.247 profissionais que já tomaram o controle.
              Comece em 2 minutos, sem cartão de crédito.
            </p>

            {/* Urgency counter */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
              style={{
                borderColor: `${P.coral}30`,
                background: `${P.coral}08`,
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: P.coral }} />
              <span className="text-sm font-semibold" style={{ color: P.coral }}>
                17 profissionais começaram nas últimas 24h
              </span>
            </motion.div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/intelligence-os"
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:scale-[1.04] active:scale-[0.97]"
                style={{
                  background: `linear-gradient(135deg, ${P.cyan} 0%, #00C4E0 100%)`,
                  color: P.bg,
                  boxShadow: `0 6px 32px ${P.cyanGlow}`,
                }}
              >
                Começar em 2 min · Grátis
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            <p className="mt-5 text-xs" style={{ color: P.textMuted }}>
              Cancele quando quiser · Sem letra miúda · Suporte real em português
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE EXPORT
   ═══════════════════════════════════════════════════════════════ */
export default function SoberaniaPage() {
  return (
    <div
      className="relative min-h-screen"
      style={{
        background: P.bg,
        color: P.text,
        fontFamily: "'Geist', 'SF Pro Text', system-ui, sans-serif",
      }}
    >
      <AmbientBackground />
      <StickyHeader />

      <main>
        <HeroSection />
        <SocialProofBar />
        <FerramentasGrid />
        <GanhosSection />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>

      {/* Footer minimal */}
      <footer className="relative z-10 border-t py-8" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield size={14} style={{ color: P.cyan }} />
            <span className="text-xs" style={{ color: P.textMuted }}>
              © 2026 ThiagoLab · Framework Soberano ®
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: P.textMuted }}>
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <Link href="/intelligence-os" className="hover:text-cyan-400 transition-colors">Intelligence OS</Link>
            <Link href="/biblioteca" className="hover:text-cyan-400 transition-colors">Biblioteca</Link>
          </div>
        </div>
      </footer>

      {/* Floating orb keyframes */}
      <style jsx global>{`
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 25px) scale(0.97); }
          66% { transform: translate(35px, -15px) scale(1.03); }
        }
        @keyframes floatOrb3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, -20px) scale(1.04); }
          66% { transform: translate(20px, 35px) scale(0.96); }
        }
      `}</style>
    </div>
  );
}
