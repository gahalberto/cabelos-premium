"use client";

import Link from "next/link";
import Image from "next/image";

const benefits = ["Movimento\nNatural", "Brilho\nSaudável", "Alta\nDurabilidade", "Fácil\nManutenção"];
const hairTypes = ["Loiros\nNaturais", "Castanhos\nClaros", "Castanhos\nNaturais", "Descoloridos e\nPersonalizados"];

const gridImages = [
  { src: "/images/mega-hair/1.png", alt: "Cabelo Mega Hair 1" },
  { src: "/images/mega-hair/2.png", alt: "Cabelo Mega Hair 2" },
  { src: "/images/mega-hair/3.png", alt: "Cabelo Mega Hair 3" },
  { src: "/images/mega-hair/4.png", alt: "Cabelo Mega Hair 4" },
  { src: "/images/mega-hair/5.png", alt: "Cabelo Mega Hair 5" },
  { src: "/images/mega-hair/6.png", alt: "Cabelo Mega Hair 6" },
  { src: "/images/mega-hair/7.png", alt: "Cabelo Mega Hair 7" },
  { src: "/images/mega-hair/8.png", alt: "Cabelo Mega Hair 8" },
];

const MegaHairHero = () => {
  return (
    <section className="w-full bg-[#f0efdb] py-12 px-4">

      {/* ── Bloco de texto central ── */}
      <div className="max-w-4xl mx-auto text-center mb-8 space-y-8">

        <h1 className="font-le-jour text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#8a7d5c] tracking-widest mb-4">
          MEGA HAIR BRASILEIRO DO SUL
        </h1>

        <p className="font-montserrat text-base md:text-lg text-blackmb-6">
          <strong>Uma peça exclusiva para cada</strong>{" "}
          <span className="font-brittany text-3xl md:text-4xl text-[#555] align-middle">darling</span>
        </p>

        <p className="font-montserrat text-[15px] md:text-base text-[#555] leading-relaxed mb-8 max-w-2xl mx-auto">
          Nossos cabelos para Mega Hair são 100% brasileiros do Sul legítimos,
          com cutículas alinhadas e textura macia, proporcionando:
        </p>

        {/* Pills de benefícios */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
          {benefits.map((b) => (
            <span
              key={b}
              className="bg-[#8a7d5c] text-[#f0efdb] font-montserrat text-sm md:text-base font-semibold rounded-xl px-8 py-3 text-center whitespace-pre-line leading-snug"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* ── Grid de 8 imagens ── */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        {gridImages.map((img, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-xl"
            style={{ aspectRatio: "3/4" }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>

      {/* ── Bloco inferior ── */}
      <div className="max-w-4xl mx-auto text-center">

        {/* Pills de tipos */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {hairTypes.map((t) => (
            <span
              key={t}
              className="bg-[#8a7d5c] text-[#f0efdb] font-montserrat text-sm md:text-base font-semibold rounded-xl px-8 py-3 text-center whitespace-pre-line leading-snug"
            >
              {t}
            </span>
          ))}
        </div>

        <p className="font-montserrat text-[15px] md:text-base text-[#555] leading-relaxed mb-2 max-w-2xl mx-auto space-x-8">
          Disponíveis em diferentes tamanhos e volumes, os fios se adaptam perfeitamente
          a diversas técnicas de alongamento, oferecendo leveza e acabamento impecável.{" "}
          <strong className="text-[#3a3020]">
            Transforme seu visual com segurança e qualidade premium.
          </strong>
        </p>

        <div className="mt-10">
          <Link
            href="/shop"
            className="inline-block bg-[#8a7d5c] hover:bg-[#6e6348] text-white font-montserrat font-semibold text-sm tracking-[0.18em] uppercase px-16 py-4 rounded-md transition-all duration-300"
          >
            SAIBA MAIS
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MegaHairHero;
