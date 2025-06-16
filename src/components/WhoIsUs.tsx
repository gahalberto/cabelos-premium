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
import HeaderBanner from "./HeaderBanner";
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
        {/* Título Principal sozinho no topo */}
        <div className="w-full flex justify-center mb-12 px-4">
          <h1 className="text-[37.8px] md:text-4xl lg:text-5xl xl:text-6xl font-le-jour text-[#8a7d5c] tracking-wide leading-tight text-center">
            LANÇAMENTO BY CABELOS PREMIUM
          </h1>
        </div>
        <div className="flex flex-col md:flex-row w-full max-w-none items-center justify-center">
          {/* Texto centralizado */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center px-4 md:px-0">
            <h2 className="text-xl md:text-2xl lg:text-3xl text-[#333333] mb-6">
              <span className="font-montserrat font-medium">Uma técnica exclusiva para </span>
              <span className="font-brittany italic text-2xl md:text-3xl lg:text-4xl">profissionais</span>
            </h2>
            <p className="text-base md:text-lg text-[#333333] leading-relaxed font-montserrat max-w-xl">
              A Cabelos Premium tem o prazer de apresentar uma inovação exclusiva para os profissionais da beleza: a nova técnica de Mega Hair com fitas de alta performance, desenvolvida para atender às necessidades de praticidade, conforto e qualidade que só os maiores salões exigem, <span className="font-bold">pela primeira vez no Brasil confeccionada por uma marca especialista em Cabelos Brasileiros do Sul.</span>
            </p>
          </div>
          {/* Imagem colada na borda direita */}
          <div className="relative w-full h-full flex justify-end items-stretch md:w-1/2 max-w-xl md:max-w-[450px] lg:max-w-[550px] xl:max-w-[600px]">
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
          <div className="font-montserrat text-center pt-10">Lançamento elaborado para transformar o seu salão e encantar os seus clientes. Prepare-se para um novo patamar de qualidade, conforto e praticidade com nossa exclusiva técnica de Mega Hair com fitas de Alta Performance.

Criada especialmente para profissionais da beleza, ela combina facilidade de aplicação, segurança e resultados duradouros – tudo para deixar os cabelos de suas clientes deslumbrantes!
</div>
        </div>
        <div className="font-bold font-montserrat text-center pt-10">Conheça detalhes sobre todo nosso lançamento clicando aqui.
        </div>
      </section>

      {/* Seção Coleção Candy */}
      <section className="w-full bg-[#8a7d5c] py-20 pt-16 px-4 sm:px-10 md:px-20 lg:px-36 relative ">
        <div className="absolute right-0 top-0 z-0" style={{height: '520px', width: '33%'}}>
          <Image
            src="/images/2/imagem-candy.png"
            alt="Background Candy"
            width={600}
            height={220}
            className="object-contain object-right object-top opacity-90 w-full h-full"
          />
        </div>
        <div className="relative z-10">
          <header className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-le-jour text-[#e6e6e6] pb-16">COLEÇÃO CANDY</h1>
            <h2 className="text-[#e6e6e6] mt-4 pb-16">
              <span className="font-brittany text-[45px]">Uma doce</span>
              <span className="font-montserrat font-bold text-[25px]"> coleção de cores para nossas </span>
              <span className="font-brittany text-[45px]">darlings</span>
            </h2>
            <div className="mt-8 text-[18px] text-[#e6e6e6] font-montserrat text-left max-w-4xl mx-auto">
              Nossa primeira coleção traz cores que você vai amar: conheça Candy. <b>Todas cores feitas manualmente em Cabelos Brasileiros do Sul selecionados da Cabelos Premium</b>, ficam ainda mais perfeitos quando juntamos eles a essa técnica de lançamento. Com <b>6 tonalidades exclusivas</b>, essa linha foi pensada para mulheres poderosas, sofisticadas e elegantes, mas com aquele toque doce e encantador. Feitas com cabelos brasileiros do Sul, as fitas Mega Hair são <b>fininhas, flexíveis e ideais para quem busca naturalidade, conforto e durabilidade.</b>
              <br/><br/>
              <b>De Caramel a Like a Virgin</b>, cada cor traz uma transição suave, deixando os fios radiantes e elegantes.
            </div>
            <Separator className="my-6 bg-amber-400 mx-auto w-32 h-1" />
          </header>

          <div className="max-w-6xl mx-auto">
            {/* Grid de cores */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16" data-aos="fade-up">
              {[
                { name: "Caramel", image: "Caramel.png" },
                { name: "Vanilla", image: "Vanilla.png" },
                { name: "Toffee", image: "Toffee.png" },
                { name: "Honey", image: "Honey.png" },
                { name: "Cookie", image: "Cookie.png" },
                { name: "Like a Virgin", image: "Virgin.png" }
              ].map((color) => (
                <div key={color.name} className="flex flex-col items-center">
                  <div className="w-40 h-40  rounded-md flex items-center justify-center mb-3">
                    <Image
                      src={`/images/3/${color.image}`}
                      alt={color.name}
                      width={200}
                      height={130}
                      className="object-contain"
                    />
                  </div>
                  <h4 className="text-base font-medium text-[#e6e6e6]">{color.name}</h4>
                </div>
              ))}
              <div className="col-span-2 md:col-span-3 lg:col-span-6 flex justify-center items-center">
                <div className="text-center max-w-2xl mx-auto">
                  <h3 className="text-6xl font-brittany text-[#f0efdb] mb-4 pt-12 pb-8">
                    Cores artesanalmente padronizadas
                  </h3>
                  <p className="text-base font-bold font-montserrat text-white">
                    Descubra mais sobre as cores da nossa doce coleção clicando aqui.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Seção Torne-se Expert */}
      <section className="w-full bg-[#f0efdb] py-36 px-4 sm:px-10 md:px-20 lg:px-36">
        <div className="max-w-6xl mx-auto">
          {/* Título Principal */}
          <div className="text-center mb-16" data-aos="fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-le-jour text-[#8a7d5c] mb-6 tracking-wide">
              TORNE-SE EXPERT
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl text-[#333333] mb-8">
              <span className="font-montserrat font-semibold">Com nossa técnica você transforma sua  paixão</span>
              <span className="font-montserrat font-semibold"> em </span>
              <span className="font-brittany italic text-5xl  text-black">sucesso</span>
            </h2>
            <p className="text-base md:text-lg text-[#333333] font-montserrat max-w-3xl mx-auto leading-relaxed text-left">
              Quer se destacar na beleza, oferecer um serviço premium e aumentar seus ganhos? 
              Com a Cabelos Premium, você aprende do zero ao avançado as técnicas mais modernas e seguras 
              de extensão capilar, e o melhor: <span className="font-bold text-black">o curso é 100% gratuito na compra do nosso kit de cabelos.</span>
            </p>
          </div>

          {/* Título "Você vai aprender:" alinhado à esquerda com lista */}
          <div className="mb-12" data-aos="fade-up">
            <div className="max-w-2xl mx-auto">
              <h3 className="text- mb-2 text-black font-montserrat ">
                Você vai aprender:
              </h3>
              <ul className="space-y-2 font-montserrat">
                {[
                  "Aplicações naturais e seguras",
                  "Técnicas de finalização profissional", 
                  "Atendimento premium e fidelização de clientes",
                  "Estratégias de vendas e posicionamento no mercado"
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-[#333333] font-montserrat">
                    <div className="w-2 h-2 bg-black rounded-full mr-4 flex-shrink-0"></div>
                    <span className="text-base font-bold md:text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Imagem do lado esquerdo */}
            <div className="flex justify-center lg:justify-center order-2 lg:order-1" data-aos="fade-right">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#d4a249] to-[#f0efdb] rounded-3xl opacity-10 blur-xl"></div>
                <div className="relative rounded-2xl p-6">
                  <Image
                    src="/images/expert.png"
                    alt="Kit Cabelos Premium"
                    width={500}
                    height={500}
                    className="object-contain w-[1200px] h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Conteúdo Direito - Benefícios */}
            <div className="space-y-8 order-1 lg:order-2" data-aos="fade-left">
              {/* Benefícios */}
              <div className="bg-[#8a7d5c] rounded-2xl p-6 md:p-8">
                <h4 className="text-xl md:text-5xl font-brittany text-[#f0efdb] mb-6">
                  Benefícios:
                </h4>
                <div className="space-y-1">
                  {[
                    "Curso gratuito com o kit",
                    "Suporte completo", 
                    "Instrutores especializados",
                    "Marca consolidada no Brasil",
                    "Alta demanda e ótimo faturamento"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center text-[#f0efdb] font-montserrat">
                      <svg className="w-5 h-5 text-white mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm md:text-base">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16" data-aos="fade-up">
            <p className="text-lg md:text-xl font-montserrat text-[#333333] mb-6">
            Seja você iniciante ou profissional da beleza, essa é sua chance de se tornar referência!
 Adquira seu kit, ganhe o curso completo e comece a faturar mais. <b>Clique e saiba mais.</b>

              <br className="hidden md:block" />
            </p>
            <div className="text-sm inline-block bg-[#8a7d5c] text-white px-8 py-4 rounded-lg font-montserrat uppercase  hover:bg-[#b8923e] transition-colors cursor-pointer shadow-lg">
              Saiba mais
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
            <h1 className="text-4xl md:text-5xl font-le-jour text-[#333333] mb-4">SHOP</h1>
            <p className="text-lg md:text-xl font-montserrat text-[#333333] mb-12">
              Conheça nossa linha de produtos exclusivos para Extensões Capilares
            </p>
          </div>

          {/* Seção Keter Cosméticos */}
          <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8">
            <div className="w-full lg:w-1/2" data-aos="fade-right">
              <h2 className="font-brittany text-4xl md:text-5xl text-[#f0efdb] mb-6">Keter Cosmeticos</h2>
              <p className="font-montserrat text-[#333333] mb-4">
                A linha Keter Cosméticos com <span className="font-bold ">formulação italiana e base de caviar</span>, oferece cuidados especializados para manter suas extensões sempre lindas e saudáveis. Cada produto foi desenvolvido para tratar e proteger, mantendo os cabelos mais macios, fortes e com aquele brilho que toda <span className="font-bold">Mega Hair merece</span>.
              </p>
            </div>
            
            <div className="w-full lg:w-1/2 flex justify-center" data-aos="fade-left">
              <Image
                src="/images/produtos/produtos.png"
                alt="Keter Cosméticos"
                width={500}
                height={400}
                className="object-contain"
              />
            </div>
          </div>

          {/* Grid de produtos numerados */}
        </div>
        <div className="bg-orange-100 bg-opacity-20 w-full py-16" data-aos="fade-up">
          <div className="max-w-7xl mx-auto px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Produto 1 */}
            <div className="flex flex-col items-center">
              <div className="bg-[#a38a55] w-10 h-10 rounded-full flex items-center justify-center mb-6">
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
              <div className="bg-[#a38a55] w-10 h-10 rounded-full flex items-center justify-center mb-6">
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
              <div className="bg-[#a38a55] w-10 h-10 rounded-full flex items-center justify-center mb-6">
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
              <div className="bg-[#a38a55] w-10 h-10 rounded-full flex items-center justify-center mb-6">
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
              <div className="bg-[#a38a55] w-10 h-10 rounded-full flex items-center justify-center mb-6">
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
          
          {/* Rodapé da seção */}
          <div className="text-center mt-8" data-aos="fade-up">
            <p className="font-montserrat text-[#333333] hover:text-[#d4a249] transition-colors cursor-pointer">
              Conheça detalhes sobre toda nossa linha de tratamento clicando aqui.
            </p>
          </div>
                  </div>
      </section>

      {/* Seção de Contato */}
      <ContactSection />

    </>
  );
};

export default WhoIsUs;