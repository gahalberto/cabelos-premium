"use server";

import { db } from "../_lib/prisma";

interface UpdateUserProfileData {
  userId: string;
  data: {
    name?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    cpf?: string;
    birthDate?: Date | null;
  };
}

export async function updateUserProfile({ userId, data }: UpdateUserProfileData) {
  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        cpf: data.cpf,
        birthDate: data.birthDate,
        updatedAt: new Date(),
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Erro ao atualizar perfil do usuário:", error);
    throw new Error("Não foi possível atualizar o perfil do usuário");
  }
} 