import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { db } from "@/app/_lib/prisma";
import { siteUrl, siteConfig } from "@/config/metadata";
import Image from "next/image";
import Link from "next/link";

interface Props {
  params: { category: string };
}

export async function generateStaticParams() {
  const categories = await db.category.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return categories.map((c) => ({ category: c.slug }));
}

async function getCategory(slug: string) {
  return db.category.findUnique({
    where: { slug, isActive: true },
    select: {
      id: true, name: true, slug: true, description: true,
      metaTitle: true, metaDescription: true, canonicalUrl: true, keywords: true, noIndex: true,
    },
  });
}

async function getCategoryProducts(categoryId: string) {
  return db.product.findMany({
    where: { categoryId, isActive: true, stock: { gt: 0 } },
    select: {
      id: true, name: true, slug: true, price: true, salePrice: true,
      images: true, priceOnRequest: true,
    },
    orderBy: { isFeatured: "desc" },
    take: 48,
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory(params.category);
  if (!category) return {};

  const title = category.metaTitle || `${category.name} | ${siteConfig.name}`;
  const description =
    category.metaDescription ||
    category.description ||
    `Compre ${category.name} com qualidade premium. Confira nossa coleção completa.`;
  const canonical = category.canonicalUrl || `${siteUrl}/shop/${category.slug}`;
  const keywords = category.keywords
    ? category.keywords.split(",").map((k) => k.trim())
    : [category.name, ...siteConfig.keywords];

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    robots: {
      index: !category.noIndex,
      follow: !category.noIndex,
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
    },
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
}

export default async function CategoryPage({ params }: Props) {
  const category = await getCategory(params.category);
  if (!category) notFound();

  const products = await getCategoryProducts(category.id);
  const canonical = `${siteUrl}/shop/${category.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description ?? undefined,
    url: canonical,
    numberOfItems: products.length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-500" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-gray-700">Home</Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-gray-700">Loja</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{category.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Cabeçalho da categoria */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
            {category.description && (
              <p className="text-gray-600 max-w-2xl">{category.description}</p>
            )}
            <p className="text-sm text-gray-400 mt-1">{products.length} produto{products.length !== 1 ? "s" : ""}</p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">Nenhum produto disponível nesta categoria.</p>
              <Link href="/shop" className="mt-4 inline-block text-sm underline hover:text-gray-700">
                Ver todos os produtos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/${product.slug}`}
                  className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={product.images[0] || "/images/no-image.png"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h2>
                    {product.priceOnRequest ? (
                      <span className="text-amber-700 font-medium text-sm">Sob consulta</span>
                    ) : (
                      <div>
                        {product.salePrice && product.salePrice < product.price && (
                          <p className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</p>
                        )}
                        <p className="font-bold text-gray-900">
                          {formatPrice(product.salePrice ?? product.price)}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 underline"
            >
              ← Ver todos os produtos com filtros avançados
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
