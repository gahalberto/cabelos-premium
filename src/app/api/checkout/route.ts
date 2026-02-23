import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/app/_lib/prisma";
import { mpPreference } from "@/app/_lib/mercado-pago";

export async function POST(req: NextRequest) {
    try {
        // -----------------------------------------------------------------------
        // 1. Autenticação
        // -----------------------------------------------------------------------
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Usuário não autenticado. Faça login para continuar." },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // -----------------------------------------------------------------------
        // 2. Busca o carrinho do usuário DIRETAMENTE no banco — nunca confie
        //    nos preços enviados pelo frontend.
        // -----------------------------------------------------------------------
        const cartItems = await db.cartItem.findMany({
            where: { userId },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        salePrice: true,
                        stock: true,
                        isActive: true,
                        images: true,
                    },
                },
            },
        });

        if (cartItems.length === 0) {
            return NextResponse.json(
                { error: "Seu carrinho está vazio." },
                { status: 400 }
            );
        }

        // Filtra apenas produtos ativos e valida estoque
        const validItems = cartItems.filter(
            (item) => item.product.isActive && item.product.stock >= item.quantity
        );

        if (validItems.length === 0) {
            return NextResponse.json(
                { error: "Nenhum produto disponível no carrinho." },
                { status: 400 }
            );
        }

        // -----------------------------------------------------------------------
        // 3. Busca o endereço padrão do usuário
        // -----------------------------------------------------------------------
        const defaultAddress = await db.shippingAddress.findFirst({
            where: { userId, isDefault: true },
        });

        if (!defaultAddress) {
            return NextResponse.json(
                {
                    error:
                        "Nenhum endereço de entrega padrão encontrado. Cadastre um endereço antes de finalizar a compra.",
                },
                { status: 400 }
            );
        }

        // -----------------------------------------------------------------------
        // 4. Calcula totais com preços do banco (anti-fraude)
        // -----------------------------------------------------------------------
        const subtotal = validItems.reduce((acc, item) => {
            const unitPrice = item.product.salePrice ?? item.product.price;
            return acc + unitPrice * item.quantity;
        }, 0);

        const shipping = 0; // Implementar cálculo de frete se necessário
        const tax = 0;
        const discount = 0;
        const total = subtotal + shipping + tax - discount;

        // -----------------------------------------------------------------------
        // 5. Gera número do pedido único
        // -----------------------------------------------------------------------
        const orderNumber = `ORD-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 7)
            .toUpperCase()}`;

        // -----------------------------------------------------------------------
        // 6. Cria o pedido e os itens no banco (status inicial: PENDING)
        // -----------------------------------------------------------------------
        const order = await db.order.create({
            data: {
                orderNumber,
                userId,
                status: "PENDING",
                paymentStatus: "PENDING",
                paymentMethod: "mercado_pago",
                subtotal: Math.round(subtotal * 100) / 100,
                shipping,
                tax,
                discount,
                total: Math.round(total * 100) / 100,
                // Endereço de entrega
                shippingName: defaultAddress.name,
                shippingEmail: session.user.email ?? "",
                shippingPhone: defaultAddress.phone,
                shippingAddress: `${defaultAddress.street}, ${defaultAddress.number}${defaultAddress.complement ? ` - ${defaultAddress.complement}` : ""
                    } - ${defaultAddress.neighborhood}`,
                shippingCity: defaultAddress.city,
                shippingState: defaultAddress.state,
                shippingZipCode: defaultAddress.zipCode,
                items: {
                    create: validItems.map((item) => {
                        const unitPrice = item.product.salePrice ?? item.product.price;
                        return {
                            productId: item.product.id,
                            quantity: item.quantity,
                            price: Math.round(unitPrice * 100) / 100,
                            total: Math.round(unitPrice * item.quantity * 100) / 100,
                        };
                    }),
                },
            },
        });

        // -----------------------------------------------------------------------
        // 7. Cria a Preference no Mercado Pago (Checkout Pro)
        // -----------------------------------------------------------------------
        // Pega a URL dinamicamente
        const appUrl = req.nextUrl?.origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        const preference = await mpPreference.create({
            body: {
                // Referência externa = ID do pedido no Prisma (usada no webhook)
                external_reference: order.id,

                // Itens do pedido
                items: validItems.map((item) => {
                    const unitPrice = item.product.salePrice ?? item.product.price;
                    return {
                        id: item.product.id,
                        title: item.product.name,
                        quantity: item.quantity,
                        unit_price: Math.round(unitPrice * 100) / 100,
                        currency_id: "BRL",
                        picture_url: item.product.images[0] ?? undefined,
                    };
                }),

                // Dados do pagador (prefill no checkout do MP)
                payer: {
                    email: session.user.email ?? undefined,
                    name: session.user.name ?? undefined,
                },

                // URLs de retorno após o pagamento
                back_urls: {
                    success: `${appUrl}/checkout/sucesso`,
                    failure: `${appUrl}/checkout/falha`,
                    pending: `${appUrl}/checkout/pendente`,
                },

                // auto_return só aceita back_urls com HTTPS (exigência do Mercado Pago)
                auto_return: appUrl.startsWith("https") ? "approved" : undefined,

                // URL do webhook para receber notificações de pagamento - SEMPRE usar a URL pública (Ngrok/Produção)
                notification_url: `${process.env.NEXT_PUBLIC_APP_URL || appUrl}/api/webhooks/mercadopago`,

                // Metadados extras (opcional mas útil para debug)
                metadata: {
                    order_id: order.id,
                    order_number: orderNumber,
                    user_id: userId,
                },
            },
        });

        // Atualiza o pedido com o ID da preference do MP (útil para rastreamento)
        await db.order.update({
            where: { id: order.id },
            data: { paymentId: preference.id },
        });

        // -----------------------------------------------------------------------
        // 8. Retorna a URL de checkout do Mercado Pago
        // -----------------------------------------------------------------------
        return NextResponse.json({
            checkoutUrl: preference.init_point,
            orderId: order.id,
            orderNumber,
        });
    } catch (error) {
        console.error("[CHECKOUT] Erro ao criar pedido:", error);
        return NextResponse.json(
            { error: "Erro interno ao processar o checkout. Tente novamente." },
            { status: 500 }
        );
    }
}
