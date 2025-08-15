"use server";

import { db } from "@/app/_lib/prisma";
import bcrypt from "bcryptjs";

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
    // Verificar se o usuário já existe
    const existingUserByEmail = await db.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUserByEmail) {
      throw new Error("Este e-mail já está em uso.");
    }

    // Verificar se o documento já existe
    const whereClause = userData.documentType === "CPF" 
      ? { cpf: userData.document }
      : { cnpj: userData.document };
      
    const existingUserByDocument = await db.user.findUnique({
      where: whereClause,
    });

    if (existingUserByDocument) {
      throw new Error(`Este ${userData.documentType} já está em uso.`);
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Criar o usuário
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

    // Adicionar CPF ou CNPJ baseado no tipo
    const createUserData = userData.documentType === "CPF" 
      ? { ...baseUserData, cpf: userData.document }
      : { ...baseUserData, cnpj: userData.document };

    const user = await db.user.create({
      data: createUserData,
    });

    return { success: true, user };
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
  }
};
