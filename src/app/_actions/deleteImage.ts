"use server" 
import { db } from "../_lib/prisma"

export const DeleteImage = async (id: number) => {
    return await db.profilePhotos.delete({
        where: {
            id,
        }
    });
}