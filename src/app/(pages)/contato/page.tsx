"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Esquema de validação com Zod
const contactSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos" }).optional(),
  subject: z.string().min(3, { message: "Assunto deve ter pelo menos 3 caracteres" }),
  message: z.string().min(10, { message: "Mensagem deve ter pelo menos 10 caracteres" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar mensagem");
      }

      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      reset();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f0efdb] min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-le-jour text-primary mb-4">Contato</h1>
          <h2 className="text-2xl font-normal text-gray-800 mb-4">Entre em contato com a Cabelos Premium</h2>
          <p className="text-lg font-montserrat text-gray-600 max-w-2xl mx-auto">
            Estamos aqui para transformar seu visual e oferecer a melhor experiência com cabelos naturais e exclusivos.
          </p>
          <Separator className="my-6 bg-[#b08c4f] mx-auto w-16" />
        </div>

        {/* Botões de Contato */}
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* WhatsApp */}
            <button
              onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
              className="bg-[#25D366] text-white px-8 py-6 rounded-lg font-montserrat font-medium hover:bg-[#20BD5C] transition-colors flex flex-col items-center gap-3 shadow-lg"
            >
              <FaWhatsapp size={48} />
              <span className="text-xl">WhatsApp</span>
            </button>

            {/* Instagram */}
            <button
              onClick={() => window.open('https://instagram.com/cabelospremium', '_blank')}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-8 py-6 rounded-lg font-montserrat font-medium hover:opacity-90 transition-opacity flex flex-col items-center gap-3 shadow-lg"
            >
              <FaInstagram size={48} />
              <span className="text-xl">Instagram</span>
            </button>

            {/* Contato Fixo */}
            <button
              onClick={() => window.open('tel:+551138252050', '_blank')}
              className="bg-[#8a7d5c] text-white px-8 py-6 rounded-lg font-montserrat font-medium hover:bg-[#7a6d4c] transition-colors flex flex-col items-center gap-3 shadow-lg"
            >
              <FaPhone size={48} />
              <span className="text-xl">Contato Fixo</span>
              <span className="text-lg">(11) 3825-2050</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 