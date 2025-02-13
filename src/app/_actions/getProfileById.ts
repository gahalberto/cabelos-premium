"use server";

import { db } from "../_lib/prisma";


export async function getProfile(id: string) {
  try {
    const profile = await db.memoriaProfiles.findUnique({
      where: { id },
      include: {
        ProfilePhotos: true, // Inclua as fotos relacionadas
      }
    });

    if (!profile) {
      throw new Error("Perfil não encontrado.");
    }

    return profile;
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    throw error;
  }
}
