/* ==========================================================================
   templates/hero.tsx — 6 Hero Templates Premium
   Cada template retorna JSX string puro para montagem do site.
   Mobile-first, dark mode support, acessível.
   Prompt → Site React + Tailwind completo (v0/Framer-like).
   thiagolab.com
   ========================================================================== */

import type { Palette } from '../design-tokens';

export interface HeroContext {
  company: string;
  tagline: string;
  subtitle: string;
  cta: string;
  secondaryCta?: string;
  colors: Palette['colors'];
  darkMode: boolean;
}

// ─── 1. CENTER — Título centralizado com animações ──────────────────────────

export function heroCenter(ctx: HeroContext): string {
  const c = ctx.colors;
  return `
<section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[${c.background}]">
  <div className="absolute inset-0 bg-gradient-to-b from-[${c.primary}]/5 via-transparent to-[${c.background}]" />
  <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[${c.secondary}]/5 rounded-full blur-3xl animate-pulse" />
  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[${c.accent}]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
  <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center py-20 md:py-32">
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[${c.border}] text-sm text-[${c.textSecondary}] mb-8">
      <span className="w-2 h-2 rounded-full bg-[${c.secondary}] animate-pulse" />
      <span>Bem-vindo ao futuro</span>
    </div>
    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-[${c.text}] mb-6" data-animate>
      ${ctx.tagline}
    </h1>
    <p className="text-lg md:text-xl text-[${c.textSecondary}] leading-relaxed max-w-2xl mx-auto mb-10" data-animate>
      ${ctx.subtitle}
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center" data-animate>
      <a
        href="#cta"
        className="group inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-[${c.background}] bg-[${c.secondary}] hover:opacity-90 transition-all duration-300 shadow-xl shadow-[${c.secondary}]/20 hover:shadow-2xl hover:shadow-[${c.secondary}]/30"
      >
        <span>${ctx.cta}</span>
        <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
      </a>
      <a
        href="#features"
        className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold border border-[${c.border}] text-[${c.text}] hover:bg-[${c.surface}] transition-all duration-300"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
        ${ctx.secondaryCta || 'Ver demonstração'}
      </a>
    </div>
    <div className="mt-12 flex items-center justify-center gap-8 text-sm text-[${c.textSecondary}]" data-animate>
      <span className="flex items-center gap-2"><svg className="w-4 h-4 text-[${c.secondary}]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Sem cartão de crédito</span>
      <span className="flex items-center gap-2"><svg className="w-4 h-4 text-[${c.secondary}]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Cancele quando quiser</span>
      <span className="flex items-center gap-2"><svg className="w-4 h-4 text-[${c.secondary}]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Suporte 24/7</span>
    </div>
  </div>
</section>`;
}

// ─── 2. SPLIT — Texto + Imagem lado a lado ──────────────────────────────────

