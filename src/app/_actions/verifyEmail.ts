"use server";

import { db } from "../_lib/prisma";

export const verifyEmail = async (email: string, token: string) => {
  if (!email || !token) {
    return { success: false, message: "Link inválido." };
  }

  const record = await db.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token } },
  });

  if (!record) {
    return { success: false, message: "Link inválido ou já utilizado." };
  }

  if (record.expires < new Date()) {
    await db.verificationToken.delete({
      where: { identifier_token: { identifier: email, token } },
    });
    return { success: false, message: "Link expirado. Faça login para reenviar a verificação." };
  }

  await db.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });

  await db.verificationToken.delete({
    where: { identifier_token: { identifier: email, token } },
  });

  return { success: true, message: "E-mail verificado com sucesso!" };
};
