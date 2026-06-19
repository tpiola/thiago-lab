/* ==========================================================================
   templates/index.ts — Templates de Seções React + Tailwind Premium
   Cada seção retorna código JSX completo com múltiplas variações.
   AI Site Generator — thiagolab.com
   ========================================================================== */

import type { ColorPalette, FontPairing } from '../design-system';

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface SectionContext {
  palette: ColorPalette;
  font: FontPairing;
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  darkMode: boolean;
  industry: string;
  tone: string;
  targetAudience: string;
}

export type SectionGenerator = (ctx: SectionContext, variation?: number) => string;

// ─── HEADER ─────────────────────────────────────────────────────────────────

export const header: SectionGenerator = (ctx, variation = 1) => {
  const { palette, font, siteName, darkMode } = ctx;
  const c = palette.colors;

  switch (variation) {
    case 1:
      // Header transparente com glassmorphism
      return `
<header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-${darkMode ? '[#0A0A0A]/80' : 'white/80'} border-b border-[${c.border}]/30">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16 md:h-20">
      <a href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-[${c.secondary}] flex items-center justify-center">
          <span className="text-[${c.background}] font-bold text-sm">S</span>
        </div>
        <span className="font-semibold text-lg tracking-tight text-[${c.text}]">${siteName}</span>
      </a>
      <nav className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors duration-200">Recursos</a>
        <a href="#pricing" className="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors duration-200">Preços</a>
        <a href="#testimonials" className="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors duration-200">Depoimentos</a>
        <a href="#contact" className="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors duration-200">Contato</a>
      </nav>
      <div className="flex items-center gap-3">
        <a href="#login" className="hidden sm:inline-flex text-sm font-medium text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Entrar</a>
        <a
          href="#cta"
          className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-[${c.background}] bg-[${c.secondary}] hover:bg-[${c.accent}] transition-all duration-200 shadow-lg shadow-[${c.secondary}]/20"
        >
          ${ctx.ctaText}
        </a>
      </div>
    </div>
  </div>
</header>`;

    case 2:
      // Header minimalista centralizado
      return `
<header className="fixed top-0 left-0 right-0 z-50 bg-[${c.background}]/95 backdrop-blur-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-center h-16 md:h-18">
      <nav className="flex items-center gap-8">
        <a href="#features" className="text-sm font-medium text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Recursos</a>
        <a href="/" className="flex items-center gap-2 mx-8">
          <span className="text-lg font-bold tracking-tight text-[${c.text}]">${siteName}</span>
        </a>
        <a href="#pricing" className="text-sm font-medium text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Preços</a>
        <a href="#contact" className="text-sm font-medium text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Contato</a>
      </nav>
    </div>
  </div>
</header>`;

    case 3:
      // Header com fundo sólido e destaque
      return `
<header className="bg-[${c.surface}] border-b border-[${c.border}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16 md:h-20">
      <a href="/" className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tight text-[${c.text}]">${siteName}</span>
      </a>
      <nav className="hidden lg:flex items-center gap-8">
        <a href="#features" className="text-sm font-medium text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Recursos</a>
        <a href="#pricing" className="text-sm font-medium text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Planos</a>
        <a href="#testimonials" className="text-sm font-medium text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Clientes</a>
        <a href="#faq" className="text-sm font-medium text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">FAQ</a>
        <a href="#contact" className="text-sm font-medium text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Contato</a>
      </nav>
      <a
        href="#cta"
        className="inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[${c.secondary}] hover:opacity-90 transition-all"
      >
        ${ctx.ctaText}
      </a>
    </div>
  </div>
</header>`;

    default:
      return header(ctx, 1);
  }
};

// ─── HERO ───────────────────────────────────────────────────────────────────

