"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail } from "@/app/_actions/verifyEmail";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";
  const token = searchParams?.get("token") || "";

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    verifyEmail(email, token).then((res) => {
      if (res.success) {
        setStatus("success");
        setTimeout(() => router.push("/login"), 4000);
      } else {
        setStatus("error");
        setMessage(res.message || "Erro ao verificar o e-mail.");
      }
    });
  }, [email, token, router]);

  return (
    <div className="text-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-14 h-14 text-[#8a7d5c] mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-bold text-[#1a1611] mb-2">Verificando seu e-mail...</h2>
          <p className="text-sm text-gray-500">Aguarde um momento.</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 className="w-16 h-16 text-[#8a7d5c] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1a1611] mb-2">E-mail confirmado!</h2>
          <p className="text-sm text-gray-500 mb-1">Sua conta foi ativada com sucesso.</p>
          <p className="text-xs text-gray-400 mb-6">Redirecionando para o login...</p>
          <Link href="/login" className="text-[#8a7d5c] hover:underline text-sm font-medium">
            Ir para o login agora
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1a1611] mb-2">Link inválido</h2>
          <p className="text-sm text-gray-500 mb-6">{message}</p>
          <Link href="/login" className="text-[#8a7d5c] hover:underline text-sm font-medium">
            Voltar para o login
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
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
          <Suspense fallback={
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-[#8a7d5c] mx-auto animate-spin" />
            </div>
          }>
            <VerifyEmailContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
