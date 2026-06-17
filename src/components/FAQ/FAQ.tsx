'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

/* ─── FAQ Items ─── */
const FAQS = [
  {
    q: 'O que é o Thiago Lab?',
    a: 'O Thiago Lab é um laboratório digital onde eu construo sistemas de IA, automações e produtos digitais de verdade — sem promessas vazias, sem curso genérico, sem guru. Cada projeto é documentado, testado e entregue com código aberto. É um portfólio vivo, um centro de conhecimento e um ponto de partida pra quem quer construir — não só consumir conteúdo.',
  },
  {
    q: 'Para quem é o Thiago Lab?',
    a: 'Para empreendedores, profissionais liberais, pequenos negócios e qualquer pessoa que queira usar IA e automação de forma prática pra resolver problemas reais. Não importa se você sabe programar ou não — o conteúdo é feito pra ser aplicável, com ou sem código. Se você está cansado de teoria e quer ver o que realmente funciona na prática, o Thiago Lab é pra você.',
  },
  {
    q: 'O Thiago Lab dá conselho médico ou financeiro?',
    a: 'Não. O Thiago Lab é um laboratório de tecnologia e automação. Nada do que é publicado aqui constitui conselho médico, financeiro, jurídico ou qualquer outra orientação profissional regulamentada. Sempre consulte um profissional qualificado para decisões nessas áreas. O foco aqui é exclusivamente técnico: construir sistemas, automatizar processos e criar produtos digitais.',
  },
  {
    q: 'Qual a diferença entre o Thiago Lab e o Rei das Vendas?',
    a: 'O Rei das Vendas é um projeto focado exclusivamente em vendas — estratégias, processos e automação comercial. O Thiago Lab é mais amplo: cobre IA, automação geral, desenvolvimento de produtos, miniapps, estudos de caso e muito mais. Enquanto o Rei das Vendas é um curso/venda específico, o Thiago Lab é um laboratório contínuo de construção — com planos gratuitos (Lab Lite) e premium (Lab Pro). Um complementa o outro, mas são projetos independentes com escopos diferentes.',
  },
];

/* ─── Accordion Item ─── */
function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof FAQS)[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-ios-border/40 last:border-b-0">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-0 py-5 text-left transition-colors duration-200 hover:text-ios-accent sm:py-6"
      >
        <span className="font-mono text-sm font-medium leading-snug text-ios-text sm:text-base">
          {faq.q}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-ios-muted transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-ios-accent' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="overflow-hidden"
          >
            <div className="pb-5 sm:pb-6">
              <p className="max-w-2xl text-sm leading-relaxed text-ios-text-secondary">
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Component ─── */
export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function handleToggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <section
      id="faq"
      className="relative border-t border-ios-border/40 py-24 sm:py-32"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_70%_50%,rgba(61,245,197,0.02),transparent)]" />

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
            <HelpCircle size={12} />
            faq
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
          Perguntas{' '}
          <span className="text-gradient-accent">frequentes</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="mt-4 max-w-2xl text-base leading-relaxed text-ios-text-secondary"
        >
          Dúvidas comuns sobre o Thiago Lab, o que entregamos e como
          funciona.
        </motion.p>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: 0.3,
            ease: [0.19, 1, 0.22, 1],
          }}
          className="mx-auto mt-12 max-w-3xl rounded-2xl border border-ios-border bg-ios-surface/60 px-6 sm:px-10"
        >
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default FAQ;
