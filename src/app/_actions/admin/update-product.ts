"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

interface UpdateProductData {
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  stock: number;
  category: string;
  length?: string;
  texture?: string;
  color?: string;
  weight?: string;
  origin?: string;
  images?: string[];
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
}

export async function updateProduct(id: string, data: UpdateProductData) {
  try {
    // Buscar a categoria pelo slug
    const category = await db.category.findUnique({
      where: { slug: data.category }
    });

    if (!category) {
      throw new Error("Categoria não encontrada");
    }

    // Atualizar o produto
    const product = await db.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice,
        stock: data.stock,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        isNew: data.isNew,
        length: data.length,
        texture: data.texture,
        color: data.color,
        weight: data.weight,
        origin: data.origin,
        images: data.images || [],
        categoryId: category.id,
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    revalidatePath("/admin");
    revalidatePath("/shop");

    return { success: true, product };
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    throw new Error("Não foi possível atualizar o produto");
  }
} 