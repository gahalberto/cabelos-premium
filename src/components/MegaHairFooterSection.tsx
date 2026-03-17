"use client";

import Image from "next/image";

const MegaHairFooterSection = () => {
  return (
    <section className="w-full relative min-h-[420px] md:min-h-[500px] flex items-center justify-center overflow-hidden">

      {/* Imagem de fundo — substitua pelo src real quando disponível */}
      <Image
        src="/images/novas-imagens/pagina-lancamento/cabelos-enrolados.jpg"
        alt="Textura de cabelos enrolados"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(135deg, #1a1208 0%, #2c1f0a 40%, #1a1208 100%)" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-16">
        <Image
          src="/images/logoouro.png"
          alt="CABELOSPREMIUM"
          width={300}
          height={85}
          className="object-contain mb-6 drop-shadow-lg"
          priority
        />
        <p className="font-montserrat text-white text-base md:text-lg font-light leading-relaxed">
          Vários modelos de full laces para nossas{" "}
          <span className="font-brittany text-3xl md:text-4xl align-middle">darlings</span>
        </p>
      </div>
    </section>
  );
};

export default MegaHairFooterSection;
