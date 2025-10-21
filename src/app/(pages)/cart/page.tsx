"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft,
  CreditCard,
  Truck,
  Package
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { items, total, itemCount, loading, removeItem, updateQuantity, clearCartItems } = useCart();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [updatingQuantities, setUpdatingQuantities] = useState<Set<string>>(new Set());

  const handleQuantityChange = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingQuantities(prev => new Set(prev).add(cartItemId));
    try {
      await updateQuantity(cartItemId, newQuantity);
    } finally {
      setUpdatingQuantities(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await removeItem(cartItemId);
    } catch (error) {
      // Erro já tratado no contexto
    }
  };

  const handleClearCart = async () => {
    if (confirm("Tem certeza que deseja limpar todo o carrinho?")) {
      try {
        await clearCartItems();
      } catch (error) {
        // Erro já tratado no contexto
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Login necessário
          </h2>
          <p className="text-gray-600 mb-6">
            Faça login para acessar seu carrinho de compras
          </p>
          <Link href="/login">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Fazer Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-6">
              Adicione alguns produtos para começar suas compras
            </p>
            <Link href="/shop">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continuar Comprando
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/shop">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar às Compras
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Carrinho de Compras</h1>
          </div>
          <p className="text-gray-600">
            {itemCount} {itemCount === 1 ? 'item' : 'itens'} no carrinho
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Produtos */}
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-lg">Produtos ({items.length})</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Carrinho
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                    {/* Imagem do Produto */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.product.images[0] || '/images/no-avatar.webp'}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    {/* Informações do Produto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Preço: {formatPrice(item.product.salePrice || item.product.price)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Estoque: {item.product.stock} unidades
                      </p>
                    </div>

                    {/* Controles de Quantidade */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updatingQuantities.has(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <div className="w-12 text-center">
                          {updatingQuantities.has(item.id) ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
                          ) : (
                            <span className="text-sm font-medium">{item.quantity}</span>
                          )}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock || updatingQuantities.has(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remover
                      </Button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="bg-white sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Detalhes dos Valores */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frete</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Finalizar Compra
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    size="lg"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Salvar para Depois
                  </Button>
                </div>

                {/* Informações Adicionais */}
                <div className="text-xs text-gray-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-3 w-3" />
                    <span>Frete grátis para todo o Brasil</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-3 w-3" />
                    <span>Entrega em 3-5 dias úteis</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 