'use client';

import { useState, type FormEvent } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import styles from './OfertaSection.module.css';

/* ─── Types ─── */

interface LeadFormProps {
  onSuccess?: () => void;
}

function LeadForm({ onSuccess }: LeadFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Erro ao cadastrar. Tente novamente.');
      }

      setStatus('success');
      onSuccess?.();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Erro inesperado.');
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.formSuccess}>
        <span>✓</span> Feito! Você está dentro. Cheque seu email.
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <input
        type="email"
        required
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.formInput}
        disabled={status === 'loading'}
        autoComplete="email"
      />
      <button
        type="submit"
        className={styles.formButton}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <><span className="spinner-accent" /> Enviando…</>
        ) : (
          '▶ Quero acesso gratuito'
        )}
      </button>
      {status === 'error' && (
        <p className={styles.formError}>{errorMsg}</p>
      )}
    </form>
  );
}

/* ─── Tiers Data ─── */

interface Tier {
  id: string;
  name: string;
  price: string;
  priceLabel: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref?: string;
  ctaVariant: 'primary' | 'secondary' | 'whatsapp';
  featured?: boolean;
  badge?: string;
  hasForm?: boolean;
}

const TIERS: Tier[] = [
  {
    id: 'lab-lite',
    name: 'Lab Lite',
    price: 'Grátis',
    priceLabel: 'acesso imediato',
    description:
      'O ponto de partida. Conteúdo e experimentos direto do laboratório — sem enrolação, sem curso de 47 módulos.',
    features: [
      'Newsletter com códigos e insights reais',
      'Acesso a ferramentas experimentais',
      'Comunidade no Discord',
      'Zero promessas de milhão',
    ],
    ctaLabel: '▶ Quero acesso gratuito',
    ctaVariant: 'primary',
    hasForm: true,
  },
  {
    id: 'lab-pro',
    name: 'Lab Pro',
    price: 'R$ 97',
    priceLabel: '/mês · cancele quando quiser',
    description:
      'Automações sob demanda. Você traz o problema, eu trago o código. Sem contrato fidelidade, sem frescura.',
    features: [
      '1 automação personalizada por mês',
      'Suporte direto via WhatsApp',
      'Repositório exclusivo de agentes',
      'Acesso antecipado a novos experimentos',
    ],
    ctaLabel: 'Assinar Lab Pro',
    ctaHref: '#',
    ctaVariant: 'secondary',
    badge: 'Mais popular',
    featured: true,
  },
  {
    id: 'thiago-lab-os',
    name: 'Thiago Lab OS',
    price: 'R$ 497',
    priceLabel: '/mês · contrato trimestral',
    description:
      'Seu negócio roda no Intelligence OS. Sistemas completos, agentes dedicados e integrações que realmente funcionam — não é PowerPoint.',
    features: [
      'Infraestrutura de IA completa',
      'Agentes dedicados para seu negócio',
      'Integrações com CRM, e-mail, ERP',
      'Dashboard e relatórios em tempo real',
    ],
    ctaLabel: 'Ver plano completo',
    ctaHref: '#',
    ctaVariant: 'secondary',
  },
  {
    id: 'construcao-guiada',
    name: 'Construção Guiada',
    price: 'Sob medida',
    priceLabel: 'projetos de alto valor',
    description:
      'Projetos do zero, construídos lado a lado. Ideal se você quer um sistema único — não um template genérico que promete resolver tudo.',
    features: [
      'Diagnóstico completo do seu negócio',
      'Arquitetura personalizada',
      'Desenvolvimento iterativo (sprints)',
      'Suporte direto com Thiago',
    ],
    ctaLabel: 'Falar no WhatsApp',
    ctaHref: 'https://wa.me/5511999999999',
    ctaVariant: 'whatsapp',
  },
];

/* ─── CTA Button Renderer ─── */

function CtaButton({ tier }: { tier: Tier }) {
  const variantClass =
    tier.ctaVariant === 'primary'
      ? styles.ctaPrimary
      : tier.ctaVariant === 'whatsapp'
        ? styles.ctaWhatsApp
        : styles.ctaSecondary;

  const icon =
    tier.ctaVariant === 'whatsapp' ? (
      <MessageCircle size={14} />
    ) : (
      <ArrowUpRight size={14} />
    );

  if (tier.hasForm && tier.id === 'lab-lite') {
    return null; // Form is rendered separately
  }

  return (
    <a
      href={tier.ctaHref || '#'}
      className={`${styles.cta} ${variantClass}`}
      {...(tier.ctaVariant === 'whatsapp' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {tier.ctaLabel}
      {icon}
    </a>
  );
}

/* ─── Component ─── */

export function OfertaSection() {
  return (
    <section className={styles.section} id="ofertas">
      {/* Scanline decoration */}
      <div className={styles.scanlineDecoration} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Header */}
        <header className={styles.header}>
          <p className={styles.label}>/ofertas</p>
          <h2 className={styles.title}>
            Escolha seu{' '}
            <span className={styles.titleAccent}>degrau</span>
          </h2>
          <p className={styles.subtitle}>
            Quatro níveis de acesso ao Intelligence OS. Do gratuito ao
            sob medida — sem pegadinha, sem funil invertido, sem apelo emocional.
          </p>
        </header>

        {/* Cards Grid */}
        <div className={styles.grid}>
          {TIERS.map((tier) => (
            <article
              key={tier.id}
              className={`${styles.card} ${tier.featured ? styles.cardFeatured : ''}`}
            >
              {/* Badge */}
              {tier.badge && (
                <span className={styles.badge}>{tier.badge}</span>
              )}

              {/* Terminal top bar */}
              <div className={styles.cardTop}>
                <span className={styles.cardPrompt}>$</span>
                <span
                  className={`${styles.cardTier} ${tier.id === 'lab-lite' ? styles.cardTierFree : ''}`}
                >
                  ./{tier.id}
                </span>
              </div>

              {/* Body */}
              <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{tier.name}</h3>
                <p className={styles.cardPrice}>{tier.price}</p>
                <p className={styles.cardPriceLabel}>{tier.priceLabel}</p>
                <p className={styles.cardDesc}>{tier.description}</p>

                {/* Features */}
                <ul className={styles.features}>
                  {tier.features.map((feat, i) => (
                    <li key={i} className={styles.featureItem}>
                      <span className={styles.featureIcon}>◆</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* Lead form for Lab Lite */}
                {tier.hasForm && tier.id === 'lab-lite' && <LeadForm />}

                {/* CTA for other tiers */}
                <CtaButton tier={tier} />
              </div>
            </article>
          ))}
        </div>

        {/* Disclaimer */}
        <footer className={styles.disclaimer}>
          <p className={styles.disclaimerText}>
            $ Todos os planos com garantia de 7 dias. Sem fidelidade nos
            planos mensais. O Thiago Lab não promete resultados financeiros —
            entrega código, sistema e suporte de verdade.
          </p>
        </footer>
      </div>
    </section>
  );
}

export default OfertaSection;
