"use client";

import { useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface CheckoutButtonProps {
    /** Texto customizável do botão */
    label?: string;
    className?: string;
}

export function CheckoutButton({
    label = "Finalizar Compra",
    className = "",
}: CheckoutButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    async function handleCheckout() {
        if (loading) return;
        setLoading(true);
        let redirecting = false;

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (!response.ok) {
                // Erro específico de endereço: redireciona para a conta
                if (
                    response.status === 400 &&
                    data.error?.toLowerCase().includes("endereço")
                ) {
                    toast({
                        variant: "destructive",
                        title: "Atenção",
                        description: "Você precisa cadastrar um endereço de entrega antes de finalizar a compra.",
                    });

                    redirecting = true;
                    // Adiciona um pequeno atraso antes de redirecionar para que o usuário possa ler o toast
                    setTimeout(() => {
                        router.push("/account?error=no_address#shipping");
                    }, 2000);
                    return;
                }

                // Outros erros: apenas exibe a mensagem
                toast({
                    variant: "destructive",
                    title: "Erro ao iniciar checkout",
                    description: data.error || "Tente novamente mais tarde.",
                });
                return;
            }

            // Redireciona o usuário para o Checkout Pro do Mercado Pago
            redirecting = true;
            window.location.href = data.checkoutUrl;
        } catch (error) {
            console.error("[CheckoutButton] Erro ao chamar /api/checkout:", error);
            toast({
                variant: "destructive",
                title: "Erro de conexão",
                description: "Verifique sua internet e tente novamente."
            });
        } finally {
            if (!redirecting) {
                setLoading(false);
            }
        }
    }

    return (
        <button
            onClick={handleCheckout}
            disabled={loading}
            className={`flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-yellow-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        >
            {loading ? (
                <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Redirecionando…
                </>
            ) : (
                <>
                    <ShoppingCart className="h-5 w-5" />
                    {label}
                </>
            )}
        </button>
    );
}
