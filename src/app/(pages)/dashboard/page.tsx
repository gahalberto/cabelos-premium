"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, User, Settings } from "lucide-react";
import Link from "next/link";

const DashboardPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Negado
          </h1>
          <p className="text-gray-600 mb-6">
            Você precisa estar logado para acessar o dashboard.
          </p>
          <Link href="/login">
            <Button>Fazer Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, {session?.user.name}!
          </h1>
          <p className="text-gray-600">
            Gerencie sua conta e acompanhe seus pedidos
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card de Pedidos */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meus Pedidos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Nenhum pedido realizado
              </p>
            </CardContent>
          </Card>

          {/* Card de Carrinho */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carrinho</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Itens no carrinho
              </p>
            </CardContent>
          </Card>

          {/* Card de Perfil */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meu Perfil</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Link href="/account">
                <Button variant="outline" size="sm">
                  Editar Perfil
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card de Configurações */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Configurações</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Link href="/account">
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Ações Rápidas */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/shop">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-medium text-gray-900">Ver Produtos</h3>
                  <p className="text-sm text-gray-600">
                    Explore nossa coleção de cabelos
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/account">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <User className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-medium text-gray-900">Minha Conta</h3>
                  <p className="text-sm text-gray-600">
                    Gerencie suas informações
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/contato">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Settings className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-medium text-gray-900">Suporte</h3>
                  <p className="text-sm text-gray-600">
                    Entre em contato conosco
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
