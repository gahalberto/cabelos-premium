"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Instagram, Phone, MessageCircle } from "lucide-react";

const ContactSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  const handleWhatsAppClick = () => {
    const phoneNumber = "5511974172074";
    const message = encodeURIComponent("Olá! Gostaria de saber mais informações sobre os produtos Cabelos Premium.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

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

        {/* Informações de Contato */}
        <div className="flex flex-col md:flex-row gap-6 mb-10 w-full max-w-3xl justify-center items-center">
          {/* WhatsApp */}
          <a 
            href="https://wa.me/5511974172074"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-[#333333] hover:text-[#8a7d5c] transition-colors"
          >
            <MessageCircle className="w-6 h-6 text-[#25D366]" />
            <div className="text-left">
              <p className="font-montserrat font-semibold text-sm">WhatsApp</p>
              <p className="font-montserrat text-sm">(11) 97417-2074</p>
            </div>
          </a>

          {/* Telefone Fixo */}
          <a 
            href="tel:+551137417074"
            className="flex items-center gap-3 text-[#333333] hover:text-[#8a7d5c] transition-colors"
          >
            <Phone className="w-6 h-6 text-[#8a7d5c]" />
            <div className="text-left">
              <p className="font-montserrat font-semibold text-sm">Telefone</p>
              <p className="font-montserrat text-sm">(11) 3741-7074</p>
            </div>
          </a>

          {/* Instagram */}
          <a 
            href="https://instagram.com/cabelospremium"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-[#333333] hover:text-[#8a7d5c] transition-colors"
          >
            <Instagram className="w-6 h-6 text-[#E4405F]" />
            <div className="text-left">
              <p className="font-montserrat font-semibold text-sm">Instagram</p>
              <p className="font-montserrat text-sm">@cabelospremium</p>
            </div>
          </a>
        </div>
        
        {/* Botão de contato */}
        <button 
          onClick={handleWhatsAppClick}
          className="bg-[#8a7d5c] text-white py-3 px-8 rounded-md hover:bg-[#736a4e] transition-colors duration-300 mb-10 flex items-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          CONTATO VIA WHATSAPP
        </button>
        
        {/* Texto de rodapé */}
        <p className="font-montserrat text-xl text-[#333333] text-center">
          Seja bem-vindo(a) à Cabelos Premium – A marca da sua extensão.
        </p>
      </div>
    </section>
  );
};

export default ContactSection; 