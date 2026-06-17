'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Heart,
  TrendingDown,
  HeartHandshake,
  ShoppingCart,
  Lightbulb,
  Shield,
  Rocket,
  ChevronDown,
  Terminal,
} from 'lucide-react';

/* ─── Areas Data ─── */

interface AreaDetail {
  label: string;
  value: string;
}

interface AreaCard {
  id: string;
  icon: React.ElementType;
  title: string;
  shortDesc: string;
  details: AreaDetail[];
  description: string;
  gradient: string;
  borderColor: string;
}

const AREAS: AreaCard[] = [
  {
    id: 'ia-estudos',
    icon: GraduationCap,
    title: 'IA para Estudos',
    shortDesc: 'Aprenda mais rápido com agentes de estudo personalizados.',
    description:
      'Crie um tutor virtual que se adapta ao seu ritmo. Resumos automáticos, flashcards inteligentes, simulados com feedback e curadoria de conteúdo baseada no seu nível. Transforme horas de estudo em minutos de compreensão real.',
    details: [
      { label: 'aplicações', value: 'Resumos · Flashcards · Simulados · Curadoria' },
      { label: 'stack', value: 'Claude · GPT · RAG · Supabase' },
      { label: 'formato', value: 'Prompt Validado + Workflow' },
    ],
    gradient: 'from-blue-500/10 to-blue-500/5',
    borderColor: 'border-blue-500/20',
  },
  {
    id: 'saude-informativa',
    icon: Heart,
    title: 'Saúde Informativa',
    shortDesc: 'Informação confiável para decisões de saúde conscientes.',
    description:
      'Navegue pelo universo da saúde com um assistente que filtra ruído, organiza laudos, cruza sintomas com literatura médica revisada e traduz o "médiquês" para uma linguagem que você entende. Sem diagnósticos — só informação de qualidade.',
    details: [
      { label: 'aplicações', value: 'Análise de laudos · Glossário médico · Alertas' },
      { label: 'stack', value: 'RAG · PubMed API · NLP' },
      { label: 'formato', value: 'MiniApp + Prompt Validado' },
    ],
    gradient: 'from-rose-500/10 to-rose-500/5',
    borderColor: 'border-rose-500/20',
  },
  {
    id: 'economia',
    icon: TrendingDown,
    title: 'Economia',
    shortDesc: 'Controle financeiro pessoal com visão de sistemas.',
    description:
      'Um dashboard vivo dos seus gastos, receitas e investimentos. Classificação automática de despesas, projeções baseadas em padrões de consumo e alertas inteligentes antes do dinheiro acabar. Economia não é sobre cortar — é sobre enxergar.',
    details: [
      { label: 'aplicações', value: 'Dashboard · Projeções · Categorização · Alertas' },
      { label: 'stack', value: 'Python · Google Sheets · n8n' },
      { label: 'formato', value: 'MiniApp + Workflow' },
    ],
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    borderColor: 'border-emerald-500/20',
  },
  {
    id: 'relacionamentos',
    icon: HeartHandshake,
    title: 'Relacionamentos',
    shortDesc: 'Comunicação consciente apoiada por inteligência aumentada.',
    description:
      'Use IA como um espelho das suas interações. Análise de padrões de comunicação, sugestões para conversas difíceis, lembretes de datas importantes e um diário relacional que ajuda a enxergar o que passa despercebido no dia a dia.',
    details: [
      { label: 'aplicações', value: 'Análise de tom · Sugestões · Lembretes · Diário' },
      { label: 'stack', value: 'Claude · Whisper · Supabase' },
      { label: 'formato', value: 'Estudo de Caso + Prompt Validado' },
    ],
    gradient: 'from-violet-500/10 to-violet-500/5',
    borderColor: 'border-violet-500/20',
  },
  {
    id: 'compras-inteligentes',
    icon: ShoppingCart,
    title: 'Compras Inteligentes',
    shortDesc: 'Decisões de consumo baseadas em dados, não em impulso.',
    description:
      'Um comparador inteligente que vai além do preço: histórico de variação, reputação do vendedor, custo-benefício real e alertas quando o produto que você quer entra na faixa ideal. Compre com estratégia, não com ansiedade.',
    details: [
      { label: 'aplicações', value: 'Comparador · Histórico · Alertas · Score' },
      { label: 'stack', value: 'Web Scraping · n8n · Supabase' },
      { label: 'formato', value: 'Workflow + MiniApp' },
    ],
    gradient: 'from-amber-500/10 to-amber-500/5',
    borderColor: 'border-amber-500/20',
  },
  {
    id: 'criacao-de-projetos',
    icon: Lightbulb,
    title: 'Criação de Projetos',
    shortDesc: 'Estruture ideias em projetos executáveis com IA.',
    description:
      'Do brainstorm ao cronograma em minutos. Um agente que ajuda a validar sua ideia, quebrar em tarefas, estimar prazos, identificar riscos e gerar os primeiros artefatos. Ideal para quem tem 100 ideias por dia mas realiza poucas.',
    details: [
      { label: 'aplicações', value: 'Brainstorm · Roadmap · Riscos · Artefatos' },
      { label: 'stack', value: 'Claude · Mermaid · Notion API' },
      { label: 'formato', value: 'Prompt Validado + Workflow' },
    ],
    gradient: 'from-orange-500/10 to-orange-500/5',
    borderColor: 'border-orange-500/20',
  },
  {
    id: 'situacoes-dificeis',
    icon: Shield,
    title: 'Situações Difíceis',
    shortDesc: 'Suporte estratégico para momentos de alta pressão.',
    description:
      'Um conselheiro silencioso para os momentos em que cada palavra importa. Roteiros para conversas delicadas, análise de cenários, simulação de desfechos e um espaço seguro para ensaiar antes de agir. Não substitui terapia — complementa sua preparação.',
    details: [
      { label: 'aplicações', value: 'Roteiros · Simulações · Cenários · Preparação' },
      { label: 'stack', value: 'Claude · Prompt Engineering · RAG' },
      { label: 'formato', value: 'Prompt Validado + Estudo de Caso' },
    ],
    gradient: 'from-red-500/10 to-red-500/5',
    borderColor: 'border-red-500/20',
  },
  {
    id: 'aceleracao-resultados',
    icon: Rocket,
    title: 'Aceleração de Resultados',
    shortDesc: 'Sistemas que multiplicam sua produtividade real.',
    description:
      'O oposto de "mais dicas de produtividade". São sistemas completos que automatizam tarefas repetitivas, priorizam o que realmente move o ponteiro e geram relatórios de progresso semanais. Resultados mensuráveis, não a sensação de estar ocupado.',
    details: [
      { label: 'aplicações', value: 'Automação · Priorização · Relatórios · Métricas' },
      { label: 'stack', value: 'n8n · Supabase · Claude · Python' },
      { label: 'formato', value: 'MiniApp + Workflow + Prompt' },
    ],
    gradient: 'from-ios-accent/10 to-ios-accent/5',
    borderColor: 'border-ios-accent/20',
  },
];

