"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/app/_lib/prisma";
import { UserRole } from "@prisma/client";

export async function adminDeleteUser(userId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) throw new Error("Não autenticado");

  const admin = await db.user.findUnique({
    where: { email: session.user.email },
    select: { role: true, id: true },
  });

  if (!admin || admin.role !== UserRole.ADMIN) throw new Error("Acesso negado");
  if (admin.id === userId) throw new Error("Você não pode excluir sua própria conta.");

  await db.user.delete({ where: { id: userId } });

  return { success: true };
}
