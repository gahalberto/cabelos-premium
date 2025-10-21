"use server";

import { db } from "../_lib/prisma";

export async function deleteUserAvatar(userId: string) {
  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        image: null,
        updatedAt: new Date(),
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Erro ao remover avatar do usuário:", error);
    throw new Error("Não foi possível remover o avatar do usuário");
  }
} 