export const hero: SectionGenerator = (ctx, variation = 1) => {
  const { palette, font, darkMode } = ctx;
  const c = palette.colors;

  switch (variation) {
    case 1:
      // Hero split: texto + imagem com gradiente
      return `
<section className="relative min-h-screen flex items-center overflow-hidden bg-[${c.background}]">
  <div className="absolute inset-0 bg-gradient-to-br from-[${c.primary}]/5 via-transparent to-[${c.secondary}]/5" />
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div className="space-y-8">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-[${c.secondary}]/10 text-[${c.secondary}] text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-[${c.secondary}] mr-2 animate-pulse" />
          Lançamento oficial
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-[${c.text}]">
          ${ctx.heroTitle}
        </h1>
        <p className="text-lg md:text-xl text-[${c.textSecondary}] leading-relaxed max-w-xl">
          ${ctx.heroSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#cta"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-[${c.background}] bg-[${c.secondary}] hover:opacity-90 transition-all duration-200 shadow-xl shadow-[${c.secondary}]/20"
          >
            ${ctx.ctaText}
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold border border-[${c.border}] text-[${c.text}] hover:bg-[${c.surface}] transition-all duration-200"
          >
            Saiba mais
          </a>
        </div>
        <div className="flex items-center gap-6 pt-4">
          <div className="flex -space-x-2">
            {[1,2,3,4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-[${c.surface}] border-2 border-[${c.background}] flex items-center justify-center text-xs font-medium text-[${c.textSecondary}]">
                \${String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <p className="text-sm text-[${c.textSecondary}]">
            <span className="font-semibold text-[${c.text}]">2.000+</span> clientes ativos
          </p>
        </div>
      </div>
      <div className="relative lg:pl-8">
        <div className="relative aspect-square lg:aspect-[4/5] rounded-2xl bg-gradient-to-br from-[${c.secondary}]/20 to-[${c.primary}]/20 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-[${c.secondary}]/20 flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-[${c.secondary}]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-[${c.textSecondary}] text-sm">Preview do produto</p>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[${c.secondary}]/10 rounded-full blur-3xl" />
        <div className="absolute -top-6 -right-6 w-40 h-40 bg-[${c.accent}]/10 rounded-full blur-3xl" />
      </div>
    </div>
  </div>
</section>`;

    case 2:
      // Hero centralizado
      return `
<section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[${c.background}]">
  <div className="absolute inset-0 bg-gradient-to-b from-[${c.primary}]/5 via-transparent to-[${c.background}]" />
  <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[${c.secondary}]/5 rounded-full blur-3xl" />
  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[${c.accent}]/5 rounded-full blur-3xl" />
  <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center py-20 md:py-32">
    <div className="inline-flex items-center px-4 py-2 rounded-full border border-[${c.border}] text-sm text-[${c.textSecondary}] mb-8">
      <span className="w-2 h-2 rounded-full bg-[${c.secondary}] mr-2" />
      Agora disponível
    </div>
    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-[${c.text}] mb-6">
      ${ctx.heroTitle}
    </h1>
    <p className="text-lg md:text-xl text-[${c.textSecondary}] leading-relaxed max-w-2xl mx-auto mb-10">
      ${ctx.heroSubtitle}
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <a
        href="#cta"
        className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-[${c.background}] bg-[${c.secondary}] hover:opacity-90 transition-all shadow-xl shadow-[${c.secondary}]/20"
      >
        ${ctx.ctaText}
      </a>
      <a
        href="#features"
        className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold border border-[${c.border}] text-[${c.text}] hover:bg-[${c.surface}] transition-all"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
        Ver demonstração
      </a>
    </div>
  </div>
</section>`;

    case 3:
      // Hero fullscreen com gradiente ousado
      return `
<section className="relative min-h-screen flex items-center overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-[${c.primary}] via-[${c.primary}]/95 to-[${c.secondary}]/20" />
  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
  <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center py-20 md:py-32">
    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-white mb-6">
      ${ctx.heroTitle}
    </h1>
    <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto mb-10">
      ${ctx.heroSubtitle}
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <a
        href="#cta"
        className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-[${c.primary}] bg-white hover:bg-white/90 transition-all shadow-2xl"
      >
        ${ctx.ctaText}
      </a>
      <a
        href="#features"
        className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-white border border-white/30 hover:bg-white/10 transition-all"
      >
        Explorar
      </a>
    </div>
  </div>
</section>`;

    default:
      return hero(ctx, 1);
  }
};

