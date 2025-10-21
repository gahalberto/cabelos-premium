"use server";

import { db } from "@/app/_lib/prisma";

export async function getAdminCategories() {
  try {
    const categories = await db.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    return categories;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    throw new Error("Não foi possível buscar as categorias");
  }
} 