"use server"

import { db } from "../_lib/prisma"

export const fetchProfileData = async (id: string) => {
    try {
        const profile = await db.memoriaProfiles.findUnique({
            where: {
                id,
            },
        });

        if (!profile) {
            throw new Error("Perfil não encontrado");
        }

        // Converter `null` para `undefined`
        return {
            ...profile,
            phrase: profile.phrase || undefined,  // Exemplo de conversão de `null` para `undefined`
            biography: profile.biography || undefined,  // Exemplo de conversão de `null` para `undefined`
            profileName: profile.name || undefined,  // Exemplo de conversão de `null` para `undefined`
        };
    } catch (error) {
        console.error("Erro ao buscar o perfil:", error);
        throw new Error("Não foi possível buscar o perfil");
    }
};
