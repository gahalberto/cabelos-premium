"use server"
import { db } from "../_lib/prisma"

export const MakeAvatarPhoto = async (id: string, profileImg: string) => {
    return db.memoriaProfiles.update({
        where: { id },
        data: {
            profileImg
        }
    })
}