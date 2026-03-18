"use server";

import crypto from "crypto";
import { db } from "@/app/_lib/prisma";
import { sendVerificationEmail } from "@/app/services/emailService";

export async function resendVerificationEmail(identifier: string) {
  if (!identifier) return { success: false, message: "Identificador inválido." };

  let user = null;
  const cleanIdentifier = identifier.replace(/\D/g, "");

  if (identifier.includes("@")) {
    user = await db.user.findUnique({ where: { email: identifier } });
  } else if (cleanIdentifier.length === 11) {
    user = await db.user.findUnique({ where: { cpf: identifier } });
    if (!user) user = await db.user.findUnique({ where: { cpf: cleanIdentifier } });
  } else if (cleanIdentifier.length === 14) {
    user = await db.user.findUnique({ where: { cnpj: identifier } });
    if (!user) user = await db.user.findUnique({ where: { cnpj: cleanIdentifier } });
  }

  if (!user || !user.email) return { success: false, message: "Usuário não encontrado." };
  if (user.emailVerified) return { success: false, message: "E-mail já verificado." };

  await db.verificationToken.deleteMany({ where: { identifier: user.email } });
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
  await db.verificationToken.create({ data: { identifier: user.email, token, expires } });
  await sendVerificationEmail(user.email, user.name ?? "Cliente", token);

  return { success: true, message: "E-mail de verificação reenviado com sucesso!" };
}
