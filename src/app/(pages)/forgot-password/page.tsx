"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { sendResetEmail } from "@/app/_actions/send-reset-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await sendResetEmail(email.trim());
      setSent(true);
    } catch {
      setError("Erro ao enviar o e-mail. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Painel esquerdo */}
      <div className="hidden lg:flex lg:w-2/5 relative flex-col items-center justify-center bg-[#1a1611] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle at 1.5px 1.5px, #8a7d5c 1.5px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        <div className="relative z-10 text-center px-12">
          <Image src="/images/logo-cabelos.png" alt="Cabelos Premium" width={140} height={140} className="mx-auto drop-shadow-2xl" />
          <h1 className="text-white text-3xl font-light mt-8 tracking-[0.2em] uppercase">Cabelos Premium</h1>
          <div className="w-12 h-px bg-[#8a7d5c] mx-auto mt-4 mb-4" />
          <p className="text-[#a89870] text-sm tracking-widest uppercase">Beleza que Transforma</p>
        </div>
      </div>

      {/* Painel direito */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-[#F5F4F0]">
        <div className="max-w-md mx-auto w-full">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <Image src="/images/logo-cabelos.png" alt="Cabelos Premium" width={70} height={70} className="mx-auto" />
            <p className="text-[#8a7d5c] text-xs tracking-widest uppercase mt-2">Cabelos Premium</p>
          </div>

          {!sent ? (
            <>
              <h2 className="text-2xl font-bold text-[#1a1611] mb-1">Esqueceu sua senha?</h2>
              <p className="text-sm text-gray-500 mb-8">
                Digite seu e-mail e enviaremos um link para redefinir sua senha.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[#1a1611] font-medium text-sm">
                    E-mail cadastrado
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white border-gray-200 focus-visible:ring-[#8a7d5c] focus-visible:border-[#8a7d5c] h-11"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-[#8a7d5c] hover:bg-[#6d6247] text-white font-medium tracking-wide transition-colors"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Enviar link de redefinição
                    </span>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle2 className="w-16 h-16 text-[#8a7d5c]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1a1611] mb-3">E-mail enviado!</h2>
              <p className="text-sm text-gray-500 mb-2">
                Se <strong>{email}</strong> estiver cadastrado, você receberá um link para redefinir sua senha.
              </p>
              <p className="text-xs text-gray-400 mb-8">
                Verifique também sua caixa de spam. O link expira em 1 hora.
              </p>
            </div>
          )}

          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#8a7d5c] transition-colors mt-6 justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}
