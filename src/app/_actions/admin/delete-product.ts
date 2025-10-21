"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: string) {
  try {
    // Verificar se o produto existe
    const product = await db.product.findUnique({
      where: { id }
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    // Excluir o produto
    await db.product.delete({
      where: { id }
    });

    revalidatePath("/admin");
    revalidatePath("/shop");

    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    throw new Error("Não foi possível excluir o produto");
  }
} 