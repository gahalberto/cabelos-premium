"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/app/_lib/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

interface AdminUpdateUserData {
  userId: string;
  email?: string;
  newPassword?: string;
  role?: UserRole;
}

export async function adminUpdateUser({ userId, email, newPassword, role }: AdminUpdateUserData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Não autenticado");
  }

  const admin = await db.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (!admin || admin.role !== UserRole.ADMIN) {
    throw new Error("Acesso negado");
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };

  if (email) {
    const trimmedEmail = email.trim().toLowerCase();

    // Verifica duplicidade (ignorando o próprio usuário)
    const existing = await db.user.findFirst({
      where: { email: trimmedEmail, NOT: { id: userId } },
    });
    if (existing) {
      throw new Error("Este e-mail já está sendo usado por outro usuário");
    }

    updateData.email = trimmedEmail;
  }

  if (newPassword) {
    if (newPassword.length < 6) {
      throw new Error("A senha deve ter pelo menos 6 caracteres");
    }
    updateData.password = await bcrypt.hash(newPassword, 12);
  }

  if (role) {
    updateData.role = role;
  }

  await db.user.update({
    where: { id: userId },
    data: updateData,
  });

  return { success: true };
}
