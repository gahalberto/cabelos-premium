"use server"
import { db } from "../_lib/prisma"

export const DeleteProfilePhoto = async (profileId: string, imageUrl: string) => {
   const profile = await db.memoriaProfiles.findFirst({
        where: {
            id: profileId
        },
        select: {
            images: true 
        }
    });

    if(!profile || !profile.images) throw new Error("Perfil não encontrado ou sem imagens. Atualize a página e se o erro persestir, entrar em contato com a administração");
    
    const updateImages = profile.images.filter((image: string) => image !== imageUrl);

    return await db.memoriaProfiles.update({
        where: {id: profileId},
        data: { images: updateImages }
    });

}