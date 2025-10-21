"use server";

import { db } from "../_lib/prisma";

export interface ShippingAddressData {
  name: string;
  phone: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

// Buscar todos os endereços de um usuário
export async function getUserShippingAddresses(userId: string) {
  try {
    const addresses = await db.shippingAddress.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return addresses;
  } catch (error) {
    console.error("Erro ao buscar endereços de entrega:", error);
    throw new Error("Não foi possível buscar os endereços de entrega");
  }
}

// Criar novo endereço de entrega
export async function createShippingAddress(userId: string, data: ShippingAddressData) {
  try {
    // Se o novo endereço for padrão, remover o padrão anterior
    if (data.isDefault) {
      await db.shippingAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      });
    }

    const address = await db.shippingAddress.create({
      data: {
        ...data,
        userId
      }
    });

    return address;
  } catch (error) {
    console.error("Erro ao criar endereço de entrega:", error);
    throw new Error("Não foi possível criar o endereço de entrega");
  }
}

// Atualizar endereço de entrega
export async function updateShippingAddress(addressId: string, userId: string, data: ShippingAddressData) {
  try {
    // Se o endereço for marcado como padrão, remover o padrão anterior
    if (data.isDefault) {
      await db.shippingAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      });
    }

    const address = await db.shippingAddress.update({
      where: { 
        id: addressId,
        userId // Garantir que o usuário só edite seus próprios endereços
      },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });

    return address;
  } catch (error) {
    console.error("Erro ao atualizar endereço de entrega:", error);
    throw new Error("Não foi possível atualizar o endereço de entrega");
  }
}

// Deletar endereço de entrega
export async function deleteShippingAddress(addressId: string, userId: string) {
  try {
    const address = await db.shippingAddress.delete({
      where: { 
        id: addressId,
        userId // Garantir que o usuário só delete seus próprios endereços
      }
    });

    // Se o endereço deletado era padrão, definir o primeiro como padrão
    if (address.isDefault) {
      const firstAddress = await db.shippingAddress.findFirst({
        where: { userId }
      });

      if (firstAddress) {
        await db.shippingAddress.update({
          where: { id: firstAddress.id },
          data: { isDefault: true }
        });
      }
    }

    return address;
  } catch (error) {
    console.error("Erro ao deletar endereço de entrega:", error);
    throw new Error("Não foi possível deletar o endereço de entrega");
  }
}

// Definir endereço como padrão
export async function setDefaultShippingAddress(addressId: string, userId: string) {
  try {
    // Remover padrão anterior
    await db.shippingAddress.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false }
    });

    // Definir novo padrão
    const address = await db.shippingAddress.update({
      where: { 
        id: addressId,
        userId
      },
      data: { 
        isDefault: true,
        updatedAt: new Date()
      }
    });

    return address;
  } catch (error) {
    console.error("Erro ao definir endereço padrão:", error);
    throw new Error("Não foi possível definir o endereço padrão");
  }
} 