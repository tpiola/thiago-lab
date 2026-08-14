import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Política de Privacidade — Thiago Lab',
  description: 'Como o Thiago Lab coleta, usa e protege dados pessoais, em conformidade com a LGPD (Lei nº 13.709/2018).',
  alternates: { canonical: 'https://thiagolab.com/privacidade' },
  robots: 'index, follow',
};

const LAST_UPDATED = '14 de agosto de 2026';

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-ios-base">
      <Nav />
      <section className="pt-28 pb-20 px-6">
        <div className="container-ios max-w-3xl">
          <h1 className="heading-display text-[clamp(1.75rem,4vw,2.5rem)] text-ios-text">
            Política de Privacidade
          </h1>
          <p className="mt-3 text-sm text-ios-muted">Última atualização: {LAST_UPDATED}</p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-ios-text-secondary">
            <p>
              Esta Política de Privacidade descreve como o <strong className="text-ios-text">Thiago Lab</strong> (&quot;nós&quot;),
              operado por Thiago Piola, coleta, usa, armazena e protege dados pessoais de visitantes,
              usuários e clientes deste site e de suas plataformas associadas (Builder, PremiumSite OS,
              Intelligence OS), em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
            </p>

            <div>
              <h2 className="text-base font-semibold text-ios-text mb-2">1. Dados que coletamos</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Dados de contato fornecidos voluntariamente (nome, e-mail, telefone/WhatsApp) em formulários, briefings e cadastros.</li>
                <li>Dados de navegação (cookies, endereço IP, páginas visitadas, dispositivo e navegador) via analytics.</li>
                <li>Conteúdo inserido no Builder e no briefing de projetos (nome do negócio, endereço, serviços, provas sociais).</li>
                <li>Comunicações trocadas por e-mail ou WhatsApp para fins de suporte e atendimento comercial.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-semibold text-ios-text mb-2">2. Finalidade do tratamento</h2>
              <p>Usamos os dados coletados para:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>Fornecer, operar e melhorar os produtos e serviços do Thiago Lab;</li>
                <li>Responder solicitações, dúvidas e propostas comerciais;</li>
                <li>Gerar e hospedar sites e projetos criados no Builder / PremiumSite OS;</li>
                <li>Cumprir obrigações legais e regulatórias;</li>
                <li>Medir performance e uso da plataforma (analytics agregado).</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-semibold text-ios-text mb-2">3. Base legal</h2>
              <p>
                O tratamento de dados pessoais é realizado com base no consentimento do titular, na execução de
                contrato ou procedimentos preliminares a ele relacionados, e no legítimo interesse do Thiago Lab
                para fins de segurança, prevenção a fraudes e melhoria dos serviços, nos termos do art. 7º da LGPD.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-ios-text mb-2">4. Compartilhamento de dados</h2>
              <p>
                Não vendemos dados pessoais. Dados podem ser compartilhados com prestadores de serviço estritamente
                necessários à operação da plataforma (hospedagem, e-mail transacional, processamento de pagamentos,
                analytics), sempre sob obrigação contratual de confidencialidade e segurança.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-ios-text mb-2">5. Cookies</h2>
              <p>
                Utilizamos cookies essenciais ao funcionamento do site e cookies de analytics para entender o uso
                da plataforma. Você pode gerenciar preferências de cookies no banner de consentimento exibido na
                primeira visita ou nas configurações do seu navegador.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-ios-text mb-2">6. Retenção e segurança</h2>
              <p>
                Dados pessoais são mantidos apenas pelo tempo necessário às finalidades descritas nesta política ou
                conforme exigido por lei, e são protegidos por medidas técnicas e administrativas razoáveis para
                evitar acessos não autorizados, perda ou vazamento.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-ios-text mb-2">7. Seus direitos (art. 18 da LGPD)</h2>
              <p>Você pode, a qualquer momento, solicitar:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>Confirmação da existência de tratamento e acesso aos dados;</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
                <li>Portabilidade dos dados a outro fornecedor;</li>
                <li>Revogação do consentimento e eliminação dos dados tratados com base nele;</li>
                <li>Informações sobre entidades com as quais os dados foram compartilhados.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-semibold text-ios-text mb-2">8. Contato</h2>
              <p>
                Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato pelo e-mail{' '}
                <a href="mailto:oi@thiagolabs.com" className="text-ios-accent hover:underline">oi@thiagolabs.com</a>.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-ios-text mb-2">9. Alterações desta política</h2>
              <p>
                Esta política pode ser atualizada periodicamente para refletir mudanças em nossas práticas ou na
                legislação aplicável. A data da última atualização é exibida no topo desta página.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
