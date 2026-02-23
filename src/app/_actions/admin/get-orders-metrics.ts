"use server";

import { db } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { OrderStatus, PaymentStatus, UserRole } from "@prisma/client";

export async function getOrdersMetrics() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            throw new Error("Não autorizado");
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email },
            select: { role: true }
        });

        if (!user || user.role !== UserRole.ADMIN) {
            throw new Error("Não autorizado");
        }

        const [
            paidOrders,
            pendingCount,
            confirmedCount,
            processingCount,
        ] = await Promise.all([
            db.order.findMany({
                where: {
                    paymentStatus: PaymentStatus.PAID,
                },
                select: {
                    total: true,
                },
            }),
            db.order.count({
                where: {
                    status: OrderStatus.PENDING,
                },
            }),
            db.order.count({
                where: {
                    status: OrderStatus.CONFIRMED,
                },
            }),
            db.order.count({
                where: {
                    status: OrderStatus.PROCESSING,
                },
            }),
        ]);

        const totalRevenue = paidOrders.reduce((acc, order) => acc + order.total, 0);
        const averageTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
        const activeOrdersCount = confirmedCount + processingCount;

        return {
            totalRevenue,
            averageTicket,
            pendingOrdersCount: pendingCount,
            activeOrdersCount,
            success: true,
        };
    } catch (error) {
        console.error("Erro ao carregar métricas de pedidos:", error);
        return {
            totalRevenue: 0,
            averageTicket: 0,
            pendingOrdersCount: 0,
            activeOrdersCount: 0,
            success: false,
        };
    }
}
