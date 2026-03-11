"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Eye,
  TrendingUp,
  DollarSign,
  MessageSquare
} from "lucide-react";

interface AdminStatsCardsProps {
  products: any[];
  categories: any[];
  expertApplications?: any[];
  orderMetrics?: {
    totalRevenue: number;
    averageTicket: number;
    pendingOrdersCount: number;
    activeOrdersCount: number;
  } | null;
  unreadContacts?: number;
}

export function AdminStatsCards({
  products,
  categories,
  expertApplications = [],
  orderMetrics,
  unreadContacts = 0
}: AdminStatsCardsProps) {
  const activeProducts = products.filter(p => p.isActive).length;
  const newProducts = products.filter(p => p.isNew).length;

  const stats = [
    {
      title: "Receita Total",
      value: `R$ ${(orderMetrics?.totalRevenue || 0).toFixed(2)}`,
      description: "Faturamento total (Pedidos Pagos)",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
    {
      title: "Ticket Médio",
      value: `R$ ${(orderMetrics?.averageTicket || 0).toFixed(2)}`,
      description: "Valor médio por pedido pago",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Pedidos Pendentes",
      value: orderMetrics?.pendingOrdersCount || 0,
      description: "Aguardando pagamento",
      icon: Package,
      color: "text-amber-600",
      bgColor: "bg-amber-100"
    },
    {
      title: "Pedidos Ativos",
      value: orderMetrics?.activeOrdersCount || 0,
      description: "Confirmados e em processamento",
      icon: Package,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    {
      title: "Total de Produtos",
      value: products.length,
      description: "Produtos cadastrados",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Produtos Ativos",
      value: activeProducts,
      description: "Visíveis na loja",
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Mensagens Não Lidas",
      value: unreadContacts,
      description: "Contatos aguardando resposta",
      icon: MessageSquare,
      color: unreadContacts > 0 ? "text-red-600" : "text-gray-400",
      bgColor: unreadContacts > 0 ? "bg-red-100" : "bg-gray-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
