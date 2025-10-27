import { MetadataRoute } from 'next';
import { siteUrl } from '@/config/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl;

  // Páginas estáticas principais
  const staticPages = [
    '',
    '/sobre',
    '/shop',
    '/contato',
    '/colecao',
    '/lancamento',
    '/torne-se-expert',
    '/politica-privacidade',
    '/termos-uso',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [...staticPages];
}

