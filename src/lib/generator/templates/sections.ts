/* ==========================================================================
   templates/sections.ts — Seções Premium (features, pricing, testimonials,
   cta, footer, contact) com 4-5 variações cada.
   Mobile-first, dark mode support.
   Prompt → Site React + Tailwind completo (v0/Framer-like).
   thiagolab.com
   ========================================================================== */

import type { Palette } from '../design-tokens';
import type { HeroContext } from './hero';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SectionContext extends HeroContext {
  siteName: string;
  industry: string;
}

// ─── FEATURES ────────────────────────────────────────────────────────────────

export function renderFeatures(ctx: SectionContext, variation: number = 1): string {
  const c = ctx.colors;
  const defaultFeatures = [
    { icon: 'Zap', title: 'Rápido e Performático', desc: 'Carregamento instantâneo em qualquer dispositivo.' },
    { icon: 'Shield', title: 'Segurança Total', desc: 'Criptografia ponta a ponta e conformidade total.' },
    { icon: 'Layers', title: 'Interface Intuitiva', desc: 'Design pensado para a melhor experiência do usuário.' },
    { icon: 'BarChart3', title: 'Análises em Tempo Real', desc: 'Métricas atualizadas para decisões inteligentes.' },
    { icon: 'Users', title: 'Colaboração em Equipe', desc: 'Ferramentas colaborativas integradas e eficientes.' },
    { icon: 'Smartphone', title: '100% Responsivo', desc: 'Experiência perfeita em qualquer tela.' },
  ];

  switch (variation) {
    case 1:
      return `<!-- FEATURES V1 -->
<section id="features" className="py-20 md:py-32 bg-[${c.background}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
      <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[${c.secondary}]">Recursos</span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mt-3 mb-4">
        Tudo que você precisa
      </h2>
      <p className="text-lg text-[${c.textSecondary}]">
        Funcionalidades completas para impulsionar seu ${ctx.industry.toLowerCase() || 'negócio'} ao próximo nível.
      </p>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      ${defaultFeatures.map((f, i) => `
      <div key={${i}} className="group p-6 md:p-8 rounded-2xl bg-[${c.surface}] border border-[${c.border}] hover:border-[${c.secondary}]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[${c.secondary}]/5" data-animate>
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
      // Staggered / alternating
      return `<!-- FEATURES V2 -->
<section id="features" className="py-20 md:py-32 bg-[${c.surface}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <span className="text-sm font-semibold uppercase tracking-widest text-[${c.secondary}]">Funcionalidades</span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mt-3 mb-4">
        Por que escolher ${ctx.siteName}?
      </h2>
    </div>
    <div className="space-y-12">
      ${defaultFeatures.slice(0, 4).map((f, i) => `
      <div key={${i}} className="flex flex-col md:flex-row gap-6 md:gap-16 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}" data-animate>
        <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-[${c.secondary}]/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-[${c.secondary}]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div className="flex-1 text-center md:text-${i % 2 === 1 ? 'right' : 'left'}">
          <h3 className="text-xl md:text-2xl font-semibold text-[${c.text}] mb-3">${f.title}</h3>
          <p className="text-[${c.textSecondary}] text-base max-w-xl${i % 2 === 1 ? ' ml-auto' : ''}">${f.desc}</p>
        </div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;

    case 3:
      // Cards com gradiente
      return `<!-- FEATURES V3 -->
<section id="features" className="py-20 md:py-32 bg-[${c.background}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mb-4">
        Recursos que fazem a diferença
      </h2>
    </div>
    <div className="grid md:grid-cols-3 gap-8">
      ${defaultFeatures.slice(0, 6).map((f, i) => `
      <div key={${i}} className="relative p-8 rounded-2xl overflow-hidden group cursor-pointer" data-animate>
        <div className="absolute inset-0 bg-gradient-to-br from-[${c.secondary}]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[${c.secondary}]/20 to-[${c.accent}]/20 flex items-center justify-center mb-5">
            <svg className="w-7 h-7 text-[${c.secondary}]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="text-xl font-semibold text-[${c.text}] mb-3">${f.title}</h3>
          <p className="text-[${c.textSecondary}] leading-relaxed">${f.desc}</p>
        </div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;

    case 4:
      // Features with numbers
      return `<!-- FEATURES V4 -->
<section id="features" className="py-20 md:py-32 bg-[${c.surface}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[${c.secondary}]">Recursos</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mt-3 mb-6">
          Potencialize seus resultados
        </h2>
        <p className="text-lg text-[${c.textSecondary}] mb-8">
          Descubra por que milhares de empresas confiam em ${ctx.siteName}.
        </p>
        <a href="#cta" className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-[${c.background}] bg-[${c.secondary}] hover:opacity-90 transition-all">
          Começar agora
          <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </a>
      </div>
      <div className="space-y-8">
        ${defaultFeatures.slice(0, 4).map((f, i) => `
        <div key={${i}} className="flex gap-6" data-animate>
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[${c.secondary}]/10 flex items-center justify-center text-lg font-bold text-[${c.secondary}]">
            ${String(i + 1).padStart(2, '0')}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[${c.text}] mb-1">${f.title}</h3>
            <p className="text-sm text-[${c.textSecondary}]">${f.desc}</p>
          </div>
        </div>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>`;

    default:
      return renderFeatures(ctx, 1);
  }
}

// ─── PRICING ─────────────────────────────────────────────────────────────────

export function renderPricing(ctx: SectionContext, variation: number = 1): string {
  const c = ctx.colors;
  const plans = [
    { name: 'Básico', price: 'R$ 97', desc: 'Para começar', features: ['1 projeto', '5GB armazenamento', 'Suporte email', 'Dashboard básico'], popular: false },
    { name: 'Profissional', price: 'R$ 197', desc: 'Para crescer', features: ['10 projetos', '50GB armazenamento', 'Suporte prioritário', 'Análises avançadas', 'API REST', 'Integrações'], popular: true },
    { name: 'Enterprise', price: 'R$ 497', desc: 'Para escalar', features: ['Projetos ilimitados', '500GB armazenamento', 'Suporte 24/7', 'SLA 99.9%', 'Gerente de conta', 'Onboarding dedicado'], popular: false },
  ];

  switch (variation) {
    case 1:
      return `<!-- PRICING V1 -->
<section id="pricing" className="py-20 md:py-32 bg-[${c.surface}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mb-4">Planos para cada momento</h2>
      <p className="text-lg text-[${c.textSecondary}]">Escolha o plano ideal. Cancele quando quiser.</p>
    </div>
    <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
      ${plans.map((plan) => `
      <div key="${plan.name}" className="relative p-8 rounded-2xl bg-[${c.background}] border ${plan.popular ? 'border-[${c.secondary}] ring-2 ring-[${c.secondary}]/20 shadow-xl shadow-[${c.secondary}]/10' : 'border-[${c.border}]'} transition-all duration-300 hover:shadow-xl" data-animate>
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
        <a href="#cta" className="block w-full text-center py-3.5 rounded-xl text-sm font-semibold ${plan.popular ? 'bg-[${c.secondary}] text-[${c.background}] hover:opacity-90' : 'bg-[${c.surface}] text-[${c.text}] border border-[${c.border}] hover:bg-[${c.border}]'} transition-all">
          ${plan.popular ? 'Começar agora' : 'Escolher plano'}
        </a>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;

    case 2:
      // Toggle monthly/yearly, 2-column
      return `<!-- PRICING V2 -->
<section id="pricing" className="py-20 md:py-32 bg-[${c.background}]">
  <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mb-4">Invista no seu crescimento</h2>
    <p className="text-lg text-[${c.textSecondary}] mb-16">Planos simples e transparentes para todos os tamanhos de negócio.</p>
    <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
      ${plans.filter(p => p.name !== 'Enterprise').map((plan) => `
      <div key="${plan.name}" className="p-8 md:p-10 rounded-3xl bg-[${c.surface}] border border-[${c.border}] text-left ${plan.popular ? 'md:-mt-4 md:mb-4 relative' : ''} transition-all hover:shadow-lg" data-animate>
        ${plan.popular ? '<div className="text-xs font-semibold uppercase tracking-wider text-[${c.secondary}] mb-2">RECOMENDADO</div>' : ''}
        <h3 className="text-xl font-bold text-[${c.text}] mb-2">${plan.name}</h3>
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-5xl font-black text-[${c.text}]">${plan.price}</span>
          <span className="text-[${c.textSecondary}]">/mês</span>
        </div>
        <ul className="space-y-3 mb-8">
          ${plan.features.map((f) => `
          <li key="${f}" class="flex items-center gap-3 text-sm text-[${c.textSecondary}]">
            <svg class="w-4 h-4 text-[${c.secondary}]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ${f}
          </li>`).join('\n          ')}
        </ul>
        <a href="#cta" class="block w-full text-center py-3 rounded-xl text-sm font-semibold ${plan.popular ? 'bg-[${c.secondary}] text-[${c.background}]' : 'border border-[${c.border}] text-[${c.text}] hover:bg-[${c.border}]'} transition-all">
          ${plan.popular ? 'Assinar Profissional' : 'Começar Básico'}
        </a>
      </div>`).join('\n      ')}
    </div>
    <p className="text-sm text-[${c.textSecondary}] mt-10">Todos os planos incluem 7 dias de teste grátis. Sem compromisso.</p>
  </div>
</section>`;

    default:
      return renderPricing(ctx, 1);
  }
}

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────

export function renderTestimonials(ctx: SectionContext, variation: number = 1): string {
  const c = ctx.colors;
  const items = [
    { name: 'Ana Silva', role: 'CEO, TechStart', text: 'Transformou nossa presença digital. Design impecável, performance excepcional.' },
    { name: 'Carlos Oliveira', role: 'CTO, DataFlow', text: 'A plataforma mais completa que já usamos. Integração suave e suporte excepcional.' },
    { name: 'Marina Santos', role: 'Design Lead, CreativLab', text: 'Interface intuitiva e resultados impressionantes. Nossa equipe adotou rapidamente.' },
    { name: 'Rafael Costa', role: 'Founder, GrowthHouse', text: 'Resultados acima do esperado. Recomendo para qualquer empresa que queira crescer.' },
    { name: 'Juliana Lima', role: 'Marketing VP, BrandNew', text: 'O ROI superou todas as nossas expectativas. Ferramenta indispensável.' },
  ];

  switch (variation) {
    case 1:
      return `<!-- TESTIMONIALS V1 -->
<section id="testimonials" className="py-20 md:py-32 bg-[${c.background}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mb-4">O que nossos clientes dizem</h2>
      <p className="text-lg text-[${c.textSecondary}]">Histórias reais de quem já transformou seu negócio conosco.</p>
    </div>
    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
      ${items.slice(0, 3).map((item, i) => `
      <div key={${i}} className="p-6 md:p-8 rounded-2xl bg-[${c.surface}] border border-[${c.border}]" data-animate>
        <div className="flex mb-4">
          ${[1,2,3,4,5].map(() => `<svg className="w-5 h-5 text-[${c.secondary}]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>`).join('')}
        </div>
        <p className="text-[${c.textSecondary}] mb-6 leading-relaxed">"${item.text}"</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[${c.secondary}]/20 flex items-center justify-center text-sm font-semibold text-[${c.secondary}]">${item.name.charAt(0)}</div>
          <div>
            <p className="text-sm font-semibold text-[${c.text}]">${item.name}</p>
            <p className="text-xs text-[${c.textSecondary}]">${item.role}</p>
          </div>
        </div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;

    case 2:
      // Carousel-like horizontal
      return `<!-- TESTIMONIALS V2 -->
<section id="testimonials" className="py-20 md:py-32 bg-[${c.surface}] overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
    <div className="text-center max-w-3xl mx-auto">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mb-4">Depoimentos</h2>
    </div>
  </div>
  <div className="flex gap-6 animate-scroll" style={{ width: 'max-content' }}>
    ${[...items, ...items].map((item, i) => `
    <div key={${i}} className="flex-shrink-0 w-80 p-6 rounded-2xl bg-[${c.background}] border border-[${c.border}]">
      <div className="flex mb-3">
        ${[1,2,3,4,5].map(() => `<svg className="w-4 h-4 text-[${c.secondary}]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>`).join('')}
      </div>
      <p className="text-sm text-[${c.textSecondary}] mb-4 leading-relaxed">"${item.text.slice(0, 80)}..."</p>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[${c.secondary}]/20 flex items-center justify-center text-xs font-semibold text-[${c.secondary}]">${item.name.charAt(0)}</div>
        <div>
          <p className="text-xs font-semibold text-[${c.text}]">${item.name}</p>
          <p className="text-[10px] text-[${c.textSecondary}]">${item.role}</p>
        </div>
      </div>
    </div>`).join('\n    ')}
  </div>
  <style>@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-scroll { animation: scroll 30s linear infinite; }</style>
</section>`;

    default:
      return renderTestimonials(ctx, 1);
  }
}

// ─── CTA ─────────────────────────────────────────────────────────────────────

export function renderCTA(ctx: SectionContext, variation: number = 1): string {
  const c = ctx.colors;

  switch (variation) {
    case 1:
      return `<!-- CTA V1 -->
<section id="cta" className="py-20 md:py-32 bg-[${c.background}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[${c.primary}] to-[${c.primary}]/90 p-8 md:p-16 text-center">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: \`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")\` }} />
      <div className="relative">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Pronto para começar?</h2>
        <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">Junte-se a milhares de empresas que transformaram seus resultados com ${ctx.siteName}.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#" className="group inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-[${c.primary}] bg-white hover:bg-white/90 transition-all shadow-xl">
            ${ctx.cta}
            <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
          <a href="#" className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-white border border-white/30 hover:bg-white/10 transition-all">Falar com vendas</a>
        </div>
      </div>
    </div>
  </div>
</section>`;

    case 2:
      return `<!-- CTA V2 -->
<section id="cta" className="py-20 md:py-32 bg-[${c.background}]">
  <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mb-4">Vamos trabalhar juntos?</h2>
    <p className="text-lg text-[${c.textSecondary}] mb-8">Estamos prontos para ajudar seu negócio a alcançar novos patamares.</p>
    <a href="#" className="group inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-[${c.background}] bg-[${c.secondary}] hover:opacity-90 transition-all shadow-xl shadow-[${c.secondary}]/20">
      ${ctx.cta}
      <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
    </a>
  </div>
</section>`;

    case 3:
      return `<!-- CTA V3 -->
<section id="cta" className="py-20 md:py-32 bg-[${c.surface}]">
  <div className="max-w-5xl mx-auto px-4 sm:px-6">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mb-4">Comece sua jornada hoje</h2>
        <p className="text-lg text-[${c.textSecondary}] mb-6">Inscreva-se gratuitamente e descubra como podemos transformar seu negócio digital.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-[${c.background}] bg-[${c.secondary}] hover:opacity-90 transition-all">${ctx.cta}</a>
          <a href="#" className="text-sm font-medium text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Saiba mais →</a>
        </div>
      </div>
      <div className="p-8 rounded-2xl bg-[${c.background}] border border-[${c.border}]">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-[${c.secondary}]/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-[${c.secondary}]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[${c.text}]">Garantia de 7 dias</p>
            <p className="text-xs text-[${c.textSecondary}]">Teste grátis, cancele quando quiser</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[${c.secondary}]/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-[${c.secondary}]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[${c.text}]">Dados seguros</p>
            <p className="text-xs text-[${c.textSecondary}]">Criptografia de ponta a ponta</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`;

    default:
      return renderCTA(ctx, 1);
  }
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

export function renderContact(ctx: SectionContext, variation: number = 1): string {
  const c = ctx.colors;

  switch (variation) {
    case 1:
      return `<!-- CONTACT V1 -->
<section id="contact" className="py-20 md:py-32 bg-[${c.surface}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
      <div>
        <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[${c.secondary}]">Contato</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mt-3 mb-4">Vamos conversar?</h2>
        <p className="text-lg text-[${c.textSecondary}] mb-8">Tem um projeto em mente? Adoraríamos saber mais sobre você.</p>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[${c.secondary}]/10 flex items-center justify-center"><svg className="w-6 h-6 text-[${c.secondary}]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
            <div><p className="text-sm font-medium text-[${c.text}]">Email</p><p className="text-sm text-[${c.textSecondary}]">ola@${ctx.siteName.toLowerCase().replace(/\\s/g, '')}.com</p></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[${c.secondary}]/10 flex items-center justify-center"><svg className="w-6 h-6 text-[${c.secondary}]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
            <div><p className="text-sm font-medium text-[${c.text}]">Endereço</p><p className="text-sm text-[${c.textSecondary}]">São Paulo, SP — Brasil</p></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[${c.secondary}]/10 flex items-center justify-center"><svg className="w-6 h-6 text-[${c.secondary}]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
            <div><p className="text-sm font-medium text-[${c.text}]">Horário</p><p className="text-sm text-[${c.textSecondary}]">Seg-Sex, 9h — 18h</p></div>
          </div>
        </div>
      </div>
      <div className="p-8 rounded-2xl bg-[${c.background}] border border-[${c.border}]">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[${c.text}] mb-1">Nome</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl bg-[${c.surface}] border border-[${c.border}] text-[${c.text}] placeholder:text-[${c.textSecondary}]/50 focus:outline-none focus:border-[${c.secondary}]/50 transition-colors text-sm" placeholder="Seu nome" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[${c.text}] mb-1">Email</label>
              <input type="email" className="w-full px-4 py-3 rounded-xl bg-[${c.surface}] border border-[${c.border}] text-[${c.text}] placeholder:text-[${c.textSecondary}]/50 focus:outline-none focus:border-[${c.secondary}]/50 transition-colors text-sm" placeholder="seu@email.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[${c.text}] mb-1">Mensagem</label>
            <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-[${c.surface}] border border-[${c.border}] text-[${c.text}] placeholder:text-[${c.textSecondary}]/50 focus:outline-none focus:border-[${c.secondary}]/50 transition-colors text-sm resize-none" placeholder="Como podemos ajudar?" />
          </div>
          <button type="submit" className="w-full py-3.5 rounded-xl text-sm font-semibold text-[${c.background}] bg-[${c.secondary}] hover:opacity-90 transition-all">Enviar mensagem</button>
        </form>
      </div>
    </div>
  </div>
</section>`;

    case 2:
      return `<!-- CONTACT V2 -->
<section id="contact" className="py-20 md:py-32 bg-[${c.background}]">
  <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
    <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[${c.secondary}]">Contato</span>
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[${c.text}] mt-3 mb-8">Entre em contato</h2>
    <form className="max-w-xl mx-auto space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-2 gap-4">
        <input type="text" className="w-full px-4 py-3 rounded-xl bg-[${c.surface}] border border-[${c.border}] text-[${c.text}] placeholder:text-[${c.textSecondary}]/50 focus:outline-none focus:border-[${c.secondary}]/50 text-sm" placeholder="Nome" />
        <input type="email" className="w-full px-4 py-3 rounded-xl bg-[${c.surface}] border border-[${c.border}] text-[${c.text}] placeholder:text-[${c.textSecondary}]/50 focus:outline-none focus:border-[${c.secondary}]/50 text-sm" placeholder="Email" />
      </div>
      <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-[${c.surface}] border border-[${c.border}] text-[${c.text}] placeholder:text-[${c.textSecondary}]/50 focus:outline-none focus:border-[${c.secondary}]/50 text-sm resize-none" placeholder="Sua mensagem" />
      <button type="submit" className="w-full py-3.5 rounded-xl text-sm font-semibold text-[${c.background}] bg-[${c.secondary}] hover:opacity-90 transition-all">Enviar →</button>
    </form>
  </div>
</section>`;

    default:
      return renderContact(ctx, 1);
  }
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

export function renderFooter(ctx: SectionContext, variation: number = 1): string {
  const c = ctx.colors;

  switch (variation) {
    case 1:
      return `<!-- FOOTER V1 -->
<footer className="py-12 md:py-16 bg-[${c.primary}] border-t border-[${c.border}]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid md:grid-cols-4 gap-8 mb-10">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[${c.secondary}] flex items-center justify-center">
            <span className="text-[${c.background}] font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-lg text-[${c.text}]">${ctx.siteName}</span>
        </div>
        <p className="text-sm text-[${c.textSecondary}] max-w-md">Transformando ideias em soluções digitais desde 2024. Tecnologia premium para resultados excepcionais.</p>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-[${c.text}] mb-4">Produto</h4>
        <ul className="space-y-2">
          <li><a href="#features" className="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Recursos</a></li>
          <li><a href="#pricing" className="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Preços</a></li>
          <li><a href="#testimonials" className="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Depoimentos</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-[${c.text}] mb-4">Empresa</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Sobre</a></li>
          <li><a href="#" className="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Blog</a></li>
          <li><a href="#contact" className="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Contato</a></li>
        </ul>
      </div>
    </div>
    <div className="pt-8 border-t border-[${c.border}] flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-xs text-[${c.textSecondary}]">© 2024 ${ctx.siteName}. Todos os direitos reservados.</p>
      <div className="flex items-center gap-4">
        <a href="#" className="text-xs text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Privacidade</a>
        <a href="#" className="text-xs text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Termos</a>
      </div>
    </div>
  </div>
</footer>`;

    case 2:
      return `<!-- FOOTER V2 -->
<footer className="py-16 bg-[${c.background}]">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
    <div className="flex items-center justify-center gap-2 mb-6">
      <div className="w-10 h-10 rounded-full bg-[${c.secondary}] flex items-center justify-center">
        <span className="text-[${c.background}] font-bold">S</span>
      </div>
      <span className="text-xl font-bold text-[${c.text}]">${ctx.siteName}</span>
    </div>
    <nav className="flex flex-wrap justify-center gap-6 mb-8">
      <a href="#features" className="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Recursos</a>
      <a href="#pricing" className="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Preços</a>
      <a href="#testimonials" className="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Clientes</a>
      <a href="#contact" className="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Contato</a>
      <a href="#" className="text-sm text-[${c.textSecondary}] hover:text-[${c.text}] transition-colors">Blog</a>
    </nav>
    <div className="flex justify-center gap-4 mb-8">
      {['T','F','I','L'].map((s) => (
        <a key={s} href="#" className="w-10 h-10 rounded-full bg-[${c.surface}] border border-[${c.border}] flex items-center justify-center text-sm text-[${c.textSecondary}] hover:text-[${c.text}] hover:border-[${c.secondary}]/30 transition-all">{s}</a>
      ))}
    </div>
    <p className="text-xs text-[${c.textSecondary}]">© 2024 ${ctx.siteName}. Todos os direitos reservados.</p>
  </div>
</footer>`;

    default:
      return renderFooter(ctx, 1);
  }
}

// ─── Section Router ──────────────────────────────────────────────────────────

export type SectionType = 'features' | 'pricing' | 'testimonials' | 'cta' | 'contact' | 'footer';

const SECTION_RENDERERS: Record<SectionType, (ctx: SectionContext, v?: number) => string> = {
  features: renderFeatures,
  pricing: renderPricing,
  testimonials: renderTestimonials,
  cta: renderCTA,
  contact: renderContact,
  footer: renderFooter,
};

export function renderSection(type: SectionType, ctx: SectionContext, variation: number = 1): string {
  const renderer = SECTION_RENDERERS[type];
  if (!renderer) return '';
  return renderer(ctx, variation);
}

export function getVariationForTone(section: SectionType, tone: string): number {
  if (tone === 'luxo' || tone === 'elegante') {
    if (section === 'features') return 1;
    if (section === 'cta') return 1;
    if (section === 'testimonials') return 1;
    if (section === 'footer') return 1;
    if (section === 'contact') return 1;
  }
  if (tone === 'minimalista' || tone === 'profissional') {
    if (section === 'cta') return 2;
    if (section === 'footer') return 2;
    if (section === 'contact') return 2;
  }
  if (tone === 'criativo' || tone === 'jovem' || tone === 'moderno') {
    if (section === 'features') return 3;
    if (section === 'pricing') return 1;
    if (section === 'cta') return 3;
    if (section === 'testimonials') return 2;
  }
  if (tone === 'corporativo' || tone === 'profissional') {
    if (section === 'features') return 4;
    if (section === 'pricing') return 1;
    if (section === 'cta') return 1;
  }
  return 1;
}
