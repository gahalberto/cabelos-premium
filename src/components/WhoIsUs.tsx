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
            <div className="md:w-1/2" data-aos="fade-right">
              <p className="text-xl text-gray-700 leading-relaxed">
                A Cabelos Premium tem o prazer de apresentar uma inovação exclusiva para os profissionais da beleza: a nova técnica de Mega Hair com fitas de alta performance, desenvolvida para atender às necessidades de praticidade, conforto e qualidade que só os maiores salões exigem.
              </p>
            </div>
            <div className="md:w-1/2" data-aos="fade-left">
              <Image
                src="/images/finura.jpg"
                alt="Finura"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Segundo Bloco */}
          <div className="flex flex-col-reverse md:flex-row items-center gap-12">
            <div className="md:w-1/2" data-aos="fade-right">
              <Image
                src="/images/tecnica-maleavel.jpg"
                alt="Técnica Maleável"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="md:w-1/2" data-aos="fade-left">
              <p className="text-xl text-gray-700 leading-relaxed">
                Após meses de pesquisa e desenvolvimento, nosso produto foi criado com um único objetivo: oferecer aos profissionais da beleza uma solução eficiente e duradoura, sem abrir mão do conforto e da elegância. A necessidade de um produto que fosse fácil de aplicar, seguro e confortável para o cliente é o maior objetivo por trás dessa inovação.
              </p>
            </div>
          </div>

          {/* Terceiro Bloco */}
          <div className="text-center" data-aos="fade-up">
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              Agora, você pode ter acesso e em mãos uma técnica de mega hair única, feita sob medida para quem busca excelência no serviço e resultados impecáveis. Uma verdadeira revolução no mercado de extensões capilares.
            </p>
            <h2 className="text-3xl font-bold text-amber-600 mb-6">
              Exclusivo para Salões e Profissionais da Beleza
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-12">
              Com a Cabelos Premium, você terá uma ferramenta poderosa em seu salão para lotar sua agenda e faturar números nunca vistos antes. Aplique a técnica de mega hair com facilidade e rapidez, sem perder tempo ou comprometer a qualidade do serviço. Sinta a diferença e ofereça uma experiência premium aos seus clientes.
            </p>
            <Image
              src="/images/livros-caixa-cabelo.jpg"
              alt="Livros e Caixa de Cabelo"
              width={800}
              height={400}
              className="rounded-lg shadow-xl mx-auto"
            />
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

        <div className="max-w-6xl mx-auto space-y-24">
          {/* Introdução */}
          <div className="text-center" data-aos="fade-up">
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              Apresentamos a primeira coleção: Candy. Criada especialmente para nossas Sweet Darlings, mulheres exigentes e poderosas, mas muito doces.
            </p>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-12">
              São 6 tonalidades exclusivas, desenvolvidas para atender aos variados gostos e estilos de mesclagens e tons de descoloração.
            </p>
            <div className="max-w-4xl mx-auto">
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                autoplay={{
                  delay: 3500,
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
                <SwiperSlide>
                  <div className="p-2">
                    <Image
                      src="/images/toffee.jpg"
                      alt="Toffee"
                      width={400}
                      height={300}
                      className="rounded-lg shadow-xl mx-auto"
                    />
                    <h4 className="text-xl font-semibold text-amber-600 mt-4">Toffee</h4>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="p-2">
                    <Image
                      src="/images/vanilla.jpg"
                      alt="Vanilla"
                      width={400}
                      height={300}
                      className="rounded-lg shadow-xl mx-auto"
                    />
                    <h4 className="text-xl font-semibold text-amber-600 mt-4">Vanilla</h4>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="p-2">
                    <Image
                      src="/images/6-cores.jpg"
                      alt="Caramel"
                      width={400}
                      height={300}
                      className="rounded-lg shadow-xl mx-auto"
                    />
                    <h4 className="text-xl font-semibold text-amber-600 mt-4">Caramel</h4>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="p-2">
                    <Image
                      src="/images/6-cores.jpg"
                      alt="Chocolate"
                      width={400}
                      height={300}
                      className="rounded-lg shadow-xl mx-auto"
                    />
                    <h4 className="text-xl font-semibold text-amber-600 mt-4">Chocolate</h4>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="p-2">
                    <Image
                      src="/images/6-cores.jpg"
                      alt="Honey"
                      width={400}
                      height={300}
                      className="rounded-lg shadow-xl mx-auto"
                    />
                    <h4 className="text-xl font-semibold text-amber-600 mt-4">Honey</h4>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="p-2">
                    <Image
                      src="/images/6-cores.jpg"
                      alt="Blonde"
                      width={400}
                      height={300}
                      className="rounded-lg shadow-xl mx-auto"
                    />
                    <h4 className="text-xl font-semibold text-amber-600 mt-4">Blonde</h4>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>

          {/* Diferencial */}
          <div data-aos="fade-up" className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8 text-amber-600">
              A primeira marca que trabalha com fitas EXCLUSIVAMENTE COM CABELOS BRASILEIROS DO SUL
            </h3>
            <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto leading-relaxed mb-8">
              Cada fita mede 5cm. São finas, flexíveis e confortáveis, proporcionando um resultado impecável e natural. A técnica de mega hair mais avançada no mercado, garante um acabamento suave e invisível, totalmente leve e confortável, ideal para quem busca o melhor resultado em extensão capilar.
            </p>
            <Image
              src="/images/fita-fina.jpg"
              alt="Fita Fina"
              width={800}
              height={400}
              className="rounded-lg shadow-xl mx-auto"
            />
          </div>

          {/* Cores */}
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6" data-aos="fade-right">
              <h3 className="text-2xl font-bold text-amber-600">Toffee</h3>
              <p className="text-xl text-gray-700">Uma cor quente e sofisticada, com tons de caramelo e dourado.</p>
              <Image
                src="/images/toffee.jpg"
                alt="Toffee"
                width={500}
                height={300}
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="space-y-6" data-aos="fade-left">
              <h3 className="text-2xl font-bold text-amber-600">Vanilla</h3>
              <p className="text-xl text-gray-700">Um tom suave e delicado, perfeito para iluminar os fios.</p>
              <Image
                src="/images/vanilla.jpg"
                alt="Vanilla"
                width={500}
                height={300}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Características */}
          <div data-aos="fade-up" className="mb-12">
            <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto leading-relaxed mb-12">
              Cada kit é ideal para criar efeitos naturais e discretos, sem comprometer a leveza e o conforto dos fios naturais. Por ser mais fina e flexível, a fita se adapta facilmente a qualquer tipo de cabelo, garantindo uma aplicação precisa e duradoura.
            </p>
            <Image
              src="/images/flexivel.jpg"
              alt="Flexível"
              width={800}
              height={400}
              className="rounded-lg shadow-xl mx-auto"
            />
          </div>

          {/* Benefícios */}
          <div data-aos="fade-up" className="mb-12">
            <h3 className="text-3xl font-bold text-center mb-12 text-amber-600">
              Por que escolher o Mega Hair Candy?
            </h3> 
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <span className="text-amber-600 text-2xl">✅</span>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Conforto e Leveza</h4>
                  <p className="text-gray-600">As fitas são finas e flexíveis, proporcionando uma sensação de leveza durante o uso.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-amber-600 text-2xl">✅</span>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Durabilidade e Segurança</h4>
                  <p className="text-gray-600">Feitas com cabelo 100% brasileiro do Sul, garantem resistência e longevidade.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-amber-600 text-2xl">✅</span>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Estilo e Versatilidade</h4>
                  <p className="text-gray-600">Diversas tonalidades para atender os vários gostos de descoloração.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-amber-600 text-2xl">✅</span>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Qualidade Pro</h4>
                  <p className="text-gray-600">Produto exclusivo para salões e profissionais da beleza, desenvolvido com os mais altos padrões do mercado.</p>
                </div>
              </div>
            </div>
            <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto leading-relaxed mt-12">
              O Mega Hair Candy é a escolha certa para quem busca oferecer aos seus clientes a melhor experiência em extensões capilares, com a garantia de resultados naturais e duradouros. Disponível apenas para profissionais de beleza, nossa coleção é a ferramenta perfeita para levar o seu salão a um novo patamar.
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
    </>
  );
};

export default WhoIsUs;