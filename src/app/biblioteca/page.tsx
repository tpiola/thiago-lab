'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  FileText,
  BookOpen,
  Code,
  Sparkles,
  Terminal,
  Copy,
  Check,
  Tag,
  ArrowUpRight,
  ChevronDown,
  GraduationCap,
  Briefcase,
  Layers,
  PenTool,
} from 'lucide-react';

/* ─── Prompt Library Data ─── */
interface PromptItem {
  id: string;
  title: string;
  description: string;
  category: 'projetos' | 'templates' | 'skills' | 'apostilas';
  tags: string[];
  preview: string;
  content: string;
  source: string;
}

const PROMPTS: PromptItem[] = [
  // ── PROJETOS ──
  {
    id: 'rebuild-reidasvendas',
    title: 'Rebuild Completo — reidasvendas.com.br',
    category: 'projetos',
    description: 'Prompt de rebuild completo do site reidasvendas.com.br. Vite + React 18 + TypeScript + Tailwind CSS, do zero. Exclui conteúdo existente e recria tudo.',
    tags: ['Vite', 'React', 'TypeScript', 'Tailwind', 'Framer Motion'],
    preview: 'VOCÊ VAI REESCREVER COMPLETAMENTE O SITE reidasvendas.com.br do ZERO. Exclua TODO o conteúdo existente...',
    content: `# REBUILD COMPLETO — reidasvendas.com.br

## INSTRUÇÃO
VOCÊ VAI REESCREVER COMPLETAMENTE O SITE reidasvendas.com.br do ZERO.
Exclua TODO o conteúdo existente em apps/web/src/ e apps/web/public/ e recrie tudo.
Mantenha apenas: apps/web/package.json, apps/web/tailwind.config.js, apps/web/vite.config.ts, apps/web/tsconfig.json, apps/web/index.html, apps/web/postcss.config.js, apps/web/vercel.json, apps/web/api/ (lead.ts e chat.ts).

## STACK
- Vite + React 18 + TypeScript strict
- Tailwind CSS 3
- react-router-dom v7
- framer-motion
- react-hook-form + zod
- lucide-react

## MARCA REI DAS VENDAS
- Cores primárias: Azul #0057FF, Ouro #C9A84C, Fundo escuro #030305
- Fontes: Playfair Display (headings), Geist (texto corrido)
- Tom: profissional premium, conversão, sofisticado
- Nichos: Calçadista, Comércio, Indústria, Saúde, Educação, Serviços`,
    source: 'prompt-rebuild.md — reidasvendas',
  },
  {
    id: 'piola-build',
    title: 'Piola.BUILD — Plano de Agência IA',
    category: 'projetos',
    description: 'Plano de negócio completo para agência IA de Sites 3D Futuristas. Do Notion de Thiago Piola.',
    tags: ['Notion', 'Plano de Negócio', 'Agência IA', '3D'],
    preview: 'PROJETO PIOLA.BUILD — Agência IA de Sites 3D Futuristas. Estrutura completa de serviços, pricing e operação...',
    content: `# PIOLA.BUILD — Plano de Agência IA

## Visão Geral
Agência especializada em sites 3D futuristas com inteligência artificial integrada.

## Serviços
1. Sites 3D imersivos (Three.js / Spline)
2. Agentes de IA customizados
3. Automação de marketing e vendas
4. Consultoria em transformação digital

## Stack Principal
- Next.js + Three.js + Framer Motion
- Agentes Claude Code / Codex
- n8n para automação
- Supabase + Vercel

## Modelo de Negócio
- Assinatura mensal (manutenção + IA)
- Projetos avulsos (escopo fechado)
- Revenue share em resultados`,
    source: 'Notion — PROJETO PIOLA.BUILD',
  },
  {
    id: 'estudio-piola',
    title: 'Estúdio Piola — Workspace',
    category: 'projetos',
    description: 'Estrutura do Estúdio Piola: workspace criativo com produtos, clientes e marketing integrados.',
    tags: ['Workspace', 'Produtos', 'Marketing', 'Clientes'],
    preview: 'Estúdio Piola — Hub criativo e operacional para gestão de projetos, produtos digitais e campanhas...',
    content: `# ESTÚDIO PIOLA — Workspace

## Áreas de Atuação
- Desenvolvimento Web (Next.js, React, Three.js)
- Automação com IA (n8n, Make, agentes)
- Marketing Digital
- Produtos Digitais

## Pipeline Operacional
1. Prospecção → Lead → Proposta
2. Onboarding → Diagnóstico → Arquitetura
3. Desenvolvimento → Testes → Deploy
4. Suporte → Otimização → Crescimento`,
    source: 'Notion — Estúdio Piola',
  },

  // ── TEMPLATES ──
  {
    id: 'pharma-linkedin',
    title: 'LinkedIn — Representante Farmacêutico',
    category: 'templates',
    description: 'Template de posicionamento LinkedIn para Representante Farmacêutico. Prompt validado para perfil profissional na indústria farmacêutica.',
    tags: ['LinkedIn', 'Farma', 'Personal Branding', 'Perfil'],
    preview: 'Template de posicionamento profissional para LinkedIn — indústria farmacêutica. Otimizado para E-E-A-T e recrutadores...',
    content: `# TEMPLATE LINKEDIN — Representante Farmacêutico

## Seu Título (Headline)
[Seu Nome] | Representante Farmacêutico na [Empresa] | Especialista em [Área] | Apaixonado por [Tema]

## Sobre (About)
Sou Representante Técnico de Vendas na [Empresa] há [X] anos, atendendo as regiões de [Regiões].
Minha missão é levar soluções que transformam a prática médica e melhoram a qualidade de vida dos pacientes.

### Minha abordagem:
📍 Relacionamento baseado em ciência e confiança
📍 Educação médica continuada
📍 Parceria estratégica com consultórios

### Áreas de expertise:
▸ [Especialidade 1]
▸ [Especialidade 2]
▸ [Especialidade 3]

📞 Vamos conversar? [Seu WhatsApp]`,
    source: 'profile-pharma-industry-rep-prompt.md',
  },
  {
    id: 'gem-arquiteto',
    title: '★ GEM — Arquiteto Digital Estratégico',
    category: 'templates',
    description: 'Prompt formal do Notion Clarity OS Pro. Pipeline completo de projeto digital: diagnóstico, arquitetura, execução e otimização.',
    tags: ['GEM', 'Arquiteto Digital', 'Clarity OS', 'Pipeline'],
    preview: 'Você é o Arquiteto Digital Estratégico. Seu papel é projetar a arquitetura completa de soluções digitais...',
    content: `# GEM — ARQUITETO DIGITAL ESTRATÉGICO

## Identidade
Você é o Arquiteto Digital Estratégico — responsável por projetar a arquitetura completa de soluções digitais desde o diagnóstico até a entrega.

## Metodologia
1. DIAGNÓSTICO — Mapear estado atual, dores, oportunidades
2. ARQUITETURA — Desenhar solução técnica e de negócio
3. EXECUÇÃO — Implementar com métricas e entregáveis
4. OTIMIZAÇÃO — Medir, ajustar, escalar

## Entregáveis
- Documento de Arquitetura
- Roadmap Técnico
- Estimativas de Esforço
- Plano de Riscos`,
    source: 'Notion — Clarity OS Pro / GEM',
  },
  {
    id: 'thiago-os',
    title: 'Thiago OS — LifeOS / GTD',
    category: 'templates',
    description: 'Sistema pessoal de produtividade e GTD de Thiago Piola. LifeOS integrado com Notion, calendário e automações.',
    tags: ['GTD', 'Produtividade', 'LifeOS', 'Sistema'],
    preview: 'Thiago OS — Sistema operacional pessoal baseado em GTD. Integra CRM, financeiro, projetos e biblioteca...',
    content: `# THIAGO OS — LifeOS / GTD

## Pilares
1. CRM — Pipeline de leads e clientes
2. Financeiro — Fluxo de caixa e metas
3. Projetos — Roadmap e entregas
4. Biblioteca — Conhecimento organizado

## Comando Diário
- Manhã: Revisão de prioridades
- Tarde: Execução focada
- Noite: Registro e ajustes

## Integrações
- Notion (base central)
- n8n (automações)
- Telegram Bot (captura rápida)
- Google Calendar (agenda)`,
    source: 'Notion — Thiago OS',
  },

  // ── SKILLS ──
  {
    id: 'clarity-os-pro',
    title: 'Clarity OS Pro — 13 Skills + GEM',
    category: 'skills',
    description: 'Skill Pack completo do Notion com 13 habilidades de IA + GEM (Arquiteto Digital Estratégico). Dashboard integrado.',
    tags: ['Clarity OS', 'Skills', 'GEM', 'Dashboard'],
    preview: 'Clarity OS Pro — Notion AI Skill Pack. 13 skills especializadas + Arquiteto Digital Estratégico...',
    content: `# CLARITY OS PRO — NOTION AI SKILL PACK

## Skills Inclusas
1. Arquiteto Digital Estratégico (GEM)
2. Analista de Dados
3. Estrategista de Marketing
4. Copywriter de Alta Conversão
5. Engenheiro de Prompts
6. Designer de Experiência
7. Gestor de Projetos
8. Analista Financeiro
9. Especialista em SEO
10. Consultor de Vendas
11. Automatizador de Processos
12. Curador de Conteúdo
13. Mentor de Carreira

## Comando Diário Integrado
- CRM: Gestão de leads e clientes
- Financeiro: Fluxo de caixa
- Projetos: Roadmap
- Biblioteca: Conhecimento`,
    source: 'Notion — Clarity OS Pro',
  },
  {
    id: 'prompts-prontos',
    title: 'Prompts Prontos — 13 System Prompts',
    category: 'skills',
    description: '13 system prompts copiáveis do INEMA.CLUB. Prontos para usar em Claude, GPT, Gemini e outros LLMs.',
    tags: ['System Prompt', 'INEMA', 'Claude', 'GPT'],
    preview: '13 system prompts profissionais para copiar e usar. Cobre: agente, escritor, analista, programador, estrategista...',
    content: `# PROMPTS PRONTOS — 13 System Prompts

## Categorias
1. Agente Executor — Executa tarefas com ferramentas
2. Escritor Criativo — Gera conteúdo original
3. Analista de Dados — Interpreta e visualiza dados
4. Programador Sênior — Código limpo e arquitetura
5. Estrategista de Negócio — Planejamento estratégico
6. Copywriter — Textos de alta conversão
7. Tutor — Ensino adaptativo
8. Tradutor — Tradução contextual
9. Revisor — Revisão técnica e gramatical
10. Pesquisador — Análise profunda de tópicos
11. Designer de Prompts — Cria e otimiza prompts
12. Consultor de Carreira — Orientação profissional
13. Debugger — Correção de código e lógica`,
    source: 'github.com/inematds/prompts-prontos',
  },
  {
    id: 'skills-craft',
    title: 'Skills Craft — Dataset 39k Skills',
    category: 'skills',
    description: 'Curso data-driven sobre Agent Skills com dataset de 39 mil skills do skills.sh. Formato INEMA.CLUB.',
    tags: ['Skills', 'Dataset', 'Data-driven', '39k'],
    preview: 'Curso completo sobre criação e otimização de agent skills. Dataset massivo de 39k skills para análise...',
    content: `# SKILLS CRAFT — Curso Data-Driven

## Conteúdo
1. Fundamentos de Agent Skills
2. Anatomia de uma Skill
3. Dataset de 39k skills (skills.sh)
4. Padrões e categorias
5. Criação de skills customizadas
6. Otimização e testes

## Dataset
- 39,000+ skills analisadas
- Categorias: code, creative, research, analysis
- Padrões identificados: instrução, contexto, exemplo
- Métricas de performance`,
    source: 'github.com/inematds/skills-craft',
  },

  // ── APOSTILAS ──
  {
    id: 'fep-modulos',
    title: 'FEP — 8 Módulos de Prompt Engineering',
    category: 'apostilas',
    description: 'Formação Engenharia de Prompt. 8 módulos completos: system prompts, few-shot, chain-of-thought, RAG e muito mais.',
    tags: ['Prompt Engineering', 'FEP', '8 Módulos', 'System Prompt'],
    preview: 'FEP — Formação Engenharia de Prompt. Módulo 1: Fundamentos. Módulo 2: System Prompts. Módulo 3: Few-Shot...',
    content: `# FEP — FORMAÇÃO ENGENHARIA DE PROMPT

## Módulos
1. **Fundamentos** — O que é prompt engineering, anatomia de um prompt
2. **System Prompts** — Criação de system prompts eficazes
3. **Few-Shot** — Exemplos contextuais e in-context learning
4. **Chain-of-Thought** — Raciocínio passo a passo
5. **RAG** — Retrieval Augmented Generation na prática
6. **Tool Use** — Uso de ferramentas por LLMs
7. **Multi-Turn** — Gerenciamento de conversas longas
8. **Avaliação** — Métricas e testes de prompt

## Certificação INEMA
- Projeto final: sistema prompt completo
- Avaliação automatizada
- Certificado de conclusão`,
    source: 'github.com/inematds/FEP',
  },
  {
    id: 'fea-ia-agentes',
    title: 'FEA-IA — Engenharia de Agentes IA',
    category: 'apostilas',
    description: 'Formação de Engenheiros de Agentes de Inteligência Artificial. Arquitetura de agentes, loops autônomos e sistemas multiagentes.',
    tags: ['Agentes', 'FEA-IA', 'Arquitetura', 'Multiagentes'],
    preview: 'FEA-IA — Formação completa de engenharia de agentes. De loops básicos a sistemas multiagentes em produção...',
    content: `# FEA-IA — ENGENHARIA DE AGENTES IA

## Módulos
1. **Fundamentos de Agentes** — O que é um agente, ciclo perceive-think-act
2. **Arquitetura** — Componentes de um agente (tools, memory, planning)
3. **Ferramentas** — Criação e integração de tools
4. **Memória** — Memória curta, longa e episódica
5. **Planejamento** — Chain-of-thought, ReAct, Tree-of-Thought
6. **Multiagentes** — Orquestração, comunicação, delegação
7. **Produção** — Deploy, monitoramento, logging
8. **Segurança** — Alinhamento, jailbreaks, guardrails`,
    source: 'github.com/inematds/FEA-IA',
  },
  {
    id: 'system-prompts-leaks',
    title: 'System Prompts Leaks — Curso + Dataset',
    category: 'apostilas',
    description: 'System prompts reais de Claude, GPT, Gemini, Cursor + curso Padrões de System Prompts (INEMA.CLUB).',
    tags: ['System Prompts', 'Leaks', 'Análise', 'Padrões'],
    preview: 'Coleção de system prompts reais vazados dos principais modelos. Curso de análise e criação de padrões...',
    content: `# SYSTEM PROMPTS LEAKS — Análise e Padrões

## Dataset
System prompts reais de:
- Claude (Anthropic)
- GPT (OpenAI)
- Gemini (Google)
- Cursor (Code editor AI)
- Copilot (Microsoft)

## Curso: Padrões de System Prompts
1. Estrutura comum
2. Técnicas de restrição
3. Formatação e estilo
4. Segurança e alinhamento
5. Personalização

## Aplicações
- Criar seus próprios system prompts
- Entender limitações
- Otimizar para cada modelo`,
    source: 'github.com/inematds/system_prompts_leaks',
  },
  {
    id: 'imagens-reidasvendas',
    title: '21 Prompts de Imagens — reidasvendas',
    category: 'apostilas',
    description: '21 prompts de geração de imagens para o site reidasvendas.com.br. Cobre thumbnails, covers e hero slides.',
    tags: ['Imagens', 'DALL-E', 'Midjourney', 'Design'],
    preview: 'Sessão completa de geração de imagens: 4 project thumbnails (1536x1024), 9 niche covers (1024x1024)...',
    content: `# SESSION: reidasvendas.com.br Image Generation

## Project Thumbnails (1536×1024)
| Nome | Descrição |
|------|-----------|
| project-clube-digital | Luxurious modern aesthetic clinic reception area |
| project-advocacia-soberana | Sophisticated law office, mahogany desk, brass lamp |
| project-vitrine-imobiliaria | Modern luxury living room, ocean view, marble |
| project-maquina-varejo | Modern boutique retail, warm lighting, plants |

## Niche Covers (1024×1024)
estetica, odontologia, personal, restaurante, varejo, imobiliaria, advocacia, educacao, servicos

## Hero Slides (1536×1024)
3 slides: business growth concept, digital marketing, professional team

## Stock Photos (1024×1024)
5 fotos: business meeting, customer service, digital strategy, sales growth, professional team`,
    source: 'session-2026-06-12-reidasvendas-prompts.md',
  },
];

