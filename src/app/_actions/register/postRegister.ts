"use server";

import { db } from "@/app/_lib/prisma";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const registerUser = async (data: { name: string; email: string; password: string }) => {
  // Criptografar a senha antes de salvar
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const existingUser = await db.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Este e-mail já está em uso.");
  } else {
    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
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
