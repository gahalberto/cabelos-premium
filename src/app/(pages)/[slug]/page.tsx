import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { db } from "@/app/_lib/prisma";
import { siteUrl, siteConfig } from "@/config/metadata";
import { ProductPageClient } from "./product-client";

interface Props {
  params: { slug: string };
}

// Pré-renderiza as páginas de produtos mais visitados no build
export async function generateStaticParams() {
  const products = await db.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return products.map((p) => ({ slug: p.slug }));
}

async function getProduct(slug: string) {
  const product = await db.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: { select: { id: true, name: true, slug: true, description: true } },
      reviews: { where: { isApproved: true }, select: { rating: true } },
    },
  });

  if (!product) return null;

  const reviewCount = product.reviews.length;
  const averageRating =
    reviewCount > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / reviewCount
      : 0;

  return { ...product, reviewCount, averageRating };
}

// ─── generateMetadata ────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};

  const title = product.metaTitle || `${product.name} | ${siteConfig.name}`;
  const description =
    product.metaDescription ||
    product.description ||
    `Compre ${product.name} com qualidade premium. ${product.category.name} na Cabelos Premium.`;
  const canonical =
    product.canonicalUrl || `${siteUrl}/${product.slug}`;
  const keywords = product.keywords
    ? product.keywords.split(",").map((k) => k.trim())
    : [product.name, product.category.name, ...siteConfig.keywords];
  const image = product.ogImage || product.images[0] || siteConfig.ogImage;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@cabelospremium",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

// ─── JSON-LD Schema.org ───────────────────────────────────────────────────────

function ProductJsonLd({ product }: { product: NonNullable<Awaited<ReturnType<typeof getProduct>>> }) {
  const currentPrice = product.salePrice ?? product.price;
  const availability =
    product.stock > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";
  const image = product.images[0] || siteConfig.ogImage;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    sku: product.sku,
    image,
    url: `${siteUrl}/${product.slug}`,
    brand: { "@type": "Brand", name: "Cabelos Premium" },
    category: product.category.name,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/${product.slug}`,
      priceCurrency: "BRL",
      price: product.priceOnRequest ? undefined : currentPrice,
      availability,
      seller: { "@type": "Organization", name: "Cabelos Premium" },
      ...(product.salePrice && !product.priceOnRequest
        ? { priceValidUntil: new Date(Date.now() + 30 * 86400_000).toISOString().split("T")[0] }
        : {}),
    },
  };

  if (product.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.averageRating.toFixed(1),
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  // Adapta a shape para o tipo ProductDetails esperado pelo client
  const productDetails = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    salePrice: product.salePrice,
    sku: product.sku,
    stock: product.stock,
    priceOnRequest: product.priceOnRequest,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    length: product.length,
    texture: product.texture,
    color: product.color,
    weight: product.weight,
    origin: product.origin,
    images: product.images,
    category: product.category,
    averageRating: product.averageRating,
    reviewCount: product.reviewCount,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };

  return (
    <>
      <ProductJsonLd product={product} />
      <ProductPageClient product={productDetails} />
    </>
  );
}