/* ─── Category Config ─── */
const CATEGORIES = [
  { key: 'projetos', label: 'Projetos', icon: Briefcase, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { key: 'templates', label: 'Templates', icon: PenTool, color: 'text-ios-accent bg-ios-accent-dim border-ios-accent/20' },
  { key: 'skills', label: 'Skills', icon: Layers, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { key: 'apostilas', label: 'Apostilas', icon: GraduationCap, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
];

/* ─── Card Component ─── */
function PromptCard({ item, index }: { item: PromptItem; index: number }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORIES.find((c) => c.key === item.category)!;

  const copyContent = async () => {
    await navigator.clipboard.writeText(item.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.19, 1, 0.22, 1] }}
      className="card-surface group flex flex-col overflow-hidden transition-all duration-300 hover:border-ios-accent/30"
    >
      {/* Card Top */}
      <div className="p-5 pb-3">
        {/* Category + Copy */}
        <div className="flex items-start justify-between gap-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${cat.color}`}>
            <cat.icon size={10} />
            {cat.label}
          </span>
          <button
            onClick={copyContent}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-ios-border bg-ios-surface-2 text-ios-muted opacity-0 transition-all hover:border-ios-accent/30 hover:text-ios-accent group-hover:opacity-100"
            title="Copiar prompt"
          >
            {copied ? <Check size={12} className="text-ios-accent" /> : <Copy size={12} />}
          </button>
        </div>

        {/* Title */}
        <h3 className="mt-3 font-mono text-sm font-bold text-ios-text">{item.title}</h3>

        {/* Description */}
        <p className="mt-1.5 text-sm leading-relaxed text-ios-text-secondary">{item.description}</p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-md border border-ios-border bg-ios-surface-2 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-ios-muted">
              <Tag size={8} />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Preview / Content */}
      <div className="border-t border-ios-border/30 px-5 py-3">
        <div className="code-block max-h-32 overflow-hidden text-[11px] leading-relaxed text-ios-text-secondary">
          <pre className="whitespace-pre-wrap">{expanded ? item.content : item.preview}</pre>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex items-center gap-1 font-mono text-[10px] text-ios-accent transition-colors hover:brightness-110"
        >
          <ChevronDown size={10} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          {expanded ? 'Mostrar menos' : 'Mostrar completo'}
        </button>
      </div>

      {/* Source */}
      <div className="mt-auto border-t border-ios-border/30 px-5 py-2.5">
        <span className="font-mono text-[9px] text-ios-muted">{item.source}</span>
      </div>
    </motion.article>
  );
}

