import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { db } from "@/app/_lib/prisma";
import { mpPayment } from "@/app/_lib/mercado-pago";
import { redirect } from "next/navigation";

export default async function CheckoutSuccessPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // 1. Pegar parâmetros da URL de retorno do MP
    const paymentId = searchParams.payment_id as string;
    const status = searchParams.status as string;
    const externalReference = searchParams.external_reference as string; // Esse é o ID do Order no Prisma

    let orderStatusUpdated = false;

    // 2. Se tivermos ID de pagamento, fazemos a verificação manual (fallback pro webhook)
    if (paymentId && status === "approved" && externalReference) {
        try {
            // Verificar se o pedido já foi atualizado pelo webhook
            const order = await db.order.findUnique({
                where: { id: externalReference }
            });

            if (order && order.paymentStatus === "PENDING") {
                // Pedido ainda está pendente! Vamos verificar direto no MP para garantir que o usuário não fraudou a URL
                const payment = await mpPayment.get({ id: paymentId });

                if (payment && payment.status === "approved" && payment.external_reference === externalReference) {
                    // Tudo certo, pagamento validado. Atualizamos o banco
                    await db.order.update({
                        where: { id: externalReference },
                        data: {
                            paymentStatus: "PAID",
                            status: "CONFIRMED",
                            paymentId: String(payment.id),
                        },
                    });

                    // Limpa o carrinho
                    await db.cartItem.deleteMany({
                        where: { userId: order.userId },
                    });

                    orderStatusUpdated = true;
                    console.log(`[CHECKOUT-SUCCESS] Pedido ${order.orderNumber} atualizado para PAGO na página de retorno.`);
                }
            }
        } catch (error) {
            console.error("[CHECKOUT-SUCCESS] Erro ao verificar pagamento na página de retorno:", error);
            // Mesmo se der erro na verificação (ex: API lenta), vamos apenas exibir a tela de sucesso para não frustrar o cliente. 
            // O webhook atualizará depois.
        }
    }

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Pagamento Aprovado! 🎉
                </h1>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                    Seu pedido foi confirmado com sucesso. Em breve você receberá um e-mail com os
                    detalhes da sua compra.
                </p>
                {orderStatusUpdated && (
                    <p className="mt-4 text-sm text-green-600 font-medium">
                        Seu pedido já foi atualizado no sistema.
                    </p>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link
                    href="/orders"
                    className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-white hover:bg-yellow-600 transition-colors"
                >
                    Ver meus pedidos
                </Link>
                <Link
                    href="/"
                    className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Continuar comprando
                </Link>
            </div>
        </div>
    );
}
