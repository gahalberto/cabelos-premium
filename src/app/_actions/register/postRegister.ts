"use server";

import { db } from "@/app/_lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/app/services/emailService";

interface RegisterUserData {
  name: string;
  lastName: string;
  email: string;
  document: string;
  documentType: "CPF" | "CNPJ";
  birthDate: Date;
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  userType: "CLIENTE" | "ESPECIALISTA";
  zipCode: string;
  phone: string;
  password: string;
}

export const registerUser = async (userData: RegisterUserData) => {
  try {
    const existingUserByEmail = await db.user.findUnique({
      where: { email: userData.email },
    });
    if (existingUserByEmail) throw new Error("Este e-mail já está em uso.");

    const whereClause = userData.documentType === "CPF"
      ? { cpf: userData.document }
      : { cnpj: userData.document };

    const existingUserByDocument = await db.user.findUnique({ where: whereClause });
    if (existingUserByDocument) throw new Error(`Este ${userData.documentType} já está em uso.`);

    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const baseUserData = {
      name: userData.name,
      lastName: userData.lastName,
      email: userData.email,
      birthDate: userData.birthDate,
      gender: userData.gender,
      role: userData.userType,
      zipCode: userData.zipCode,
      phone: userData.phone,
      password: hashedPassword,
    };

    const createUserData = userData.documentType === "CPF"
      ? { ...baseUserData, cpf: userData.document }
      : { ...baseUserData, cnpj: userData.document };

    const user = await db.user.create({ data: createUserData });

    // Gerar e enviar token de verificação de e-mail
    try {
      await db.verificationToken.deleteMany({ where: { identifier: userData.email } });
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
      await db.verificationToken.create({
        data: { identifier: userData.email, token, expires },
      });
      await sendVerificationEmail(userData.email, userData.name, token);
    } catch {
      // Não bloqueia o cadastro se o e-mail falhar
    }

    return { success: true, user };
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
  }
};
