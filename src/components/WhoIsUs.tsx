"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import ContactSection from "./ContactSection";

const WhoIsUs = () => {
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
        
        .candy-swiper {
          padding-bottom: 50px !important;
        }
        
        .launch-swiper {
          padding-bottom: 50px !important;
        }
      `}</style>
            
      {/* Seção Lançamento */}
      <section className="w-full bg-[#f0efdb] py-16">
        <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto items-center justify-center px-8">
          {/* Texto */}
          <div className="w-full md:w-1/2 flex flex-col items-start justify-center px-4 md:px-8 lg:px-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-le-jour text-[#8a7d5c] mb-6 tracking-wide whitespace-nowrap">
              CABELOS PREMIUM
            </h1>
            <div className="mb-6">
              <p className="text-xl md:text-2xl text-[#333333] font-montserrat font-bold leading-snug">
                Há mais de 1 década sendo especialista em{" "}
                <span className="font-brittany text-3xl md:text-4xl italic font-normal">
                  Brasileiros do Sul
                </span>
              </p>
            </div>
            <p className="text-base md:text-lg text-[#333333] leading-relaxed font-montserrat font-thin max-w-xl">
              Beleza começa pela qualidade. Na Cabelos Premium, oferecemos cabelos 100% brasileiros, selecionados diretamente da região Sul do país, reconhecida pela textura macia, brilho natural e alta durabilidade dos fios.
            </p>
          </div>
          {/* Imagem */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <img 
              src="/images/novas-imagens/cap1.png" 
              alt="Cabelos Premium Lançamento" 
              className="w-3/4 md:w-2/3 h-auto object-cover"
            />
          </div>
        </div>

        <div className="w-full flex justify-center">
          <Image
            src="/images/v3/hero1.png"
            alt="Hero"
            width={1200}
            height={600}
            className="w-full object-cover"
          />
        </div>

        <div className="max-w-6xl mx-auto pt-10">
          <div data-aos="fade-up">

            <div className="max-w-4xl mx-auto">
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                autoplay={{
                  delay: 3000,
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
                {[
                  "Cópia de acm_051224164.jpg",
                  "Cópia de acm_051224171.jpg", 
                  "Cópia de acm_051224236.jpg",
                  "Cópia de acm_051224244.jpg",
                  "Cópia de acm_051224247.jpg",
                  "Cópia de acm_051224248.jpg"
                ].map((imageName, index) => (
                  <SwiperSlide key={index}>
                    <div className="p-2">
                      <Image
                        src={`/images/novas-imagens/carrosel1/${imageName}`}
                        alt={`Produto Premium ${index + 1}`}
                        width={400}
                        height={300}
                        className="rounded-lg shadow-xl mx-auto object-cover w-full h-[300px]"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <div className="font-montserrat text-center pt-10 px-8 md:px-12 font-thin lg:px-16">
            Lançamento elaborado para transformar o seu salão e encantar os seus clientes. Prepare-se para um novo patamar de qualidade, conforto e praticidade com nossa exclusiva técnica de Mega Hair com fitas de Alta Performance.
            <br/><br/>
            Criada especialmente para profissionais da beleza, ela combina facilidade de aplicação, segurança e resultados duradouros – tudo para deixar os cabelos de suas clientes deslumbrantes!
          </div>
        </div>
        <div className="font-bold font-montserrat text-center pt-10">Conheça detalhes sobre todo nosso lançamento clicando aqui.
        </div>
      </section>

      {/* Seção Quem Somos */}
      <section className="w-full bg-[#f0efdb] py-24 px-4">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-le-jour text-[#8a7d5c] mb-10 tracking-wide">
            QUEM SOMOS?
          </h1>
          <p className="text-[21px] text-[#333333] mb-10">
            <span className="font-montserrat font-semibold">Nossa história é feita de </span>
            <span className="font-brittany text-4xl md:text-5xl italic font-normal">qualidade e confiança.</span>
          </p>
          <p className="text-base md:text-lg text-[#333333] font-montserrat font-thin leading-relaxed max-w-2xl mx-auto">
            A Cabelos Premium nasceu com o propósito de oferecer ao mercado fios brasileiros autênticos, com procedência garantida e padrão superior.
          </p>
        </div>
        <div className="w-screen relative left-1/2 -translate-x-1/2 mt-12">
          <Image
            src="/images/v3/hero2.png"
            alt="Quem Somos"
            width={1200}
            height={600}
            className="w-full object-cover"
          />
        </div>
        <div className="max-w-5xl mx-auto text-center px-4 pt-12 pb-4" data-aos="fade-up">
          <p className="text-base md:text-lg text-[#333333] font-montserrat font-thin leading-relaxed">
            Especializados em cabelos do Sul do Brasil, selecionamos cada mecha com cuidado, priorizando textura uniforme, cutículas alinhadas e durabilidade excepcional. Nosso compromisso vai além da venda: buscamos criar relações de confiança com profissionais e clientes finais, oferecendo atendimento personalizado e suporte completo.
            <br />
            Acreditamos que cabelo é identidade, autoestima e poder. <span className="font-semibold">E é por isso que entregamos apenas o melhor.</span>
          </p>
        </div>
      </section>

      {/* Seção Nossas Laces */}
      <section className="w-full bg-[#8a7d5c] py-20 pt-16 px-4 sm:px-10 md:px-20 lg:px-36 relative ">
        <div className="relative z-10">
          <header className="text-center">
            <h1 className="font-le-jour text-[37.8px] text-[#e6e6e6] pb-16">NOSSAS LACES</h1>
            <h2 className="text-[#e6e6e6] mt-4 pb-16">
              <span className="font-montserrat text-[21px] font-bold">Vários modelos de full laces para nossas </span>
              <span className="font-brittany text-[31.5px]">darlings</span>
            </h2>
          </header>

          <div className="max-w-6xl mx-auto" data-aos="fade-up">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                "1.png",
                "2.png",
                "3.png",
                "4.png",
                "5.png",
                "6.png",
                "7.png",
                "8.png",
              ].map((imageName, index) => (
                <div key={index} className="overflow-hidden rounded-[18px] bg-white/10">
                  <Image
                    src={`/images/laces/${imageName}`}
                    alt={`Lace ${index + 1}`}
                    width={320}
                    height={420}
                    className="w-full h-auto object-cover rounded-[18px]"
                  />
                </div>
              ))}
            </div>

            <p className="font-brittany text-[39.5px] text-[#f0efdb] text-center pt-12">
              Cores artesanalmente personalizadas
            </p>

            <div className="flex justify-center pt-8">
              <button className="rounded-xl bg-[#f0efdb] px-6 py-2 font-montserrat text-[24.1px] text-black">
                SAIBA MAIS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Produtos */}
      <section id="shop" className="w-full bg-[#bca168] py-20 px-6 md:px-24 relative overflow-hidden">
        {/* Background com padrão de logo */}
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="w-full h-full bg-repeat" style={{ backgroundImage: "url('/images/logoouro.png')", backgroundSize: "300px" }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Cabeçalho */}
          <div className="text-center mb-8" data-aos="fade-up">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-le-jour text-[#333333] mb-4">SHOP</h1>
            <p className="text-xl md:text-2xl  font-montserrat font-bold text-[#333333] mb-0">
              Conheça nossa linha de produtos exclusivos para Extensões Capilares
            </p>
          </div>

          {/* Seção Keter Cosméticos */}
          <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8">
            <div className="w-full lg:w-1/2 px-8 md:px-12 lg:px-16" data-aos="fade-right">
              <h2 className="font-brittany text-4xl md:text-5xl text-[#f0efdb] mb-6">Keter Cosmeticos</h2>
              <p className="font-montserrat text-[#333333] mb-4">
                Desenvolvida com <span className="font-bold">tecnologia italiana e base de extrato de caviar</span>, a <span className="font-bold">linha Keter Cosméticos</span> foi criada para oferecer um cuidado completo e sofisticado às suas <span className="font-bold">extensões</span> e todos os tipos de cabelos.
              </p>
              <p className="font-montserrat text-[#333333] mb-4">
                Cada produto é formulado com ativos de alta performance que <span className="font-bold">nutrem, fortalecem e protegem os fios</span>, preservando a leveza e o toque sedoso característico dos cabelos naturais.
              </p>
              <p className="font-montserrat text-[#333333] mb-4">
                O resultado é um cabelo <span className="font-bold">mais saudável, brilhante e cheio de vida</span>, com a durabilidade e o movimento que um <span className="font-bold">Mega Hair Premium</span> merece.
              </p>
            </div>
            
            <div className="w-full lg:w-1/2 flex justify-center" data-aos="fade-left">
              <Image
                src="/images/produtos/produtos.png"
                alt="Keter Cosméticos"
                width={800}
                height={650}
                className="object-contain w-full max-w-2xl"
              />
            </div>
          </div>

          {/* Grid de produtos numerados */}
        </div>
        <div className="bg-orange-100 bg-opacity-20 w-screen py-16 px-4 sm:px-6 md:px-8 lg:px-12 -mx-6 md:-mx-24" data-aos="fade-up">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
              {/* Linha do tempo horizontal - visível apenas em telas grandes */}
              <div className="hidden lg:block absolute top-5 left-[10%] right-[10%] h-1 bg-[#a38a55] opacity-30 z-0"></div>
            {/* Produto 1 */}
            <div className="flex flex-col items-center">
              <div className="bg-[#a38a55] w-10 h-10 rounded-full flex items-center justify-center mb-6 relative z-10 ring-4 ring-orange-100 ring-opacity-50">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-center font-montserrat font-medium mb-4">Removedor</h3>
              <div className="h-48 w-full relative mb-2">
                <Image
                  src="/images/produtos/removedor.png"
                  alt="Removedor"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Produto 2 */}
            <div className="flex flex-col items-center">
              <div className="bg-[#a38a55] w-10 h-10 rounded-full flex items-center justify-center mb-6 relative z-10 ring-4 ring-orange-100 ring-opacity-50">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-center font-montserrat font-medium mb-4">Óleo Hidratante</h3>
              <div className="h-48 w-full relative mb-2">
                <Image
                  src="/images/produtos/oleo.png"
                  alt="Óleo Hidratante"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Produto 3 */}
            <div className="flex flex-col items-center">
              <div className="bg-[#a38a55] w-10 h-10 rounded-full flex items-center justify-center mb-6 relative z-10 ring-4 ring-orange-100 ring-opacity-50">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-center font-montserrat font-medium mb-4">Shampoo</h3>
              <div className="h-48 w-full relative mb-2">
                <Image
                  src="/images/produtos/shampoo.png"
                  alt="Shampoo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Produto 4 */}
            <div className="flex flex-col items-center">
              <div className="bg-[#a38a55] w-10 h-10 rounded-full flex items-center justify-center mb-6 relative z-10 ring-4 ring-orange-100 ring-opacity-50">
                <span className="text-white font-bold">4</span>
              </div>
              <h3 className="text-center font-montserrat font-medium mb-4">Máscara</h3>
              <div className="h-48 w-full relative mb-2">
                <Image
                  src="/images/produtos/mascara.png"
                  alt="Máscara"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Produto 5 */}
            <div className="flex flex-col items-center">
              <div className="bg-[#a38a55] w-10 h-10 rounded-full flex items-center justify-center mb-6 relative z-10 ring-4 ring-orange-100 ring-opacity-50">
                <span className="text-white font-bold">5</span>
              </div>
              <h3 className="text-center font-montserrat font-medium mb-4">Leave-in</h3>
              <div className="h-48 w-full relative mb-2">
                <Image
                  src="/images/produtos/leavein.png"
                  alt="Leave-in"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          </div>
                  </div>
          
          {/* Rodapé da seção */}
          <div className="text-center mt-8 max-w-7xl mx-auto relative z-10" data-aos="fade-up">
            <p className="font-montserrat text-[#333333] hover:text-[#d4a249] transition-colors cursor-pointer">
              Conheça detalhes sobre toda nossa linha de tratamento clicando aqui.
            </p>
          </div>
      </section>

      {/* Seção de Contato */}
      <ContactSection />

    </>
  );
};

export default WhoIsUs;