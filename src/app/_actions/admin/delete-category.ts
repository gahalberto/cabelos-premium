"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { logActivity } from "./log-activity";

export async function deleteCategoryAction(id: string) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role === "VENDEDOR") {
    return { success: false, error: "Sem permissão para excluir categorias" };
  }

  try {
    // Verificar se a categoria está sendo usada por algum produto
    const productsUsingCategory = await db.product.findFirst({
      where: { categoryId: id }
    });

    if (productsUsingCategory) {
      throw new Error("Não é possível excluir uma categoria que possui produtos associados");
    }

    const category = await db.category.findUnique({ where: { id } });

    // Deletar a categoria
    await db.category.delete({
      where: { id }
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin");
    await logActivity({ action: "Excluiu", entity: "Categoria", entityId: id, entityName: category?.name });

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