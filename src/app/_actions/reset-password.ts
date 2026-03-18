"use server";

import { db } from "@/app/_lib/prisma";
import bcrypt from "bcryptjs";

export async function resetPassword(email: string, token: string, newPass: string) {
  if (!email || !token || !newPass) throw new Error("Dados inválidos.");
  if (newPass.length < 6) throw new Error("A senha deve ter pelo menos 6 caracteres.");

  const normalizedEmail = email.trim().toLowerCase();
  const identifier = `reset:${normalizedEmail}`;

  const record = await db.verificationToken.findUnique({
    where: { identifier_token: { identifier, token } },
  });

  if (!record) throw new Error("Link inválido ou expirado.");
  if (record.expires < new Date()) {
    await db.verificationToken.delete({ where: { identifier_token: { identifier, token } } });
    throw new Error("Este link expirou. Solicite um novo.");
  }

  const hashedPassword = await bcrypt.hash(newPass, 12);

  await db.user.update({
    where: { email: normalizedEmail },
    data: {
      password: hashedPassword,
      emailVerified: new Date(), // prova posse do e-mail ao usar o link de reset
    },
  });

  await db.verificationToken.delete({ where: { identifier_token: { identifier, token } } });

  return { success: true };
}