// ─── FEATURES ───────────────────────────────────────────────────────────────

export const features: SectionGenerator = (ctx, variation = 1) => {
  const { palette, font, industry } = ctx;
  const c = palette.colors;

  const defaultFeatures = [
    { icon: 'Zap', title: 'Rápido e Performático', desc: 'Otimizado para velocidade máxima com carregamento instantâneo em qualquer dispositivo.' },
    { icon: 'Shield', title: 'Segurança Total', desc: 'Proteção de dados com criptografia de ponta a ponta e conformidade com LGPD.' },
    { icon: 'Layers', title: 'Interface Intuitiva', desc: 'Design pensado para a melhor experiência do usuário, sem curvas de aprendizado.' },
    { icon: 'BarChart3', title: 'Análises em Tempo Real', desc: 'Métricas e insights atualizados em tempo real para decisões inteligentes.' },
    { icon: 'Users', title: 'Colaboração em Equipe', desc: 'Trabalhe em equipe com ferramentas de colaboração integradas e eficientes.' },
    { icon: 'Smartphone', title: '100% Responsivo', desc: 'Experiência perfeita em qualquer tela, do desktop ao smartphone.' },
  ];

  switch (variation) {
    case 1:
      // Features grid 3-col
      return `
<section id="features" className="py-20 md:py-32 bg-[${c.background}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mb-4">
        Tudo que você precisa
      </h2>
      <p className="text-lg text-[${c.textSecondary}]">
        Funcionalidades completas para impulsionar seu ${industry.toLowerCase() || 'negócio'} ao próximo nível.
      </p>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      ${defaultFeatures.map((f, i) => `
      <div key={${i}} className="group p-6 md:p-8 rounded-2xl bg-[${c.surface}] border border-[${c.border}] hover:border-[${c.secondary}]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[${c.secondary}]/5">
        <div className="w-12 h-12 rounded-xl bg-[${c.secondary}]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
          <svg className="w-6 h-6 text-[${c.secondary}]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <h3 className="text-lg font-semibold text-[${c.text}] mb-2">${f.title}</h3>
        <p className="text-[${c.textSecondary}] leading-relaxed text-sm">${f.desc}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;

    case 2:
      // Features staggered com ícones grandes
      return `
<section id="features" className="py-20 md:py-32 bg-[${c.surface}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <span className="text-sm font-semibold uppercase tracking-widest text-[${c.secondary}]">Funcionalidades</span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mt-3 mb-4">
        Por que escolher ${ctx.siteName}?
      </h2>
      <p className="text-lg text-[${c.textSecondary}]">
        Descubra recursos pensados para transformar sua experiência.
      </p>
    </div>
    <div className="space-y-12">
      ${defaultFeatures.slice(0, 4).map((f, i) => `
      <div key={${i}} className="flex flex-col md:flex-row gap-6 md:gap-12 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}">
        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[${c.secondary}]/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-[${c.secondary}]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div className="flex-1 text-center md:text-${i % 2 === 1 ? 'right' : 'left'}">
          <h3 className="text-xl font-semibold text-[${c.text}] mb-2">${f.title}</h3>
          <p className="text-[${c.textSecondary}] max-w-lg">${f.desc}</p>
        </div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;

    default:
      return features(ctx, 1);
  }
};

// ─── PRICING ────────────────────────────────────────────────────────────────

