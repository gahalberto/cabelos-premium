"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getUserCart, addToCart, removeFromCart, updateCartItemQuantity, clearCart } from '@/app/_actions/cart-actions';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    salePrice: number | null;
    images: string[];
    stock: number;
    isActive: boolean;
  };
}

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  addItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCartItems: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    if (status !== 'authenticated') {
      setItems([]);
      setTotal(0);
      setItemCount(0);
      return;
    }

    setLoading(true);
    try {
      const cartData = await getUserCart();
      setItems(cartData.items);
      setTotal(cartData.total);
      setItemCount(cartData.itemCount);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o carrinho",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId: string, quantity: number) => {
    if (status !== 'authenticated') {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar produtos ao carrinho",
        variant: "destructive"
      });
      return;
    }

    try {
      await addToCart(productId, quantity);
      await refreshCart();
      toast({
        title: "Produto adicionado!",
        description: "Produto foi adicionado ao carrinho com sucesso",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao adicionar ao carrinho";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      await removeFromCart(cartItemId);
      await refreshCart();
      toast({
        title: "Produto removido",
        description: "Produto foi removido do carrinho",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o produto do carrinho",
        variant: "destructive"
      });
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      await updateCartItemQuantity(cartItemId, quantity);
      await refreshCart();
      if (quantity > 0) {
        toast({
          title: "Quantidade atualizada",
          description: "Quantidade do produto foi atualizada",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a quantidade",
        variant: "destructive"
      });
    }
  };

  const clearCartItems = async () => {
    try {
      await clearCart();
      await refreshCart();
      toast({
        title: "Carrinho limpo",
        description: "Todos os produtos foram removidos do carrinho",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível limpar o carrinho",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      refreshCart();
    } else if (status === 'unauthenticated') {
      setItems([]);
      setTotal(0);
      setItemCount(0);
    }
  }, [status]);

  const value: CartContextType = {
    items,
    total,
    itemCount,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCartItems,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
} 