/* ─── Page Component ─── */
export default function BibliotecaPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('todos');

  const filtered = useMemo(() => {
    return PROMPTS.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = category === 'todos' || p.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  return (
    <main className="min-h-screen bg-ios-base">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-ios-border/40 pt-28 pb-16 sm:pt-36 sm:pb-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_30%,rgba(61,245,197,0.04),transparent)]" />
        <div className="container-ios relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-ios-accent/20 bg-ios-accent-dim px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-widest text-ios-accent">
              <Terminal size={12} />
              biblioteca
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-ios-accent/20 to-transparent" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
            className="heading-xl max-w-3xl"
          >
            Biblioteca de{' '}
            <span className="text-gradient-accent">Prompts e Materiais</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="mt-4 max-w-2xl text-base leading-relaxed text-ios-text-secondary"
          >
            Prompts validados, templates profissionais, skills de IA e apostilas completas
            — tudo organizado e pronto para usar. Material dos repositórios INEMA,
            Notion e arquivos locais de Thiago Piola.
          </motion.p>
        </div>
      </section>

      {/* ── Search + Filter ── */}
      <section className="container-ios py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ios-muted" />
            <input
              type="text"
              placeholder="Buscar prompts, skills, templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-ios-border bg-ios-surface py-2.5 pl-10 pr-4 font-mono text-sm text-ios-text placeholder:text-ios-muted/60 transition-colors focus:border-ios-accent/40 focus:outline-none focus:ring-1 focus:ring-ios-accent/20"
            />
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setCategory('todos')}
              className={`rounded-lg px-3 py-2 font-mono text-[10px] font-medium uppercase tracking-wider transition-all ${
                category === 'todos'
                  ? 'bg-ios-accent text-ios-base shadow-ios-glow-sm'
                  : 'border border-ios-border bg-ios-surface text-ios-muted hover:border-ios-accent/30 hover:text-ios-text'
              }`}
            >
              Todos
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`rounded-lg px-3 py-2 font-mono text-[10px] font-medium uppercase tracking-wider transition-all ${
                  category === cat.key
                    ? 'bg-ios-accent text-ios-base shadow-ios-glow-sm'
                    : 'border border-ios-border bg-ios-surface text-ios-muted hover:border-ios-accent/30 hover:text-ios-text'
                }`}
              >
                <cat.icon size={10} className="inline-block mr-1" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="container-ios pb-24 sm:pb-32">
        <div className="grid gap-5 sm:grid-cols-2">
          {filtered.map((item, i) => (
            <PromptCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16 flex flex-col items-center gap-4 text-center"
          >
            <FileText size={32} className="text-ios-muted" />
            <p className="font-mono text-sm text-ios-muted">Nenhum material encontrado</p>
            <button
              onClick={() => { setSearch(''); setCategory('todos'); }}
              className="btn-outline text-xs"
            >
              Limpar filtros
            </button>
          </motion.div>
        )}

        {/* Terminal status */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="mx-auto mt-10 flex max-w-lg items-center gap-2 rounded-lg border border-ios-border bg-ios-surface-2 px-4 py-2.5 font-mono text-[11px] text-ios-muted"
        >
          <Terminal size={13} className="text-ios-accent" />
          <span className="text-ios-accent">$</span>
          <span>find ./biblioteca -type f | wc -l</span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ios-accent/60" />
            <span className="text-ios-accent/80">{filtered.length} materiais</span>
          </span>
        </motion.div>
      </section>
    </main>
  );
}
