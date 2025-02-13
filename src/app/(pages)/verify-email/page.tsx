"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail } from "@/app/_actions/verifyEmail";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { newPassword } from "@/app/_actions/newPassword";

const VerifyEmailComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email");
  const token = searchParams?.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"success" | "error" | "loading">(
    "loading"
  );
  const [message, setMessage] = useState("");

  const handleSavePassword = async () => {
    if (!email || !password) return;
    const res = await newPassword(email, password);
    if (res) {
      setStatus("success");
      setMessage("✅ Senha alterada com sucesso!");
      setTimeout(() => router.push("/login"), 3000);
    } else {
      setStatus("error");
      setMessage("❌ Erro ao alterar a senha.");
    }
  };

  useEffect(() => {
    const handleVerifyEmail = async () => {
      if (!email || !token) {
        setStatus("error");
        setMessage(
          "❌ Link inválido. Certifique-se de que você copiou corretamente."
        );
        setLoading(false);
        return;
      }

      try {
        const response = await verifyEmail(email, token);

        if (response.success) {
          setStatus("success");
          setMessage("✅ E-mail verificado com sucesso!");
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao verificar o e-mail."
        );
      } finally {
        setLoading(false);
      }
    };

    handleVerifyEmail();
  }, [email, token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md text-center">
        {loading ? (
          <p className="text-gray-600">🔄 Verificando seu e-mail...</p>
        ) : status === "success" ? (
          <>
            <h1 className="text-red-600 text-xl font-bold">{message}</h1>
            <Input
              type="password"
              placeholder="Digite uma nova senha para sua conta"
              value={password}
              onChange={(e) =>
                setPassword((e.target as HTMLInputElement).value)
              }
              className="mt-4"
            />
            <Button
              color="primary"
              variant="secondary"
              className="mt-4"
              onClick={handleSavePassword}
            >
              Salvar nova senha
            </Button>
          </>
        ) : (
          <h1 className="text-red-600 text-xl font-bold">
            E-mail já verificado ou token expirado.
          </h1>
        )}
      </div>
    </div>
  );
};

const VerifyEmailPage = () => {
  return (
    <Suspense fallback={<p className="text-gray-600">🔄 Carregando...</p>}>
      <VerifyEmailComponent />
    </Suspense>
  );
};

export default VerifyEmailPage;
