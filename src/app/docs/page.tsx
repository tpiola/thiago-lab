import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Documentação — PremiumSite OS',
  description: 'Arquitetura em 7 camadas, checklist de QA Clínico e SLA de implantação do PremiumSite OS.',
  alternates: { canonical: 'https://thiagolab.com/docs' },
  robots: 'index, follow',
};

const LAYERS = [
  { n: 1, name: 'Briefing Inteligente', desc: 'Input estruturado: vertical, cidade, serviços, provas, fotos, preços, agenda.' },
  { n: 2, name: 'Geração', desc: 'Estrutura, copy, SEO, schema.org e blocos de conversão a partir do briefing.' },
  { n: 3, name: 'QA Clínico', desc: 'Checklist de conversão, SEO local e prova social antes do deploy (régua >90).' },
  { n: 4, name: 'Deploy & Infra', desc: 'Domínio, SSL, CDN, headers de segurança e cache agressivo de estáticos.' },
  { n: 5, name: 'Conversão', desc: 'WhatsApp com UTM, agendamento, orçamento e schema.org LocalBusiness.' },
  { n: 6, name: 'Monetização', desc: 'Pix / Mercado Pago / Stripe, planos e upsell (integração por conta do cliente).' },
  { n: 7, name: 'Growth', desc: 'SEO local, Google Business Profile, avaliações e rotina de CRO pós-deploy.' },
];

const QA_CHECKLIST = [
  'Domínio próprio + e-mail profissional',
  'SSL + CDN + monitoramento de uptime',
  'Backup automático',
  'GA4 + Search Console + eventos de conversão',
  'Google Business Profile otimizado + rota de avaliações',
  'WhatsApp Business + fluxo de resposta rápido',
  'Agendamento com confirmação',
  'Thank-you pages rastreadas',
  'LGPD: cookies, privacidade, termos, consentimento',
  'Lighthouse >90 nas 4 categorias',
  'Schema.org LocalBusiness/Service/FAQ',
  'Prova social com consentimento',
  'Rotina mensal de CRO e SEO',
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-ios-base">
      <Nav />
      <section className="pt-28 pb-20 px-6">
        <div className="container-ios max-w-3xl">
          <h1 className="heading-display text-[clamp(1.75rem,4vw,2.5rem)] text-ios-text">
            Documentação · PremiumSite OS
          </h1>
          <p className="mt-3 text-ios-text-secondary text-sm leading-relaxed max-w-2xl">
            Arquitetura em 7 camadas, checklist de QA Clínico e o que verificar antes de publicar um site
            gerado pelo <Link href="/briefing" className="text-ios-accent hover:underline">Briefing Inteligente</Link>.
          </p>

          <h2 className="mt-12 text-base font-semibold text-ios-text">Arquitetura em 7 camadas</h2>
          <div className="mt-4 space-y-3">
            {LAYERS.map((layer) => (
              <div key={layer.n} className="card-surface p-4 flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ios-accent/20 bg-ios-accent-dim font-mono text-xs font-bold text-ios-accent">
                  {layer.n}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ios-text">{layer.name}</h3>
                  <p className="text-xs text-ios-text-secondary mt-0.5">{layer.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="mt-12 text-base font-semibold text-ios-text">Checklist de implantação</h2>
          <p className="mt-2 text-xs text-ios-muted">
            O <Link href="/builder" className="text-ios-accent hover:underline">Builder</Link> automatiza a
            verificação estrutural (WhatsApp, LocalBusiness, prova social, FAQ) via QA Clínico. Os demais itens
            abaixo dependem de configuração de infraestrutura e conta do cliente.
          </p>
          <ul className="mt-4 grid sm:grid-cols-2 gap-2.5">
            {QA_CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-ios-text-secondary rounded-lg border border-ios-border bg-ios-surface px-3 py-2.5">
                <span className="mt-0.5 text-ios-accent">□</span>
                {item}
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-base font-semibold text-ios-text">Regras de conteúdo</h2>
          <div className="mt-3 space-y-2 text-sm text-ios-text-secondary leading-relaxed">
            <p>Zero alucinação: a copy gerada deve usar apenas dados informados no briefing.</p>
            <p>Estrutura por bloco: promessa → prova → ação, em cada página gerada.</p>
            <p>
              Setores regulados (saúde, jurídico): linguagem informativa, sem promessa de resultado e sem
              antes/depois indevido.
            </p>
          </div>

          <h2 className="mt-12 text-base font-semibold text-ios-text">SLA</h2>
          <p className="mt-2 text-sm text-ios-text-secondary leading-relaxed">
            Prazos e níveis de suporte são definidos por pacote em{' '}
            <Link href="/pricing" className="text-ios-accent hover:underline">/pricing</Link>. Integrações de
            terceiros (WhatsApp Business API, Pix, Mercado Pago, Stripe, Google Business Profile) dependem de
            credenciais e aprovação da própria conta do cliente.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
