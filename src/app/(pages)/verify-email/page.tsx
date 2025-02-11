"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail } from "@/app/_actions/verifyEmail";

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email");
  const token = searchParams?.get("token");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"success" | "error" | "loading">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleVerifyEmail = async () => {
      if (!email || !token) {
        setStatus("error");
        setMessage("❌ Link inválido. Certifique-se de que você copiou corretamente.");
        setLoading(false);
        return;
      }

      try {
        const response = await verifyEmail(email, token); // Chama a Server Action diretamente

        if (response.success) {
          setStatus("success");
          setMessage("✅ E-mail verificado com sucesso! Redirecionando...");
          setTimeout(() => router.push("/login"), 3000);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Erro desconhecido ao verificar o e-mail.");
      } finally {
        setLoading(false);
      }
    };

    handleVerifyEmail();
  }, [email, token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md text-center">
        {loading ? (
          <p className="text-gray-600">🔄 Verificando seu e-mail...</p>
        ) : status === "success" ? (
          <h1 className="text-green-600 text-xl font-bold">{message}</h1>
        ) : (
          <h1 className="text-red-600 text-xl font-bold">{message}</h1>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
