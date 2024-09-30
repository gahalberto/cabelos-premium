"use server"

import { db } from "../_lib/prisma"

// Defina a interface para os dados do perfil
interface ProfileData {
    profileName: string;
    biography: string;
    phrase: string;
    birthday: Date;
    deathday: Date | null;
}

// Função para atualizar o perfil no banco de dados
export const EditProfile = async ({ profileId, profileData }: { profileId: string, profileData: ProfileData }) => {
    try {
        const updatedProfile = await db.memoriaProfiles.update({
            where: {
                id: profileId,  // Use o `profileId` fornecido para encontrar o registro correto
            },
            data: {
                name: profileData.profileName,
                biography: profileData.biography,
                phrase: profileData.phrase,
                birthday: profileData.birthday,
                deathday: profileData.deathday,
            },
        })

        return updatedProfile
    } catch (error) {
        console.error("Erro ao atualizar o perfil:", error)
        throw new Error("Erro ao atualizar o perfil")
    }
}