export const pricing: SectionGenerator = (ctx, variation = 1) => {
  const { palette, font } = ctx;
  const c = palette.colors;

  const plans = [
    { name: 'Básico', price: 'R$ 97', desc: 'Para começar', features: ['1 projeto', '5GB de armazenamento', 'Suporte por email', 'Dashboard básico'], popular: false },
    { name: 'Profissional', price: 'R$ 197', desc: 'Para crescer', features: ['10 projetos', '50GB de armazenamento', 'Suporte prioritário', 'Análises avançadas', 'API REST', 'Integrações'], popular: true },
    { name: 'Enterprise', price: 'R$ 497', desc: 'Para escalar', features: ['Projetos ilimitados', '500GB de armazenamento', 'Suporte 24/7', 'Análises completas', 'API dedicada', 'SLA 99.9%', 'Gerente de conta'], popular: false },
  ];

  return `
<section id="pricing" className="py-20 md:py-32 bg-[${c.surface}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mb-4">
        Planos para cada momento
      </h2>
      <p className="text-lg text-[${c.textSecondary}]">
        Escolha o plano ideal para seu negócio. Cancele quando quiser.
      </p>
    </div>
    <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
      ${plans.map((plan) => `
      <div key="${plan.name}" className="relative p-8 rounded-2xl bg-[${c.background}] border ${plan.popular ? 'border-[${c.secondary}] shadow-xl shadow-[${c.secondary}]/10' : 'border-[${c.border}]'} transition-all duration-300 hover:shadow-xl">
        ${plan.popular ? '<div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[${c.secondary}] text-xs font-semibold text-[${c.background}]">Mais popular</div>' : ''}
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-[${c.text}] mb-1">${plan.name}</h3>
          <p className="text-sm text-[${c.textSecondary}] mb-4">${plan.desc}</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-[${c.text}]">${plan.price}</span>
            <span className="text-sm text-[${c.textSecondary}]">/mês</span>
          </div>
        </div>
        <ul className="space-y-3 mb-8">
          ${plan.features.map((f) => `
          <li key="${f}" className="flex items-start gap-3">
            <svg className="w-5 h-5 text-[${c.secondary}] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="text-sm text-[${c.textSecondary}]">${f}</span>
          </li>`).join('\n          ')}
        </ul>
        <a
          href="#cta"
          className="block w-full text-center py-3 rounded-xl text-sm font-semibold ${plan.popular ? 'bg-[${c.secondary}] text-[${c.background}] hover:opacity-90' : 'bg-[${c.surface}] text-[${c.text}] border border-[${c.border}] hover:bg-[${c.border}]'} transition-all"
        >
          ${plan.popular ? 'Começar agora' : 'Escolher plano'}
        </a>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;
};

// ─── TESTIMONIALS ───────────────────────────────────────────────────────────

