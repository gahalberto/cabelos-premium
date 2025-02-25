"use client";
import { Roboto } from "next/font/google";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useRouter } from "next/navigation";
import { Separator } from "./ui/separator";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

const WhoIsUs = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  const router = useRouter();

  return (
    <>
      {/* Seção 1: A Marca Da Sua Extensão */}
      <section className="w-full bg-emerald-100 py-16 px-4 sm:px-10 md:px-20 lg:px-36">
        <header className="text-center">
          <h1 className="text-4xl font-raleway">
            A Marca Da Sua <span className="font-bold">Extensão</span>
          </h1>
          <Separator className="my-6 bg-gray-400 mx-auto w-16" />
        </header>

        <article className="mt-12 text-center">
          <h2 className="text-3xl font-raleway mb-8">Lançamentos</h2>
          <p className="text-lg font-raleway max-w-2xl mx-auto leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </article>

        <div className="mt-12 mx-auto max-w-4xl">
          <Image
            src="/images/longbanner.png"
            alt="Cabelos Premium"
            width={1200}
            height={400}
            layout="responsive"
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Seção 2: Por que escolher a Cabelos Premium? */}
      <section className="w-full bg-white py-16 px-4 sm:px-10 md:px-20 lg:px-36">
        <div className="max-w-6xl mx-auto bg-white p-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Por que escolher a{" "}
              <span className="text-amber-600">Cabelos Premium?</span>
            </h2>
            <p className="text-gray-600 mb-6">
              Somos a única empresa do Brasil que trabalha com autênticos
              cabelos do Sul, reconhecidos mundialmente pela sua qualidade.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-700">
                  ✅ Qualidade superior
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Cabelos naturais, 100% do Sul. Fios selecionados, macios,
                  extra finos, saudáveis e brilhantes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">✅ Durabilidade</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Nossos fios mantêm sua integridade, maciez e brilho ao longo
                  do tempo, resistindo ao uso contínuo.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">✅ Excelência</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Compromisso com a entrega, garantia do produto e atendimento
                  personalizado.
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push("https://wa.me/seunumerodewhatsapp")}
              className="mt-8 bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700 transition duration-300"
            >
              Fazer minha cotação agora pelo WhatsApp
            </button>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <Image
              src="/images/cabelos-banner-1.png"
              width={600}
              height={600}
              alt="Cabelos Premium"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Seção 3: Laces e Próteses */}
      <section className="w-full bg-emerald-100 py-16 px-4 sm:px-10 md:px-20 lg:px-36">
        <header className="text-center">
          <h1 className="text-4xl font-raleway">Laces e Próteses</h1>
          <Separator className="my-6 bg-gray-400 mx-auto w-16" />
        </header>

        <article className="mt-12 text-center">
          <p className="text-lg font-raleway max-w-5xl mx-auto leading-relaxed">
            Nossas perucas são uma ótima escolha para quem quer mudar o visual
            de forma rápida e sem agredir os fios, ideal também para quem está
            em tratamento quimioterápico, para pessoas que sofrem com alopecia
            ou estão em processo de transição capilar. São costuradas fio a fio,
            confeccionadas com cabelos naturais do sul, oferecendo leveza e
            naturalidade. Proporcionam conforto e praticidade para o uso diário.
            Sua alta tecnologia imita o couro cabeludo, tornando o uso
            imperceptível.
          </p>
        </article>
      </section>

      {/* Vídeo em background */}
      <div className="relative h-[600px] w-full">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover opacity-100"
          autoPlay
          loop
          muted
        >
          <source src="/images/video-perucas-2.mp4" type="video/mp4" />
          Seu navegador não suporta o elemento de vídeo.
        </video>
      </div>

      {/* Seção 4: Topo & Rabo */}
      <section className="w-full bg-white py-16 px-4 sm:px-10 md:px-20 lg:px-36">
        <header className="text-center">
          <h1 className="text-4xl font-raleway">Topo & Rabo</h1>
          <Separator className="my-6 bg-gray-400 mx-auto w-16" />
        </header>

        <article className="mt-12 text-center">
          <p className="text-lg font-raleway max-w-5xl mx-auto leading-relaxed">
            O topo capilar é confeccionado em uma tela fina, onde os fios são
            costurados fio a fio, simulando o couro cabeludo. Pode ser colado ou
            fixado com presilhas estilo TIC TAC, são ideais para pessoas que
            apresentam falhas ou querem adicionar volume. O Rabo é colocado por
            cima do seu rabo de cavalo natural, fixado por um feltro adesivo,
            resultando em naturalidade e aumento de volume. Ideal para quem
            busca um visual elegante e sofisticado, seja para uso diário ou
            ocasiões especiais. Personalizamos o topo e rabo de acordo com a
            necessidade de nossas clientes.
          </p>
        </article>
      </section>

      {/* Vídeo em background */}
      <div className="relative h-[600px] w-full">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover opacity-100"
          autoPlay
          loop
          muted
        >
          <source src="/images/video-perucas-3.mp4" type="video/mp4" />
          Seu navegador não suporta o elemento de vídeo.
        </video>
      </div>

            {/* Seção 2: Por que escolher a Cabelos Premium? */}
            <section className="w-full bg-emerald-100 py-16 px-4 ">
            <header className="text-center">
          <h1 className="text-4xl font-raleway">Mega Hair</h1>
          <Separator className="my-6 bg-gray-400 mx-auto w-16" />
        </header>

        <div className="max-w-6xl mx-auto  p-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <p className="text-gray-600 mb-6">
            O mega hair é a escolha ideal para quem busca não apenas volume e comprimento, mas uma verdadeira transformação no visual com naturalidade e sofisticação. Confeccionados com cabelos 100% naturais do Sul, mechas macias, brilhantes e duráveis, trazendo harmonia e naturalidade sem comprometer o movimento e a leveza dos fios.

O processo é cuidadoso e feito de forma personalizada, respeitando o estilo e as necessidades de cada cliente, seja para dar mais volume, alongar os cabelos ou até criar um visual renovado.

Além de agregar a beleza instantânea, nosso mega hair proporciona durabilidade. Com ele, você melhora seu visual e eleva sua autoestima com um produto desenvolvido para oferecer o melhor em estética e conforto. 

            </p>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <Image
              src="/images/meganew.webp"
              width={600}
              height={600}
              alt="Cabelos Premium"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>


    </>
  );
};

export default WhoIsUs;