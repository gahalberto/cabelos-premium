"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Home, Phone } from "lucide-react";

const ContactSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  return (
    <section className="w-full bg-[#d9d6c3] py-16 px-4">
      <div className="max-w-6xl mx-auto" data-aos="fade-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-end">
          <a
            href="tel:+551138252050"
            className="flex flex-col items-center"
            aria-label="Telefone"
          >
            <Home className="w-20 h-20 md:w-24 md:h-24 text-[#918560] mb-4" strokeWidth={1.8} />
            <div className="w-full max-w-[240px] rounded-2xl bg-[#918560] py-3 text-center">
              <span className="font-montserrat text-[20px] text-[#f0efdb]">TELEFONE</span>
            </div>
          </a>

          <a
            href="https://wa.me/5511974172074"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
            aria-label="WhatsApp SP"
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-[#918560] md:h-24 md:w-24">
              <Phone className="h-9 w-9 text-[#918560] md:h-10 md:w-10" strokeWidth={2.2} />
            </div>
            <div className="w-full max-w-[240px] rounded-2xl bg-[#918560] py-3 text-center">
              <span className="font-montserrat text-[20px] text-[#f0efdb]">WHATSAPP SP</span>
            </div>
          </a>

          <a
            href="https://wa.me/5521999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
            aria-label="WhatsApp RJ"
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-[#918560] md:h-24 md:w-24">
              <Phone className="h-9 w-9 text-[#918560] md:h-10 md:w-10" strokeWidth={2.2} />
            </div>
            <div className="w-full max-w-[240px] rounded-2xl bg-[#918560] py-3 text-center">
              <span className="font-montserrat text-[20px] text-[#f0efdb]">WHATSAPP RJ</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 