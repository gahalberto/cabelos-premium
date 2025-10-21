"use server";

import { db } from "../_lib/prisma";
import bcrypt from "bcryptjs";

interface UpdatePasswordData {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export async function updateUserPassword({ userId, currentPassword, newPassword }: UpdatePasswordData) {
  try {
    // Buscar o usuário atual
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { password: true }
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (!user.password) {
      throw new Error("Usuário não possui senha definida");
    }

    // Verificar se a senha atual está correta
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error("Senha atual incorreta");
    }

    // Validar a nova senha
    if (newPassword.length < 6) {
      throw new Error("A nova senha deve ter pelo menos 6 caracteres");
    }

    // Criptografar a nova senha
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Atualizar a senha
    await db.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    throw error;
  }
} 