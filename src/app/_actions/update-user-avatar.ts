"use server";

import { db } from "../_lib/prisma";

export async function updateUserAvatar(userId: string, imageUrl: string) {
  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        image: imageUrl,
        updatedAt: new Date(),
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Erro ao atualizar avatar do usuário:", error);
    throw new Error("Não foi possível atualizar o avatar do usuário");
  }
} 