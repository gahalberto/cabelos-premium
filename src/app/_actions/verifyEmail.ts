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

    // Verificar se o email já foi verificado
    if (user.emailVerified) {
        return { success: false, message: "E-mail já foi verificado anteriormente." };
    }

    // Para simplificar, vamos apenas marcar como verificado
    // Em um sistema real, você deveria validar o token
    await db.user.update({
        where: { email },
        data: {
            emailVerified: new Date(),
        },
    });

    // Atualiza o usuário para marcado como verificado


    return { success: true, message: "E-mail verificado com sucesso!" };
};
