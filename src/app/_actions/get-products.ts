"use server";

import { db } from "../_lib/prisma";

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  search?: string;
  texture?: string;
  color?: string;
  length?: string;
}

export interface GetProductsOptions {
  page?: number;
  limit?: number;
  filters?: ProductFilters;
  sortBy?: 'price' | 'name' | 'createdAt' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export async function getProducts(options: GetProductsOptions = {}) {
  const {
    page = 1,
    limit = 12,
    filters = {},
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  try {
    const where: any = {
      isActive: true,
    };

    // Aplicar filtros
    if (filters.category) {
      where.category = { slug: filters.category };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    if (filters.isFeatured) {
      where.isFeatured = true;
    }

    if (filters.isNew) {
      where.isNew = true;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { color: { contains: filters.search, mode: 'insensitive' } },
        { texture: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.texture && filters.texture !== 'all') {
      where.texture = filters.texture;
    }

    if (filters.color && filters.color !== 'all') {
      where.color = filters.color;
    }

    if (filters.length && filters.length !== 'all') {
      where.length = filters.length;
    }

    // Calcular offset para paginação
    const offset = (page - 1) * limit;

    // Buscar produtos
    const [products, totalCount] = await Promise.all([
      db.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          price: true,
          salePrice: true,
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
          createdAt: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: offset,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    // Calcular informações de paginação
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Calcular rating médio para cada produto
    const productsWithRating = products.map(product => {
      const ratings = product.reviews.map(review => review.rating);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
        : 0;

      return {
        ...product,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: ratings.length,
      };
    });

    return {
      products: productsWithRating,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPreviousPage,
        limit,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw new Error("Não foi possível buscar os produtos");
  }
}

// Buscar categorias ativas
export async function getCategories() {
  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
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

// Buscar filtros disponíveis
export async function getAvailableFilters() {
  try {
    const [textures, colors, lengths] = await Promise.all([
      db.product.findMany({
        where: { isActive: true },
        select: { texture: true },
        distinct: ['texture'],
      }),
      db.product.findMany({
        where: { isActive: true },
        select: { color: true },
        distinct: ['color'],
      }),
      db.product.findMany({
        where: { isActive: true },
        select: { length: true },
        distinct: ['length'],
      }),
    ]);

    return {
      textures: textures.map(t => t.texture).filter(Boolean),
      colors: colors.map(c => c.color).filter(Boolean),
      lengths: lengths.map(l => l.length).filter(Boolean),
    };
  } catch (error) {
    console.error("Erro ao buscar filtros:", error);
    return { textures: [], colors: [], lengths: [] };
  }
} 