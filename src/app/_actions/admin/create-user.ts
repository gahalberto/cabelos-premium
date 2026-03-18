"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/app/_lib/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

interface CreateUserData {
  name: string;
  lastName?: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}

export async function adminCreateUser({ name, lastName, email, password, role, phone }: CreateUserData) {
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

  if (!name.trim()) throw new Error("Nome é obrigatório");
  if (!email.trim()) throw new Error("E-mail é obrigatório");
  if (password.length < 6) throw new Error("A senha deve ter pelo menos 6 caracteres");

  const trimmedEmail = email.trim().toLowerCase();

  const existing = await db.user.findUnique({ where: { email: trimmedEmail } });
  if (existing) throw new Error("Este e-mail já está cadastrado");

  const user = await db.user.create({
    data: {
      name: name.trim(),
      lastName: lastName?.trim() || null,
      email: trimmedEmail,
      password: await bcrypt.hash(password, 12),
      role,
      phone: phone?.trim() || null,
    },
  });

  return { success: true, userId: user.id };
}
