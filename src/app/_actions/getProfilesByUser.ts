// src/app/_actions/getProfilesByUser.ts
"use server"

import { db } from "../_lib/prisma"

export const getProfilesByUser = async (userId: string) => {
    console.log("userId", userId);

    const profile =  await db.memoriaProfiles.findMany({
        where: {
            userId,
        },
        include: {
            orders: true, // Inclua as ordens relacionadas
            ProfilePhotos: true, // Inclua as fotos relacionadas
        },
    });
    return profile
};
