import { FaHome, FaWhatsapp } from "react-icons/fa";
import { db } from "@/app/_lib/prisma";
import { defaultContactConfig } from "@/contexts/ContactConfigContext";

async function getContactConfig() {
  try {
    const cfg = await db.storeConfig.findUnique({
      where: { id: "default" },
      select: {
        whatsappSP: true,
        whatsappRJ: true,
        whatsappMessage: true,
        phoneSP: true,
      },
    });
    return {
      whatsappSP:      cfg?.whatsappSP      || defaultContactConfig.whatsappSP,
      whatsappRJ:      cfg?.whatsappRJ      || defaultContactConfig.whatsappRJ,
      whatsappMessage: cfg?.whatsappMessage || defaultContactConfig.whatsappMessage,
      phoneSP:         cfg?.phoneSP         || defaultContactConfig.phoneSP,
    };
  } catch {
    return defaultContactConfig;
  }
}

function waUrl(number: string, message: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export default async function ContactPage() {
  const cfg = await getContactConfig();

  const contacts = [
    {
      id: "telefone",
      icon: <FaHome size={40} className="text-[#3b2f1e]" />,
      label: "TELEFONE",
      address: "R. Dr. Albuquerque Lins, 537 - Santa Cecília,",
      city: "São Paulo - SP, 01150-001",
      phone: "Telefone: (11) 3825-2050",
      href: `tel:+${cfg.phoneSP.replace(/\D/g, "")}`,
      external: false,
    },
    {
      id: "whatsapp-sp",
      icon: <FaWhatsapp size={40} className="text-[#3b2f1e]" />,
      label: "WHATSAPP SP",
      address: "R. Dr. Albuquerque Lins, 537 - Santa Cecília,",
      city: "São Paulo - SP, 01150-001",
      phone: "Telefone: (11) 3825-2050",
      href: waUrl(cfg.whatsappSP, cfg.whatsappMessage),
      external: true,
    },
    {
      id: "whatsapp-rj",
      icon: <FaWhatsapp size={40} className="text-[#3b2f1e]" />,
      label: "WHATSAPP RJ",
      address: "Av. Das Américas, 700 - Loja 204 L, Barra da Tijuca,",
      city: "Shopping Citta América - Rio de Janeiro, RJ",
      phone: "Telefone: (21) 3400-8184 | Cel: (21) 9929-3-7658",
      href: waUrl(cfg.whatsappRJ, cfg.whatsappMessage),
      external: true,
    },
  ];

  return (
    <div className="bg-[#f0efdb] min-h-screen pt-36 pb-20">
      <div className="max-w-2xl mx-auto px-6">

        <div className="text-center mb-10">
          <h1 className="font-montserrat font-bold text-[#3b2f1e] text-2xl md:text-3xl mb-5">
            Entre em contato com a Cabelos Premium
          </h1>
          <p className="font-montserrat text-sm text-[#3b2f1e] leading-relaxed">
            Nosso contato é feito via <span className="font-bold">WhatsApp</span>, estamos prontas para
            ajudá-la a escolher as melhores opções para o seu cabelo, o seu salão, tirar dúvidas sobre
            nossa técnica, nossas cores e orçamentos.
          </p>
          <p className="font-montserrat text-sm text-[#3b2f1e] font-bold mt-2">
            Basta clicar no número abaixo e iniciar a conversa.
          </p>
        </div>

        <div className="space-y-4">
          {contacts.map((c) => (
            <a
              key={c.id}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noopener noreferrer" : undefined}
              className="flex items-center gap-6 bg-[#e8dfcb] hover:bg-[#dfd4b8] transition-colors duration-300 rounded-2xl p-5 cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center min-w-[110px] gap-2">
                {c.icon}
                <span className="font-montserrat font-bold text-[#3b2f1e] text-xs tracking-wide text-center">
                  {c.label}
                </span>
              </div>

              <div className="w-px h-16 bg-[#c4b89a]" />

              <div className="font-montserrat text-[#3b2f1e] text-sm text-center flex-1">
                <p className="font-semibold">{c.address}</p>
                <p className="font-semibold">{c.city}</p>
                <p className="underline mt-1">{c.phone}</p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}
