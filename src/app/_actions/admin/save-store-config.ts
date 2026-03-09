"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/app/_lib/prisma";
import { UserRole } from "@prisma/client";

export async function saveStoreConfig(data: { freeShippingThreshold: number }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) throw new Error("Não autenticado");

  const admin = await db.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (!admin || admin.role !== UserRole.ADMIN) throw new Error("Acesso negado");

  if (data.freeShippingThreshold < 0) {
    throw new Error("O valor mínimo para frete grátis não pode ser negativo");
  }

  const config = await db.storeConfig.upsert({
    where: { id: "default" },
    create: { id: "default", freeShippingThreshold: data.freeShippingThreshold },
    update: { freeShippingThreshold: data.freeShippingThreshold },
  });

  return config;
}
