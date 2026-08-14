/* ==========================================================================
   blockHtml — Renderizador HTML compartilhado dos blocks do Builder
   Usado por: Preview, BuilderStore (export HTML), /api/export, /api/deploy
   Fonte única de verdade para o markup gerado por tipo de bloco.
   ========================================================================== */

export interface RenderableBlock {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

export function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderBlockHtml(block: RenderableBlock): string {
  const p = block.props as Record<string, unknown>;
  const id = block.id;

  switch (block.type) {
    case 'hero': {
      const title = escHtml(String(p.title ?? ''));
      const subtitle = escHtml(String(p.subtitle ?? ''));
      const cta = escHtml(String(p.cta ?? ''));
      const bgColor = String(p.bgColor ?? '#06080C');
      const accentColor = String(p.accentColor ?? '#3DF5C5');
      return `<section id="${id}" style="background:${bgColor};color:#E8EDF2;padding:6rem 1.5rem;text-align:center;min-height:80vh;display:flex;flex-direction:column;justify-content:center;align-items:center">
        <h1 style="font-size:clamp(2rem,6vw,4rem);font-weight:700;max-width:800px;margin:0 auto 1rem;line-height:1.1">${title}</h1>
        <p style="font-size:1.25rem;color:#B0B8C4;max-width:600px;margin:0 auto 2rem">${subtitle}</p>
        <a href="#contato" style="display:inline-block;background:${accentColor};color:#06080C;padding:0.75rem 2rem;border-radius:8px;font-weight:600;font-size:1rem">${cta}</a>
      </section>`;
    }
    case 'features': {
      const title = escHtml(String(p.title ?? 'Recursos'));
      const items = (p.items as Array<Record<string, string>>) || [];
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#0C0F15">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;max-width:1200px;margin:0 auto">
          ${items.map((item) =>
            `<div style="background:#12161E;border:1px solid #1E2433;border-radius:12px;padding:1.5rem">
              ${item.icon ? `<div style="font-size:2rem;margin-bottom:0.5rem">${item.icon}</div>` : ''}
              <h3 style="color:#E8EDF2;margin:0 0 0.5rem">${escHtml(item.title ?? '')}</h3>
              <p style="color:#7A8694;margin:0">${escHtml(item.desc ?? '')}</p>
            </div>`
          ).join('\n          ')}
        </div>
      </section>`;
    }
    case 'pricing': {
      const title = escHtml(String(p.title ?? 'Planos'));
      const plans = (p.plans as Array<Record<string, unknown>>) || [];
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#06080C">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;max-width:1000px;margin:0 auto">
          ${plans.map((plan) => {
            const name = escHtml(String(plan.name ?? ''));
            const price = String(plan.price ?? '');
            const featured = !!plan.featured;
            const features = (plan.features as string[]) || [];
            return `<div style="background:#12161E;border:1px solid ${featured ? '#3DF5C5' : '#1E2433'};border-radius:12px;padding:2rem;text-align:center">
              <h3 style="color:#E8EDF2;margin:0 0 0.5rem">${name}</h3>
              <div style="font-size:2.5rem;font-weight:700;color:#3DF5C5;margin:1rem 0">R$${price}<span style="font-size:1rem;color:#7A8694">/mês</span></div>
              <ul style="list-style:none;padding:0;margin:1.5rem 0;color:#B0B8C4">
                ${features.map((f) => `<li style="padding:0.375rem 0">✓ ${escHtml(f)}</li>`).join('\n                ')}
              </ul>
              <a href="#" style="display:inline-block;background:${featured ? '#3DF5C5' : 'transparent'};color:${featured ? '#06080C' : '#E8EDF2'};border:1px solid ${featured ? '#3DF5C5' : '#1E2433'};padding:0.75rem 2rem;border-radius:8px;font-weight:600">Escolher</a>
            </div>`;
          }).join('\n          ')}
        </div>
      </section>`;
    }
    case 'testimonials': {
      const title = escHtml(String(p.title ?? 'Depoimentos'));
      const items = (p.items as Array<Record<string, string>>) || [];
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#0C0F15">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;max-width:1000px;margin:0 auto">
          ${items.map((item) =>
            `<div style="background:#12161E;border:1px solid #1E2433;border-radius:12px;padding:1.5rem">
              <p style="color:#B0B8C4;font-style:italic;margin:0 0 1rem">"${escHtml(item.text ?? '')}"</p>
              <div><strong style="color:#E8EDF2">${escHtml(item.name ?? '')}</strong><span style="color:#7A8694;margin-left:0.5rem">${escHtml(item.role ?? '')}</span></div>
            </div>`
          ).join('\n          ')}
        </div>
      </section>`;
    }
    case 'faq': {
      const title = escHtml(String(p.title ?? 'FAQ'));
      const items = (p.items as Array<Record<string, string>>) || [];
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#06080C">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="max-width:700px;margin:0 auto">
          ${items.map((item) =>
            `<details style="background:#12161E;border:1px solid #1E2433;border-radius:12px;margin-bottom:0.75rem;padding:1rem">
              <summary style="color:#E8EDF2;font-weight:600;cursor:pointer">${escHtml(item.q ?? '')}</summary>
              <p style="color:#7A8694;margin-top:0.75rem">${escHtml(item.a ?? '')}</p>
            </details>`
          ).join('\n          ')}
        </div>
      </section>`;
    }
    case 'cta': {
      const title = escHtml(String(p.title ?? ''));
      const subtitle = escHtml(String(p.subtitle ?? ''));
      const buttonText = escHtml(String(p.buttonText ?? ''));
      return `<section id="${id}" style="padding:4rem 1.5rem;text-align:center;background:linear-gradient(135deg,#1A1F2B,#0C0F15)">
        <h2 style="font-size:2rem;color:#E8EDF2;margin:0 0 0.5rem">${title}</h2>
        <p style="color:#B0B8C4;margin:0 0 2rem">${subtitle}</p>
        <a href="#" style="display:inline-block;background:#3DF5C5;color:#06080C;padding:0.75rem 2rem;border-radius:8px;font-weight:600">${buttonText}</a>
      </section>`;
    }
    case 'footer': {
      const copyright = escHtml(String(p.copyright ?? ''));
      const links = (p.links as Array<Record<string, string>>) || [];
      return `<footer id="${id}" style="padding:2rem 1.5rem;background:#06080C;border-top:1px solid #1E2433;text-align:center">
        <p style="color:#7A8694;margin:0 0 1rem">${copyright}</p>
        <div style="display:flex;justify-content:center;gap:1.5rem">
          ${links.map((link) =>
            `<a href="${escHtml(link.href ?? '#')}" style="color:#B0B8C4;text-decoration:none;font-size:0.875rem">${escHtml(link.label ?? '')}</a>`
          ).join('\n          ')}
        </div>
      </footer>`;
    }
    case 'stats': {
      const title = escHtml(String(p.title ?? ''));
      const items = (p.items as Array<Record<string, unknown>>) || [];
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#0C0F15">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem;max-width:800px;margin:0 auto;text-align:center">
          ${items.map((item) =>
            `<div>
              <div style="font-size:2.5rem;font-weight:700;color:#3DF5C5">${String(item.value ?? 0)}</div>
              <div style="color:#7A8694;margin-top:0.25rem">${escHtml(String(item.label ?? ''))}</div>
            </div>`
          ).join('\n          ')}
        </div>
      </section>`;
    }
    case 'gallery': {
      const title = escHtml(String(p.title ?? 'Galeria'));
      const images = (p.images as Array<Record<string, string>>) || [];
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#06080C">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;max-width:1000px;margin:0 auto">
          ${images.map((img) =>
            `<div style="border-radius:12px;overflow:hidden;background:#12161E;aspect-ratio:16/10">
              <img src="${escHtml(img.src ?? '/placeholder.svg')}" alt="${escHtml(img.alt ?? '')}" style="width:100%;height:100%;object-fit:cover" />
            </div>`
          ).join('\n          ')}
        </div>
      </section>`;
    }
    case 'contact': {
      const title = escHtml(String(p.title ?? 'Contato'));
      const email = escHtml(String(p.email ?? ''));
      const phone = escHtml(String(p.phone ?? ''));
      const address = escHtml(String(p.address ?? ''));
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#06080C">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="max-width:500px;margin:0 auto;text-align:center">
          ${email ? `<p style="color:#B0B8C4;margin:0.5rem 0">✉ ${email}</p>` : ''}
          ${phone ? `<p style="color:#B0B8C4;margin:0.5rem 0">📞 ${phone}</p>` : ''}
          ${address ? `<p style="color:#B0B8C4;margin:0.5rem 0">📍 ${address}</p>` : ''}
        </div>
      </section>`;
    }
    case 'whatsapp': {
      const digits = String(p.phone ?? '').replace(/\D/g, '');
      const message = encodeURIComponent(String(p.message ?? ''));
      const source = encodeURIComponent(String(p.source ?? 'site'));
      const href = `https://wa.me/55${digits}?text=${message}&utm_source=site&utm_medium=cta&utm_campaign=${source}`;
      return `<a id="${id}" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp" style="position:fixed;bottom:1.25rem;right:1.25rem;z-index:999;display:inline-flex;align-items:center;gap:0.5rem;background:#25D366;color:#06080C;padding:0.75rem 1.25rem;border-radius:999px;font-weight:700;font-size:0.9rem;box-shadow:0 8px 24px rgba(37,211,102,0.35);text-decoration:none">💬 Falar no WhatsApp</a>`;
    }
    case 'localBusiness': {
      const businessName = String(p.businessName ?? '');
      const addressLocality = String(p.addressLocality ?? '');
      const addressRegion = String(p.addressRegion ?? '');
      const phone = String(p.phone ?? '');
      const openingHours = String(p.openingHours ?? '');
      const areaServed = String(p.areaServed ?? '');
      const ratingValue = String(p.ratingValue ?? '');
      const reviewCount = String(p.reviewCount ?? '');

      const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: businessName,
        address: { '@type': 'PostalAddress', addressLocality, addressRegion, addressCountry: 'BR' },
        telephone: phone,
        openingHours,
        areaServed,
      };
      if (ratingValue && reviewCount) {
        schema.aggregateRating = { '@type': 'AggregateRating', ratingValue, reviewCount };
      }
      const jsonLd = JSON.stringify(schema).replace(/</g, '\\u003c');

      return `<section id="${id}" style="padding:3rem 1.5rem;background:#0C0F15;text-align:center">
        <h3 style="color:#E8EDF2;font-size:1.25rem;margin:0 0 0.75rem">${escHtml(businessName)}</h3>
        ${addressLocality ? `<p style="color:#B0B8C4;margin:0.25rem 0">📍 ${escHtml(addressLocality)}${addressRegion ? ', ' + escHtml(addressRegion) : ''}</p>` : ''}
        ${phone ? `<p style="color:#B0B8C4;margin:0.25rem 0">📞 ${escHtml(phone)}</p>` : ''}
        ${openingHours ? `<p style="color:#B0B8C4;margin:0.25rem 0">🕒 ${escHtml(openingHours)}</p>` : ''}
        ${areaServed ? `<p style="color:#7A8694;margin:0.25rem 0;font-size:0.85rem">Atendemos: ${escHtml(areaServed)}</p>` : ''}
        ${ratingValue ? `<p style="color:#3DF5C5;margin:0.5rem 0;font-weight:600">★ ${escHtml(ratingValue)} (${escHtml(reviewCount)} avaliações)</p>` : ''}
      </section>
      <script type="application/ld+json">${jsonLd}</script>`;
    }
    default:
      return '';
  }
}
