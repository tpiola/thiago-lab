'use client';

/* ==========================================================================
   /briefing — PremiumSite OS · Briefing Inteligente
   Wizard estruturado (vertical, cidade, serviços, provas, canais, pagamento)
   que gera um projeto pronto no Builder para negócios locais brasileiros.
   ========================================================================== */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Plus, Trash2, Sparkles, Check } from 'lucide-react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { BuilderProvider, useBuilderStore } from '@/components/Builder/BuilderStore';
import { TEMPLATES } from '@/components/Builder/BuilderTypes';
import type { BuilderBlock } from '@/components/Builder/BuilderTypes';

const VERTICALS = [
  { id: 'local-clinica-saude', label: 'Clínica de Saúde', icon: '🩺' },
  { id: 'local-juridico', label: 'Escritório de Advocacia', icon: '⚖️' },
  { id: 'local-estetica', label: 'Estúdio de Estética', icon: '✨' },
  { id: 'local-oficina', label: 'Oficina Mecânica', icon: '🔧' },
  { id: 'local-imobiliaria', label: 'Imobiliária', icon: '🏠' },
  { id: 'local-servicos-gerais', label: 'Serviços Gerais', icon: '🧰' },
];

const PAYMENT_METHODS = ['Pix', 'Cartão', 'Mercado Pago', 'Stripe'];

interface ServiceItem {
  name: string;
  price: string;
}

const STEPS = ['Negócio', 'Serviços', 'Provas & Diferenciais', 'Canais & Pagamento', 'Revisão'];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'site';
}

