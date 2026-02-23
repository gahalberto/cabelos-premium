"use client";

import { useState } from "react";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, MapPin, Package, Phone, User, Info, FileText } from "lucide-react";
import { updateOrderStatus } from "@/app/_actions/admin/update-order-status";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface OrderItemData {
    id: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    total: number;
}

interface OrderData {
    id: string;
    orderNumber: string;
    userName: string | null;
    userEmail: string;
    total: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    createdAt: Date;
    itemsCount: number;

    // Detalhes extras
    shippingName: string;
    shippingEmail: string;
    shippingPhone: string;
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingZipCode: string;
    notes: string | null;
    trackingCode: string | null;
    items: OrderItemData[];
}

export function AdminOrdersTable({ orders }: { orders: OrderData[] }) {
    const { toast } = useToast();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        setIsUpdating(true);
        try {
            const res = await updateOrderStatus(orderId, newStatus);
            if (res.success) {
                toast({
                    title: "Status Atualizado",
                    description: "O status do pedido foi atualizado com sucesso.",
                });
            } else {
                throw new Error("Falha ao atualizar");
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: "Não foi possível atualizar o pedido.",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const getPaymentBadge = (status: PaymentStatus) => {
        const badges: Record<PaymentStatus, { class: string; label: string }> = {
            PENDING: { class: "bg-yellow-100 text-yellow-800", label: "Pendente" },
            PAID: { class: "bg-green-100 text-green-800", label: "Pago" },
            FAILED: { class: "bg-red-100 text-red-800", label: "Falhou" },
            REFUNDED: { class: "bg-gray-100 text-gray-800", label: "Reembolsado" },
        };
        const b = badges[status];
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${b.class}`}>{b.label}</span>;
    };

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Pedido</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Pagamento</TableHead>
                        <TableHead>Status / Envio</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                                Nenhum pedido encontrado.
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium text-gray-900">
                                    {order.orderNumber}
                                    <div className="text-xs text-gray-500 mt-1">{order.itemsCount} itens</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm font-medium text-gray-900">{order.userName || "Sem nome"}</div>
                                    <div className="text-sm text-gray-500">{order.userEmail}</div>
                                </TableCell>
                                <TableCell className="text-sm">
                                    {new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(order.createdAt)}
                                </TableCell>
                                <TableCell className="font-semibold">
                                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(order.total)}
                                </TableCell>
                                <TableCell>
                                    {getPaymentBadge(order.paymentStatus)}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        defaultValue={order.status}
                                        onValueChange={(val) => handleStatusChange(order.id, val as OrderStatus)}
                                        disabled={isUpdating}
                                    >
                                        <SelectTrigger className="w-[140px] h-8 text-xs font-medium">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PENDING">Pendente</SelectItem>
                                            <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                                            <SelectItem value="PROCESSING">Processando</SelectItem>
                                            <SelectItem value="SHIPPED">Enviado</SelectItem>
                                            <SelectItem value="DELIVERED">Entregue</SelectItem>
                                            <SelectItem value="CANCELLED">Cancelado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-8 gap-1">
                                                <Eye className="w-3.5 h-3.5" />
                                                Detalhes
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-6 sm:rounded-xl">
                                            <DialogHeader>
                                                <DialogTitle className="text-xl">Detalhes do Pedido - {order.orderNumber}</DialogTitle>
                                                <DialogDescription>
                                                    Realizado em {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" }).format(order.createdAt)}
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                                {/* Card - Endereço */}
                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                    <h3 className="font-semibold flex items-center gap-2 mb-3 text-gray-900">
                                                        <MapPin className="w-4 h-4 text-[#b08c4f]" />
                                                        Endereço de Entrega
                                                    </h3>
                                                    <div className="text-sm text-gray-700 space-y-1">
                                                        <p className="font-medium text-gray-900">{order.shippingName}</p>
                                                        <p>{order.shippingAddress}</p>
                                                        <p>{order.shippingCity} - {order.shippingState}</p>
                                                        <p>CEP: {order.shippingZipCode}</p>
                                                    </div>
                                                </div>

                                                {/* Card - Contato */}
                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                    <h3 className="font-semibold flex items-center gap-2 mb-3 text-gray-900">
                                                        <User className="w-4 h-4 text-[#b08c4f]" />
                                                        Contato do Cliente
                                                    </h3>
                                                    <div className="text-sm text-gray-700 space-y-2">
                                                        <p className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-gray-400" /> {order.shippingEmail}</p>
                                                        <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-400" /> {order.shippingPhone}</p>
                                                    </div>
                                                </div>

                                                {/* Card - Notas */}
                                                {(order.notes || order.trackingCode) && (
                                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 md:col-span-2">
                                                        <h3 className="font-semibold flex items-center gap-2 mb-2 text-blue-900">
                                                            <Info className="w-4 h-4 text-blue-600" />
                                                            Informações Adicionais
                                                        </h3>
                                                        <div className="text-sm text-blue-800 space-y-2">
                                                            {order.trackingCode && <p><span className="font-medium">Código Rastreio:</span> {order.trackingCode}</p>}
                                                            {order.notes && <p><span className="font-medium">Notas:</span> {order.notes}</p>}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Itens do Pedido */}
                                            <div className="mt-8">
                                                <h3 className="font-semibold flex items-center gap-2 mb-4 text-gray-900 border-b pb-2">
                                                    <Package className="w-4 h-4 text-[#b08c4f]" />
                                                    Itens do Pedido ({order.itemsCount})
                                                </h3>
                                                <div className="space-y-4">
                                                    {order.items.map((item) => (
                                                        <div key={item.id} className="flex items-center gap-4 bg-white border border-gray-100 p-3 rounded-lg">
                                                            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                                                <Image
                                                                    src={item.productImage}
                                                                    alt={item.productName}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-gray-900 truncate text-sm">{item.productName}</p>
                                                                <p className="text-xs text-gray-500 mt-0.5">Qtd: {item.quantity} x {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.price)}</p>
                                                            </div>
                                                            <div className="font-semibold text-gray-900">
                                                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.total)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                                                    <span className="font-semibold text-gray-700">Total Pago:</span>
                                                    <span className="text-xl font-bold text-[#b08c4f]">
                                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(order.total)}
                                                    </span>
                                                </div>
                                            </div>

                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
