'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { ArrowRight, ChevronRight } from 'lucide-react';

import { SplineScene } from './SplineScene';
import styles from './Hero.module.css';

/* ─── Types ─── */
interface HeroProps {
  /** Spline 3D scene URL (.spline) */
  splineSceneUrl?: string;
  /** Headline text */
  headline?: string;
  /** Highlighted portion of headline (wrapped in gradient span) */
  headlineHighlight?: string;
  /** Terminal capabilities to type */
  capabilities?: string[];
  /** Primary CTA config */
  primaryCta?: { label: string; href: string };
  /** Secondary CTA config */
  secondaryCta?: { label: string; href: string };
}

/* ─── Defaults ─── */
const DEFAULT_CAPABILITIES = [
  'Sistemas inteligentes',
  'Automações sob medida',
  'Produtos digitais',
];

const DEFAULT_SPLINE_URL =
  'https://prod.spline.design/6WqMiqWejMFmBmFf/scene.spline';

/* ─── Hook: prefers-reduced-motion ─── */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

/* ─── Hook: Terminal Typewriter with GSAP ─── */
function useTerminalTypewriter(
  terminalRef: React.RefObject<HTMLSpanElement | null>,
  capabilities: string[],
  reducedMotion: boolean
) {
  useEffect(() => {
    const el = terminalRef.current;
    if (!el || capabilities.length === 0) return;

    if (reducedMotion) {
      // Static fallback — show all capabilities separated by a pipe
      el.textContent = capabilities.join(' | ');
      return;
    }

    const ctx = gsap.context(() => {
      const lines = capabilities;
      let fullText = '';
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });

      lines.forEach((line, i) => {
        const prefix = i === 0 ? '> ' : '  ';
        const typedLine = prefix + line;

        tl.to(el, {
          duration: 0.02 * typedLine.length,
          text: {
            value: fullText + typedLine,
            delimiter: '',
          },
          ease: 'none',
        });

        fullText += typedLine + '\n';
      });

      // Pause at full text, then clear
      tl.to(
        el,
        {
          duration: 2,
          ease: 'none',
        },
        '+=0.5'
      );

      tl.to(el, {
        duration: 0.5,
        text: { value: '', delimiter: '' },
        ease: 'power2.in',
      });

      tl.to(
        el,
        {
          duration: 0.02 * lines[0].length,
          text: { value: '> ' + lines[0], delimiter: '' },
          ease: 'none',
        },
        '+=0.10'
      );
    });

    return () => ctx.revert();
  }, [terminalRef, capabilities, reducedMotion]);
}

/* ─── Hook: entrance animations ─── */
function useEntranceAnimations(
  containerRef: React.RefObject<HTMLDivElement | null>,
  reducedMotion: boolean
) {
  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const children = containerRef.current?.children;
      if (!children) return;

      gsap.fromTo(
        children,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          delay: 0.2,
        }
      );
    });

    return () => ctx.revert();
  }, [containerRef, reducedMotion]);
}

/* ─── Component ─── */
export function Hero({
  splineSceneUrl = DEFAULT_SPLINE_URL,
  headline = 'IA aplicada para transformar ideias em',
  headlineHighlight = 'sistemas, automações e produtos digitais.',
  capabilities = DEFAULT_CAPABILITIES,
  primaryCta = { label: 'Vamos conversar', href: '#contato' },
  secondaryCta = { label: 'Ver projetos', href: '#projetos' },
}: HeroProps) {
  const reducedMotion = useReducedMotion();
  const terminalRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [splineReady, setSplineReady] = useState(false);

  // Intersection Observer for lazy Spline
  const { ref: sectionRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });

  // Start terminal typewriter
  useTerminalTypewriter(terminalRef, capabilities, reducedMotion);

  // Entrance animations
  useEntranceAnimations(contentRef, reducedMotion);

  // Enable Spline when section is in view (and not reduced-motion)
  const showSpline = inView && !reducedMotion && splineSceneUrl.length > 0;

  const handleSplineLoad = useCallback(() => {
    setSplineReady(true);
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero} id="hero">
      {/* ── Spline 3D Background ── */}
      {showSpline && (
        <div className={styles.splineWrapper}>
          <SplineScene
            sceneUrl={splineSceneUrl}
            className={styles.splineScene}
          />
          <div className={styles.splineFallback}>
            <div className="h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
          </div>
        </div>
      )}

      {/* ── Static gradient fallback (Spline not loaded / reduced motion) ── */}
      {(!showSpline || reducedMotion) && (
        <div
          className={styles.splineFallback}
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        >
          <div className="h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute left-1/3 top-1/4 h-48 w-48 rounded-full bg-purple-500/8 blur-3xl" />
        </div>
      )}

      {/* ── Content ── */}
      <div ref={contentRef} className={styles.content}>
        {/* Headline */}
        <h1 className={styles.headline}>
          {headline}{' '}
          <span className={styles.highlight}>{headlineHighlight}</span>
        </h1>

        {/* Terminal */}
        <div className={styles.terminal}>
          <span className={styles.terminalPrompt}>&gt;</span>
          <span ref={terminalRef} className={styles.terminalText}>
            {reducedMotion
              ? capabilities.join(' | ')
              : capabilities[0]
              ? `> ${capabilities[0]}`
              : ''}
          </span>
          {!reducedMotion && <span className={styles.terminalCursor} />}
        </div>

        {/* CTAs */}
        <div className={styles.ctas}>
          <a href={primaryCta.href} className={styles.ctaPrimary}>
            {primaryCta.label}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
          <a href={secondaryCta.href} className={styles.ctaSecondary}>
            {secondaryCta.label}
            <ChevronRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
