"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/app/_lib/prisma";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Não autenticado");
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });
  if (!user || user.role !== UserRole.ADMIN) throw new Error("Acesso negado");
}

// ─── SEOConfig por página ─────────────────────────────────────────────────────

export interface SEOConfigInput {
  id: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  keywords?: string;
  noIndex?: boolean;
}

export async function saveSEOConfig(data: SEOConfigInput) {
  await assertAdmin();

  const config = await db.sEOConfig.upsert({
    where: { id: data.id },
    create: {
      id: data.id,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      ogImage: data.ogImage,
      keywords: data.keywords,
      noIndex: data.noIndex ?? false,
    },
    update: {
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      ogImage: data.ogImage,
      keywords: data.keywords,
      noIndex: data.noIndex ?? false,
    },
  });

  revalidatePath("/");
  revalidatePath(`/${data.id}`);
  return config;
}

// ─── Scripts de rastreamento ──────────────────────────────────────────────────

export interface TrackingConfigInput {
  gtmId?: string;
  ga4Id?: string;
  metaPixelId?: string;
  customHeadScripts?: string;
  customBodyScripts?: string;
  robotsContent?: string;
}

export async function saveTrackingConfig(data: TrackingConfigInput) {
  await assertAdmin();

  const config = await db.storeConfig.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      freeShippingThreshold: 0,
      gtmId: data.gtmId,
      ga4Id: data.ga4Id,
      metaPixelId: data.metaPixelId,
      customHeadScripts: data.customHeadScripts,
      customBodyScripts: data.customBodyScripts,
      robotsContent: data.robotsContent,
    },
    update: {
      gtmId: data.gtmId || null,
      ga4Id: data.ga4Id || null,
      metaPixelId: data.metaPixelId || null,
      customHeadScripts: data.customHeadScripts || null,
      customBodyScripts: data.customBodyScripts || null,
      robotsContent: data.robotsContent || null,
    },
  });

  revalidatePath("/", "layout");
  return config;
}

// ─── SEO de produto individual ────────────────────────────────────────────────

export interface ProductSEOInput {
  productId: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export async function saveProductSEO(data: ProductSEOInput) {
  await assertAdmin();

  const product = await db.product.update({
    where: { id: data.productId },
    data: {
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      keywords: data.keywords || null,
      ogImage: data.ogImage || null,
      canonicalUrl: data.canonicalUrl || null,
    },
    select: { slug: true },
  });

  revalidatePath(`/${product.slug}`);
  return product;
}
