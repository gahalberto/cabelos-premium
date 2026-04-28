import { MetadataRoute } from 'next';
import { siteUrl } from '@/config/metadata';
import { db } from '@/app/_lib/prisma';

// Revalida a cada 12h como fallback.
// Na prática, create-post e update-post chamam revalidatePath('/sitemap.xml')
// para forçar regeneração imediata a cada publicação.
export const revalidate = 43200;

// Data de referência para páginas verdadeiramente estáticas
const SITE_LAUNCH = new Date('2024-01-01');
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function postFrequency(updatedAt: Date): MetadataRoute.Sitemap[number]['changeFrequency'] {
  return Date.now() - updatedAt.getTime() < THIRTY_DAYS ? 'weekly' : 'monthly';
}

function postPriority(updatedAt: Date): number {
  return Date.now() - updatedAt.getTime() < THIRTY_DAYS ? 0.8 : 0.7;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, posts] = await Promise.all([
    db.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    }),
    db.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    db.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    }),
  ]);

  // lastmod do /blog = data do post mais recente
  const latestPostDate = posts[0]?.updatedAt ?? SITE_LAUNCH;
  // lastmod do /shop = produto mais recente
  const latestProductDate = products[0]?.updatedAt ?? SITE_LAUNCH;

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl,                                  lastModified: latestProductDate, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${siteUrl}/shop`,                        lastModified: latestProductDate, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${siteUrl}/blog`,                        lastModified: latestPostDate,    changeFrequency: 'daily',   priority: 0.85 },
    { url: `${siteUrl}/colecao`,                     lastModified: latestProductDate, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${siteUrl}/laces`,                       lastModified: SITE_LAUNCH,       changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${siteUrl}/megahair`,                    lastModified: SITE_LAUNCH,       changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${siteUrl}/topo-capilar`,                lastModified: SITE_LAUNCH,       changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${siteUrl}/sobre`,                       lastModified: SITE_LAUNCH,       changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/contato`,                     lastModified: SITE_LAUNCH,       changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/politica-privacidade`,        lastModified: SITE_LAUNCH,       changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${siteUrl}/termos-uso`,                  lastModified: SITE_LAUNCH,       changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/shop/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  const postUrls: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: postFrequency(p.updatedAt),
    priority: postPriority(p.updatedAt),
  }));

  return [...staticPages, ...productUrls, ...categoryUrls, ...postUrls];
}
