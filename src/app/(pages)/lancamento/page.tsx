"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ContactSection from "@/components/ContactSection";

export default function LancamentoPage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  return (
    <>
      <style jsx global>{`
        .swiper-pagination-bullet-active {
          background-color: #d4a249 !important;
        }
        
        .swiper-button-next,
        .swiper-button-prev {
          color: #d4a249 !important;
        }
        
        .swiper-slide {
          height: auto !important;
        }
        
        .launch-swiper {
          padding-bottom: 50px !important;
        }
      `}</style>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-[#f5f1e8] to-[#f0efdb] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-le-jour text-[#8a7d5c] mb-6 tracking-wide">
              LANÇAMENTO BY CABELOS PREMIUM
            </h1>
            <div className="h-1 w-32 bg-[#d4a249] mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-[#333333] font-montserrat max-w-4xl mx-auto leading-relaxed">
              A revolução chegou! Apresentamos nossa técnica exclusiva de Mega Hair com fitas de alta performance.
            </p>
          </div>
        </div>
      </section>

      {/* Seção Principal do Lançamento */}
      <section className="w-full bg-[#f0efdb] py-20">
        <div className="flex flex-col md:flex-row w-full max-w-none items-center justify-center">
          {/* Conteúdo textual */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center px-4 md:px-8 lg:px-16" data-aos="fade-right">
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-[#333333] mb-8">
              <span className="font-montserrat font-medium">Uma técnica exclusiva para </span>
              <span className="font-brittany italic text-3xl md:text-4xl lg:text-5xl text-[#d4a249]">profissionais</span>
            </h2>
            <p className="text-base md:text-lg text-[#333333] leading-relaxed font-montserrat max-w-2xl mb-8">
              A Cabelos Premium tem o prazer de apresentar uma inovação exclusiva para os profissionais da beleza: a nova técnica de Mega Hair com fitas de alta performance, desenvolvida para atender às necessidades de praticidade, conforto e qualidade que só os maiores salões exigem.
            </p>
            <div className="bg-[#8a7d5c] p-6 rounded-2xl shadow-lg">
              <p className="text-[#f0efdb] font-montserrat text-lg font-bold text-center">
                Pela primeira vez no Brasil confeccionada por uma marca especialista em Cabelos Brasileiros do Sul.
              </p>
            </div>
          </div>
          
          {/* Imagem */}
          <div className="relative w-full h-full flex justify-end items-stretch md:w-1/2 max-w-xl md:max-w-[450px] lg:max-w-[550px] xl:max-w-[600px]" data-aos="fade-left">
            <img 
              src="/images/2/lancamento.png" 
              alt="Cabelos Premium Lançamento" 
              className="h-full w-full md:h-auto object-cover md:object-contain object-right m-0 p-0"
              style={{ maxWidth: '100%', marginRight: 0, paddingRight: 0 }}
            />
            <div className="absolute inset-0 pointer-events-none"
                 style={{
                   background: "linear-gradient(to right, rgba(240,239,219,1) 0%, rgba(240,239,219,0.7) 10%, rgba(240,239,219,0) 30%)"
                 }}
            />
          </div>
        </div>
      </section>

      {/* Galeria de Produtos */}
      <section className="w-full bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-le-jour text-[#8a7d5c] mb-6">
              GALERIA DO LANÇAMENTO
            </h2>
            <p className="text-lg text-[#333333] font-montserrat max-w-3xl mx-auto">
              Conheça de perto nossa nova técnica e veja os resultados incríveis que ela proporciona.
            </p>
          </div>

          <div data-aos="fade-up">
            <div className="max-w-5xl mx-auto">
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                modules={[Pagination, Navigation, Autoplay]}
                className="launch-swiper"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SwiperSlide key={num}>
                    <div className="p-2">
                      <Image
                        src={`/images/lancamentos/${num}.jpg`}
                        alt={`Produto Premium ${num}`}
                        width={400}
                        height={300}
                        className="rounded-2xl shadow-xl mx-auto object-cover w-full h-[300px] hover:shadow-2xl transition-shadow duration-300"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Diferenciais */}
      <section className="w-full bg-[#8a7d5c] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-le-jour text-[#f0efdb] mb-6">
              NOSSOS DIFERENCIAIS
            </h2>
            <p className="text-lg text-[#f0efdb] font-montserrat max-w-3xl mx-auto">
              Por que escolher nossa técnica revolucionária?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Alta Performance",
                description: "Fitas desenvolvidas com tecnologia avançada para máxima durabilidade e conforto.",
                icon: "⚡"
              },
              {
                title: "Aplicação Simples",
                description: "Técnica fácil de aplicar, economizando tempo e garantindo resultados profissionais.",
                icon: "🎯"
              },
              {
                title: "Cabelos Brasileiros",
                description: "Exclusivamente feitos com cabelos brasileiros do Sul, garantindo qualidade superior.",
                icon: "🇧🇷"
              },
              {
                title: "Conforto Total",
                description: "Design ergonômico que proporciona conforto durante todo o período de uso.",
                icon: "💆‍♀️"
              },
              {
                title: "Resultados Duradouros",
                description: "Tecnologia que garante longa durabilidade mantendo a beleza natural.",
                icon: "⏰"
              },
              {
                title: "Suporte Completo",
                description: "Acompanhamento técnico e suporte para profissionais da beleza.",
                icon: "🤝"
              }
            ].map((diferencial, index) => (
              <div key={index} className="bg-[#f0efdb] rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="text-4xl mb-4">{diferencial.icon}</div>
                <h3 className="text-xl font-montserrat font-bold text-[#8a7d5c] mb-3">
                  {diferencial.title}
                </h3>
                <p className="text-[#333333] font-montserrat">
                  {diferencial.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full bg-[#f0efdb] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-le-jour text-[#8a7d5c] mb-6">
            PRONTO PARA REVOLUCIONAR SEU SALÃO?
          </h2>
          <p className="text-lg text-[#333333] font-montserrat mb-8 max-w-2xl mx-auto">
            Lançamento elaborado para transformar o seu salão e encantar os seus clientes. Prepare-se para um novo patamar de qualidade, conforto e praticidade com nossa exclusiva técnica de Mega Hair com fitas de Alta Performance.
          </p>
          <p className="text-base text-[#333333] font-montserrat mb-8">
            Criada especialmente para profissionais da beleza, ela combina facilidade de aplicação, segurança e resultados duradouros – tudo para deixar os cabelos de suas clientes deslumbrantes!
          </p>
          <div className="inline-block bg-[#d4a249] text-white px-10 py-4 rounded-full font-montserrat font-bold text-lg hover:bg-[#b8923e] transition-colors cursor-pointer shadow-lg hover:shadow-xl">
            Conheça detalhes sobre todo nosso lançamento
          </div>
        </div>
      </section>

      {/* Seção de Contato */}
      <ContactSection />
    </>
  );
} 