"use server";

import { db } from "@/app/_lib/prisma";
import { sendPasswordResetEmail } from "@/app/services/emailService";
import crypto from "crypto";

export async function sendResetEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await db.user.findUnique({
    where: { email: normalizedEmail },
    select: { name: true, email: true },
  });

  // Não revelar se o usuário existe ou não
  if (!user) return { success: true };

  const identifier = `reset:${normalizedEmail}`;

  // Remove token anterior
  await db.verificationToken.deleteMany({ where: { identifier } });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

  await db.verificationToken.create({
    data: { identifier, token, expires },
  });

  await sendPasswordResetEmail(normalizedEmail, user.name || "Cliente", token);

  return { success: true };
}
