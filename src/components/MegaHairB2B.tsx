"use client";

import Image from "next/image";
import Link from "next/link";

const MegaHairB2B = () => {
  return (
    <section className="w-full bg-[#f0efdb]">

      {/* Foto full-width — substitua o src pela foto real quando disponível */}
      <div className="relative w-full" style={{ aspectRatio: "16/7", minHeight: "300px" }}>
        <Image
          src="/images/novas-imagens/pagina-lancamento/b2b-foto.jpg"
          alt="Profissional aplicando Mega Hair"
          fill
          className="object-cover object-top"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "linear-gradient(180deg, #d6cbb5 0%, #b8a88a 50%, #9a8860 100%)" }}
        />
      </div>

      {/* Texto */}
      <div className="max-w-4xl mx-auto px-6 py-14">
        <h2 className="font-montserrat font-semibold text-[21px] text-[#333] mb-5">
          Atacado para Salões e Profissionais da Beleza
        </h2>
        <p className="font-montserrat font-normal text-[13.5px] text-[#555] leading-relaxed mb-10">
          Com a Cabelos Premium, você terá uma ferramenta poderosa em seu salão para lotar
          sua agenda e faturar números nunca vistos antes. Aplique a técnica de mega hair
          com facilidade e rapidez, sem perder tempo ou comprometer a qualidade do serviço.{" "}
          <strong className="font-bold text-[#3a3020]">
            Sinta a diferença e ofereça uma experiência premium aos seus clientes.
          </strong>
        </p>

        <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2">
          <Image
            src="/images/mega-hair/last-image.png"
            alt="Mega Hair Premium"
            width={1200}
            height={700}
            className="block w-screen h-auto object-cover"
          />
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/contato"
            className="inline-block bg-[#8a7d5c] hover:bg-[#6e6348] text-white font-montserrat font-semibold text-sm tracking-[0.18em] uppercase px-16 py-4 rounded-md transition-all duration-300"
          >
            SAIBA MAIS
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MegaHairB2B;
