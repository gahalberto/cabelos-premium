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
    <div className="bg-[#f9f3ee] min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-raleway text-gray-800 mb-4">Entre em Contato</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos aqui para transformar seu visual e oferecer a melhor experiência com cabelos naturais e exclusivos.
          </p>
          <Separator className="my-6 bg-[#b08c4f] mx-auto w-16" />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Formulário de Contato */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Envie uma Mensagem</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08c4f] focus:border-transparent"
                  placeholder="Seu nome completo"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08c4f] focus:border-transparent"
                  placeholder="seu.email@exemplo.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone (opcional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register("phone")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08c4f] focus:border-transparent"
                  placeholder="(00) 00000-0000"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Assunto
                </label>
                <input
                  type="text"
                  id="subject"
                  {...register("subject")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08c4f] focus:border-transparent"
                  placeholder="Assunto da mensagem"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  {...register("message")}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08c4f] focus:border-transparent"
                  placeholder="Digite sua mensagem aqui..."
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#b08c4f] text-white py-3 px-6 rounded-md hover:bg-[#8a6d3b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#b08c4f] focus:ring-offset-2 disabled:opacity-70"
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
              </button>
            </form>
          </div>

          {/* Informações de Contato */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-md mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Informações de Contato</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#f9f3ee] p-3 rounded-full">
                    <FaPhone className="text-[#b08c4f] text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Telefone</h3>
                    <p className="text-gray-600">(11) 3825-2050</p>
                    <p className="text-gray-600">(11) 98765-4321</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#f9f3ee] p-3 rounded-full">
                    <FaWhatsapp className="text-[#b08c4f] text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">WhatsApp</h3>
                    <p className="text-gray-600">(11) 98765-4321</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#f9f3ee] p-3 rounded-full">
                    <FaEnvelope className="text-[#b08c4f] text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Email</h3>
                    <p className="text-gray-600">contato@cabelospremium.com.br</p>
                    <p className="text-gray-600">atendimento@cabelospremium.com.br</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#f9f3ee] p-3 rounded-full">
                    <FaInstagram className="text-[#b08c4f] text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Instagram</h3>
                    <p className="text-gray-600">@cabelospremium</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#f9f3ee] p-3 rounded-full">
                    <FaMapMarkerAlt className="text-[#b08c4f] text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Endereço</h3>
                    <p className="text-gray-600">
                      Av. Paulista, 1000 - Bela Vista
                      <br />
                      São Paulo - SP, 01310-100
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Horário de Atendimento</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Segunda a Sexta</span>
                  <span className="font-medium text-gray-800">9h às 18h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sábado</span>
                  <span className="font-medium text-gray-800">9h às 14h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Domingo e Feriados</span>
                  <span className="font-medium text-gray-800">Fechado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa ou Imagem */}
        <div className="mt-16 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Nossa Localização</h2>
          <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
            <Image
              src="/images/mapa-placeholder.jpg"
              alt="Localização da Cabelos Premium"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 