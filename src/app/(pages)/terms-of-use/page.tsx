import React from "react";
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Termos de Uso | InMemorian',
};

type PropsType = {
    title: string;
    children: string;
}

const Section = ({ title, children }: PropsType) => (
  <section className="mb-6">
    <h2 className="text-lg font-bold mb-2">{title}</h2>
    <p className="text-gray-700">{children}</p>
  </section>
);

const TermsOfUse = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Termos de Uso</h1>
      <p className="text-gray-500 mb-4">Última atualização: 05 de fevereiro de 2025</p>
      
      <Section title="1. Aceitação dos Termos">
        Ao acessar e utilizar a nossa plataforma, você concorda em cumprir e ficar vinculado aos seguintes Termos de Uso. Caso não concorde com qualquer parte destes termos, você não deve utilizar a plataforma.
      </Section>
      
      <Section title="2. Descrição do Serviço">
        Nossa plataforma permite que pessoas que perderam ente-querido ou queira fazer uma biografia seja da própria pessoa ou de terceiros criem uma página personalizada preenchendo um formulário com o nome do perfil, data de início da morte e nascimento, uma mensagem personalizada e até 30 fotos. Após o preenchimento, a pessoa é direcionada para o checkout e, ao concluir o pagamento, recebe um link para preencher o perfil do ente-querido.
      </Section>
      
      <Section title="3. Cadastro e Segurança">
        Para utilizar o serviço, você deve fornecer um endereço de email válido. Não compartilharemos seu email com terceiros.
      </Section>
      
      <Section title="4. Privacidade">
        Respeitamos a sua privacidade. Não utilizamos seus dados para qualquer tipo de processamento ou venda de dados para terceiros. O email cadastrado é utilizado apenas para o envio do link da página personalizada.
      </Section>
      
      <Section title="5. Conteúdo do Usuário">
        Você é responsável pelo conteúdo que insere na plataforma, incluindo fotos, mensagens e informações do ente-querido. Não nos responsabilizamos por qualquer conteúdo impróprio ou ilegal carregado pelos usuários.
      </Section>
      
      <Section title="6. Pagamentos e Reembolsos">
        Todos os pagamentos são processados através do Stripe. Após a conclusão do pagamento, o casal receberá um link para a página personalizada via email. Não oferecemos reembolsos, exceto em casos excepcionais a nosso exclusivo critério.
      </Section>
      
      <Section title="7. Modificações no Serviço">
        Nós nos comprometemos a manter o serviço ativo e disponível pelo período contratado, conforme o plano escolhido (1 ano no plano básico ou tempo vitalício no plano avançado). No entanto, em circunstâncias excepcionais que fujam ao nosso controle, como questões legais, técnicas ou financeiras, reservamo-nos o direito de modificar ou descontinuar o serviço. Caso seja necessário descontinuar o serviço, tomaremos todas as medidas possíveis para notificar os usuários com antecedência e garantir a preservação das páginas ou oferecer soluções alternativas sempre que possível. A InMemorian não se responsabiliza por eventuais perdas decorrentes de modificações ou descontinuação em situações extraordinárias, mas faremos o possível para minimizar o impacto.
      </Section>
      
      <Section title="8. Limitação de Responsabilidade">
        Em nenhuma circunstância seremos responsáveis por qualquer dano indireto, incidental, especial ou consequente decorrente de ou relacionado ao uso ou incapacidade de uso da plataforma.
      </Section>
      
      <Section title="9. Alterações nos Termos">
        Podemos atualizar estes Termos de Uso periodicamente. Quando fizermos isso, revisaremos a data da "última atualização" no topo desta página. É sua responsabilidade revisar estes Termos de Uso periodicamente para se manter informado sobre quaisquer alterações.
      </Section>
      
      <Section title="10. Contato">
        Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco pelo email: gahalberto@icloud.com.
      </Section>
    </div>
  );
};

export default TermsOfUse;
