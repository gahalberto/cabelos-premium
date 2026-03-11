"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaInstagram, FaPhone, FaWhatsapp } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }).optional().or(z.literal("")),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos" }),
  subject: z.string().optional(),
  content: z.string().min(5, { message: "Mensagem deve ter pelo menos 5 caracteres" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const WHATSAPP_NUMBER = "5511912290102";
const WHATSAPP_MESSAGE = "Oi eu vim pelo site www.cabelospremium.com.br";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Falha ao enviar mensagem");

      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      reset();
    } catch (error) {
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Formulário de Contato */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Envie uma mensagem</h3>
            <p className="text-gray-500 text-sm mb-6">Preencha o formulário abaixo e retornaremos em breve.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Nome */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  {...register("name")}
                  className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b08c4f] focus:border-transparent transition"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>

              {/* E-mail */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register("email")}
                  className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b08c4f] focus:border-transparent transition"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              {/* Telefone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  {...register("phone")}
                  className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b08c4f] focus:border-transparent transition"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
              </div>

              {/* Assunto */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Assunto
                </label>
                <input
                  id="subject"
                  type="text"
                  placeholder="Qual o assunto da sua mensagem?"
                  {...register("subject")}
                  className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b08c4f] focus:border-transparent transition"
                />
              </div>

              {/* Mensagem */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  rows={5}
                  placeholder="Escreva sua mensagem aqui..."
                  {...register("content")}
                  className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b08c4f] focus:border-transparent transition resize-none"
                />
                {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#b08c4f] text-white py-3 px-6 rounded-lg font-montserrat font-medium hover:bg-[#9a7a40] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
              </button>
            </form>
          </div>

          {/* Canais de Contato */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">Outros canais</h3>

            {/* WhatsApp */}
            <button
              onClick={() =>
                window.open(
                  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
                  "_blank"
                )
              }
              className="w-full bg-[#25D366] text-white px-8 py-5 rounded-xl font-montserrat font-medium hover:bg-[#20BD5C] transition-colors flex items-center gap-4 shadow-md"
            >
              <FaWhatsapp size={36} />
              <div className="text-left">
                <p className="text-lg font-semibold">WhatsApp</p>
                <p className="text-sm opacity-90">(11) 91229-0102</p>
              </div>
            </button>

            {/* Instagram */}
            <button
              onClick={() => window.open("https://instagram.com/cabelospremium", "_blank")}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-8 py-5 rounded-xl font-montserrat font-medium hover:opacity-90 transition-opacity flex items-center gap-4 shadow-md"
            >
              <FaInstagram size={36} />
              <div className="text-left">
                <p className="text-lg font-semibold">Instagram</p>
                <p className="text-sm opacity-90">@cabelospremium</p>
              </div>
            </button>

            {/* Contato Fixo */}
            <button
              onClick={() => window.open("tel:+551138252050", "_blank")}
              className="w-full bg-[#8a7d5c] text-white px-8 py-5 rounded-xl font-montserrat font-medium hover:bg-[#7a6d4c] transition-colors flex items-center gap-4 shadow-md"
            >
              <FaPhone size={36} />
              <div className="text-left">
                <p className="text-lg font-semibold">Telefone Fixo</p>
                <p className="text-sm opacity-90">(11) 3825-2050</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
