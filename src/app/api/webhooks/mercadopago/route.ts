import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";
import { mpPayment, verifyMercadoPagoSignature } from "@/app/_lib/mercado-pago";
import { OrderStatus, PaymentStatus } from "@prisma/client";

// O MP retorna o status do pagamento como string — mapeamos para nossos enums
function mapPaymentStatus(mpStatus: string): {
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
} {
    switch (mpStatus) {
        case "approved":
            return { paymentStatus: "PAID", orderStatus: "CONFIRMED" };
        case "rejected":
        case "cancelled":
            return { paymentStatus: "FAILED", orderStatus: "CANCELLED" };
        case "refunded":
        case "charged_back":
            return { paymentStatus: "REFUNDED", orderStatus: "CANCELLED" };
        default:
            // pending, in_process, authorized, etc.
            return { paymentStatus: "PENDING", orderStatus: "PENDING" };
    }
}

export async function POST(req: NextRequest) {
    try {
        // -----------------------------------------------------------------------
        // 1. Verifica a assinatura do webhook (proteção anti-spoofing)
        //    NOTA: Em ambiente de desenvolvimento local sem ngrok configurado,
        //    o MP não consegue enviar o webhook. Nesse caso, o MERCADO_PAGO_WEBHOOK_SECRET
        //    pode não estar setado — vamos pular a verificação apenas em dev.
        // -----------------------------------------------------------------------
        const isDev = process.env.NODE_ENV === "development";
        const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
        // Só verifica assinatura se um secret real estiver configurado
        const hasRealSecret =
            !!webhookSecret && !webhookSecret.startsWith("your-");

        if (!isDev && !hasRealSecret) {
            console.warn(
                "[WEBHOOK-MP] ⚠️  MERCADO_PAGO_WEBHOOK_SECRET não configurado — ignorando verificação de assinatura em produção!"
            );
        }

        if (hasRealSecret) {
            const isValid = verifyMercadoPagoSignature(req);
            if (!isValid) {
                console.warn("[WEBHOOK-MP] Assinatura inválida recebida.");
                return NextResponse.json(
                    { error: "Assinatura inválida." },
                    { status: 401 }
                );
            }
        }

        // -----------------------------------------------------------------------
        // 2. Lê o body da notificação
        //    O MP envia o tipo de notificação e o ID do recurso afetado
        // -----------------------------------------------------------------------
        const body = await req.json();
        const { type, data } = body as {
            type: string;
            data: { id: string };
        };

        console.log("[WEBHOOK-MP] Notificação recebida:", { type, data });

        // Ignoramos notificações que não sejam de pagamento
        if (type !== "payment") {
            return NextResponse.json({ received: true }, { status: 200 });
        }

        const paymentId = data?.id;
        if (!paymentId) {
            return NextResponse.json({ error: "ID de pagamento ausente." }, { status: 400 });
        }

        // -----------------------------------------------------------------------
        // 3. Busca o pagamento atualizado diretamente na API do Mercado Pago
        //    (nunca confiar nos dados do body do webhook — apenas no ID)
        // -----------------------------------------------------------------------
        const payment = await mpPayment.get({ id: paymentId });

        if (!payment) {
            console.error("[WEBHOOK-MP] Pagamento não encontrado no MP:", paymentId);
            return NextResponse.json({ error: "Pagamento não encontrado." }, { status: 404 });
        }

        const externalReference = payment.external_reference;
        const mpStatus = payment.status ?? "pending";

        console.log("[WEBHOOK-MP] Pagamento:", {
            id: paymentId,
            status: mpStatus,
            externalReference,
        });

        if (!externalReference) {
            console.error("[WEBHOOK-MP] external_reference ausente no pagamento.");
            return NextResponse.json({ received: true }, { status: 200 });
        }

        // -----------------------------------------------------------------------
        // 4. Busca o pedido pelo external_reference (= Order.id do Prisma)
        // -----------------------------------------------------------------------
        const order = await db.order.findUnique({
            where: { id: externalReference },
        });

        if (!order) {
            console.error("[WEBHOOK-MP] Pedido não encontrado:", externalReference);
            return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
        }

        // -----------------------------------------------------------------------
        // 5. Atualiza o status do pedido no banco
        // -----------------------------------------------------------------------
        const { paymentStatus, orderStatus } = mapPaymentStatus(mpStatus);

        await db.order.update({
            where: { id: order.id },
            data: {
                paymentStatus,
                status: orderStatus,
                // Salva o ID do pagamento do MP para rastreamento e estornos
                paymentId: String(payment.id),
            },
        });

        // -----------------------------------------------------------------------
        // 6. Se o pagamento foi aprovado, limpa o carrinho do usuário
        // -----------------------------------------------------------------------
        if (paymentStatus === "PAID") {
            await db.cartItem.deleteMany({
                where: { userId: order.userId },
            });

            console.log(
                `[WEBHOOK-MP] ✅ Pedido ${order.orderNumber} marcado como PAGO. Carrinho limpo.`
            );
        } else {
            console.log(
                `[WEBHOOK-MP] Pedido ${order.orderNumber} atualizado — status: ${paymentStatus}`
            );
        }

        // -----------------------------------------------------------------------
        // 7. Sempre retorna 200 para o MP (caso contrário ele vai retentar)
        // -----------------------------------------------------------------------
        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("[WEBHOOK-MP] Erro inesperado:", error);
        // Retornamos 200 mesmo em erro para evitar retentativas infinitas do MP
        // O erro será visível nos logs do servidor
        return NextResponse.json({ received: true }, { status: 200 });
    }
}
