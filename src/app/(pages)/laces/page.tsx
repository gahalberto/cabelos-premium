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

const laceImages = [
    { src: "/images/laces/1.png", alt: "Lace 1" },
    { src: "/images/laces/2.png", alt: "Lace 2" },
    { src: "/images/laces/3.png", alt: "Lace 3" },
    { src: "/images/laces/4.png", alt: "Lace 4" },
    { src: "/images/laces/5.png", alt: "Lace 5" },
    { src: "/images/laces/6.png", alt: "Lace 6" },
    { src: "/images/laces/7.png", alt: "Lace 7" },
    { src: "/images/laces/8.png", alt: "Lace 8" },
];

const laceDetails = [
    {
        title: "Lace Loiro Quente",
        imgSrc: "/images/laces/8.png",
        bold: "Início da raiz mesclada com tons quentes, pontas claras.",
        desc: "O tom de mel dourado com raízes aquecidas traz um brilho iluminado e sofisticado, perfeito para quem quer um visual luminoso e cheio de vitalidade, sem perder a naturalidade.",
        imgRight: true,
    },
    {
        title: "Lace Mechada",
        imgSrc: "/images/laces/5.png",
        bold: "Fios mesclados da raiz às pontas.",
        desc: "Oferece uma transição perfeita entre raízes mais escuras e pontas mais claras, criando uma harmonia que lembra o efeito balayage, exalando charme e um toque natural ao visual.",
        imgRight: false,
    },
    {
        title: "Lace Loiro Incrível",
        imgSrc: "/images/laces/1.png",
        bold: 'Mesclagem e tonalização de "loiro natural".',
        desc: "Uma cor suave e delicada com um tom de loiro que lembra o creme de baunilha. A mistura perfeita de tons claros e frios, proporcionando uma aparência natural e fresca, ideal para quem quer um visual sofisticado mas sem exageros.",
        imgRight: true,
    },
    {
        title: "Lace Castanho Claro",
        imgSrc: "/images/laces/6.png",
        bold: "Tonalidade rica, quente e envolvente.",
        desc: "O castanho claro iluminado traz profundidade e brilho ao mesmo tempo, criando um visual radiante e sofisticado. Ideal para quem busca uma transformação elegante sem perder a essência natural dos fios.",
        imgRight: false,
    },
    {
        title: "Lace Castanho Escuro",
        imgSrc: "/images/laces/2.png",
        bold: "Fios escuros com profundidade e brilho intenso.",
        desc: "O castanho profundo oferece um visual misterioso e elegante. Com textura impecável e fios 100% brasileiros do Sul, garante resistência, naturalidade e um acabamento digno de passarela.",
        imgRight: true,
    },
    {
        title: "Lace Preto Azulado",
        imgSrc: "/images/laces/4.png",
        bold: "Natural e Virgem.",
        desc: "A cor mais pura e intensa de todas, com um tom que preserva a essência e o brilho dos fios escuros. Uma opção ideal para quem deseja um visual poderoso e sofisticado, proporcionando um look arrojado, leve e impecável.",
        imgRight: false,
    },
    {
        title: "Lace Ondulada",
        imgSrc: "/images/laces/7.png",
        bold: "Ondas suaves e volume natural.",
        desc: "Perfeita para quem deseja um visual cheio de movimento e feminilidade. Os fios ondulados em cabelo 100% brasileiro garantem leveza e um acabamento super natural, proporcionando beleza sem esforço no dia a dia.",
        imgRight: true,
    },
    {
        title: "Lace Caramelo",
        imgSrc: "/images/laces/8.png",
        bold: "Raiz mesclada até a metade, pontas uniformemente claras.",
        desc: "Uma cor rica e envolvente que mistura o tom quente e profundo do caramelo com pontas mais claras, criando um efeito suave e natural. Ideal para quem busca um visual radiante e sofisticado em qualquer ocasião.",
        imgRight: false,
    },
];

