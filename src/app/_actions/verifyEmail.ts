"use server";

import { db } from "../_lib/prisma";

export const verifyEmail = async (email: string, token: string) => {
    if (!email || !token) {
        return { success: false, message: "E-mail ou token ausente." };
    }

    // Busca o usuário no banco de dados
    const user = await db.user.findUnique({
        where: { email },
    });

    if (!user) {
        return { success: false, message: "Usuário não encontrado." };
    }

    if (user.verificationToken === token) {
        await db.user.update({
            where: { email },
            data: {
                isVerified: true,
                emailVerified: new Date(),
                verificationToken: '', // Remove o token do banco
            },
        });
    } else {
        return { success: false, message: "Já verificou ou Token inválido ou expirado." };
    }

    // Atualiza o usuário para marcado como verificado


    return { success: true, message: "E-mail verificado com sucesso!" };
};
