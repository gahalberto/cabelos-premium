"use server";

import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// Adicionar produto ao carrinho
export async function addToCart(productId: string, quantity: number = 1) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    // Verificar se o produto existe e está ativo
    const product = await db.product.findUnique({
      where: { 
        id: productId,
        isActive: true 
      },
      select: { 
        id: true, 
        name: true, 
        price: true, 
        stock: true 
      }
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    if (product.stock < quantity) {
      throw new Error("Quantidade solicitada não disponível em estoque");
    }

    // Verificar se o produto já está no carrinho
    const existingCartItem = await db.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId: productId,
      },
    });

    if (existingCartItem) {
      // Atualizar quantidade se já existir
      const newQuantity = existingCartItem.quantity + quantity;
      
      if (newQuantity > product.stock) {
        throw new Error("Quantidade total excede o estoque disponível");
      }

      await db.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Criar novo item no carrinho
      await db.cartItem.create({
        data: {
          userId: session.user.id,
          productId: productId,
          quantity: quantity,
        },
      });
    }

    return { success: true, message: "Produto adicionado ao carrinho" };
  } catch (error) {
    console.error("Erro ao adicionar ao carrinho:", error);
    throw error;
  }
}

// Remover produto do carrinho
export async function removeFromCart(cartItemId: string) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    await db.cartItem.delete({
      where: {
        id: cartItemId,
        userId: session.user.id, // Garantir que só deleta seus próprios itens
      },
    });

    return { success: true, message: "Produto removido do carrinho" };
  } catch (error) {
    console.error("Erro ao remover do carrinho:", error);
    throw error;
  }
}

// Atualizar quantidade no carrinho
export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    if (quantity <= 0) {
      // Se quantidade for 0 ou menor, remover o item
      return await removeFromCart(cartItemId);
    }

    // Verificar estoque
    const cartItem = await db.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: session.user.id,
      },
      include: {
        product: {
          select: { stock: true }
        }
      }
    });

    if (!cartItem) {
      throw new Error("Item do carrinho não encontrado");
    }

    if (quantity > cartItem.product.stock) {
      throw new Error("Quantidade solicitada não disponível em estoque");
    }

    await db.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return { success: true, message: "Quantidade atualizada" };
  } catch (error) {
    console.error("Erro ao atualizar quantidade:", error);
    throw error;
  }
}

// Buscar carrinho do usuário
export async function getUserCart() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { items: [], total: 0, itemCount: 0 };
    }

    const cartItems = await db.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            salePrice: true,
            images: true,
            stock: true,
            isActive: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filtrar produtos ativos e calcular totais
    const activeItems = cartItems.filter(item => item.product.isActive);
    
    const total = activeItems.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price;
      return sum + (price * item.quantity);
    }, 0);

    const itemCount = activeItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: activeItems,
      total: Math.round(total * 100) / 100,
      itemCount,
    };
  } catch (error) {
    console.error("Erro ao buscar carrinho:", error);
    return { items: [], total: 0, itemCount: 0 };
  }
}

// Limpar carrinho
export async function clearCart() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    await db.cartItem.deleteMany({
      where: { userId: session.user.id },
    });

    return { success: true, message: "Carrinho limpo com sucesso" };
  } catch (error) {
    console.error("Erro ao limpar carrinho:", error);
    throw error;
  }
} 