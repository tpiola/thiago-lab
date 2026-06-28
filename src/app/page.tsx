"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Brain, BarChart3, Users, Bot, Workflow, Shield, ArrowRight,
  Activity, Cpu, Rocket, Check, Menu, X, TrendingUp, Target,
  DollarSign, Layers, Eye, MessageCircle, Sparkles, Lock,
  Zap, Globe, ChartLine, Clock, ChevronRight,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   PALETA — SPRINT AI STYLE — HIGHLIGHT CYAN/TEAL
   ═══════════════════════════════════════════════════════════════ */
const G = {
  primary: "#00C9A7",
  secondary: "#3DF5C5",
  dark: "#00A88C",
  glow: "rgba(0, 201, 167, 0.12)",
  glowMd: "rgba(0, 201, 167, 0.25)",
  bg: "#030303",
  surface: "rgba(255,255,255,0.03)",
  glass: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.08)",
};

const easeOut = [0.16, 1, 0.3, 1] as const;

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SCORE DISPLAY — estilo Sprint AI
   ═══════════════════════════════════════════════════════════════ */
function ScoreDisplay({ label, value, max = 100, suffix = "", color = G.primary }: {
  label: string; value: number; max?: number; suffix?: string; color?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(value / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, value]);

  const pct = (count / max) * 100;
  const dash = 2 * Math.PI * 40;
  const offset = dash - (pct / 100) * dash;

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <svg width="96" height="96" viewBox="0 0 100 100" className="drop-shadow-[0_0_20px_rgba(0,201,167,0.15)]">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={dash} strokeDashoffset={inView ? offset : dash}
          transform="rotate(-90 50 50)" style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
        />
        <text x="50" y="52" textAnchor="middle" dominantBaseline="middle"
          fill="white" fontSize="22" fontWeight="700" fontFamily="Plus Jakarta Sans">
          {count}{suffix}
        </text>
      </svg>
      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STICKY NAV
   ═══════════════════════════════════════════════════════════════ */
function Nav() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(3,3,3,0)", "rgba(3,3,3,0.95)"]);
  const border = useTransform(scrollY, [0, 80], ["rgba(255,255,255,0)", "rgba(255,255,255,0.06)"]);

  return (
    <motion.nav style={{ backgroundColor: bg, borderBottomColor: border }}
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00C9A7]/10">
            <Brain size={18} className="text-[#00C9A7]" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">Thiago Lab</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {[
            { label: "Plataforma", href: "#plataforma" },
            { label: "Dashboard", href: "#dashboard" },
            { label: "Processo", href: "#processo" },
            { label: "FAQ", href: "#faq" },
          ].map((item) => (
            <Link key={item.label} href={item.href}
              className="rounded-lg px-4 py-2 text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/login"
            className="ml-4 inline-flex items-center gap-2 rounded-full bg-[#00C9A7] px-5 py-2 text-sm font-bold text-black transition-all hover:bg-[#3DF5C5]"
          >
            Acessar <ArrowRight size={14} />
          </Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-[#030303] px-6 py-4 md:hidden">
          {["Plataforma", "Dashboard", "Processo", "FAQ"].map((item) => (
            <Link key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)}
              className="block py-3 text-sm text-white/60"
            >
              {item}
            </Link>
          ))}
          <Link href="/login" className="mt-3 block rounded-full bg-[#00C9A7] px-5 py-2.5 text-center text-sm font-bold text-black">
            Acessar
          </Link>
        </div>
      )}
    </motion.nav>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#030303] font-sans text-white">
      <Nav />

      {/* ═══════ HERO — SPRINT AI + UNICORN STUDIO ═══════ */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#050B08] to-[#030303]" />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle at 30% 40%, #00C9A7 0%, transparent 50%), radial-gradient(circle at 70% 60%, #00C9A7 0%, transparent 40%)" }}
          />
          <div className="absolute inset-0 opacity-[0.015]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: easeOut }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#00C9A7]/20 bg-[#00C9A7]/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#00C9A7]">
              <Sparkles size={12} /> Intelligence OS — v3.0
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.15, ease: easeOut }}
            className="mt-8 max-w-4xl font-display text-[clamp(2.8rem,7vw,5.5rem)] font-black leading-[0.9] tracking-tighter"
          >
            <span className="block">Sistema de Inteligência</span>
            <span className="block bg-gradient-to-r from-[#00C9A7] to-[#3DF5C5] bg-clip-text text-transparent">
              Operacional
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/40"
          >
            Dados centralizados, insights acionáveis e automação inteligente para sua operação. Deixe de apagar incêndio — comece a decidir com clareza.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link href="/login"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#00C9A7] px-8 py-4 text-sm font-bold text-black transition-all hover:bg-[#3DF5C5] hover:shadow-[0_0_30px_rgba(0,201,167,0.3)]"
            >
              Iniciar Diagnóstico <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="#plataforma"
              className="inline-flex items-center rounded-full border border-white/15 px-8 py-4 text-sm font-bold text-white/50 transition-all hover:border-white/30 hover:text-white"
            >
              Ver Plataforma
            </Link>
          </motion.div>

          {/* Score preview — Sprint AI style */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-16 grid grid-cols-2 gap-4 border-t border-white/[0.04] pt-10 md:grid-cols-4"
          >
            {[
              { label: "Eficiência", value: 94, suffix: "%" },
              { label: "Automação", value: 87, suffix: "%" },
              { label: "Cobertura", value: 100, suffix: "%" },
              { label: "Uptime", value: 99.9, suffix: "%" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-black text-white">{s.value}{s.suffix}</p>
                <p className="text-xs text-white/30">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ SEÇÃO DE PROBLEMA ═══════ */}
      <Section className="border-t border-white/[0.04] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#00C9A7]">O Problema</span>
            <h2 className="mt-4 font-display text-3xl font-black leading-tight md:text-5xl">
              Você toma decisões<br />
              <span className="text-[#00C9A7]">no escuro?</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/40">
              Dados espalhados em planilhas, indicadores sem contexto, alertas que nunca chegam. 
              Sua operação funciona no reativo — e isso custa caro.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              { icon: <Activity size={20} />, title: "Sem Visibilidade", desc: "Você não sabe o que está funcionando até perder resultado." },
              { icon: <BarChart3 size={20} />, title: "Dados Parados", desc: "Coleta informação mas não transforma em decisão rápida." },
              { icon: <Zap size={20} />, title: "Operação Reativa", desc: "Corrige problema em vez de antecipar ele." },
            ].map((item) => (
              <div key={item.title} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all hover:border-[#00C9A7]/20 hover:bg-[#00C9A7]/[0.02]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00C9A7]/10 text-[#00C9A7]">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════ DASHBOARD / SCORE SECTION — SPRINT AI ═══════ */}
      <Section id="dashboard" className="border-t border-white/[0.04] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#00C9A7]">Score ao Vivo</span>
              <h2 className="mt-4 font-display text-3xl font-black leading-tight md:text-5xl">
                Onde sua operação<br />
                <span className="text-[#00C9A7]">realmente está</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/40">
                Cada score mede um eixo crítico. Cada número tem contexto, tendência e recomendação. 
                Você não precisa adivinhar — precisa agir.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { label: "Score de Performance", value: "A+", color: "#00C9A7" },
                  { label: "Risco Operacional", value: "Baixo", color: "#3DF5C5" },
                  { label: "Potencial de Conversão", value: "84%", color: "#00C9A7" },
                  { label: "Próxima Ação", value: "Automatizar relatório semanal", color: "rgba(255,255,255,0.4)" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                    <span className="text-sm text-white/50">{item.label}</span>
                    <span className="text-sm font-bold text-white" style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <ScoreDisplay label="Performance" value={94} suffix="%" />
              <ScoreDisplay label="Automação" value={87} suffix="%" />
              <ScoreDisplay label="Eficiência" value={92} suffix="%" />
              <ScoreDisplay label="Cobertura" value={78} suffix="%" />
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ MECANISMO ÚNICO ═══════ */}
      <Section id="plataforma" className="border-t border-white/[0.04] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#00C9A7]">Mecanismo</span>
            <h2 className="mt-4 font-display text-3xl font-black leading-tight md:text-5xl">
              Dados → Score → <span className="text-[#00C9A7]">Ação</span>
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {[
              { icon: <Layers size={22} />, title: "Coleta", desc: "Conecte suas fontes: planilhas, APIs, sensores, ferramentas." },
              { icon: <Brain size={22} />, title: "Interpretação", desc: "IA analisa padrões, correlações e anomalias em tempo real." },
              { icon: <Target size={22} />, title: "Score", desc: "Cada métrica vira indicador claro com tendência e alerta." },
              { icon: <Rocket size={22} />, title: "Ação", desc: "Recomendação inteligente + automação do próximo passo." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center transition-all hover:border-[#00C9A7]/20">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#00C9A7]/10 text-[#00C9A7]">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-white/40">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════ BENEFÍCIOS POR PAPEL ═══════ */}
      <Section className="border-t border-white/[0.04] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-black leading-tight md:text-5xl">
              Para cada <span className="text-[#00C9A7]">decisor</span>
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: <Users size={22} />, role: "Gestor", items: ["Visão consolidada da operação", "Alertas antes do problema", "Relatórios automáticos"] },
              { icon: <Bot size={22} />, role: "Analista", items: ["Automação de tarefas repetitivas", "Pipeline de dados limpa", "Insights com IA"] },
              { icon: <Eye size={22} />, role: "Cliente", items: ["Transparência em tempo real", "Dashboard dedicado", "Indicadores de resultado"] },
            ].map((item) => (
              <div key={item.role} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00C9A7]/10 text-[#00C9A7]">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{item.role}</h3>
                <ul className="mt-4 space-y-3">
                  {item.items.map((i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                      <Check size={14} className="mt-0.5 shrink-0 text-[#00C9A7]" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════ PROCESSO ═══════ */}
      <Section id="processo" className="border-t border-white/[0.04] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#00C9A7]">Processo</span>
            <h2 className="mt-4 font-display text-3xl font-black leading-tight md:text-5xl">
              Em 4 semanas você <span className="text-[#00C9A7]">decide melhor</span>
            </h2>
          </div>
          <div className="mt-14 space-y-4">
            {[
              { step: "01", title: "Diagnóstico", desc: "Mapeamos suas fontes de dados, processos críticos e gaps de informação." },
              { step: "02", title: "Arquitetura", desc: "Desenhamos o pipeline: coleta → normalização → análise → score → ação." },
              { step: "03", title: "Ativação", desc: "Conectamos ferramentas, configuramos alertas e treinamos o time." },
              { step: "04", title: "Operação", desc: "Acompanhamento contínuo. Seus indicadores evoluindo em tempo real." },
            ].map((item, i) => (
              <div key={item.step} className="group flex items-start gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-[#00C9A7]/20 md:p-8">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#00C9A7]/10 font-display text-xl font-black text-[#00C9A7]">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/40">{item.desc}</p>
                </div>
                <div className="hidden shrink-0 items-center gap-2 text-sm font-bold text-[#00C9A7] md:flex">
                  {i < 3 && <><span className="text-white/20">→</span></>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════ FAQ ═══════ */}
      <Section id="faq" className="border-t border-white/[0.04] py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 md:px-12">
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-black leading-tight md:text-5xl">
              Dúvidas <span className="text-[#00C9A7]">comuns</span>
            </h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "Preciso ter infraestrutura própria?", a: "Não. Trabalhamos 100% em nuvem. Você acessa pelo navegador." },
              { q: "Quanto tempo leva para implementar?", a: "O ciclo completo de implantação leva de 2 a 4 semanas, dependendo da complexidade." },
              { q: "Funciona para meu segmento?", a: "A arquitetura é adaptável — já operamos em saúde, educação, comércio e serviços." },
              { q: "E se eu já tiver ferramentas?", a: "Integramos com suas ferramentas atuais via API. Não precisa trocar tudo." },
            ].map((item) => (
              <details key={item.q} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all hover:border-white/[0.1]">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-bold text-white">
                  {item.q}
                  <ChevronRight size={16} className="shrink-0 text-white/30 transition-transform group-open:rotate-90" />
                </summary>
                <div className="border-t border-white/[0.04] px-6 py-4 text-sm leading-relaxed text-white/40">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════ CTA FINAL ═══════ */}
      <Section className="border-t border-white/[0.04] py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-12">
          <h2 className="font-display text-3xl font-black leading-tight md:text-5xl">
            Pronto para sair do escuro?
          </h2>
          <p className="mt-4 mx-auto max-w-md text-base text-white/40">
            Diagnóstico gratuito. Sem compromisso. Em 30 minutos você entende onde sua operação pode melhorar.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/login"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#00C9A7] px-8 py-4 text-sm font-bold text-black transition-all hover:bg-[#3DF5C5] hover:shadow-[0_0_30px_rgba(0,201,167,0.3)]"
            >
              Quero Meu Diagnóstico <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-white/[0.04] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row md:px-12">
          <div className="flex items-center gap-2 text-sm text-white/30">
            <Brain size={14} className="text-[#00C9A7]" />
            Thiago Lab — Intelligence OS
          </div>
          <div className="flex gap-6 text-xs text-white/20">
            <Link href="/sobre">Sobre</Link>
            <Link href="/privacidade">Privacidade</Link>
            <Link href="/termos">Termos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
