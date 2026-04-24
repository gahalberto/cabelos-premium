import { MetadataRoute } from 'next';
import { siteUrl } from '@/config/metadata';
import { db } from '@/app/_lib/prisma';

export const revalidate = 3600;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const config = await db.storeConfig.findUnique({ where: { id: 'default' } });

  if (config?.robotsContent) {
    // Quando a agência define conteúdo customizado no painel admin, retorna raw
    // O Next.js não suporta string direta; usamos a rota abaixo para isso.
    // Aqui retornamos o padrão mas a rota /robots.txt sobrescreve.
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/checkout/',
          '/account/',
          '/dashboard/',
          '/orders/',
          '/criar-perfil/',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/verify-email',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