export default function LacesPage() {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <>
            <section className="w-full bg-[#8a7d5c] py-20">
                <div className="max-w-5xl mx-auto px-8 md:px-12 lg:px-16 flex flex-col items-center">

                    {/* Título principal */}
                    <div data-aos="fade-up" className="text-center mb-6">
                        <h1 className="font-le-jour text-[42px] md:text-[52px] text-white tracking-widest uppercase">
                            Laces Hiper-Realistas
                        </h1>
                    </div>

                    {/* Subtítulo darlings */}
                    <div data-aos="fade-up" data-aos-delay="100" className="text-center mb-6">
                        <span className="font-brittany italic text-[44px] text-white">
                            darlings
                        </span>
                    </div>

                    {/* Descrição */}
                    <div data-aos="fade-up" data-aos-delay="200" className="text-center max-w-2xl mb-10">
                        <p className="font-montserrat text-base text-white">
                            As nossas Laces são confeccionadas com cabelos brasileiros do Sul,
                            garantindo realismo, conforto e sofisticação.
                        </p>
                    </div>

                    {/* Badges de features */}
                    <div
                        data-aos="fade-up"
                        data-aos-delay="300"
                        className="flex flex-wrap gap-4 justify-center mb-14"
                    >
                        {features.map((feature) => (
                            <div
                                key={feature}
                                className="bg-[#2c2214] text-white font-montserrat font-semibold text-sm text-center px-6 py-3 rounded-md whitespace-pre-line"
                            >
                                {feature}
                            </div>
                        ))}
                    </div>

                    {/* Grade de imagens — 4x2 */}
                    <div
                        data-aos="fade-up"
                        data-aos-delay="400"
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-12"
                    >
                        {laceImages.map((img) => (
                            <div
                                key={img.src}
                                className="rounded-xl overflow-hidden flex items-center justify-center aspect-[3/4]"
                            >
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    width={300}
                                    height={400}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Texto descritivo */}
                    <div data-aos="fade-up" className="text-center max-w-2xl mb-10">
                        <p className="font-montserrat text-base text-white leading-relaxed">
                            A primeira marca que trabalha com técnologia importada e laces EXCLUSIVAMENTE COM{" "}
                            <span className="font-bold">CABELOS BRASILEIROS DO SUL</span>,{" "}
                            máxima qualidade e durabilidade. Ideal para quem busca praticidade sem abrir mão
                            da elegância e da aparência natural.
                        </p>
                        <p className="font-montserrat text-base text-white font-bold mt-2">
                            Beleza instantânea com padrão profissional.
                        </p>
                    </div>

                    {/* Botão SAIBA MAIS */}
                    <div data-aos="fade-up">
                        <Link
                            href="/shop"
                            className="inline-block bg-[#f0efdb] text-[#3b2f1e] font-montserrat font-semibold text-sm tracking-widest uppercase px-12 py-4 rounded-full hover:bg-white transition-colors duration-300"
                        >
                            SAIBA MAIS
                        </Link>
                    </div>

                </div>
            </section>

            {/* Vídeo — 100% da tela */}
            <section className="w-full h-screen overflow-hidden">
                <video
                    src="/videos/2.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                />
            </section>

            {/* Seção de descrições individuais de cada Lace */}
            <section className="w-full bg-[#8a7d5c] py-20">
                <div className="max-w-5xl mx-auto px-8 md:px-12 lg:px-16 space-y-20">
                    {laceDetails.map((lace) => (
                        <div
                            key={lace.title}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                            data-aos="fade-up"
                        >
                            {/* Texto */}
                            <div className={lace.imgRight ? "order-2 md:order-1" : "order-2 md:order-2"}>
                                <h3 className="font-brittany text-5xl text-[#f0efdb] mb-4">{lace.title}</h3>
                                <p className="font-montserrat text-base text-white leading-relaxed">
                                    <span className="font-bold">{lace.bold}</span>{" "}
                                    {lace.desc}
                                </p>
                            </div>
                            {/* Imagem */}
                            <div
                                className={`flex justify-center ${lace.imgRight ? "order-1 md:order-2" : "order-1 md:order-1"
                                    }`}
                            >
                                <div className="w-56 h-56 rounded-full overflow-hidden">
                                    <Image
                                        src={lace.imgSrc}
                                        alt={lace.title}
                                        width={224}
                                        height={224}
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Texto final */}
                    <div className="max-w-3xl mx-auto pb-8" data-aos="fade-up">
                        <p className="font-montserrat text-base text-white leading-relaxed font-thin text-center">
                            <span className="font-bold">Cada Lace é ideal para criar resultados naturais e discretos,</span>
                            {" "}sem comprometer a leveza e o conforto. Por ser confeccionada com fios 100% brasileiros
                            do Sul, garante durabilidade, acabamento hiper-realista e uma aplicação segura e duradoura.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
