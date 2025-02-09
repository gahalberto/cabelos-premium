"use server";

import { db } from "@/app/_lib/prisma";
import jwt from 'jsonwebtoken';
import { randomBytes } from "crypto";

export const registerUser = async (email: string, name: string) => {
  // Criptografar a senha antes de salvar
   function generatePassword(length = 12) {
    return randomBytes(length).toString('base64').slice(0, length);
  }
  
  const hashedPassword = generatePassword();

  const existingUser = await db.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    throw new Error("Este e-mail já está em uso.");
  } else {
    const user = await db.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword, // Armazena a senha criptografada
      },
    });

    // Gerar um token JWT de confirmação
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    // Retornar o token junto com a resposta
    return { user, token };
  }
};
