"use server";

import { db } from "../_lib/prisma";

export async function getUserProfile(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        cpf: true,
        birthDate: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user;
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    throw new Error("Não foi possível buscar o perfil do usuário");
  }
} 