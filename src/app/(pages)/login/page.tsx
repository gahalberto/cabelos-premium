"use client";

import { getSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resendVerificationEmail } from "@/app/_actions/resendVerificationEmail";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [unverifiedIdentifier, setUnverifiedIdentifier] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    getSession().then((s) => { if (s) router.push("/"); });
  }, [router]);

  const isEmail = (v: string) => /[a-zA-Z@]/.test(v);

  const formatIdentifier = (value: string): string => {
    if (isEmail(value)) return value;
    const d = value.replace(/\D/g, "");
    if (d.length <= 11)
      return d.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return d.replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1/$2").replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  };

  const handleResend = async () => {
    if (!unverifiedIdentifier) return;
    setIsResending(true);
    setError(null);
    try {
      const result = await resendVerificationEmail(unverifiedIdentifier);
      if (result.success) {
        setInfo("E-mail de verificação reenviado! Verifique sua caixa de entrada.");
        setUnverifiedIdentifier(null);
      } else {
        setError(result.message);
      }
    } catch {
      setError("Erro ao reenviar e-mail. Tente novamente.");
    } finally {
      setIsResending(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setUnverifiedIdentifier(null);
    setIsSubmitting(true);
    try {
      const res = await signIn("credentials", { redirect: false, email: identifier, password });
      if (res?.error) {
        if (res.error === "EMAIL_NOT_VERIFIED") {
          setUnverifiedIdentifier(identifier);
          setIsSubmitting(false);
          // Reenviar automaticamente
          try {
            const result = await resendVerificationEmail(identifier);
            if (result.success) {
              setInfo("E-mail de verificação reenviado! Verifique sua caixa de entrada.");
            } else {
              setError("Seu e-mail não foi verificado. " + result.message);
            }
          } catch {
            setError("Seu e-mail não foi verificado. Tente reenviar o link abaixo.");
          }
          return;
        } else {
          setError("Credenciais inválidas. Verifique seus dados e tente novamente.");
        }
      }
      if (res?.ok) router.push("/");
    } catch {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Painel esquerdo — decorativo */}
      <div className="hidden lg:flex lg:w-2/5 relative flex-col items-center justify-center bg-[#1a1611] overflow-hidden">
        {/* Padrão pontilhado */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle at 1.5px 1.5px, #8a7d5c 1.5px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Gradiente radial central */}
        <div className="absolute inset-0 bg-radial-[at_50%_50%] from-[#3d3523]/40 to-transparent" />

        <div className="relative z-10 text-center px-12">
          <Image
            src="/images/logo-cabelos.png"
            alt="Cabelos Premium"
            width={140}
            height={140}
            className="mx-auto drop-shadow-2xl"
          />
          <h1 className="text-white text-3xl font-light mt-8 tracking-[0.2em] uppercase">
            Cabelos Premium
          </h1>
          <div className="w-12 h-px bg-[#8a7d5c] mx-auto mt-4 mb-4" />
          <p className="text-[#a89870] text-sm tracking-widest uppercase">
            Beleza que Transforma
          </p>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-[#F5F4F0]">
        <div className="max-w-md mx-auto w-full">
          {/* Logo mobile */}
          <div className="lg:hidden mb-10 text-center">
            <Image src="/images/logo-cabelos.png" alt="Cabelos Premium" width={80} height={80} className="mx-auto" />
            <p className="text-[#8a7d5c] text-xs tracking-widest uppercase mt-2">Cabelos Premium</p>
          </div>

          <h2 className="text-2xl font-bold text-[#1a1611] mb-1">Bem-vindo de volta</h2>
          <p className="text-sm text-gray-500 mb-8">Entre com seu e-mail, CPF ou CNPJ</p>

          {info && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 mb-6">
              {info}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-6">
              {error}
              {unverifiedIdentifier && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="block mt-2 underline font-medium hover:text-red-800 disabled:opacity-50"
                >
                  {isResending ? "Reenviando..." : "Reenviar e-mail de verificação"}
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} noValidate className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="identifier" className="text-[#1a1611] font-medium text-sm">
                E-mail, CPF ou CNPJ
              </Label>
              <Input
                id="identifier"
                type="text"
                autoComplete="username"
                placeholder="seu@email.com ou 000.000.000-00"
                value={identifier}
                onChange={(e) => setIdentifier(formatIdentifier(e.target.value))}
                required
                className="bg-white border-gray-200 focus-visible:ring-[#8a7d5c] focus-visible:border-[#8a7d5c] h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[#1a1611] font-medium text-sm">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white border-gray-200 focus-visible:ring-[#8a7d5c] focus-visible:border-[#8a7d5c] h-11 pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-[#8a7d5c] hover:text-[#6d6247] hover:underline transition-colors"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#8a7d5c] hover:bg-[#6d6247] text-white font-medium tracking-wide transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Entrar
                </span>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-[#8a7d5c] hover:text-[#6d6247] font-medium hover:underline transition-colors">
              Cadastre-se gratuitamente
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
