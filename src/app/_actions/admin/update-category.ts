"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

export interface UpdateCategoryData {
  name: string;
  description?: string;
  isActive: boolean;
}

export async function updateCategoryAction(id: string, data: UpdateCategoryData) {
  try {
    // Gerar slug baseado no nome
    const slug = data.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Verificar se já existe uma categoria com o mesmo slug (excluindo a atual)
    const existingCategory = await db.category.findFirst({
      where: { 
        slug,
        id: { not: id }
      }
    });

    if (existingCategory) {
      throw new Error("Já existe uma categoria com este nome");
    }

    // Atualizar a categoria
    const category = await db.category.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        description: data.description,
        isActive: data.isActive
      }
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin");

    return {
      success: true,
      category
    };
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro interno do servidor"
    };
  }
} 