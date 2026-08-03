'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Layout, Grid3x3 } from 'lucide-react';

/* ─── Navigation Links ─── */
interface NavLink {
  label: string;
  href: string;
  icon?: React.ComponentType<{ size?: number }>;
}

const NAV_PAGES: NavLink[] = [
  { label: 'Builder', href: '/builder', icon: Layout },
  { label: 'Templates', href: '/templates', icon: Grid3x3 },
  { label: 'INEMA', href: '/inema' },
  { label: 'IA', href: '/ia' },
  { label: 'AI Builder', href: '/ai-builder' },
  { label: 'Biblioteca', href: '/biblioteca' },
  { label: 'Notas', href: '/app' },
];

/* ─── Component ─── */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on resize */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-ios-border/40 shadow-ios-card'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-ios mx-auto flex h-16 items-center justify-between md:h-18">
        {/* ── Logo ── */}
        <a
          href="/"
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-ios-text transition-colors hover:text-ios-accent"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-ios-border bg-ios-surface text-sm font-bold text-ios-accent">
            TL
          </span>
          <span className="hidden sm:inline">ThiagoLabs</span>
        </a>

        {/* ── Desktop Links ── */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_PAGES.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-ios-text-secondary transition-colors hover:bg-ios-accent/5 hover:text-ios-text"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* ── Desktop CTA ── */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/ia"
            className="btn-accent relative overflow-hidden px-5 py-2 text-sm font-semibold"
          >
            <span className="relative z-10">LLM Gateway</span>
            <span className="absolute inset-0 animate-pulse-glow rounded-md opacity-60" />
          </a>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          type="button"
          className="flex items-center justify-center p-2 text-ios-text-secondary hover:text-ios-accent md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* ── Mobile Menu ── */}
      <div
        className={`overflow-hidden transition-all duration-400 ease-out-expo md:hidden ${
          menuOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-ios-border/30 bg-ios-surface/95 px-4 py-4 backdrop-blur-xl">
          <ul className="flex flex-col gap-1">
            {NAV_PAGES.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-ios-accent transition-colors hover:bg-ios-accent/5 hover:text-ios-text"
                  >
                    {Icon && <Icon size={16} />}
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <a
            href="/ia"
            onClick={() => setMenuOpen(false)}
            className="btn-accent mt-3 w-full justify-center px-5 py-2.5 text-sm font-semibold"
          >
            LLM Gateway
          </a>
        </div>
      </div>
    </header>
  );
}

export default Nav;