function BriefingContent() {
  const router = useRouter();
  const { createProjectFromBlocks, dispatch } = useBuilderStore();
  const [step, setStep] = useState(0);

  const [vertical, setVertical] = useState(VERTICALS[0].id);
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');
  const [areaServed, setAreaServed] = useState('');

  const [services, setServices] = useState<ServiceItem[]>([{ name: '', price: '' }]);

  const [differentiators, setDifferentiators] = useState('');
  const [testimonialName, setTestimonialName] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  const [testimonialConsent, setTestimonialConsent] = useState(false);

  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bookingRules, setBookingRules] = useState('');
  const [payments, setPayments] = useState<string[]>(['Pix']);
  const [regulatory, setRegulatory] = useState('');

  const togglePayment = (m: string) => {
    setPayments((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const updateService = (i: number, field: keyof ServiceItem, value: string) => {
    setServices((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  };

  const addService = () => setServices((prev) => [...prev, { name: '', price: '' }]);
  const removeService = (i: number) => setServices((prev) => prev.filter((_, idx) => idx !== i));

  const handleGenerate = () => {
    const template = TEMPLATES.find((t) => t.id === vertical);
    if (!template) return;

    const filledServices = services.filter((s) => s.name.trim());
    const digits = whatsapp.replace(/\D/g, '');
    const address = [city, uf].filter(Boolean).join(', ');

    const blocks: BuilderBlock[] = template.blocks.map((block) => {
      switch (block.type) {
        case 'hero':
          return {
            ...block,
            props: {
              ...block.props,
              title: businessName ? `${businessName}` : (block.props.title as string),
              subtitle: differentiators.trim()
                ? differentiators.trim().slice(0, 160)
                : (block.props.subtitle as string),
            },
          };
        case 'features':
          return filledServices.length
            ? {
                ...block,
                props: {
                  ...block.props,
                  title: 'Serviços',
                  items: filledServices.map((s) => ({
                    icon: '✓',
                    title: s.name,
                    desc: s.price ? `A partir de R$ ${s.price}` : 'Consulte disponibilidade',
                  })),
                },
              }
            : block;
        case 'testimonials':
          return testimonialConsent && testimonialText.trim()
            ? {
                ...block,
                props: {
                  ...block.props,
                  items: [
                    {
                      name: testimonialName.trim() || 'Cliente',
                      role: 'Depoimento com consentimento',
                      text: testimonialText.trim(),
                    },
                  ],
                },
              }
            : block;
        case 'faq': {
          if (!payments.length) return block;
          const items = [...((block.props.items as Array<Record<string, string>>) || [])];
          items.push({ q: 'Quais formas de pagamento vocês aceitam?', a: `Aceitamos ${payments.join(', ')}.` });
          return { ...block, props: { ...block.props, items } };
        }
        case 'localBusiness':
          return {
            ...block,
            props: {
              ...block.props,
              businessName: businessName || (block.props.businessName as string),
              addressLocality: city || (block.props.addressLocality as string),
              addressRegion: uf || (block.props.addressRegion as string),
              phone: phone || (block.props.phone as string),
              openingHours: bookingRules.trim() || (block.props.openingHours as string),
              areaServed: areaServed || address || (block.props.areaServed as string),
            },
          };
        case 'whatsapp':
          return {
            ...block,
            props: {
              ...block.props,
              phone: digits || (block.props.phone as string),
              source: slugify(businessName || vertical),
            },
          };
        case 'contact':
          return {
            ...block,
            props: {
              ...block.props,
              email: email || (block.props.email as string),
              phone: phone || whatsapp || (block.props.phone as string),
              address: address || (block.props.address as string),
            },
          };
        case 'footer':
          return {
            ...block,
            props: {
              ...block.props,
              copyright: businessName
                ? `© ${new Date().getFullYear()} ${businessName}. Todos os direitos reservados.`
                : (block.props.copyright as string),
            },
          };
        default:
          return block;
      }
    });

    const project = createProjectFromBlocks(businessName || `Site — ${template.name}`, blocks);
    dispatch({ type: 'SET_PROJECT', project });
    router.push(`/builder/${project.id}`);
  };

  const canAdvance =
    step !== 0 || (businessName.trim().length > 0 && city.trim().length > 0);

  return (
    <main className="min-h-screen bg-ios-base">
      <Nav />

      <section className="relative pt-28 pb-20 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(61,245,197,0.06),transparent_70%)]" />
        <div className="container-ios relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-ios-accent/15 bg-ios-accent-dim px-4 py-1.5 mb-6">
              <Sparkles size={12} className="text-ios-accent" />
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ios-accent">
                PremiumSite OS · Briefing Inteligente
              </span>
            </div>
            <h1 className="heading-display text-[clamp(1.75rem,4.5vw,2.75rem)] text-ios-text">
              Do briefing ao site pronto, em minutos
            </h1>
            <p className="mt-3 text-ios-text-secondary text-base leading-relaxed max-w-xl">
              Responda o briefing estruturado do seu negócio local e geramos um projeto completo —
              WhatsApp com UTM, LocalBusiness (SEO), serviços, depoimentos e FAQ — pronto para editar no Builder.
            </p>
          </motion.div>

          {/* ── Progresso ── */}
          <div className="mt-10 flex items-center gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
                    i < step
                      ? 'bg-ios-accent text-ios-base'
                      : i === step
                        ? 'border-2 border-ios-accent text-ios-accent'
                        : 'border border-ios-border text-ios-muted'
                  }`}
                >
                  {i < step ? <Check size={13} /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-px flex-1 ${i < step ? 'bg-ios-accent' : 'bg-ios-border'}`} />
                )}
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] font-mono uppercase tracking-wider text-ios-muted">
            Etapa {step + 1} de {STEPS.length} · {STEPS[step]}
          </p>

          {/* ── Steps ── */}
          <div className="card-surface mt-6 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                {step === 0 && (
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-ios-muted">Vertical do negócio</label>
                      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {VERTICALS.map((v) => (
                          <button
                            key={v.id}
                            onClick={() => setVertical(v.id)}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                              vertical === v.id
                                ? 'border-ios-accent bg-ios-accent-dim text-ios-text'
                                : 'border-ios-border text-ios-text-secondary hover:border-ios-accent/40'
                            }`}
                          >
                            <span className="text-base">{v.icon}</span>
                            {v.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Field label="Nome do negócio *" value={businessName} onChange={setBusinessName} placeholder="Ex: Clínica Vida Plena" />
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Cidade *" value={city} onChange={setCity} placeholder="Franca" />
                      <Field label="UF" value={uf} onChange={setUf} placeholder="SP" />
                    </div>
                    <Field label="Áreas atendidas" value={areaServed} onChange={setAreaServed} placeholder="Franca e região" />
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-ios-muted">Serviços com preço/faixa</label>
                    {services.map((s, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input
                          value={s.name}
                          onChange={(e) => updateService(i, 'name', e.target.value)}
                          placeholder="Nome do serviço"
                          className="flex-1 bg-ios-base border border-ios-border rounded-lg px-3 py-2 text-sm text-ios-text focus:border-ios-accent focus:outline-none"
                        />
                        <input
                          value={s.price}
                          onChange={(e) => updateService(i, 'price', e.target.value)}
                          placeholder="Preço (opcional)"
                          className="w-36 bg-ios-base border border-ios-border rounded-lg px-3 py-2 text-sm text-ios-text focus:border-ios-accent focus:outline-none"
                        />
                        <button onClick={() => removeService(i)} className="p-2 text-ios-muted hover:text-ios-error transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button onClick={addService} className="btn-outline gap-1.5 px-3 py-1.5 text-[11px]">
                      <Plus size={13} /> Adicionar serviço
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <TextArea label="Diferenciais comprováveis" value={differentiators} onChange={setDifferentiators} placeholder="Atendimento humanizado, 15 anos de experiência, equipe certificada..." />
                    <div className="rounded-lg border border-ios-border p-4 space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-ios-muted">Prova social (com consentimento)</p>
                      <Field label="Nome do cliente/paciente" value={testimonialName} onChange={setTestimonialName} placeholder="Iniciais ou nome com autorização" />
                      <TextArea label="Depoimento" value={testimonialText} onChange={setTestimonialText} placeholder="Texto do depoimento" />
                      <label className="flex items-center gap-2 text-xs text-ios-text-secondary">
                        <input type="checkbox" checked={testimonialConsent} onChange={(e) => setTestimonialConsent(e.target.checked)} className="accent-ios-accent" />
                        Tenho consentimento explícito para publicar este depoimento
                      </label>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="WhatsApp (DDD + número)" value={whatsapp} onChange={setWhatsapp} placeholder="16999999999" />
                      <Field label="Telefone" value={phone} onChange={setPhone} placeholder="+55 16 99999-9999" />
                    </div>
                    <Field label="E-mail" value={email} onChange={setEmail} placeholder="contato@seunegocio.com.br" />
                    <TextArea label="Regras de agenda/booking" value={bookingRules} onChange={setBookingRules} placeholder="Mo-Fr 08:00-18:00" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ios-muted mb-2">Pagamentos aceitos</p>
                      <div className="flex flex-wrap gap-2">
                        {PAYMENT_METHODS.map((m) => (
                          <button
                            key={m}
                            onClick={() => togglePayment(m)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                              payments.includes(m)
                                ? 'border-ios-accent bg-ios-accent-dim text-ios-text'
                                : 'border-ios-border text-ios-text-secondary hover:border-ios-accent/40'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                    <TextArea label="Restrições regulatórias do setor (opcional)" value={regulatory} onChange={setRegulatory} placeholder="Ex: sem promessa de resultado, sem antes/depois indevido..." />
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <p className="text-sm text-ios-text-secondary">
                      Revise as informações abaixo. Ao gerar, um projeto completo será criado no Builder —
                      você poderá editar qualquer bloco antes de publicar.
                    </p>
                    <dl className="grid grid-cols-2 gap-3 text-xs">
                      <SummaryItem label="Vertical" value={VERTICALS.find((v) => v.id === vertical)?.label} />
                      <SummaryItem label="Negócio" value={businessName || '—'} />
                      <SummaryItem label="Cidade/UF" value={[city, uf].filter(Boolean).join(', ') || '—'} />
                      <SummaryItem label="Serviços" value={String(services.filter((s) => s.name.trim()).length)} />
                      <SummaryItem label="WhatsApp" value={whatsapp || '—'} />
                      <SummaryItem label="Pagamentos" value={payments.join(', ') || '—'} />
                    </dl>
                    {regulatory.trim() && (
                      <p className="text-[11px] text-ios-warning bg-ios-warning/10 border border-ios-warning/20 rounded-lg p-3">
                        Restrição regulatória registrada — revise a copy gerada no Builder antes de publicar.
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ── Nav ── */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="btn-outline gap-1.5 px-4 py-2 text-xs disabled:opacity-30"
              >
                <ArrowLeft size={14} /> Voltar
              </button>
              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                  disabled={!canAdvance}
                  className="btn-accent gap-1.5 px-4 py-2 text-xs disabled:opacity-40"
                >
                  Próximo <ArrowRight size={14} />
                </button>
              ) : (
                <button onClick={handleGenerate} className="btn-accent gap-1.5 px-5 py-2.5 text-xs font-semibold">
                  <Sparkles size={14} /> Gerar site no Builder
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-ios-muted">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-ios-base border border-ios-border rounded-lg px-3 py-2 text-sm text-ios-text placeholder:text-ios-muted/50 focus:border-ios-accent focus:outline-none transition-colors"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-ios-muted">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-ios-base border border-ios-border rounded-lg px-3 py-2 text-sm text-ios-text placeholder:text-ios-muted/50 focus:border-ios-accent focus:outline-none transition-colors resize-none"
      />
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-lg border border-ios-border bg-ios-base px-3 py-2">
      <dt className="text-[10px] uppercase tracking-wider text-ios-muted">{label}</dt>
      <dd className="mt-0.5 text-ios-text font-medium truncate">{value}</dd>
    </div>
  );
}

export default function BriefingPage() {
  return (
    <BuilderProvider>
      <BriefingContent />
    </BuilderProvider>
  );
}

