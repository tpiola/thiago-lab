'use client';

/* ==========================================================================
   QAChecklist — QA Clínico do PremiumSite OS
   Checklist determinístico de pré-deploy (régua >90) baseado nos blocks
   do projeto: conversão (WhatsApp), SEO local (LocalBusiness), prova social,
   quebra de objeção (FAQ) e estrutura mínima da página.
   ========================================================================== */

import { CheckCircle2, XCircle, X } from 'lucide-react';
import type { BuilderBlock } from './BuilderTypes';

interface ChecklistItem {
  label: string;
  pass: boolean;
}

function computeChecklist(blocks: BuilderBlock[]): ChecklistItem[] {
  const byType = (type: string) => blocks.filter((b) => b.type === type);
  const hero = byType('hero')[0];
  const whatsapp = byType('whatsapp')[0];
  const localBusiness = byType('localBusiness')[0];
  const testimonials = byType('testimonials')[0];
  const faq = byType('faq')[0];
  const contact = byType('contact')[0];
  const footer = byType('footer')[0];

  const str = (v: unknown) => String(v ?? '').trim();
  const arr = (v: unknown) => (Array.isArray(v) ? v : []);

  return [
    { label: 'Hero com promessa clara (título e subtítulo preenchidos)', pass: !!hero && !!str(hero.props.title) && !!str(hero.props.subtitle) },
    { label: 'CTA WhatsApp com telefone configurado e UTM de campanha', pass: !!whatsapp && !!str(whatsapp.props.phone).replace(/\D/g, '') },
    { label: 'WhatsApp com mensagem personalizada (não genérica/vazia)', pass: !!whatsapp && str(whatsapp.props.message).length > 0 },
    { label: 'Schema.org LocalBusiness com nome, cidade e telefone', pass: !!localBusiness && !!str(localBusiness.props.businessName) && !!str(localBusiness.props.addressLocality) && !!str(localBusiness.props.phone) },
    { label: 'LocalBusiness com avaliação (prova social estruturada)', pass: !!localBusiness && !!str(localBusiness.props.ratingValue) },
    { label: 'Prova social — depoimentos com consentimento preenchidos', pass: !!testimonials && arr(testimonials.props.items).length > 0 },
    { label: 'FAQ para quebra de objeção', pass: !!faq && arr(faq.props.items).length > 0 },
    { label: 'Contato com e-mail ou telefone visível', pass: !!contact && (!!str(contact.props.email) || !!str(contact.props.phone)) },
    { label: 'Footer com links institucionais (LGPD/legal)', pass: !!footer && arr(footer.props.links).length > 0 },
    { label: 'Estrutura mínima — pelo menos 5 blocos na página', pass: blocks.length >= 5 },
  ];
}

export function QAChecklist({ blocks, onClose }: { blocks: BuilderBlock[]; onClose: () => void }) {
  const items = computeChecklist(blocks);
  const passed = items.filter((i) => i.pass).length;
  const score = items.length ? Math.round((passed / items.length) * 100) : 0;
  const scoreColor = score >= 90 ? 'text-ios-success' : score >= 60 ? 'text-ios-warning' : 'text-ios-error';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ios-base/80 backdrop-blur-sm p-4">
      <div className="card-surface w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-ios-text">QA Clínico · Pré-deploy</h2>
            <p className="text-[11px] text-ios-muted mt-0.5">Régua &gt;90 antes de publicar</p>
          </div>
          <button onClick={onClose} className="p-1 text-ios-muted hover:text-ios-text transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6 rounded-lg border border-ios-border bg-ios-base p-4">
          <div className={`text-3xl font-bold font-mono ${scoreColor}`}>{score}</div>
          <div className="text-xs text-ios-text-secondary">
            {passed} de {items.length} verificações aprovadas
          </div>
        </div>

        <ul className="space-y-2.5">
          {items.map((item) => (
            <li key={item.label} className="flex items-start gap-2.5 text-xs">
              {item.pass ? (
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-ios-success" />
              ) : (
                <XCircle size={15} className="mt-0.5 shrink-0 text-ios-error" />
              )}
              <span className={item.pass ? 'text-ios-text-secondary' : 'text-ios-text'}>{item.label}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-[10px] text-ios-muted leading-relaxed">
          Este checklist cobre a estrutura de conversão e SEO local do projeto. Performance (LCP/CLS/INP),
          Lighthouse e revisão de compliance setorial devem ser validados manualmente antes do deploy final.
        </p>
      </div>
    </div>
  );
}
