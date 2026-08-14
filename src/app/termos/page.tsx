import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Termos de Uso — Thiago Lab',
  description: 'Termos e condições de uso do Thiago Lab, Builder e PremiumSite OS.',
  alternates: { canonical: 'https://thiagolab.com/termos' },
  robots: 'index, follow',
};

const LAST_UPDATED = '14 de agosto de 2026';

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-ios-base">
      <Nav />
      <section className="pt-28 pb-20 px-6">
        <div className="container-ios max-w-3xl">
          <h1 className="heading-display text-[clamp(1.75rem,4vw,2.5rem)] text-ios-text">
            Termos de Uso
          </h1>
          <p className="mt-3 text-sm text-ios-muted">Última atualização: {LAST_UPDATED}</p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-ios-text-secondary">
            <p>
              Estes Termos de Uso regem o acesso e uso do site, do Builder, do PremiumSite OS e demais produtos
              do <strong className="text-ios-text">Thiago Lab</strong>, operado por Thiago Piola. Ao usar a
              plataforma, você concorda com estes termos. Se não concordar, não utilize os serviços.
            </p>

            <div>
              <h2 className="text-base font-semibold text-ios-text mb-2">1. Descrição do serviço</h2>
              <p>
                O Thiago Lab fornece ferramentas para criação, edição, exportação e publicação de sites e páginas
                (Builder e PremiumSite OS), incluindo templates por vertical de negócio, geração de blocos de
                conteúdo, checklist de QA pré-deploy e integrações de conversão (WhatsApp, formulários, agenda).
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-ios-text mb-2">2. Cadastro e responsabilidade do usuário</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Você é responsável pela veracidade das informações inseridas nos projetos criados na plataforma.</li>
                <li>É proibido usar a plataforma para publicar conteúdo ilegal, enganoso, discriminatório ou que viole direitos de terceiros.</li>
                <li>Depoimentos e provas sociais devem ser publicados apenas com consentimento explícito das pessoas citadas.</li>
                <li>Setores regulados (saúde, jurídico, financeiro) são responsáveis por revisar a copy gerada para conformidade com suas próprias obrigações regulatórias antes da publicação.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-semibold text-ios-text mb-2">3. Propriedade intelectual</h2>
              <p>
                O código, design e marca do Thiago Lab são de propriedade exclusiva de Thiago Piola. O conteúdo
                que você insere nos projetos (textos, imagens, dados do negócio) permanece de sua propriedade;
                você concede ao Thiago Lab uma licença limitada para armazenar e processar esse conteúdo com a
                única finalidade de operar a plataforma.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-ios-text mb-2">4. QA Clínico e limitações</h2>
              <p>
                O checklist de QA disponível no Builder verifica estrutura mínima de conversão e SEO local
                (presença de CTA de WhatsApp, schema.org LocalBusiness, prova social e FAQ). Ele não substitui
                auditorias completas de performance (Lighthouse), acessibilidade, segurança ou conformidade
                legal/regulatória, que permanecem de responsabilidade do usuário antes de publicar em produção.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-ios-text mb-2">5. Planos e pagamento</h2>
              <p>
                Os planos e pacotes comerciais disponíveis estão descritos na página{' '}
                <a href="/pricing" className="text-ios-accent hover:underline">/pricing</a>. Valores, formas de
                pagamento (Pix, cartão, Mercado Pago, Stripe) e condições de recorrência são confirmados na
                contratação de cada serviço.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-ios-text mb-2">6. Limitação de responsabilidade</h2>
              <p>
                A plataforma é fornecida &quot;como está&quot;. O Thiago Lab não garante disponibilidade ininterrupta e
                não se responsabiliza por perdas decorrentes de uso indevido da plataforma, de conteúdo publicado
                pelo usuário ou de integrações de terceiros (WhatsApp, provedores de pagamento, hospedagem).
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-ios-text mb-2">7. Privacidade</h2>
              <p>
                O tratamento de dados pessoais segue nossa{' '}
                <a href="/privacidade" className="text-ios-accent hover:underline">Política de Privacidade</a>,
                em conformidade com a LGPD (Lei nº 13.709/2018).
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-ios-text mb-2">8. Alterações destes termos</h2>
              <p>
                Estes termos podem ser atualizados periodicamente. O uso continuado da plataforma após uma
                atualização implica aceitação dos novos termos.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-ios-text mb-2">9. Contato</h2>
              <p>
                Dúvidas sobre estes termos podem ser enviadas para{' '}
                <a href="mailto:oi@thiagolabs.com" className="text-ios-accent hover:underline">oi@thiagolabs.com</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
