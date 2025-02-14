// src/app/_actions/getProfilesByUser.ts
"use server"

import { db } from "../_lib/prisma"

export const getProfilesBySlug = async (slug: string) => {

    return await db.memoriaProfiles.findUnique({
        where: {
            slug,
        },
        include: {
            ProfilePhotos: true, // Inclua as fotos relacionadas
            ProfileTributes: true,
        },
    });
};
