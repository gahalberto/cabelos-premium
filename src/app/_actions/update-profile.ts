"use server";

import { db } from "../_lib/prisma";


export async function updateProfile(formData: FormData) {
  // Extração dos dados do formulário
    const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString();
  const biography = formData.get("biography")?.toString();
  const birthday = formData.get("birthday")?.toString();
  const deathday = formData.get("deathday")?.toString();
  const videoUrl = formData.get("videoUrl")?.toString();
  // Caso você precise enviar imagens, pode ser necessário um tratamento especial.
  // Por exemplo, você pode enviar as URLs das imagens (se já estiverem armazenadas) via um campo hidden.
    
  try {
    // Exemplo de atualização com Prisma (ajuste conforme sua estrutura)
    const updatedProfile = await db.memoriaProfiles.update({
      where: { id },
      data: {
        name,
        biography,
        birthday: birthday ? new Date(birthday) : null,
        deathday: deathday ? new Date(deathday) : null,
        videoUrl,
      },
    });
    return updatedProfile;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
}
