"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, Sparkles, ChevronRight, Zap, ExternalLink,
  ArrowRight, Globe, Code, LayoutDashboard,
} from "lucide-react";

/* ==========================================================================
   /thiagobuild Layout — dark + gold accent + glassmorphism
   Navbar responsiva com hamburger + footer responsivo
   ========================================================================== */

const NAV_LINKS = [
  { label: "Início", href: "/thiagobuild" },
  { label: "AI Builder", href: "/ai-builder" },
  { label: "Templates", href: "/templates" },
  { label: "Intelligence OS", href: "/intelligence-os" },
];

export default function ThiagoBuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  return (
    <div className="min-h-screen flex flex-col bg-thiagobuild-base">
      {/* ── Animated Background ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-thiagobuild-gold/8 to-transparent blur-[120px] animate-thiagobuild-float" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-thiagobuild-gold/5 to-transparent blur-[100px] animate-thiagobuild-float-delayed" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-transparent via-thiagobuild-gold/3 to-transparent blur-[80px]" />
      </div>

      {/* ── Navbar ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-thiagobuild-base/85 backdrop-blur-xl border-b border-thiagobuild-gold/10 shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <Link
              href="/thiagobuild"
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-thiagobuild-gold to-amber-600 flex items-center justify-center shadow-lg shadow-thiagobuild-gold/20 group-hover:shadow-thiagobuild-gold/30 transition-shadow">
                <Zap size={18} className="text-thiagobuild-base" />
              </div>
              <div className="hidden sm:block">
                <span className="text-base font-bold text-white font-display tracking-tight">
                  Thiago<span className="text-thiagobuild-gold">Build</span>
                </span>
                <span className="hidden md:inline text-[10px] text-white/30 ml-2 font-medium uppercase tracking-wider">
                  AI Site Builder
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all ${
                      isActive
                        ? "text-thiagobuild-gold bg-thiagobuild-gold/10"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <Link
                href="/ai-builder"
                className="hidden sm:inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-bold text-thiagobuild-base bg-thiagobuild-gold hover:bg-amber-500 transition-all hover:shadow-lg hover:shadow-thiagobuild-gold/25"
              >
                <Sparkles size={14} />
                <span>Novo Site</span>
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2.5 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                aria-label="Abrir menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-thiagobuild-gold/10 bg-thiagobuild-base/95 backdrop-blur-xl">
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeMobile}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "text-thiagobuild-gold bg-thiagobuild-gold/10"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <ChevronRight
                      size={14}
                      className={isActive ? "text-thiagobuild-gold" : "text-white/20"}
                    />
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-3 mt-3 border-t border-white/5">
                <Link
                  href="/ai-builder"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-thiagobuild-base bg-thiagobuild-gold hover:bg-amber-500 transition-all"
                >
                  <Sparkles size={16} />
                  Criar Site com IA
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 relative z-10">
        {children}
      </main>

      {/* ── Footer Responsivo ── */}
      <footer className="relative z-10 border-t border-thiagobuild-gold/8 bg-thiagobuild-surface/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-thiagobuild-gold to-amber-600 flex items-center justify-center">
                  <Zap size={16} className="text-thiagobuild-base" />
                </div>
                <span className="text-base font-bold text-white font-display">
                  Thiago<span className="text-thiagobuild-gold">Build</span>
                </span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                Crie sites profissionais com inteligência artificial em segundos. Do prompt ao deploy.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-thiagobuild-gold/60 mb-4">
                Produto
              </h4>
              <ul className="space-y-2.5">
                {["AI Builder", "Templates", "Preview", "Deploy"].map((item) => (
                  <li key={item}>
                    <Link
                      href="/ai-builder"
                      className="text-sm text-white/40 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-thiagobuild-gold/60 mb-4">
                Recursos
              </h4>
              <ul className="space-y-2.5">
                {["Documentação", "API", "Status", "Changelog"].map((item) => (
                  <li key={item}>
                    <span className="text-sm text-white/30 cursor-not-allowed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-thiagobuild-gold/60 mb-4">
                Thiago Lab
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Intelligence OS", href: "/intelligence-os" },
                  { label: "AI Builder", href: "/ai-builder" },
                  { label: "Templates", href: "/templates" },
                  { label: "GitHub", href: "https://github.com" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/40 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-thiagobuild-gold/8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/25">
              &copy; {new Date().getFullYear()} Thiago Lab. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: ExternalLink, href: "https://github.com" },
                { icon: Globe, href: "https://thiago-lab.vercel.app" },
              ].map(({ icon: Icon, href }, i) => (
                <Link
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/25 hover:text-thiagobuild-gold transition-colors"
                >
                  <Icon size={16} />
                </Link>
              ))}
              <Link
                href="/ai-builder"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-thiagobuild-gold hover:text-amber-400 transition-colors"
              >
                Criar Site <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
