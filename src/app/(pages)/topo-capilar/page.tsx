"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import Link from "next/link";

const features = [
    "Fios Brasileiros\ndo Sul",
    "Acabamento\nHiper-Realista",
    "Leve e\nDurável",
    "Versátil e\nUso Diário",
];

export default function TopoCapilarPage() {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <>
            {/* ── Seção Hero ── */}
            <section className="w-full bg-[#f0efdb] pt-36 pb-16">
                <div className="max-w-4xl mx-auto px-8 md:px-12 lg:px-16 flex flex-col items-center text-center">

                    {/* Título */}
                    <div data-aos="fade-up">
                        <h1 className="font-le-jour text-[32px] md:text-[44px] text-[#8a7d5c] tracking-widest uppercase mb-3 whitespace-nowrap">
                            Toppers Brasileiros do Sul
                        </h1>
                    </div>

                    {/* Subtitle */}
                    <div data-aos="fade-up" data-aos-delay="80" className="mb-6">
                        <p className="font-montserrat text-[21px] font-bold text-[#3b2f1e]">
                            Solução discreta e eficaz para nossas{" "}
                            <span className="font-brittany italic text-[32px] font-normal align-middle">darlings</span>
                        </p>
                    </div>

                    {/* Descrição */}
                    <div data-aos="fade-up" data-aos-delay="160" className="max-w-2xl mb-10">
                        <p className="font-montserrat text-[14px] text-[#3b2f1e] leading-relaxed">
                            Os Topos capilares da Cabelos Premium são desenvolvidos para oferecer cobertura estratégica com máxima
                            naturalidade. Produzidos com fios selecionados do Sul do Brasil, proporcionam:
                        </p>
                    </div>

                    {/* Badges */}
                    <div
                        data-aos="fade-up"
                        data-aos-delay="240"
                        className="flex flex-wrap gap-3 justify-center mb-14"
                    >
                        {features.map((feature) => (
                            <div
                                key={feature}
                                className="bg-[#2c2214] text-white font-montserrat font-semibold text-xs text-center px-5 py-3 rounded-md whitespace-pre-line"
                            >
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Seção Produtos ── */}
            <section className="w-full bg-[#f0efdb] py-14">
                <div className="max-w-4xl mx-auto px-8 md:px-12 lg:px-16 space-y-16">

                    {/* ─ Topo Capilar Silk ─ */}
                    <div data-aos="fade-up">
                        <h2 className="font-montserrat font-bold text-[21px] text-[#3b2f1e] mb-6">
                            Topo Capilar Silk
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            {/* Imagens */}
                            <div className="flex gap-3">
                                <div className="flex-1 rounded-xl overflow-hidden aspect-[3/4]">
                                    <Image
                                        src="/images/topo-capilar/silk1.png"
                                        alt="Topo Capilar Silk 1"
                                        width={280}
                                        height={373}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 rounded-xl overflow-hidden aspect-[3/4]">
                                    <Image
                                        src="/images/topo-capilar/silk2.png"
                                        alt="Topo Capilar Silk 2"
                                        width={280}
                                        height={373}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            {/* Texto */}
                            <div>
                                <p className="font-montserrat text-sm text-[#3b2f1e] leading-relaxed mb-4">
                                    O Topo Capilar em Silk é resistente e oferece o efeito realista de couro cabeludo. Sua base com tecnologia silk cria a perfeita ilusão de fios nascendo da raiz, garantindo acabamento imperceptível mesmo sob luz intensa.
                                </p>
                                <p className="font-montserrat text-sm text-[#3b2f1e] leading-relaxed">
                                    <span className="font-bold">
                                        Ideal para disfarçar falhas e rarefação no topo da cabeça,
                                        proporciona segurança, naturalidade e um visual sofisticado.
                                    </span>{" "}
                                    Confeccionado com cabelos brasileiros do sul, selecionados manualmente, entrega maciez, movimento e integração perfeita com os fios naturais.
                                    Naturalidade absoluta. Confiança imediata.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ─ Topo Capilar Técnica Full Lace ─ */}
                    <div data-aos="fade-up">
                        <h2 className="font-montserrat font-bold text-[21px] text-[#3b2f1e] mb-6">
                            Topo Capilar Técnica Full Lace
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            {/* Imagens */}
                            <div className="flex gap-3">
                                <div className="flex-1 rounded-xl overflow-hidden aspect-[3/4]">
                                    <Image
                                        src="/images/topo-capilar/full1.png"
                                        alt="Topo Capilar Full Lace 1"
                                        width={280}
                                        height={373}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 rounded-xl overflow-hidden aspect-[3/4]">
                                    <Image
                                        src="/images/topo-capilar/full2.png"
                                        alt="Topo Capilar Full Lace 2"
                                        width={280}
                                        height={373}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            {/* Texto */}
                            <div>
                                <p className="font-montserrat text-sm text-[#3b2f1e] leading-relaxed mb-4">
                                    O Topo Capilar em Tecido Leve Full Lace é sinônimo de leveza e versatilidade. Sua base respirável garante conforto no uso diário, enquanto a tecnologia full lace{" "}
                                    <span className="font-bold">permite repartir os fios em diferentes direções.</span>
                                </p>
                                <p className="font-montserrat text-sm text-[#3b2f1e] leading-relaxed">
                                    Produzido com cabelos brasileiros do sul, oferece caimento natural, liberdade de styling e acabamento sofisticado.
                                    Leve, confortável e naturalmente impecável.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ─ Botão ─ */}
                    <div data-aos="fade-up" className="flex justify-center pb-4">
                        <Link
                            href="/shop"
                            className="inline-block border border-[#3b2f1e] text-[#3b2f1e] font-montserrat font-semibold text-sm tracking-widest uppercase px-16 py-4 rounded-sm hover:bg-[#3b2f1e] hover:text-white transition-colors duration-300"
                        >
                            SAIBA MAIS
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Imagem Full Width ── */}
            <section className="w-full h-screen overflow-hidden">
                <Image
                    src="/images/topo-capilar/fundo-final.png"
                    alt="Topos Capilares Cabelos Premium"
                    width={1920}
                    height={1080}
                    className="w-full h-full object-cover object-center"
                />
            </section>

            {/* ── Fotos de Modelos ── */}
            <section className="w-full bg-[#f0efdb] py-10 px-6 md:px-10">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="overflow-hidden aspect-[3/4] rounded-xl">
                        <Image
                            src="/images/topo-capilar/imagemfinal1.png"
                            alt="Modelo com Topo Capilar 1"
                            width={760}
                            height={1000}
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                    <div className="overflow-hidden aspect-[3/4] rounded-xl">
                        <Image
                            src="/images/topo-capilar/imagemfinal2.png"
                            alt="Modelo com Topo Capilar 2"
                            width={760}
                            height={1000}
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
