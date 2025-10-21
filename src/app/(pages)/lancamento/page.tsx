"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";

export default function LancamentoPage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-[#f5f1e8] to-[#f0efdb] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="flex flex-col items-center justify-center" style={{ minHeight: '220px' }}>
              <h1 className="text-xl md:text-5xl lg:text-5xl font-le-jour text-[#8a7d5c] mb-8 tracking-wide">
                LANÇAMENTO BY CABELOS PREMIUM
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl text-[#333333] mb-6">
                <span className="font-montserrat font-medium">Uma técnica exclusiva para </span>
                <span className="font-brittany italic text-2xl md:text-3xl lg:text-4xl">profissionais</span>
              </h2>
              <div className="flex items-center justify-center w-full">
                <p className="text-base text-[#333333] leading-relaxed font-montserrat font-extralight  max-w-2xl mb-12  text-justify">
                  A Cabelos Premium tem o prazer de apresentar <b>uma inovação exclusiva para os profissionais da beleza:</b> a nova técnica de Mega Hair com fitas de alta performance, desenvolvida para atender às necessidades de praticidade, conforto e qualidade que <b>somente os maiores salões exigem.</b>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Imagem de Lançamento - Full Width */}
        <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
          <Image
            src="/images/novas-imagens/pagina-lancamento/lancamento.png"
            alt="Lançamento Cabelos Premium"
            width={1920}
            height={800}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Texto após a imagem */}
        <div className="max-w-6xl mx-auto px-4 mt-16">
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-base text-[#333333] leading-relaxed font-montserrat font-thin text-justify">
              Após meses de pesquisa e desenvolvimento, nosso produto foi criado com um único objetivo: <span className="font-bold">oferecer aos profissionais da beleza uma solução eficiente e duradoura, sem abrir mão do conforto e da elegância.</span> A necessidade de um produto que fosse fácil de aplicar, seguro e confortável para o cliente é o maior objetivo por trás dessa inovação.
            </p>
            <p className="text-base text-[#333333] leading-relaxed font-montserrat font-thin text-justify">
              Agora, você pode ter acesso e em mãos uma técnica de mega hair única, feita sob medida para quem busca excelência no serviço e resultados impecáveis. <span className="font-bold">Uma verdadeira revolução no mercado de extensões capilares.</span>
            </p>

            <div className="mt-12">
              <h3 className="text-2xl font-montserrat font-bold text-[#333333] text-left mb-4">
                Exclusivo para Salões e Profissionais da Beleza
              </h3>
              <p className="text-base text-[#333333] leading-relaxed font-montserrat font-thin text-justify">
                Com a Cabelos Premium, você terá uma ferramenta poderosa em seu salão para lotar sua agenda e faturar números nunca vistos antes. Aplique a técnica de mega hair com facilidade e rapidez, sem perder tempo ou comprometer a qualidade do serviço. <span className="font-bold">Sinta a diferença e ofereça uma experiência premium aos seus clientes.</span>
              </p>
            </div>

            {/* Imagem centralizada */}
            <div className="flex justify-center mt-12 mb-20">
              <Image
                src="/images/novas-imagens/pagina-lancamento/foto2.png"
                alt="Técnica Exclusiva"
                width={800}
                height={600}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 