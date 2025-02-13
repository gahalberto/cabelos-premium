"use server"
import { db } from "../_lib/prisma"
import bcrypt from 'bcrypt';

export const newPassword = async (email: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10)

    return db.user.update({
        where: { email },
        data: {
            password: hashedPassword
        }
    })
}