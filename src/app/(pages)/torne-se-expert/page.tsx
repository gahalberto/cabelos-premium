"use client";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ExpertApplicationForm from "@/components/ExpertApplicationForm";

export default function TorneSeExpertPage() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#f0efdb]">
      {/* Hero Section */}
      <section className="w-full bg-[#f0efdb] py-20">
        <div className="max-w-6xl mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-center" data-aos="fade-up">
            <h1 className="font-le-jour text-[38px] text-[#8a7d5c] mb-8 tracking-wide uppercase">
              TORNE-SE EXPERT
            </h1>
            <h2 className="text-[21px] text-[#333333] mb-6 font-montserrat">
              <span>Transforme sua paixão em </span>
              <span className="font-brittany italic text-[40px]">sucesso</span>
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-base text-[#333333] leading-relaxed font-montserrat font-thin text-justify">
                Se você deseja se destacar, oferecer um serviço de alto nível e <span className="font-bold">aumentar significativamente seu faturamento,</span> tornar-se expert da Cabelos Premium é a oportunidade perfeita para você!
              </p>
              <p className="text-base text-[#333333] leading-relaxed font-montserrat font-thin text-justify mt-4">
                Nosso curso exclusivo foi desenvolvido para te <span className="font-bold">ensinar do zero ao avançado as técnicas mais modernas e seguras de aplicação de extensões capilares.</span> E o melhor: ao adquirir nosso kit de cabelos, você ganha o curso completo.
              </p>
            </div>

            {/* Seção O que você vai aprender */}
            <div className="max-w-4xl mx-auto mt-16">
              <h3 className="text-[18px] text-[#333333] font-montserrat font-bold text-left mb-8">
                O que você vai aprender?
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li className="text-[14px] text-[#333333] font-montserrat font-thin text-justify">
                  Técnicas exclusivas de aplicação que garantem um alongamento perfeito e natural
                </li>
                <li className="text-[14px] text-[#333333] font-montserrat font-thin text-justify">
                  Métodos seguros e saudáveis para preservar a integridade dos fios
                </li>
                <li className="text-[14px] text-[#333333] font-montserrat font-thin text-justify">
                  Finalização profissional para um acabamento impecável
                </li>
                <li className="text-[14px] text-[#333333] font-montserrat font-thin text-justify">
                  Atendimento premium e fidelização de clientes para aumentar seus ganhos
                </li>
                <li className="text-[14px] text-[#333333] font-montserrat font-thin text-justify">
                  Dicas estratégicas para potencializar suas vendas e se posicionar no mercado
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Imagem Full Width */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <Image
          src="/images/expertpage/imagem1.png"
          alt="Expert Page"
          width={1920}
          height={800}
          className="w-full h-auto object-cover"
        />
              </div>

      {/* Seção de Benefícios */}
      <section className="pt-20 px-8 md:px-12 lg:px-16">
        <div className="bg-[#8a7d5c] rounded-3xl p-12">
          <h3 className="text-2xl md:text-3xl text-white font-brittany text-left mb-8">
            Benefícios:
                </h3>
          <ul className="space-y-1">
            <li className="text-base text-white font-montserrat font-thin flex items-start">
              <span className="text-green-400 mr-3 mt-1">✔️</span>
              Curso 100% gratuito ao adquirir nosso kit de cabelos
            </li>
            <li className="text-base text-white font-montserrat font-thin flex items-start">
              <span className="text-green-400 mr-3 mt-1">✔️</span>
              Suporte completo antes, durante e depois do curso
            </li>
            <li className="text-base text-white font-montserrat font-thin flex items-start">
              <span className="text-green-400 mr-3 mt-1">✔️</span>
              Aprendizado com profissionais experientes e especializados
            </li>
            <li className="text-base text-white font-montserrat font-thin flex items-start">
              <span className="text-green-400 mr-3 mt-1">✔️</span>
              Uma das empresas mais consolidadas de cabelos no Brasil, garantindo credibilidade e reconhecimento
            </li>
            <li className="text-base text-white font-montserrat font-thin flex items-start">
              <span className="text-green-400 mr-3 mt-1">✔️</span>
              Diferencial competitivo para salões e profissionais autônomos
            </li>
            <li className="text-base text-white font-montserrat font-thin flex items-start">
              <span className="text-green-400 mr-3 mt-1">✔️</span>
              Profissão em alta demanda, com possibilidade de atendimento VIP e alto faturamento
            </li>
          </ul>
                  </div>
      </section>

      {/* Seção de 3 Imagens */}
      <section className="pt-20 px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex justify-center">
            <Image
              src="/images/expertpage/img2.png"
              alt="Expert Image 2"
              width={400}
              height={300}
              className="rounded-lg shadow-lg w-full h-auto object-cover"
                    />
                  </div>
          <div className="flex justify-center">
            <Image
              src="/images/expertpage/img3.png"
              alt="Expert Image 3"
              width={400}
              height={300}
              className="rounded-lg shadow-lg w-full h-auto object-cover"
                    />
                  </div>
          <div className="flex justify-center">
            <Image
              src="/images/expertpage/img4.png"
              alt="Expert Image 4"
              width={400}
              height={300}
              className="rounded-lg shadow-lg w-full h-auto object-cover"
                    />
                  </div>
                </div>
      </section>

      {/* Seção Final com Call to Action */}
      <section className="pt-20 px-8 md:px-12 lg:px-16 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-base text-[#333333] leading-relaxed font-montserrat font-thin text-justify mb-8">
            Se você já trabalha na área da beleza ou deseja ingressar nesse mercado promissor, essa é a sua chance de se tornar uma referência no segmento de alongamento capilar!
          </p>
          
          <p className="text-base text-[#333333] leading-relaxed font-montserrat font-thin text-justify mb-8">
            Clique no link abaixo e faça seu cadastro agora mesmo.
          </p>
          
          <p className="text-base text-[#333333] leading-relaxed font-montserrat font-thin text-justify mb-12">
            Adquira seu kit, ganhe o curso completo e comece a faturar mais!
          </p>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                className="bg-[#8a7d5c] hover:bg-[#6b5d47] text-white px-8 py-4 text-lg font-montserrat font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Saiba Mais
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-none">
              <DialogHeader>
                <DialogTitle className="text-2xl font-le-jour text-[#8a7d5c] text-center">
                  Torne-se Expert
                </DialogTitle>
              </DialogHeader>
              <div className="mt-6">
                <ExpertApplicationForm />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  );
} 