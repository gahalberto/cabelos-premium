"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
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

<div className="font-montserrat text-[14px] text-justify">
  Nosso contato é feito via <b>WhatsApp</b>, e você pode escolher conversar diretamente com uma das nossas três vendedoras, especialistas em mega hair. Elas estão prontas para ajudá-lo a escolher as melhores opções para o seu salão, tirar dúvidas sobre nossa técnica, nossas cores, nossos valores e como se tornar um expert com nossos produtos.
<p className="mb-12"><br />
<b>Basta clicar no número da vendedora abaixo ou salvar o contato e iniciar a conversa.</b> Estamos aqui para apoiar o seu trabalho e garantir que você tenha sempre as melhores soluções para o seu salão.

</p>

</div>

        {/* Equipe de Vendas */}
        <div className="mt-16">
          <h3 className="text-3xl font-le-jour text-primary text-center mb-12">Nossa Equipe de Vendas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Edna Fonseca */}
            <div className="text-center">
              <div className="relative w-64 h-80 mx-auto mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/images/contato/1.png"
                  alt="Edna Fonseca"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-[21px] font-montserrat font-bold text-gray-800 mb-2">
                Edna Fonseca
              </h4>
              <p className="text-sm text-gray-600 font-montserrat mb-4">
                Especialista em varejo Brasil
              </p>
              <button
                onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                className="bg-[#8a7d5c] text-white px-6 py-3 rounded-lg font-montserrat font-medium hover:bg-[#7a6d4c] transition-colors flex items-center gap-2 mx-auto"
              >
                <FaWhatsapp size={20} />
                WhatsApp
              </button>
            </div>

            {/* Polly Marques */}
            <div className="text-center">
              <div className="relative w-64 h-80 mx-auto mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/images/contato/2.png"
                  alt="Polly Marques"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-[21px] font-montserrat font-bold text-gray-800 mb-2">
                Polly Marques
              </h4>
              <p className="text-sm text-gray-600 font-montserrat mb-4">
                Especialista em atacado Brasil
              </p>
              <button
                onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                className="bg-[#8a7d5c] text-white px-6 py-3 rounded-lg font-montserrat font-medium hover:bg-[#7a6d4c] transition-colors flex items-center gap-2 mx-auto"
              >
                <FaWhatsapp size={20} />
                WhatsApp
              </button>
            </div>

            {/* Ana Paula */}
            <div className="text-center">
              <div className="relative w-64 h-80 mx-auto mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/images/contato/3.png"
                  alt="Ana Paula"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-[21px] font-montserrat font-bold text-gray-800 mb-2">
                Ana Paula
              </h4>
              <p className="text-sm text-gray-600 font-montserrat mb-4">
                Especialista em atacado São Paulo
              </p>
              <button
                onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                className="bg-[#8a7d5c] text-white px-6 py-3 rounded-lg font-montserrat font-medium hover:bg-[#7a6d4c] transition-colors flex items-center gap-2 mx-auto"
              >
                <FaWhatsapp size={20} />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 