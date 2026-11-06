import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/app/', '/admin/', '/auth/', '/cart', '/order'],
      },
    ],
    sitemap: 'https://peptidelifewellness.com/sitemap.xml',
  };
}
