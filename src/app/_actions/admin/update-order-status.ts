"use server";

import { db } from "@/app/_lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
    try {
        await db.order.update({
            where: { id: orderId },
            data: { status },
        });

        // Revalida a página do admin de pedidos para mostrar os novos dados
        revalidatePath("/admin/orders");
        // Também revalida a rota do cliente para que ele veja a atualização
        revalidatePath("/orders");

        return { success: true };
    } catch (error) {
        console.error("Erro ao atualizar status do pedido:", error);
        return { success: false, error: "Falha ao atualizar o status." };
    }
}
