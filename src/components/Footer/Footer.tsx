'use client';

import { motion } from 'framer-motion';
import {
  Code2,
  ExternalLink,
  Play,
  Mail,
  Terminal,
  Heart,
  ArrowUp,
} from 'lucide-react';

/* ─── Social Links ─── */
const SOCIALS = [
  { icon: Code2, label: 'GitHub', href: '#' },
  { icon: ExternalLink, label: 'LinkedIn', href: '#' },
  { icon: Play, label: 'YouTube', href: '#' },
  { icon: Mail, label: 'Email', href: 'mailto:oi@thiagolab.com' },
];

/* ─── Quick Links ─── */
const QUICK_LINKS = [
  { label: 'Stack', href: '#stack' },
  { label: 'Manifesto', href: '#manifesto' },
  { label: 'Método', href: '#metodo' },
  { label: 'Cases', href: '#cases' },
  { label: 'Lab Lite', href: '#lab-lite' },
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
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* ── Brand Column ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-2.5">
              <Terminal size={20} className="text-ios-accent" />
              <span className="font-mono text-sm font-bold tracking-tight text-ios-text">
                thiagolab
              </span>
              <span className="font-mono text-[10px] text-ios-accent">~$</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ios-text-secondary">
              Laboratório terminal de Thiago. IA, automação e produtos
              digitais — tudo construído de verdade, sem guru.
            </p>

            {/* Social Icons */}
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-ios-border bg-ios-surface text-ios-muted transition-all duration-200 hover:border-ios-accent/30 hover:text-ios-accent hover:shadow-ios-glow-sm"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* ── Quick Links ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ios-muted">
              Navegação
            </span>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
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

          {/* ── Contact ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ios-muted">
              Contato
            </span>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="mailto:oi@thiagolab.com"
                  className="inline-flex items-center gap-2 font-mono text-sm text-ios-text-secondary transition-colors duration-200 hover:text-ios-accent"
                >
                  <Mail size={13} />
                  oi@thiagolab.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-sm text-ios-text-secondary transition-colors duration-200 hover:text-ios-accent"
                >
                  <span className="text-[11px]">📱</span>
                  WhatsApp
                </a>
              </li>
              <li className="mt-4">
                <a
                  href="#lab-lite"
                  className="btn-outline inline-flex gap-2 font-mono text-[10px] uppercase tracking-wider"
                >
                  diagnóstico gratuito
                </a>
              </li>
            </ul>
          </motion.div>

          {/* ── Terminal Quote ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="hidden lg:block"
          >
            <div className="rounded-lg border border-ios-border bg-ios-surface-2 p-4">
              <div className="flex items-center gap-2 font-mono text-[10px] text-ios-muted">
                <Terminal size={12} className="text-ios-accent" />
                <span>~/.bashrc</span>
              </div>
              <pre className="mt-3 font-mono text-xs leading-relaxed text-ios-text-secondary">
                <span className="text-ios-muted"># alias</span>
                {'\n'}
                <span className="text-ios-accent">alias</span>{' '}
                construir=
                <span className="text-ios-text">{'"não pare"'}</span>
                {'\n'}
                <span className="text-ios-accent">alias</span>{' '}
                desistir=
                <span className="text-ios-text">{'"não existe"'}</span>
              </pre>
            </div>
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
            &copy; {year} thiagolab.com —{' '}
            <span className="text-ios-accent/60">Intelligence OS</span>
            {'  '}
            <span className="inline-flex items-center gap-1">
              feito com <Heart size={11} className="text-ios-accent" />{' '}
              e muito café
            </span>
          </p>

          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-ios-muted">
              v{year}.06.17
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
