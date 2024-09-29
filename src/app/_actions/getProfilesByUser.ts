// src/app/_actions/getProfilesByUser.ts
"use server"

import { db } from "../_lib/prisma"

export const getProfilesByUser = async (userId: string) => {
    return await db.memoriaProfiles.findMany({
        where: {
            userId,
        },
        include: {
            orders: true, // Inclua as ordens relacionadas
        },
    });
};
