"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/_actions/reset-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, KeyRound, CheckCircle2, XCircle } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";
  const token = searchParams?.get("token") || "";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  if (!email || !token) {
    return (
      <div className="text-center">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#1a1611] mb-2">Link inválido</h2>
        <p className="text-sm text-gray-500 mb-6">Este link é inválido ou foi corrompido.</p>
        <Link href="/forgot-password" className="text-[#8a7d5c] hover:underline text-sm font-medium">
          Solicitar novo link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("As senhas não coincidem.");
      return;
    }
    setIsSubmitting(true);
    setStatus("idle");
    try {
      await resetPassword(email, token, password);
      setStatus("success");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Erro ao redefinir senha.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "success") {
    return (
      <div className="text-center">
        <CheckCircle2 className="w-16 h-16 text-[#8a7d5c] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#1a1611] mb-2">Senha redefinida!</h2>
        <p className="text-sm text-gray-500 mb-1">Sua nova senha foi salva com sucesso.</p>
        <p className="text-xs text-gray-400 mb-6">Redirecionando para o login...</p>
        <Link href="/login" className="text-[#8a7d5c] hover:underline text-sm font-medium">
          Ir para o login agora
        </Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-[#1a1611] mb-1">Nova senha</h2>
      <p className="text-sm text-gray-500 mb-8">
        Escolha uma nova senha para sua conta.
      </p>

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-6">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-[#1a1611] font-medium text-sm">
            Nova senha
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-white border-gray-200 focus-visible:ring-[#8a7d5c] h-11 pr-10"
            />
            <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm" className="text-[#1a1611] font-medium text-sm">
            Confirmar nova senha
          </Label>
          <Input
            id="confirm"
            type="password"
            placeholder="Repita a senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-white border-gray-200 focus-visible:ring-[#8a7d5c] h-11"
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
              Salvando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              Salvar nova senha
            </span>
          )}
        </Button>
      </form>

      <Link href="/login" className="block mt-6 text-center text-sm text-gray-500 hover:text-[#8a7d5c] transition-colors">
        Voltar para o login
      </Link>
    </>
  );
}

export default function ResetPasswordPage() {
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
          <div className="lg:hidden mb-10 text-center">
            <Image src="/images/logo-cabelos.png" alt="Cabelos Premium" width={70} height={70} className="mx-auto" />
            <p className="text-[#8a7d5c] text-xs tracking-widest uppercase mt-2">Cabelos Premium</p>
          </div>

          <Suspense fallback={<p className="text-gray-500 text-sm">Carregando...</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
