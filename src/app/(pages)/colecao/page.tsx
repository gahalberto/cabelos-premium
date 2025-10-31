"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";

export default function ColecaoPage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  return (
    <>
      {/* Section Candy */}
      <section className="w-full bg-[#8a7d5c] py-20">
        <div className="max-w-6xl mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-center" data-aos="fade-up">
            <h1 className="font-le-jour text-[37px] text-white mb-6 tracking-wide uppercase">
              coleção candy
            </h1>
            
            <h2 className="text-2xl md:text-3xl text-white mb-8">
              <span className="font-brittany italic">Uma doce</span>
              <span className="font-montserrat"> coleção de cores para nossas </span>
              <span className="font-brittany italic">darlings</span>
            </h2>

            <div className="max-w-4xl mx-auto mb-16">
              <p className="text-base text-white leading-relaxed font-montserrat text-center">
                <span className="font-bold">Apresentamos a primeira coleção: Candy.</span>
                <span className="font-thin"> Criada especialmente para nossas Sweet Darlings, mulheres exigentes e poderosas, mas muito doces. </span>
                <span className="font-bold">São 6 tonalidades exclusivas,</span>
                <span className="font-thin"> desenvolvidas para atender aos variados gostos e estilos de mesclagens e tons de descoloração.</span>
              </p>
            </div>

            {/* Grid de cores */}
            <div className="max-w-6xl mx-auto">
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
                    <h4 className="text-base font-medium text-[#f0efdb] mb-3">{color.name}</h4>
                    <div className="w-48 h-48 rounded-md flex items-center justify-center">
                      <Image
                        src={`/images/3/${color.image}`}
                        alt={color.name}
                        width={250}
                        height={180}
                        className="object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Texto após as imagens */}
              <div className="max-w-4xl mx-auto mb-16">
                <p className="text-base text-white leading-relaxed font-montserrat font-thin text-center">
                  A primeira marca que trabalha com fitas EXCLUSIVAMENTE COM <span className="font-bold">CABELOS BRASILEIROS DO SUL,</span> máxima qualidade e durabilidade. São finas, flexíveis e confortáveis, proporcionando um resultado impecável e natural. A técnica de mega hair mais avançada no mercado, garante um acabamento suave e invisível, totalmente leve e confortável, ideal para quem busca o melhor resultado em extensão capilar.
                </p>
              </div>

              <div className="grid grid-cols-1">
                <div className="col-span-1 flex justify-center items-center">
                  <div className="text-center max-w-2xl mx-auto">
                    <h3 className="text-6xl font-brittany font-thin text-[#f0efdb] mb-4 pt-12 pb-8">
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
        </div>
      </section>

      {/* Seção de Explicações das Cores */}
      <section className="w-full bg-[#8a7d5c] py-20">
        <div className="max-w-6xl mx-auto px-8 md:px-12 lg:px-16 space-y-20">
          
          {/* Caramel - Imagem à direita */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center" data-aos="fade-up">
            <div className="order-2 md:order-1">
              <h3 className="text-4xl font-brittany text-[#f0efdb] mb-4">Caramel</h3>
              <p className="text-base text-white leading-relaxed font-montserrat font-thin">
                <span className="font-bold">Raiz mesclada até a metade, pontas uniformemente claras.</span>
                {" "}Uma cor rica e envolvente, que mistura o tom quente e profundo do caramelo com as pontas mais claras, criando um efeito suave e natural. Ideal para quem busca um visual radiante e sofisticado.
              </p>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <Image
                src="/images/3/Caramel.png"
                alt="Caramel"
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
          </div>

          {/* Honey - Imagem à esquerda */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center" data-aos="fade-up">
            <div className="order-2 md:order-1 flex justify-center">
              <Image
                src="/images/3/Honey.png"
                alt="Honey"
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-4xl font-brittany text-[#f0efdb] mb-4">Honey</h3>
              <p className="text-base text-white leading-relaxed font-montserrat font-thin">
                <span className="font-bold">Início da raiz mesclada com tons quentes, pontas claras.</span>
                {" "}O tom de mel dourado com raízes aquecidas traz um brilho iluminado e sofisticado, perfeito para quem quer um visual luminoso e cheio de vitalidade, sem perder a naturalidade.
              </p>
            </div>
          </div>

          {/* Cookie - Imagem à direita */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center" data-aos="fade-up">
            <div className="order-2 md:order-1">
              <h3 className="text-4xl font-brittany text-[#f0efdb] mb-4">Cookie</h3>
              <p className="text-base text-white leading-relaxed font-montserrat font-thin">
                <span className="font-bold">Fios mesclados da raiz às pontas.</span>
                {" "}A cor Cookie oferece uma transição perfeita entre raízes mais escuras e pontas mais claras, criando uma harmonia que lembra o tom de biscoitos crocantes, que exalam charme e um toque doce ao visual.
              </p>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <Image
                src="/images/3/Cookie.png"
                alt="Cookie"
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
          </div>

          {/* Vanilla - Imagem à esquerda */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center" data-aos="fade-up">
            <div className="order-2 md:order-1 flex justify-center">
              <Image
                src="/images/3/Vanilla.png"
                alt="Vanilla"
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-4xl font-brittany text-[#f0efdb] mb-4">Vanilla</h3>
              <p className="text-base text-white leading-relaxed font-montserrat font-thin">
                <span className="font-bold">Mesclagem e tonalização de &ldquo;loiro natural&rdquo;.</span>
                {" "}Uma cor suave e delicada, com um tom de loiro que lembra o creme de baunilha. A mistura perfeita de tons claros e frios, proporcionando uma aparência natural e fresca, ideal para quem quer um visual sofisticado, mas sem exageros.
              </p>
            </div>
          </div>

          {/* Toffee - Imagem à direita */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center" data-aos="fade-up">
            <div className="order-2 md:order-1">
              <h3 className="text-4xl font-brittany text-[#f0efdb] mb-4">Toffee</h3>
              <p className="text-base text-white leading-relaxed font-montserrat font-thin">
                <span className="font-bold">Mesclagem e tonalização de morena iluminada.</span>
                {" "}Com a tonalidade rica e quente do toffee, essa cor traz um brilho iluminado nas pontas, enquanto as raízes mantêm um tom mais profundo. É uma cor cheia de personalidade que ilumina e aquece o rosto, ideal para quem busca um look radiante e elegante.
              </p>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <Image
                src="/images/3/Toffee.png"
                alt="Toffee"
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
          </div>

          {/* Like a Virgin - Imagem à esquerda */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center" data-aos="fade-up">
            <div className="order-2 md:order-1 flex justify-center">
              <Image
                src="/images/3/Virgin.png"
                alt="Like a Virgin"
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-4xl font-brittany text-[#f0efdb] mb-4">Like a Virgin</h3>
              <p className="text-base text-white leading-relaxed font-montserrat font-thin">
                <span className="font-bold">Natural e Virgem.</span>
                {" "}A cor mais pura e natural de todas, com um tom que preserva a essência dos fios virgens. Uma opção ideal para quem deseja um visual sofisticado, mas sem alteração drástica de tom, proporcionando um look natural, leve e impecável.
              </p>
            </div>
          </div>

          {/* Texto final centralizado */}
          <div className="max-w-4xl mx-auto mt-20" data-aos="fade-up">
            <p className="text-base text-white leading-relaxed font-montserrat font-thin text-center">
              <span className="font-bold">Cada kit é ideal para criar efeitos naturais e discretos,</span>
              {" "}sem comprometer a leveza e o conforto dos fios naturais. Por ser mais fina e flexível, a fita se adapta facilmente a qualquer tipo de cabelo, garantindo uma aplicação precisa e duradoura.
            </p>
          </div>

          {/* Textos após a imagem */}
          <div className="max-w-4xl mx-auto mt-16 space-y-6" data-aos="fade-up">
            <p className="text-base text-white leading-relaxed font-montserrat font-thin text-center">
              <span className="font-bold">Conforto e Leveza:</span>
              {" "}As fitas são finas e flexíveis, proporcionando uma sensação de leveza durante o uso.
            </p>
            
            <p className="text-base text-white leading-relaxed font-montserrat font-thin text-center">
              <span className="font-bold">Durabilidade e Segurança:</span>
              {" "}Feitas com cabelo 100% brasileiro do Sul, garantem resistência e longevidade.
            </p>
            
            <p className="text-base text-white leading-relaxed font-montserrat font-thin text-center">
              <span className="font-bold">Estilo e Versatilidade:</span>
              {" "}Diversas tonalidades para atender os vários gostos de descoloração.
            </p>
            
            <p className="text-base text-white leading-relaxed font-montserrat font-thin text-center">
              <span className="font-bold">Qualidade Pro:</span>
              {" "}Produto exclusivo para salões e profissionais da beleza, desenvolvido com os mais altos padrões do mercado.
            </p>
          </div>

          {/* Texto final */}
          <div className="max-w-4xl mx-auto mt-12" data-aos="fade-up">
            <p className="text-base text-white leading-relaxed font-montserrat font-thin text-center">
              <span className="font-bold">O Mega Hair Candy</span>
              {" "}é a escolha certa para quem busca oferecer aos seus clientes a melhor experiência em extensões capilares, com a garantia de resultados naturais e duradouros. Disponível apenas para profissionais de beleza, nossa coleção é a ferramenta perfeita para levar o seu salão a um novo patamar.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}

