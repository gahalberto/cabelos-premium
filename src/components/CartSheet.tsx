"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { 
  ShoppingBagIcon, 
  Trash2, 
  Plus, 
  Minus,
  ShoppingCart,
  CreditCard
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CartSheetProps {
  children: React.ReactNode;
}

export function CartSheet({ children }: CartSheetProps) {
  const { items, total, itemCount, loading, removeItem, updateQuantity } = useCart();
  const { data: session } = useSession();
  const [updatingQuantities, setUpdatingQuantities] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col !bg-white shadow-xl border-l border-gray-200">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-gray-900">
            <ShoppingBagIcon className="h-5 w-5" />
            Carrinho de Compras
            {itemCount > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Conteúdo do Carrinho */}
        <div className="flex-1 flex flex-col overflow-hidden mt-4">
          {!session?.user ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-lg">
              <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Login necessário
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Faça login para acessar seu carrinho de compras
              </p>
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button className="bg-[#8a7d5c] hover:bg-[#6d6349]">
                  Fazer Login
                </Button>
              </Link>
            </div>
          ) : loading ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8a7d5c]"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-lg">
              <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Seu carrinho está vazio
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Adicione alguns produtos para começar suas compras
              </p>
              <Link href="/shop" onClick={() => setOpen(false)}>
                <Button className="bg-[#8a7d5c] hover:bg-[#6d6349]">
                  Ver Produtos
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      {/* Imagem do Produto */}
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-white border border-gray-200">
                        <Image
                          src={item.product.images[0] || '/images/no-avatar.webp'}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Informações do Produto */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
                          {item.product.name}
                        </h4>
                        <p className="text-sm font-semibold text-[#8a7d5c] mb-2">
                          {formatPrice(item.product.salePrice || item.product.price)}
                        </p>

                        {/* Controles de Quantidade */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updatingQuantities.has(item.id)}
                              className="h-7 w-7 p-0 hover:bg-gray-100"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <div className="w-10 text-center border-x border-gray-300">
                              {updatingQuantities.has(item.id) ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#8a7d5c] mx-auto"></div>
                              ) : (
                                <span className="text-sm font-medium">{item.quantity}</span>
                              )}
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock || updatingQuantities.has(item.id)}
                              className="h-7 w-7 p-0 hover:bg-gray-100"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        {item.product.stock <= 5 && (
                          <p className="text-xs text-orange-600 mt-1">
                            Apenas {item.product.stock} em estoque
                          </p>
                        )}
                      </div>

                      {/* Subtotal */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-sm text-gray-900">
                          {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo e Ações */}
              <div className="border-t pt-4 mt-4 space-y-4 bg-white">
                <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frete</span>
                    <span className="text-green-600 font-medium">Grátis</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-[#8a7d5c]">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Link href="/checkout" onClick={() => setOpen(false)}>
                    <Button 
                      className="w-full bg-[#8a7d5c] hover:bg-[#6d6349]"
                      size="lg"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Finalizar Compra
                    </Button>
                  </Link>
                  
                  <Link href="/cart" onClick={() => setOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-300 hover:bg-gray-50"
                      size="lg"
                    >
                      Ver Carrinho Completo
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

