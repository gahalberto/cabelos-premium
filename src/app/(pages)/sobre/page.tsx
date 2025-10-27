"use client";

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Sobre a Cabelos Premium
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Nossa História
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A <strong>Cabelos Premium</strong> é referência em cabelos brasileiros de alta qualidade, 
              oferecendo os legítimos cabelos brasileiros do sul. Nossa missão é proporcionar aos 
              nossos clientes produtos de excelência que valorizam a beleza natural e a autoestima.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Nossos Valores
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Qualidade Premium em todos os nossos produtos</li>
              <li>Compromisso com a satisfação do cliente</li>
              <li>Transparência e honestidade em todas as relações</li>
              <li>Valorização da beleza natural brasileira</li>
              <li>Atendimento personalizado e especializado</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Por que escolher a Cabelos Premium?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Trabalhamos exclusivamente com cabelos naturais brasileiros, 
              cuidadosamente selecionados e processados para garantir a máxima 
              durabilidade e beleza. Nossa equipe de experts está sempre pronta 
              para auxiliar na escolha perfeita para cada cliente.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

