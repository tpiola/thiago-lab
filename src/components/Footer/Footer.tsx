'use client';

import { motion } from 'framer-motion';
import {
  Terminal,
  Heart,
  ArrowUp,
  Scale,
} from 'lucide-react';

/* ─── Legal Links ─── */
const LEGAL_LINKS = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/docs' },
  { label: 'Privacidade', href: '/privacidade' },
  { label: 'Termos', href: '/termos' },
  { label: 'llms.txt', href: '/llms.txt' },
  { label: 'Contato', href: 'mailto:oi@thiagolabs.com' },
];

/* ─── Component ─── */
export function Footer() {
  const year = new Date().getFullYear();

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer
      id="footer"
      className="relative border-t border-ios-border/40"
    >
      {/* ── Top Gradient Bar ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-ios-accent/20 to-transparent" />

      <div className="container-ios py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* ── Brand Column ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="sm:col-span-2 lg:col-span-2"
          >
            <div className="flex items-center gap-2.5">
              <Terminal size={20} className="text-ios-accent" />
              <span className="font-mono text-sm font-bold tracking-tight text-ios-text">
                ThiagoLabs
              </span>
              <span className="font-mono text-[10px] text-ios-accent">~$</span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ios-text-secondary">
              Intelligence OS — IA, automação e produtos digitais para negócios
              locais e operações de alta performance. Código real, conversão
              real, zero hype.
            </p>

            {/* CRF/SP credit */}
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-ios-border/50 bg-ios-surface-2/50 px-3 py-2">
              <Scale size={13} className="mt-0.5 shrink-0 text-ios-muted" />
              <p className="font-mono text-[10px] leading-relaxed text-ios-muted">
                CRF/SP — Responsável Técnico: Thiago Piola. As informações
                disponíveis neste site têm caráter informativo e não
                substituem a consulta a profissionais habilitados.
              </p>
            </div>
          </motion.div>

          {/* ── Links ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ios-muted">
              Links
            </span>
            <ul className="mt-4 space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 font-mono text-sm text-ios-text-secondary transition-colors duration-200 hover:text-ios-accent"
                  >
                    <span className="text-[10px] text-ios-accent/40 transition-transform duration-200 group-hover:translate-x-0.5">
                      ▸
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Seções ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ios-muted">
              Seções
            </span>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: 'Stack', href: '#stack' },
                { label: 'Manifesto', href: '#manifesto' },
                { label: 'Método', href: '#metodo' },
                { label: 'Cases', href: '#cases' },
                { label: 'Lab Pro', href: '#lab-pro' },
                { label: 'Lab Lite', href: '#lab-lite' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 font-mono text-sm text-ios-text-secondary transition-colors duration-200 hover:text-ios-accent"
                  >
                    <span className="text-[10px] text-ios-accent/40 transition-transform duration-200 group-hover:translate-x-0.5">
                      ▸
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ── Bottom Bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-ios-border/30 pt-8 sm:flex-row"
        >
          <p className="font-mono text-xs text-ios-muted">
            &copy; {year} thiagolabs.com —{' '}
            <span className="text-ios-accent/60">Intelligence OS</span>
            {'  '}
            <span className="inline-flex items-center gap-1">
              feito com <Heart size={11} className="text-ios-accent" />{' '}
              e muito café
            </span>
          </p>

          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-ios-muted">
              v{year}.08.03
            </span>
            <button
              onClick={scrollToTop}
              aria-label="Voltar ao topo"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ios-border bg-ios-surface text-ios-muted transition-all duration-200 hover:border-ios-accent/30 hover:text-ios-accent hover:shadow-ios-glow-sm"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
