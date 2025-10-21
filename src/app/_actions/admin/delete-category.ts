"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteCategoryAction(id: string) {
  try {
    // Verificar se a categoria está sendo usada por algum produto
    const productsUsingCategory = await db.product.findFirst({
      where: { categoryId: id }
    });

    if (productsUsingCategory) {
      throw new Error("Não é possível excluir uma categoria que possui produtos associados");
    }

    // Deletar a categoria
    await db.category.delete({
      where: { id }
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin");

    return {
      success: true
    };
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro interno do servidor"
    };
  }
} 