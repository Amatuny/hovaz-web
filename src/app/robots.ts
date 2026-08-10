// src/app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/studio/', '/admin', '/admin/', '/api/', '/login'],
      },
    ],
    sitemap: 'https://hovazwines.com/sitemap.xml',
    host: 'https://hovazwines.com',
  }
}