export const testimonials: SectionGenerator = (ctx, variation = 1) => {
  const { palette, font } = ctx;
  const c = palette.colors;

  const items = [
    { name: 'Ana Silva', role: 'CEO, TechStart', text: 'Transformou completamente nossa presença digital. O design é impecável e a performance superou expectativas.' },
    { name: 'Carlos Oliveira', role: 'CTO, DataFlow', text: 'A plataforma mais completa que já usamos. A integração foi suave e o suporte é excepcional.' },
    { name: 'Marina Santos', role: 'Design Lead, CreativLab', text: 'Interface intuitiva e resultados impressionantes. Nossa equipe adotou rapidamente.' },
  ];

  return `
<section id="testimonials" className="py-20 md:py-32 bg-[${c.background}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mb-4">
        O que nossos clientes dizem
      </h2>
      <p className="text-lg text-[${c.textSecondary}]">
        Histórias reais de quem já transformou seu ${ctx.industry.toLowerCase() || 'negócio'} conosco.
      </p>
    </div>
    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
      ${items.map((item, i) => `
      <div key={${i}} className="p-6 md:p-8 rounded-2xl bg-[${c.surface}] border border-[${c.border}]">
        <div className="flex mb-4">
          ${[1,2,3,4,5].map(() => `<svg className="w-5 h-5 text-[${c.secondary}]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>`).join('')}
        </div>
        <p className="text-[${c.textSecondary}] mb-6 leading-relaxed">"${item.text}"</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[${c.secondary}]/20 flex items-center justify-center text-sm font-semibold text-[${c.secondary}]">
            ${item.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-[${c.text}]">${item.name}</p>
            <p className="text-xs text-[${c.textSecondary}]">${item.role}</p>
          </div>
        </div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;
};

// ─── CTA ────────────────────────────────────────────────────────────────────

export const cta: SectionGenerator = (ctx, variation = 1) => {
  const { palette, font } = ctx;
  const c = palette.colors;

  switch (variation) {
    case 1:
      // CTA com gradiente e destaque
      return `
<section id="cta" className="py-20 md:py-32">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[${c.primary}] to-[${c.primary}]/90 p-8 md:p-16 text-center">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      <div className="relative">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
          Pronto para começar?
        </h2>
        <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
          Junte-se a milhares de empresas que já transformaram seus resultados com ${ctx.siteName}.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-[${c.primary}] bg-white hover:bg-white/90 transition-all shadow-xl"
          >
            ${ctx.ctaText}
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-white border border-white/30 hover:bg-white/10 transition-all"
          >
            Falar com vendas
          </a>
        </div>
      </div>
    </div>
  </div>
</section>`;

    case 2:
      // CTA minimalista
      return `
<section id="cta" className="py-20 md:py-32 bg-[${c.background}]">
  <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mb-4">
      Vamos trabalhar juntos?
    </h2>
    <p className="text-lg text-[${c.textSecondary}] mb-8">
      Estamos prontos para ajudar seu ${ctx.industry.toLowerCase() || 'negócio'} a alcançar novos patamares.
    </p>
    <a
      href="#"
      className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-[${c.background}] bg-[${c.secondary}] hover:opacity-90 transition-all shadow-xl shadow-[${c.secondary}]/20"
    >
      ${ctx.ctaText}
    </a>
  </div>
</section>`;

    default:
      return cta(ctx, 1);
  }
};

// ─── FOOTER ─────────────────────────────────────────────────────────────────

export const footer: SectionGenerator = (ctx, variation = 1) => {
  const { palette, font, siteName } = ctx;
  const c = palette.colors;

  const currentYear = new Date().getFullYear();

  return `
<footer className="bg-[${c.surface}] border-t border-[${c.border}] py-12 md:py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      <div className="sm:col-span-2 lg:col-span-2">
        <a href="/" className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[${c.secondary}] flex items-center justify-center">
            <span className="text-[${c.background}] font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-lg text-[${c.text}]">${siteName}</span>
        </a>
        <p className="text-sm text-[${c.textSecondary}] max-w-md leading-relaxed">
          Soluções premium para transformar seu ${ctx.industry.toLowerCase() || 'negócio'}. 
          Inovação, design e tecnologia trabalhando juntos.
        </p>
        <div className="flex gap-4 mt-6">
          {['Twitter', 'LinkedIn', 'Instagram', 'YouTube'].map((s) => (
            <a key={s} href="#" className="w-10 h-10 rounded-lg bg-[${c.background}] border border-[${c.border}] flex items-center justify-center text-[${c.textSecondary}] hover:text-[${c.secondary}] hover:border-[${c.secondary}] transition-all">
              <span className="text-xs font-semibold">{s.charAt(0)}</span>
            </a>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-[${c.text}] mb-4">Produto</h4>
        <ul className="space-y-3">
          {['Recursos', 'Preços', 'API', 'Integrações', 'Changelog'].map((item) => (
            <li key={item}><a href="#" className="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">{item}</a></li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-[${c.text}] mb-4">Empresa</h4>
        <ul className="space-y-3">
          {['Sobre', 'Blog', 'Carreiras', 'Contato', 'Parceiros'].map((item) => (
            <li key={item}><a href="#" className="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">{item}</a></li>
          ))}
        </ul>
      </div>
    </div>
    <div className="pt-8 border-t border-[${c.border}] flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-[${c.textSecondary}]">
        © ${currentYear} ${siteName}. Todos os direitos reservados.
      </p>
      <div className="flex gap-6">
        <a href="#" className="text-xs text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Privacidade</a>
        <a href="#" className="text-xs text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Termos</a>
        <a href="#" className="text-xs text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Cookies</a>
      </div>
    </div>
  </div>
</footer>`;
};

// ─── ABOUT ───────────────────────────────────────────────────────────────────

export const about: SectionGenerator = (ctx, variation = 1) => {
  const { palette, font } = ctx;
  const c = palette.colors;

  return `
<section id="about" className="py-20 md:py-32 bg-[${c.background}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div>
        <span className="text-sm font-semibold uppercase tracking-widest text-[${c.secondary}]">Sobre nós</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mt-3 mb-6">
          Nossa missão é transformar ${ctx.industry.toLowerCase() || 'o mercado'} através da tecnologia
        </h2>
        <p className="text-[${c.textSecondary}] leading-relaxed mb-6">
          Somos uma equipe apaixonada por inovação. Combinamos design de ponta com tecnologia 
          de última geração para criar soluções que realmente fazem a diferença.
        </p>
        <p className="text-[${c.textSecondary}] leading-relaxed mb-8">
          Desde nossa fundação, ajudamos centenas de empresas a alcançarem resultados extraordinários 
          através de produtos digitais excepcionais.
        </p>
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-3xl font-bold text-[${c.text}]">500+</p>
            <p className="text-sm text-[${c.textSecondary}]">Projetos entregues</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[${c.text}]">99%</p>
            <p className="text-sm text-[${c.textSecondary}]">Satisfação</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[${c.text}]">50+</p>
            <p className="text-sm text-[${c.textSecondary}]">Países atendidos</p>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="aspect-square rounded-2xl bg-gradient-to-br from-[${c.secondary}]/20 to-[${c.primary}]/20 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-32 h-32 text-[${c.secondary}]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[${c.secondary}]/10 rounded-full blur-2xl" />
      </div>
    </div>
  </div>
</section>`;
};

// ─── STATS ──────────────────────────────────────────────────────────────────

export const stats: SectionGenerator = (ctx, variation = 1) => {
  const { palette } = ctx;
  const c = palette.colors;

  return `
<section className="py-16 md:py-20 bg-[${c.surface}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {[
        { value: '10.000+', label: 'Clientes ativos' },
        { value: '99.9%', label: 'Uptime garantido' },
        { value: '150+', label: 'Países' },
        { value: '4.9/5', label: 'Avaliação média' },
      ].map((stat, i) => (
        <div key={i} className="text-center">
          <p className="text-3xl md:text-4xl font-bold text-[${c.text}] mb-1">${'{stat.value}'}</p>
          <p className="text-sm text-[${c.textSecondary}]">${'{stat.label}'}</p>
        </div>
      ))}
    </div>
  </div>
</section>`;
};

// ─── FAQ ────────────────────────────────────────────────────────────────────

export const faq: SectionGenerator = (ctx, variation = 1) => {
  const { palette } = ctx;
  const c = palette.colors;

  const items = [
    { q: 'Como funciona o processo de onboarding?', a: 'Nosso onboarding é totalmente guiado. Você recebe suporte dedicado desde o primeiro dia, com treinamento personalizado e materiais exclusivos.' },
    { q: 'Posso cancelar a qualquer momento?', a: 'Sim! Você pode cancelar sua assinatura quando quiser, sem multas ou burocracia. Seus dados ficam disponíveis para exportação.' },
    { q: 'Quais formas de pagamento são aceitas?', a: 'Aceitamos cartões de crédito (Visa, Mastercard, Amex), boleto bancário e PIX. Todas as transações são processadas com segurança.' },
    { q: 'Oferecem suporte técnico?', a: 'Sim! Todos os planos incluem suporte técnico. Nosso time está disponível via chat, email e telefone, com tempo de resposta médio de 2 minutos.' },
    { q: 'Como funciona a segurança dos dados?', a: 'Utilizamos criptografia de ponta a ponta, servidores em data centers certificados e compliance com LGPD. Sua segurança é nossa prioridade.' },
  ];

  return `
<section id="faq" className="py-20 md:py-32 bg-[${c.background}]">
  <div className="max-w-3xl mx-auto px-4 sm:px-6">
    <div className="text-center mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mb-4">
        Perguntas Frequentes
      </h2>
      <p className="text-lg text-[${c.textSecondary}]">
        Tire suas dúvidas sobre ${ctx.siteName}.
      </p>
    </div>
    <div className="space-y-4">
      ${items.map((item, i) => `
      <details key={${i}} className="group p-6 rounded-2xl bg-[${c.surface}] border border-[${c.border}] open:border-[${c.secondary}]/30 transition-all">
        <summary className="flex items-center justify-between cursor-pointer">
          <span className="text-base font-medium text-[${c.text}]">${item.q}</span>
          <svg className="w-5 h-5 text-[${c.textSecondary}] group-open:rotate-45 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </summary>
        <p className="mt-4 text-sm text-[${c.textSecondary}] leading-relaxed">${item.a}</p>
      </details>`).join('\n      ')}
    </div>
  </div>
</section>`;
};

// ─── CONTACT ────────────────────────────────────────────────────────────────

export const contact: SectionGenerator = (ctx, variation = 1) => {
  const { palette } = ctx;
  const c = palette.colors;

  return `
<section id="contact" className="py-20 md:py-32 bg-[${c.surface}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
      <div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mb-4">
          Entre em contato
        </h2>
        <p className="text-lg text-[${c.textSecondary}] mb-8">
          Tem um projeto em mente? Adoraríamos saber mais sobre ele. 
          Envie uma mensagem e retornaremos em até 24h.
        </p>
        <div className="space-y-6">
          {[
            { icon: 'Mail', label: 'Email', value: 'contato@${ctx.siteName.toLowerCase().replace(/\\s+/g, '')}.com.br' },
            { icon: 'Phone', label: 'Telefone', value: '(11) 99999-9999' },
            { icon: 'MapPin', label: 'Endereço', value: 'São Paulo, SP - Brasil' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[${c.secondary}]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[${c.secondary}]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[${c.text}]">${'{item.label}'}</p>
                <p className="text-sm text-[${c.textSecondary}]">${'{item.value}'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid sm:grid-cols-2 gap-4">
          <input type="text" placeholder="Nome" className="w-full px-4 py-3 rounded-xl bg-[${c.background}] border border-[${c.border}] text-[${c.text}] placeholder:text-[${c.textSecondary}] focus:outline-none focus:border-[${c.secondary}] transition-colors" />
          <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-xl bg-[${c.background}] border border-[${c.border}] text-[${c.text}] placeholder:text-[${c.textSecondary}] focus:outline-none focus:border-[${c.secondary}] transition-colors" />
        </div>
        <input type="text" placeholder="Assunto" className="w-full px-4 py-3 rounded-xl bg-[${c.background}] border border-[${c.border}] text-[${c.text}] placeholder:text-[${c.textSecondary}] focus:outline-none focus:border-[${c.secondary}] transition-colors" />
        <textarea rows={4} placeholder="Mensagem" className="w-full px-4 py-3 rounded-xl bg-[${c.background}] border border-[${c.border}] text-[${c.text}] placeholder:text-[${c.textSecondary}] focus:outline-none focus:border-[${c.secondary}] transition-colors resize-none" />
        <button type="submit" className="w-full py-3 rounded-xl text-base font-semibold text-[${c.background}] bg-[${c.secondary}] hover:opacity-90 transition-all">
          Enviar mensagem
        </button>
      </form>
    </div>
  </div>
</section>`;
};

// ─── GALLERY ────────────────────────────────────────────────────────────────

export const gallery: SectionGenerator = (ctx, variation = 1) => {
  const { palette } = ctx;
  const c = palette.colors;

  return `
<section id="gallery" className="py-20 md:py-32 bg-[${c.background}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mb-4">
        Nossos trabalhos
      </h2>
      <p className="text-lg text-[${c.textSecondary}]">
        Conheça alguns dos projetos que nos enchem de orgulho.
      </p>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {[1,2,3,4,5,6].map((i) => (
        <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden bg-[${c.surface}] border border-[${c.border}]">
          <div className="w-full h-full bg-gradient-to-br from-[${c.secondary}]/10 to-[${c.primary}]/10 flex items-center justify-center">
            <svg className="w-16 h-16 text-[${c.textSecondary}]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[${c.primary}]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            <div>
              <p className="text-white font-semibold">Projeto \${i}</p>
              <p className="text-white/60 text-sm">Design & Desenvolvimento</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>`;
};

// ─── LOGO-CLOUD ─────────────────────────────────────────────────────────────

export const logoCloud: SectionGenerator = (ctx, variation = 1) => {
  const { palette } = ctx;
  const c = palette.colors;

  return `
<section className="py-12 md:py-16 bg-[${c.background}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <p className="text-center text-xs font-semibold uppercase tracking-widest text-[${c.textSecondary}] mb-8">
      Empresas que confiam em nós
    </p>
    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
      {['TechCorp', 'DataFlow', 'Innovate', 'CloudBase', 'NexGen', 'PrimeTech'].map((company) => (
        <div key={company} className="h-8 flex items-center">
          <span className="text-lg font-bold text-[${c.textSecondary}]">\${company}</span>
        </div>
      ))}
    </div>
  </div>
</section>`;
};

// ─── TEAM ────────────────────────────────────────────────────────────────────

export const team: SectionGenerator = (ctx, variation = 1) => {
  const { palette } = ctx;
  const c = palette.colors;

  return `
<section id="team" className="py-20 md:py-32 bg-[${c.surface}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mb-4">
        Conheça nosso time
      </h2>
      <p className="text-lg text-[${c.textSecondary}]">
        Pessoas talentosas trabalhando juntas para criar o melhor produto.
      </p>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {[
        { name: 'João Silva', role: 'CEO & Founder' },
        { name: 'Maria Souza', role: 'CTO' },
        { name: 'Pedro Costa', role: 'Design Lead' },
        { name: 'Ana Oliveira', role: 'Marketing' },
      ].map((member, i) => (
        <div key={i} className="text-center group">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[${c.secondary}]/20 to-[${c.primary}]/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <span className="text-3xl font-bold text-[${c.secondary}]">${'{member.name.charAt(0)}'}</span>
          </div>
          <h3 className="text-lg font-semibold text-[${c.text}]">${'{member.name}'}</h3>
          <p className="text-sm text-[${c.textSecondary}]">${'{member.role}'}</p>
        </div>
      ))}
    </div>
  </div>
</section>`;
};

// ─── BLOG ────────────────────────────────────────────────────────────────────

export const blog: SectionGenerator = (ctx, variation = 1) => {
  const { palette } = ctx;
  const c = palette.colors;

  return `
<section id="blog" className="py-20 md:py-32 bg-[${c.background}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mb-4">
        Últimos artigos
      </h2>
      <p className="text-lg text-[${c.textSecondary}]">
        Fique por dentro das novidades e tendências do mercado.
      </p>
    </div>
    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
      {[1,2,3].map((i) => (
        <article key={i} className="group rounded-2xl overflow-hidden bg-[${c.surface}] border border-[${c.border}] hover:border-[${c.secondary}]/30 transition-all">
          <div className="aspect-[16/9] bg-gradient-to-br from-[${c.secondary}]/10 to-[${c.primary}]/10" />
          <div className="p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-[${c.secondary}]">Categoria</span>
            <h3 className="text-lg font-semibold text-[${c.text}] mt-2 mb-2 group-hover:text-[${c.secondary}] transition-colors">
              Título do artigo incrível sobre inovação
            </h3>
            <p className="text-sm text-[${c.textSecondary}] line-clamp-2">
              Descubra as últimas tendências e como aplicá-las no seu negócio para alcançar resultados extraordinários.
            </p>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[${c.border}]">
              <span className="text-xs text-[${c.textSecondary}]">5 min de leitura</span>
              <span className="text-xs text-[${c.textSecondary}]">•</span>
              <span className="text-xs text-[${c.textSecondary}]">Há 3 dias</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>`;
};

// ─── MAPA DE SEÇÕES ─────────────────────────────────────────────────────────

export const SECTION_MAP: Record<string, SectionGenerator> = {
  header,
  hero,
  features,
  about,
  pricing,
  testimonials,
  cta,
  footer,
  faq,
  contact,
  gallery,
  stats,
  team,
  'logo-cloud': logoCloud,
  blog,
};

/**
 * Gera uma seção específica pelo nome.
 */
export function generateSection(
  sectionName: string,
  ctx: SectionContext,
  variation?: number,
): string {
  const generator = SECTION_MAP[sectionName];
  if (!generator) {
    console.warn(`[Templates] Seção desconhecida: "${sectionName}"`);
    return '';
  }
  return generator(ctx, variation);
}
