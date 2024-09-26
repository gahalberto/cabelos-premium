"use server"

import { db } from "../_lib/prisma"

export const getProfilesByUser = async (userId: string) => {
    return await db.memoriaProfiles.findMany({
        where: {
            userId
        }
    })
}