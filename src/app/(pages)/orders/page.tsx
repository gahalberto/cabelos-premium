import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/app/_lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Package, Clock, ShoppingBag } from "lucide-react";

export const dynamic = 'force-dynamic';

function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(date);
}

function getStatusBadge(status: string) {
    const statusMap: Record<string, { label: string; color: string }> = {
        PENDING: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
        CONFIRMED: { label: "Confirmado", color: "bg-blue-100 text-blue-800" },
        PROCESSING: { label: "Em Processamento", color: "bg-indigo-100 text-indigo-800" },
        SHIPPED: { label: "Enviado", color: "bg-purple-100 text-purple-800" },
        DELIVERED: { label: "Entregue", color: "bg-green-100 text-green-800" },
        CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-800" },
    };

    const s = statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" };
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${s.color}`}>{s.label}</span>;
}

export default async function OrdersPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/orders");
    }

    const orders = await db.order.findMany({
        where: { userId: session.user.id },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            images: true,
                            slug: true,
                        }
                    },
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex items-center gap-3 mb-8">
                    <ShoppingBag className="w-8 h-8 text-[#b08c4f]" />
                    <h1 className="text-3xl font-bold text-gray-900">Meus Pedidos</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Sem pedidos por aqui...</h2>
                        <p className="text-gray-500 mb-6">
                            Você ainda não fez nenhum pedido. Que tal dar uma olhada nas nossas extensões exclusivas?
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center rounded-lg bg-[#b08c4f] px-8 py-3 font-semibold text-white shadow-md transition-all hover:bg-[#8a6d3b]"
                        >
                            Ver Produtos
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                {/* Header do Pedido */}
                                <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Data do Pedido</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <p className="text-gray-900 font-medium">{formatDate(order.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Total</p>
                                            <p className="text-gray-900 font-medium mt-1">{formatCurrency(order.total)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Pedido nº</p>
                                            <p className="text-gray-900 font-medium mt-1">{order.orderNumber}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-start md:justify-end">
                                        {getStatusBadge(order.status)}
                                    </div>
                                </div>

                                {/* Itens do Pedido */}
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex gap-4 items-center">
                                                <Link href={`/${item.product.slug}`} className="flex-shrink-0">
                                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-100">
                                                        <Image
                                                            src={item.product.images[0] || "/images/placeholder.svg"}
                                                            alt={item.product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </Link>
                                                <div className="flex-1 min-w-0">
                                                    <Link href={`/${item.product.slug}`}>
                                                        <h3 className="text-lg font-medium text-gray-900 hover:text-[#b08c4f] truncate transition-colors">
                                                            {item.product.name}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-gray-500 mt-1">Quantidade: {item.quantity}</p>
                                                    <p className="text-[#b08c4f] font-semibold mt-1">
                                                        {formatCurrency(item.price)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {order.trackingCode && (
                                        <div className="mt-6 pt-6 border-t border-gray-100">
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Informações de Entrega</h4>
                                            <p className="text-gray-600 text-sm">
                                                Código de rastreio: <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">{order.trackingCode}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
