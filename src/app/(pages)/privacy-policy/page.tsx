
import React from "react";
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Politíca de Privacidade    | InMemorian',
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <section className="mb-6">
    <h2 className="text-lg font-bold mb-2">{title}</h2>
    <div className="text-gray-700">{children}</div>
  </section>
);

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Política de Privacidade</h1>
      <p className="text-gray-500 mb-4">Última atualização: 05 de fevereiro de 2025</p>
      
      <Section title="1. Introdução">
        <p>Sua privacidade é importante para nós. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nossa plataforma InMemorian.</p>
      </Section>
      
      <Section title="2. Informações que Coletamos">
        <p>Coletamos as seguintes informações quando você utiliza nossa plataforma:</p>
        <ul className="list-disc ml-5 mt-2">
          <li><strong>Informações de Cadastro:</strong> Nome, data de nascimento e falecimento do ente-querido, mensagem personalizada, fotos do perfil e endereço de email cadastrado.</li>
          <li><strong>Informações de Pagamento:</strong> Endereço de email cadastrado no Stripe para processamento do pagamento e envio do link da página personalizada.</li>
        </ul>
      </Section>
      
      <Section title="3. Como Usamos Suas Informações">
        <p>Utilizamos suas informações para:</p>
        <ul className="list-disc ml-5 mt-2">
          <li>Processar o pagamento e enviar o link da página personalizada via email.</li>
          <li>Personalizar e criar a página do ente-querido com as informações fornecidas.</li>
          <li>Melhorar nossos serviços e suporte ao cliente.</li>
        </ul>
      </Section>
      
      <Section title="4. Compartilhamento de Informações">
        <p>Não compartilhamos suas informações pessoais com terceiros, exceto conforme necessário para processar pagamentos (Stripe) e conforme exigido por lei.</p>
      </Section>
      
      <Section title="5. Segurança">
        <p>Implementamos medidas de segurança para proteger suas informações pessoais contra acesso, uso ou divulgação não autorizados. No entanto, nenhuma transmissão de dados pela internet é completamente segura, e não podemos garantir a segurança absoluta.</p>
      </Section>
      
      <Section title="6. Retenção de Dados">
        <p>Reteremos suas informações pessoais apenas pelo tempo necessário para cumprir as finalidades para as quais foram coletadas ou conforme exigido por lei.</p>
      </Section>
      
      <Section title="7. Seus Direitos">
        <p>Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Para exercer esses direitos, entre em contato conosco pelo email: <strong>gahalberto@icloud.com</strong>.</p>
      </Section>
      
      <Section title="8. Alterações nesta Política de Privacidade">
        <p>Podemos atualizar esta Política de Privacidade periodicamente. Quando fizermos isso, revisaremos a data da "Última atualização" no topo desta página. É sua responsabilidade revisar esta política periodicamente para se manter informado sobre quaisquer alterações.</p>
      </Section>
      
      <Section title="9. Contato">
        <p>Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco pelo email: <strong>gahalberto@icloud.com</strong>.</p>
      </Section>
    </div>
  );
};

export default PrivacyPolicy;