export function heroSplit(ctx: HeroContext): string {
  const c = ctx.colors;
  return `
<section className="relative min-h-screen flex items-center overflow-hidden bg-[${c.background}]">
  <div className="absolute inset-0 bg-gradient-to-br from-[${c.primary}]/5 via-transparent to-[${c.secondary}]/5" />
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div className="space-y-8">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-[${c.secondary}]/10 text-[${c.secondary}] text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-[${c.secondary}] mr-2 animate-pulse" />
          ${ctx.company || 'Lançamento oficial'}
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-[${c.text}]" data-animate>
          ${ctx.tagline}
        </h1>
        <p className="text-lg md:text-xl text-[${c.textSecondary}] leading-relaxed max-w-xl" data-animate>
          ${ctx.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4" data-animate>
          <a
            href="#cta"
            className="group inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-[${c.background}] bg-[${c.secondary}] hover:opacity-90 transition-all duration-200 shadow-xl shadow-[${c.secondary}]/20"
          >
            <span>${ctx.cta}</span>
            <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold border border-[${c.border}] text-[${c.text}] hover:bg-[${c.surface}] transition-all duration-200"
          >
            ${ctx.secondaryCta || 'Saiba mais'}
          </a>
        </div>
        <div className="flex items-center gap-6 pt-4" data-animate>
          <div className="flex -space-x-2">
            {[1,2,3,4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-[${c.surface}] border-2 border-[${c.background}] flex items-center justify-center text-xs font-medium text-[${c.textSecondary}]">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <p className="text-sm text-[${c.textSecondary}]">
            <span className="font-semibold text-[${c.text}]">2.000+</span> clientes ativos
          </p>
        </div>
      </div>
      <div className="relative lg:pl-8" data-animate>
        <div className="relative aspect-[4/5] rounded-2xl bg-gradient-to-br from-[${c.secondary}]/20 to-[${c.primary}]/20 overflow-hidden">
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
}

// ─── 3. FULLSCREEN — Gradiente ousado, fundo inteiro ────────────────────────

export function heroFullscreen(ctx: HeroContext): string {
  const c = ctx.colors;
  return `
<section className="relative min-h-screen flex items-center overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-[${c.primary}] via-[${c.primary}]/95 to-[${c.secondary}]/20" />
  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: \`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")\` }} />
  <div className="absolute top-20 left-10 w-64 h-64 bg-[${c.secondary}]/10 rounded-full blur-[100px]" />
  <div className="absolute bottom-20 right-10 w-80 h-80 bg-[${c.accent}]/10 rounded-full blur-[100px]" />
  <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center py-20 md:py-32">
    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-white mb-6" data-animate>
      ${ctx.tagline}
    </h1>
    <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto mb-10" data-animate>
      ${ctx.subtitle}
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center" data-animate>
      <a
        href="#cta"
        className="group inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-[${c.primary}] bg-white hover:bg-white/90 transition-all shadow-2xl"
      >
        <span>${ctx.cta}</span>
        <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
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
}

// ─── 4. ANIMATED — Com gradiente animado e partículas ───────────────────────

export function heroAnimated(ctx: HeroContext): string {
  const c = ctx.colors;
  return `
<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[${c.background}]">
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-[${c.primary}]/20 via-transparent to-[${c.secondary}]/20 animate-gradient" />
    <div className="absolute top-0 -left-4 w-96 h-96 bg-[${c.secondary}]/10 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
    <div className="absolute top-0 -right-4 w-96 h-96 bg-[${c.accent}]/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[${c.primary}]/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
  </div>
  <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center py-20 md:py-32">
    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-white/80 mb-8">
      <span className="w-2 h-2 rounded-full bg-[${c.secondary}] animate-pulse" />
      Agora em beta
    </div>
    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-white mb-6" data-animate>
      ${ctx.tagline}
    </h1>
    <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto mb-10" data-animate>
      ${ctx.subtitle}
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center" data-animate>
      <a
        href="#cta"
        className="group inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-[${c.background}] bg-[${c.secondary}] hover:opacity-90 transition-all shadow-xl"
      >
        <span>${ctx.cta}</span>
        <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
      </a>
      <a
        href="#features"
        className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-white border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
        Assistir demo
      </a>
    </div>
  </div>
  <style jsx>{\`
    @keyframes blob {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(20px, -30px) scale(1.1); }
      50% { transform: translate(-20px, 20px) scale(0.9); }
      75% { transform: translate(30px, 10px) scale(1.05); }
    }
    @keyframes gradient {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
    .animate-blob { animation: blob 10s infinite; }
    .animate-gradient { animation: gradient 8s ease infinite; }
    .animation-delay-2000 { animation-delay: 2s; }
    .animation-delay-4000 { animation-delay: 4s; }
  \`}</style>
</section>`;
}

// ─── 5. VIDEO — Hero com placeholder de vídeo/mídia ────────────────────────

export function heroVideo(ctx: HeroContext): string {
  const c = ctx.colors;
  return `
<section className="relative min-h-screen flex items-center overflow-hidden bg-[${c.background}]">
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-t from-[${c.background}] via-[${c.background}]/60 to-transparent z-10" />
    <div className="absolute inset-0 bg-gradient-to-r from-[${c.primary}]/30 to-transparent z-10" />
    <div className="w-full h-full bg-gradient-to-br from-[${c.primary}] to-[${c.primary}]/80">
      <div className="w-full h-full opacity-20" style={{
        backgroundImage: \`url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")\`
      }} />
    </div>
  </div>
  <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
    <div className="max-w-3xl">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-white/80 mb-8">
        <svg className="w-4 h-4 text-[${c.secondary}]" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
        Assista ao vídeo
      </div>
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-white mb-6" data-animate>
        ${ctx.tagline}
      </h1>
      <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-xl mb-10" data-animate>
        ${ctx.subtitle}
      </p>
      <div className="flex flex-col sm:flex-row gap-4" data-animate>
        <a
          href="#cta"
          className="group inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-[${c.background}] bg-[${c.secondary}] hover:opacity-90 transition-all shadow-xl"
        >
          <span>${ctx.cta}</span>
          <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </a>
        <a
          href="#features"
          className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-white border border-white/30 hover:bg-white/10 transition-all"
        >
          ${ctx.secondaryCta || 'Saiba mais'}
        </a>
      </div>
    </div>
  </div>
</section>`;
}

// ─── 6. MINIMAL — Limpo, pouco texto, foco no CTA ──────────────────────────

export function heroMinimal(ctx: HeroContext): string {
  const c = ctx.colors;
  return `
<section className="relative min-h-[80vh] flex items-center justify-center bg-[${c.background}]">
  <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center py-20">
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[${c.secondary}] mb-6">
      ${ctx.company || 'Novo'}
    </p>
    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-[${c.text}] mb-6" data-animate>
      ${ctx.tagline}
    </h1>
    <p className="text-base md:text-lg text-[${c.textSecondary}] leading-relaxed max-w-xl mx-auto mb-10" data-animate>
      ${ctx.subtitle}
    </p>
    <div data-animate>
      <a
        href="#cta"
        className="group inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold text-[${c.background}] bg-[${c.secondary}] hover:opacity-90 transition-all shadow-lg"
      >
        <span>${ctx.cta}</span>
        <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
      </a>
    </div>
  </div>
</section>`;
}

// ─── Render Router ───────────────────────────────────────────────────────────

export type HeroTemplate = 'center' | 'split' | 'fullscreen' | 'animated' | 'video' | 'minimal';

const HERO_RENDERERS: Record<HeroTemplate, (ctx: HeroContext) => string> = {
  center: heroCenter,
  split: heroSplit,
  fullscreen: heroFullscreen,
  animated: heroAnimated,
  video: heroVideo,
  minimal: heroMinimal,
};

export function renderHero(template: HeroTemplate, ctx: HeroContext): string {
  const renderer = HERO_RENDERERS[template] || HERO_RENDERERS.center;
  return renderer(ctx);
}

export function getRecommendedHero(type: string): HeroTemplate {
  const lower = type.toLowerCase();
  if (/landing|institucional|health|education/i.test(lower)) return 'center';
  if (/saas|app|agency|ecommerce/i.test(lower)) return 'split';
  if (/portfolio|restaurant|event/i.test(lower)) return 'fullscreen';
  if (/blog|minimal/i.test(lower)) return 'minimal';
  return 'center';
}
