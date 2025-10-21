"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  Eye, 
  Star, 
  TrendingUp,
  DollarSign,
  Users
} from "lucide-react";

interface AdminStatsCardsProps {
  products: any[];
  categories: any[];
  expertApplications?: any[];
  orders?: any[];
}

export function AdminStatsCards({ 
  products, 
  categories, 
  expertApplications = [], 
  orders = [] 
}: AdminStatsCardsProps) {
  const activeProducts = products.filter(p => p.isActive).length;
  const featuredProducts = products.filter(p => p.isFeatured).length;
  const newProducts = products.filter(p => p.isNew).length;
  
  // Calcular receita total (exemplo)
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  const stats = [
    {
      title: "Total de Produtos",
      value: products.length,
      description: "Produtos cadastrados",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
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
      title: "Em Destaque",
      value: featuredProducts,
      description: "Produtos em destaque",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Categorias",
      value: categories.length,
      description: "Categorias ativas",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Aplicações Expert",
      value: expertApplications.length,
      description: "Candidatos expert",
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    {
      title: "Receita Total",
      value: `R$ ${totalRevenue.toFixed(2)}`,
      description: "Faturamento total",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
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
