'use client';
import { useEffect, useRef, useState } from 'react';

/* ─── Animated Counter ────────────────────────────────
 * Anima um número de 0 até o valor alvo no scroll
 * ───────────────────────────────────────────────────── */

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedCounter({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            hasAnimated.current = true;
            const startTime = performance.now();
            const step = (now: number) => {
              const elapsed = (now - startTime) / 1000;
              const progress = Math.min(elapsed / duration, 1);
              // ease-out quart
              const eased = 1 - Math.pow(1 - progress, 3);
              setCount(Math.floor(eased * end));
              if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className={`counter-animate ${className}`}>
      {prefix}{count}{suffix}
    </span>
  );
}
