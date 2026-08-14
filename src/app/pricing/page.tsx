'use client';

/* ==========================================================================
   /pricing — PremiumSite OS · Pacotes comerciais
   ========================================================================== */

import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

const PACKAGES = [
  {
    name: 'Site Premium + Conversão',
    range: 'R$ 8.000 – R$ 15.000',
    description: 'Setup único',
    features: [
      'Site completo (sitemap ponta a ponta)',
      'WhatsApp com UTM + agendamento',
      'LGPD (privacidade, termos, cookies)',
      'SEO local base + schema.org LocalBusiness',
      'QA Clínico (régua >90)',
    ],
    featured: false,
  },
  {
    name: 'Site + Engine de Receita',
    range: 'R$ 18.000 – R$ 30.000',
    description: 'Setup único',
    features: [
      'Tudo do plano anterior',
      'Pix / sinal de agendamento',
      'CRM e dashboard de leads',
      'SEO local avançado + Google Business Profile',
      'Automações de atendimento',
    ],
    featured: true,
  },
  {
    name: 'Multiunidade / Rede',
    range: 'R$ 40.000 – R$ 80.000',
    description: 'Setup único',
    features: [
      'Tudo do plano anterior',
      'Governança multiunidade',
      'BI e relatórios executivos',
      'Integrações personalizadas',
      'Growth ops dedicado',
    ],
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-ios-base">
      <Nav />

      <section className="relative pt-28 pb-16 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(61,245,197,0.06),transparent_70%)]" />
        <div className="container-ios relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-ios-accent/15 bg-ios-accent-dim px-4 py-1.5 mb-6">
              <Sparkles size={12} className="text-ios-accent" />
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ios-accent">
                PremiumSite OS
              </span>
            </div>
            <h1 className="heading-display text-[clamp(2rem,5vw,3.5rem)] text-ios-text">
              Infraestrutura de receita local, não apenas um site
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-ios-text-secondary text-base leading-relaxed">
              Site premium + conversão (WhatsApp/agendamento/Pix) + SEO local + LGPD + dashboard + growth,
              embalado para negócios locais brasileiros.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-16 px-6">
        <div className="container-ios grid gap-6 lg:grid-cols-3">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`card-surface p-6 flex flex-col ${pkg.featured ? 'border-ios-accent shadow-ios-glow-md' : ''}`}
            >
              {pkg.featured && (
                <span className="self-start mb-3 rounded-full bg-ios-accent text-ios-base text-[10px] font-bold uppercase tracking-wider px-3 py-1">
                  Mais escolhido
                </span>
              )}
              <h3 className="text-lg font-semibold text-ios-text">{pkg.name}</h3>
              <div className="mt-2 text-2xl font-bold text-ios-accent font-mono">{pkg.range}</div>
              <p className="text-xs text-ios-muted mb-6">{pkg.description}</p>
              <ul className="space-y-2.5 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ios-text-secondary">
                    <Check size={15} className="mt-0.5 shrink-0 text-ios-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/briefing"
                className={`mt-6 text-center text-xs font-semibold px-4 py-2.5 rounded-lg transition-all ${
                  pkg.featured ? 'btn-accent' : 'btn-outline'
                }`}
              >
                Começar briefing
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="card-surface mt-6 p-6 text-center max-w-xl mx-auto"
        >
          <h3 className="text-sm font-semibold text-ios-text">Recorrência de growth</h3>
          <p className="mt-2 text-2xl font-bold text-ios-accent font-mono">R$ 1.500 – R$ 5.000/mês</p>
          <p className="mt-2 text-xs text-ios-text-secondary">
            CRO, SEO local, conteúdo, manutenção e relatório executivo mensal.
          </p>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
