"use client";
import Image from "next/image";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const ContactSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  return (
    <section className="w-full bg-[#f7f4e8] py-16 px-4">
      <div className="max-w-5xl mx-auto flex flex-col items-center" data-aos="fade-up">
        {/* Título principal */}
        <h2 className="text-3xl md:text-4xl font-le-jour text-[#8a7d5c] tracking-wide mb-6 text-center">
          DÚVIDAS? FALE CONOSCO
        </h2>
        
        {/* Subtítulo com palavra estilizada */}
        <div className="text-center mb-4">
          <p className="text-lg md:text-xl">
            Na Cabelos Premium o atendimento é <span className="font-brittany italic text-[#d4a249] text-2xl md:text-3xl">personalizado</span>
          </p>
        </div>
        
        {/* Texto explicativo */}
        <p className="font-montserrat text-center text-[#333333] max-w-2xl mb-8">
          Converse diretamente com uma de nossas especialistas via <span className="font-bold">WhatsApp</span>. Tire dúvidas sobre qual aplicar, como cuidar dos seus cabelos e qual seria o melhor tipo para o seu caso. É um novo modelo de atendimento.
        </p>
        
        {/* Botão de contato */}
        <button className="bg-[#8a7d5c] text-white py-3 px-8 rounded-md hover:bg-[#736a4e] transition-colors duration-300 mb-10">
          CONTATO
        </button>
        
        {/* Imagem da equipe */}
        <div className="w-[90%] md:w-[70%] mx-auto mb-4">
          <Image
            src="/images/novas-imagens/time.png"
            alt="Equipe Cabelos Premium"
            width={800}
            height={450}
            className="rounded-xl shadow-md w-full h-auto"
          />
        </div>
        
        {/* Assinatura da equipe */}
        <p className="font-brittany text-2xl text-[#d4a249] mb-8">
          Equipe Cabelos Premium
        </p>
        
        {/* Texto de rodapé */}
        <p className="font-montserrat text-xl text-[#333333] text-center">
          Seja bem-vindo(a) à Cabelos Premium – A marca da sua extensão.
        </p>
      </div>
    </section>
  );
};

export default ContactSection; 