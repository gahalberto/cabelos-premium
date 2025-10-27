import { pageMetadata } from "@/config/metadata";
import type { Metadata } from 'next';

export const metadata: Metadata = pageMetadata.politicaPrivacidade;

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Política de Privacidade
        </h1>
        
        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="mb-6">
            Última atualização: Janeiro de 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Informações que Coletamos
            </h2>
            <p className="leading-relaxed mb-4">
              A Cabelos Premium coleta informações pessoais fornecidas voluntariamente 
              por você ao utilizar nosso site, incluindo nome, e-mail, endereço, telefone 
              e informações de pagamento quando você realiza uma compra.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Como Usamos suas Informações
            </h2>
            <p className="leading-relaxed mb-4">
              Utilizamos suas informações para:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Processar e entregar seus pedidos</li>
              <li>Enviar atualizações sobre seu pedido</li>
              <li>Melhorar nossos produtos e serviços</li>
              <li>Enviar informações promocionais (com seu consentimento)</li>
              <li>Responder às suas dúvidas e solicitações</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Proteção de Dados
            </h2>
            <p className="leading-relaxed mb-4">
              Implementamos medidas de segurança adequadas para proteger suas 
              informações pessoais contra acesso não autorizado, alteração, 
              divulgação ou destruição.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Compartilhamento de Informações
            </h2>
            <p className="leading-relaxed mb-4">
              Não vendemos, trocamos ou transferimos suas informações pessoais 
              para terceiros, exceto quando necessário para processar pagamentos 
              ou realizar entregas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Seus Direitos
            </h2>
            <p className="leading-relaxed mb-4">
              Você tem o direito de acessar, corrigir ou excluir suas informações 
              pessoais a qualquer momento. Para exercer esses direitos, entre em 
              contato conosco através do e-mail ou telefone disponíveis em nosso site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Contato
            </h2>
            <p className="leading-relaxed mb-4">
              Para questões sobre nossa Política de Privacidade, entre em contato:
            </p>
            <p className="leading-relaxed">
              <strong>E-mail:</strong> contato@cabelospremium.com.br<br />
              <strong>Telefone:</strong> (11) 3825-2050<br />
              <strong>Endereço:</strong> Rua Dr. Albuquerque Lins, 537 - São Paulo / SP
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

