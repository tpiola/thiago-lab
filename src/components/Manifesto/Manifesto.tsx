'use client';

import { motion } from 'framer-motion';
import {
  Quote,
  Zap,
  Thermometer,
  Shield,
  Users,
  Lightbulb,
} from 'lucide-react';

/* ─── Manifesto Principles ─── */
const PRINCIPLES = [
  {
    icon: Zap,
    title: 'Resultado > Discurso',
    text: 'Não entrego promessas bonitas. Entrego pipelines rodando, agentes funcionando e processos que cortam horas do seu dia. O código compila ou não compila — não tem meio-termo.',
  },
  {
    icon: Thermometer,
    title: 'Anti-Hype',
    text: 'Você não precisa de区块链 pra vender curso. Nem de IA generativa pra fazer planilha. Eu uso a ferramenta certa pro problema certo — mesmo que seja um script Python de 20 linhas.',
  },
  {
    icon: Shield,
    title: 'Propriedade Real',
    text: 'Nada de SaaS fechado que te prende. Tudo que eu construo é seu — código, pipeline, documentation. Se amanhã quiser levar pra outro lugar, leva. Zero lock-in.',
  },
  {
    icon: Users,
    title: 'Você no Controle',
    text: 'Automação não é pra te substituir. É pra te dar tempo pro que importa. Eu projeto sistemas que aumentam sua capacidade de decisão, não que decidem por você.',
  },
  {
    icon: Lightbulb,
    title: 'Simplicidade Radical',
    text: 'Se precisa de 10 microserviços pra fazer um CRUD, tem algo errado. Prefiro uma planilha bem feita a um dashboard bonito que ninguém usa. Complexidade é o último recurso.',
  },
];

/* ─── Highlight Pitch ─── */
function ManifestoPitch() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="relative overflow-hidden rounded-2xl border border-ios-accent/15 bg-gradient-to-br from-ios-surface-3/60 to-ios-surface/80 p-8 sm:p-12"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-ios-accent/5 blur-3xl" />

      <Quote size={28} className="mb-4 text-ios-accent/30" />

      <blockquote className="heading-md max-w-3xl font-medium leading-snug text-ios-text">
        &ldquo;Eu não vendo curso. Eu vendo{' '}
        <span className="text-gradient-accent">o que o curso deveria te ensinar a fazer</span>:
        construir.&rdquo;
      </blockquote>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px w-8 bg-ios-accent/40" />
        <span className="font-mono text-[11px] uppercase tracking-widest text-ios-muted">
          Thiago — Intelligence OS
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Component ─── */
export function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative border-t border-ios-border/40 py-24 sm:py-32"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_50%,rgba(61,245,197,0.02),transparent)]" />

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
            <Quote size={12} />
            manifesto
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
          O jeito{' '}
          <span className="text-gradient-accent">Thiago Lab</span> de
          construir.
        </motion.h2>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="mt-4 max-w-2xl text-base leading-relaxed text-ios-text-secondary"
        >
          Cansou de guru que nunca escreveu uma linha de código? De proposta
          de &quot;transformação digital&quot; que entrega só um PowerPoint?
          Pois é. Aqui é diferente.
        </motion.p>

        {/* Principles Grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + i * 0.08,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className="card-surface group flex flex-col gap-3 p-6"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ios-accent-dim transition-colors duration-300 group-hover:bg-ios-accent/20">
                  <Icon size={17} className="text-ios-accent" />
                </div>
                <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-ios-text">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-ios-text-secondary">
                  {p.text}
                </p>
              </motion.div>
            );
          })}

          {/* 6th slot — the highlight card spans the remaining space */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.5,
              delay: 0.15 + 5 * 0.08,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="card-surface col-span-1 flex flex-col items-start justify-center gap-2 border-l-2 border-l-ios-accent p-6 sm:col-span-2 lg:col-span-1"
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ios-accent">
              #buildDontTalk
            </span>
            <p className="text-sm leading-relaxed text-ios-text-secondary">
              Código &gt; PowerPoint. Entrega &gt; Promessa. Resultado &gt;
              Discurso. Simples assim.
            </p>
          </motion.div>
        </div>

        {/* Highlight Pitch */}
        <div className="mt-14">
          <ManifestoPitch />
        </div>
      </div>
    </section>
  );
}

export default Manifesto;
