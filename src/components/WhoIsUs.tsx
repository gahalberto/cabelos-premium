"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Separator } from "./ui/separator";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

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
          background-color: #d97706 !important;
        }
        
        .swiper-button-next,
        .swiper-button-prev {
          color: #d97706 !important;
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
      <section className="w-full bg-white py-20 px-4 sm:px-10 md:px-20 lg:px-36">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-raleway text-gray-800 ">Lançamento</h1>
          <Separator className="my-6 bg-amber-600 mx-auto w-16" />
        </header>

        <div className="max-w-6xl mx-auto space-y-24">
          {/* Primeiro Bloco */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="" data-aos="fade-right">
              <p className="text-xl text-gray-700 leading-relaxed">
              A Cabelos Premium tem o prazer de apresentar uma inovação exclusiva para os profissionais da beleza: a nova técnica de Mega Hair com fitas de alta performance, desenvolvida para atender às necessidades de praticidade, conforto e qualidade que só os maiores salões exigem, pela primeira vez no Brasil confeccionada por uma marca especialista em Cabelos Brasileiros do Sul.
              </p>
            </div>
          </div>

          {/* Carrossel de Imagens */}
          <div className="mt-12" data-aos="fade-up">
            <h3 className="text-2xl font-bold text-amber-600 mb-6 text-center">
              Conheça nossa linha de produtos
            </h3>
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
                    slidesPerView: 2,
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
                        className="rounded-lg shadow-xl mx-auto object-cover w-full h-[300px]"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Texto após o carrossel */}
          <div className="text-center max-w-4xl mx-auto" data-aos="fade-up">
            <p className="text-xl text-gray-700 leading-relaxed">
              Lançamento elaborado para transformar o seu salão e encantar os seus clientes. Prepare-se para um novo patamar de qualidade, conforto e praticidade com nossa exclusiva técnica de Mega Hair com fitas de Alta Performance. Criada especialmente para profissionais da beleza, ela combina facilidade de aplicação, segurança e resultados duradouros – tudo para deixar os cabelos de suas clientes deslumbrantes! 
              Conheça mais sobre nossa trajetória de lançamento clicando na aba "Lançamento".
            </p>
          </div>
        </div>
      </section>

      {/* Seção Coleção Candy */}
      <section className="w-full bg-emerald-50 py-20 px-4 sm:px-10 md:px-20 lg:px-36">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-raleway text-gray-800">Coleção</h1>
          <h2 className="text-3xl text-amber-600 mt-4">Candy, uma doce coleção</h2>
          <Separator className="my-6 bg-amber-600 mx-auto w-16" />
        </header>

        <div className="max-w-6xl mx-auto space-y-12">
          {/* Introdução */}
          <div className="text-center" data-aos="fade-up">
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              Nossa primeira coleção traz cores que você vai amar: Candy. Todas cores feitas manualmente em Cabelos Brasileiros do Sul selecionados da Cabelos Premium, ficam ainda mais perfeitos quando juntamos eles a essa técnica de lançamento. Com 6 tonalidades exclusivas, essa linha foi pensada para mulheres poderosas, sofisticadas e elegantes, mas com aquele toque doce e encantador. Feitas com cabelos brasileiros do Sul, as fitas Mega Hair são fininhas, flexíveis e ideais para quem busca naturalidade, conforto e durabilidade.
            </p>
          </div>

          {/* Carrossel de Cores */}
          <div className="max-w-4xl mx-auto" data-aos="fade-up">
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
              className="candy-swiper"
            >
              {[
                { name: "Caramel", image: "caramel.jpg" },
                { name: "Vanilla", image: "vanilla.jpg" },
                { name: "Toffee", image: "toffee.jpg" },
                { name: "Honey", image: "honey.jpg" },
                { name: "Cookie", image: "cookie.jpg" },
                { name: "Like a Virgin", image: "like a virgin.jpg" }
              ].map((color) => (
                <SwiperSlide key={color.name}>
                  <div className="p-2">
                    <Image
                      src={`/images/candy/${color.image}`}
                      alt={color.name}
                      width={400}
                      height={300}
                      className="rounded-lg shadow-xl mx-auto object-cover w-full h-[300px]"
                    />
                    <h4 className="text-xl font-semibold text-amber-600 mt-4 text-center">{color.name}</h4>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Texto Final */}
          <div className="text-center max-w-3xl mx-auto" data-aos="fade-up">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              De Caramel a Like a Virgin, cada cor traz uma transição suave, deixando os fios radiantes e elegantes. A escolha perfeita para qualquer estilo!
            </p>
            <p className="text-xl text-gray-700 leading-relaxed">
              Saiba detalhes da nossa coleção de cores Candy clicando na aba "Coleção".
            </p>
          </div>
        </div>
      </section>

      {/* Seção Produtos */}
      <section className="w-full bg-white py-20 px-4 sm:px-10 md:px-20 lg:px-36">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-raleway text-gray-800">Produtos</h1>
          <h2 className="text-3xl text-amber-600 mt-4">Conheça nossos produtos exclusivos para Extensões Capilares</h2>
          <Separator className="my-6 bg-amber-600 mx-auto w-16" />
        </header>

        <div className="max-w-6xl mx-auto space-y-12">
          {/* Introdução */}
          <div className="text-center" data-aos="fade-up">
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              A linha Keter Cosméticos, com formulação italiana e base de caviar, oferece cuidados especializados para manter suas extensões sempre lindas e saudáveis. Cada produto foi desenvolvido para tratar e proteger, mantendo os cabelos mais macios, fortes e com aquele brilho que todo Mega Hair merece.
            </p>
          </div>

          {/* Carrossel de Produtos */}
          <div className="max-w-4xl mx-auto" data-aos="fade-up">
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
              className="products-swiper"
            >
              {[
                { name: "Shampoo", image: "shampoo.jpg" },
                { name: "Máscara", image: "mascara.jpg" },
                { name: "Leave-in", image: "leavein.jpg" },
                { name: "Óleo", image: "oleo.jpg" },
                { name: "Removedor", image: "removedor.jpg" },
                { name: "Removedor Refill", image: "removedor refill.jpg" }
              ].map((product) => (
                <SwiperSlide key={product.name}>
                  <div className="p-2">
                    <Image
                      src={`/images/produtos/${product.image}`}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="rounded-lg shadow-xl mx-auto object-cover w-full h-[300px]"
                    />
                    <h4 className="text-xl font-semibold text-amber-600 mt-4 text-center">{product.name}</h4>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Texto Final */}
          <div className="text-center max-w-3xl mx-auto" data-aos="fade-up">
            <p className="text-xl text-gray-700 leading-relaxed">
              Conheça todos nossos produtos e seus benefícios clicando na aba "Produtos".
            </p>
          </div>
        </div>
      </section>

      {/* Seção Final */}
      <section className="w-full bg-amber-50 py-20 px-4 sm:px-10 md:px-20 lg:px-36">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-amber-600">
            Feita por profissionais, para profissionais
          </h2>
        </div>
      </section>

      {/* Seção Dúvidas */}
      <section className="w-full bg-amber-50 py-20 px-4 sm:px-10 md:px-20 lg:px-36">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-amber-600 mb-8">
            DÚVIDAS?
          </h2>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Fale Conosco – Aqui, o atendimento é Personalizado!
          </h3>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            Tem alguma dúvida ou quer saber mais sobre nossos produtos e técnicas? Converse diretamente com uma de nossas especialistas via WhatsApp, que você encontra na aba "CONTATO"! Elas estão prontas para ajudar você a escolher as melhores opções para seu salão e levar seu serviço de Mega Hair a um novo nível de excelência.
          </p>
          <p className="text-xl text-gray-700 leading-relaxed">
            Seja bem-vindo à Cabelos Premium – onde a beleza é tratada com sofisticação e a qualidade é sempre garantida!
          </p>
        </div>
      </section>
    </>
  );
};

export default WhoIsUs;