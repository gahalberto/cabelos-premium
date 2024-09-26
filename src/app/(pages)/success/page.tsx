"use client"; // Importante para habilitar o uso de hooks do lado do cliente

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams?.get("session_id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (session_id) {
        try {
          console.log("Verificando pagamento para session_id:", session_id);

          const response = await fetch(`/api/verify-payment?session_id=${session_id}`);

          if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
          }

          const data = await response.json();
          console.log("Resposta da verificação de pagamento:", data);

          setPaymentStatus(data.paymentStatus);

          if (data.paymentStatus === "Paid") {
            router.push("/dashboard");
          } else if (data.paymentStatus === "Pending") {
            setError("O pagamento ainda está pendente.");
          } else {
            setError("Status de pagamento desconhecido.");
          }
        } catch (error: unknown) {
          console.error("Erro ao verificar o pagamento:", error);
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("Erro desconhecido ao verificar o pagamento.");
          }
        } finally {
          setLoading(false);
        }
      } else {
        setError("session_id não encontrado na URL.");
        setLoading(false);
      }
    };

    verifyPayment();
  }, [session_id, router]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-red-600 text-2xl font-bold">Erro:</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">
        {paymentStatus === "Paid" ? "Pagamento confirmado!" : "Processando pagamento..."}
      </h1>
      {paymentStatus === "Pending" && (
        <p className="text-yellow-500">Seu pagamento está pendente. Por favor, aguarde mais alguns minutos.</p>
      )}
    </div>
  );
};

// Suspense wrapper
const Success = () => {
  return (
    <Suspense fallback={<div>Carregando dados do pagamento...</div>}>
      <SuccessContent />
    </Suspense>
  );
};

export default Success;
