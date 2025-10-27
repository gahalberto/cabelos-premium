"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateProductData {
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

export async function createProduct(data: CreateProductData) {
  try {
    // Gerar slug único baseado no nome
    const baseSlug = data.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    let slug = baseSlug;
    let counter = 1;

    // Verificar se o slug já existe e gerar um único
    while (await db.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Buscar a categoria pelo slug
    const category = await db.category.findUnique({
      where: { slug: data.category }
    });

    if (!category) {
      throw new Error("Categoria não encontrada");
    }

    // Gerar SKU único baseado no nome e timestamp
    const sku = `${data.name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .substring(0, 8)}-${Date.now().toString().slice(-6)}`;

    // Criar o produto
    const product = await db.product.create({
      data: {
        name: data.name,
        slug,
        sku,
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
    console.error("Erro ao criar produto:", error);
    throw new Error("Não foi possível criar o produto");
  }
} 