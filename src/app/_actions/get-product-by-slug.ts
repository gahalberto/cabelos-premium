"use server";

import { db } from "../_lib/prisma";

export interface ProductDetails {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  sku: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  length?: string | null;
  texture?: string | null;
  color?: string | null;
  weight?: string | null;
  origin?: string | null;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  };
  averageRating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getProductBySlug(slug: string): Promise<ProductDetails | null> {
  try {
    const product = await db.product.findUnique({
      where: { 
        slug,
        isActive: true 
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        salePrice: true,
        sku: true,
        stock: true,
        isActive: true,
        isFeatured: true,
        isNew: true,
        length: true,
        texture: true,
        color: true,
        weight: true,
        origin: true,
        images: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
          }
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!product) {
      return null;
    }

    // Calcular rating médio das reviews
    const reviews = await db.review.findMany({
      where: { 
        productId: product.id,
        isApproved: true 
      },
      select: { rating: true }
    });

    let averageRating = 0;
    let reviewCount = 0;

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = totalRating / reviews.length;
      reviewCount = reviews.length;
    }

    // Retornar produto com rating calculado
    return {
      ...product,
      averageRating,
      reviewCount
    };
  } catch (error) {
    console.error("Erro ao buscar produto por slug:", error);
    return null;
  }
}

export async function getRelatedProducts(
  currentProductId: string,
  categoryId: string,
  limit: number = 4
): Promise<ProductDetails[]> {
  try {
    const products = await db.product.findMany({
      where: {
        categoryId,
        isActive: true,
        id: { not: currentProductId }
      },
              select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          price: true,
          salePrice: true,
          sku: true,
          stock: true,
          isActive: true,
          isFeatured: true,
          isNew: true,
          length: true,
          texture: true,
          color: true,
          weight: true,
          origin: true,
          images: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
            }
          },
          createdAt: true,
          updatedAt: true,
        },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Calcular rating para cada produto relacionado
    const productsWithRating = await Promise.all(
      products.map(async (product) => {
        const reviews = await db.review.findMany({
          where: { 
            productId: product.id,
            isApproved: true 
          },
          select: { rating: true }
        });

        let averageRating = 0;
        let reviewCount = 0;

        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          averageRating = totalRating / reviews.length;
          reviewCount = reviews.length;
        }

        return {
          ...product,
          averageRating,
          reviewCount
        };
      })
    );

    return productsWithRating;
  } catch (error) {
    console.error("Erro ao buscar produtos relacionados:", error);
    return [];
  }
} 