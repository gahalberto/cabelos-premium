import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import { db } from "@/app/_lib/prisma";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminOrdersTable } from "./admin-orders-table";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login?callbackUrl=/admin/orders");
    }

    const orders = await db.order.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            user: {
                select: {
                    name: true,
                    lastName: true,
                    email: true,
                },
            },
            items: {
                include: {
                    product: {
                        select: {
                            name: true,
                            images: true,
                        }
                    }
                }
            },
            _count: {
                select: { items: true },
            },
        },
    });

    // Mapear os dados para o formato esperado pela tabela Client-Side
    const formattedOrders = orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        userName: order.user.name ? `${order.user.name} ${order.user.lastName || ""}`.trim() : null,
        userEmail: order.user.email,
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        itemsCount: order._count.items,

        // Dados adicionais para o modal de detalhes
        shippingName: order.shippingName,
        shippingEmail: order.shippingEmail,
        shippingPhone: order.shippingPhone,
        shippingAddress: order.shippingAddress,
        shippingCity: order.shippingCity,
        shippingState: order.shippingState,
        shippingZipCode: order.shippingZipCode,
        notes: order.notes,
        trackingCode: order.trackingCode,
        items: order.items.map(item => ({
            id: item.id,
            productName: item.product.name,
            productImage: item.product.images[0] || "/images/placeholder.svg",
            quantity: item.quantity,
            price: item.price,
            total: item.total
        }))
    }));

    return (
        <AdminLayout
            title="Gerenciar Pedidos"
            description="Visualize e atualize os status de todos os pedidos da loja"
        >
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Todos os Pedidos</h2>
                        <p className="text-sm text-gray-500">Listagem completa com os {orders.length} pedidos recebidos.</p>
                    </div>
                </div>
            </div>

            <AdminOrdersTable orders={formattedOrders} />
        </AdminLayout>
    );
}