/* ─── Expandable Area Card ─── */

function AreaCard({ area, index }: { area: AreaCard; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = area.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.19, 1, 0.22, 1],
      }}
      className="group"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full rounded-xl border bg-ios-surface text-left transition-all duration-300 ${area.borderColor} ${
          expanded
            ? 'shadow-[0_0_20px_rgba(61,245,197,0.06)]'
            : 'hover:border-ios-accent/20 hover:shadow-[0_0_16px_rgba(61,245,197,0.04)]'
        }`}
        aria-expanded={expanded}
      >
        {/* ── Card Header ── */}
        <div className="flex items-start gap-4 p-5">
          {/* Icon */}
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${area.gradient} ${area.borderColor} border`}>
            <Icon size={20} className="text-ios-accent" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-ios-text">
              {area.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ios-text-secondary line-clamp-2">
              {area.shortDesc}
            </p>
          </div>

          {/* Expand indicator */}
          <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ios-border transition-transform duration-300 ${
            expanded ? 'rotate-180 border-ios-accent/30 bg-ios-accent-dim' : ''
          }`}>
            <ChevronDown size={14} className="text-ios-muted transition-colors duration-300 group-hover:text-ios-accent" />
          </div>
        </div>

        {/* ── Expanded Details ── */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-ios-border/50 px-5 pb-5 pt-4">
                {/* Description */}
                <p className="text-sm leading-relaxed text-ios-text">
                  {area.description}
                </p>

                {/* Detail rows */}
                <div className="mt-4 space-y-2">
                  {area.details.map((d) => (
                    <div
                      key={d.label}
                      className="flex items-start gap-2 rounded-lg bg-ios-surface-2 px-3 py-2 font-mono text-[11px]"
                    >
                      <span className="shrink-0 font-semibold uppercase tracking-wider text-ios-accent">
                        {d.label}
                      </span>
                      <span className="text-ios-muted">:</span>
                      <span className="text-ios-text-secondary">
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}

/* ─── Component ─── */

export function Areas() {
  return (
    <section
      id="areas"
      className="relative border-t border-ios-border/40 py-24 sm:py-32"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(61,245,197,0.02),transparent)]" />

      <div className="container-ios relative">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="mb-4 flex items-center gap-3"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-ios-accent/20 bg-ios-accent-dim px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-widest text-ios-accent">
            <Terminal size={12} />
            áreas
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-ios-accent/20 to-transparent" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          className="heading-xl max-w-3xl"
        >
          Áreas de aplicação{' '}
          <span className="text-gradient-accent">prática</span>
        </motion.h2>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="mt-4 max-w-2xl text-base leading-relaxed text-ios-text-secondary"
        >
          Cada área é um sistema testado — clique para ver os detalhes
          técnicos, stack e formatos disponíveis. IA aplicada a problemas
          reais, não teoria.
        </motion.p>

        {/* Grid: 2 cols mobile, 3 cols tablet+, last row centered */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {AREAS.map((area, i) => (
            <AreaCard key={area.id} area={area} index={i} />
          ))}
        </div>

        {/* Terminal prompt hint */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.9, ease: [0.19, 1, 0.22, 1] }}
          className="mx-auto mt-10 flex max-w-lg items-center gap-2 rounded-lg border border-ios-border bg-ios-surface-2 px-4 py-2.5 font-mono text-[11px] text-ios-muted"
        >
          <Terminal size={13} className="text-ios-accent" />
          <span className="text-ios-accent">$</span>
          <span>./areas.sh --expand {AREAS.length} deployments</span>
          <span className="ml-auto inline-block h-2 w-2 rounded-full bg-ios-accent/40" />
        </motion.div>
      </div>
    </section>
  );
}

export default Areas;
