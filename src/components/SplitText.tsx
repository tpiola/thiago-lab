'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/* ─── Split Text Animation ─────────────────────────────
 * Anima letras ou palavras individualmente com stagger
 * Modos: 'chars' | 'words' | 'lines'
 * ───────────────────────────────────────────────────── */

interface SplitTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  mode?: 'chars' | 'words';
  delay?: number;
  stagger?: number;
  once?: boolean;
}

export function SplitText({
  text,
  as: Tag = 'h1',
  className = '',
  mode = 'chars',
  delay = 0,
  stagger = 0.03,
  once = true,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            hasAnimated.current = true;
            el.classList.add('is-visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (mode === 'words') {
    const words = text.split(' ');
    return (
      <Tag ref={ref as any} className={`split-text ${className}`}>
        <span className="sr-only">{text}</span>
        <span aria-hidden="true" className="inline-flex flex-wrap">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="split-word inline-block mr-[0.25em]"
              initial={{ opacity: 0, y: 30, rotateX: -90 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: delay + i * stagger,
                ease: [0.19, 1, 0.22, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
        </span>
      </Tag>
    );
  }

  // chars mode
  const chars = text.split('');
  return (
    <Tag ref={ref as any} className={`split-text ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {chars.map((char, i) => (
          <motion.span
            key={i}
            className="split-char inline-block"
            initial={{ opacity: 0, y: 40, rotateZ: -10 }}
            whileInView={{ opacity: 1, y: 0, rotateZ: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: delay + i * stagger,
              ease: [0.19, 1, 0.22, 1],
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
    </Tag>
  );
}
