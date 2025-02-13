"use server"
import { db } from "../_lib/prisma";

type TributesTypes = {
    data : {
        name: string;
        email: string;
        message: string;
        profileId: string;
    }
}

export const CreateTribute = async ({data}: TributesTypes) => {
    const tribute = await db.profileTributes.create({
        data
    });
    return tribute;
}