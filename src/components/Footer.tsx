import { FaInstagram, FaPhone, FaGlobe } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#f5f0e6] py-20 px-4 sm:px-10 md:px-20 lg:px-36">
      <div className="container mx-auto">
        <div className="relative mb-12">
          <h2 className="text-5xl font-raleway text-center text-[#333333] uppercase tracking-wider">
            Canais de Atendimento
          </h2>
          <div className="absolute left-0 right-0 bottom-0 flex items-center justify-center">
            <div className="h-[2px] w-full bg-[#b08c4f] relative">
              <div className="absolute -top-[6px] left-[25%] w-4 h-4 rounded-full bg-[#b08c4f]"></div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mt-24">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Explore e Encante-se</h3>
            <p className="text-lg text-gray-700">
              Conheça a Cabelos Premium e entre em contato conosco pelos nossos canais de atendimento.
            </p>
            <p className="text-lg text-gray-700 mt-8 text">
              Estamos aqui para transformar seu visual e oferecer a melhor experiência com cabelos naturais e exclusivos.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#b08c4f]">
                <FaInstagram className="text-2xl text-[#b08c4f]" />
              </div>
              <p className="text-xl">@cabelospremium</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#b08c4f]">
                <FaPhone className="text-2xl text-[#b08c4f]" />
              </div>
              <p className="text-xl">(11) 3825-2050</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#b08c4f]">
                <FaGlobe className="text-2xl text-[#b08c4f]" />
              </div>
              <p className="text-xl">cabelospremium.com.br</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
