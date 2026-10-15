// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import {
  getAllWineSlugs,
  getAllTourSlugs,
  getAllBlogSlugs,
  getAllEventSlugs,
  getAllNewsSlugs,
} from '@/lib/sanity/queries'

const BASE_URL = 'https://hovazwines.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [wineSlugs, tourSlugs, blogSlugs, eventSlugs, newsSlugs] = await Promise.all([
    getAllWineSlugs(),
    getAllTourSlugs(),
    getAllBlogSlugs(),
    getAllEventSlugs(),
    getAllNewsSlugs(),
  ])

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/wines`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/experiences`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/estates`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about/our-story`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/news/awards`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/news/press`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/news/brand-news`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact/agencies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact/form`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  // Dynamic wine pages
  const winePages: MetadataRoute.Sitemap = wineSlugs.map(({ slug }) => ({
    url: `${BASE_URL}/wines/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Dynamic tour/experience pages
  const tourPages: MetadataRoute.Sitemap = tourSlugs.map(({ slug }) => ({
    url: `${BASE_URL}/experiences/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Dynamic event pages
  const eventPages: MetadataRoute.Sitemap = eventSlugs.map(({ slug }) => ({
    url: `${BASE_URL}/events/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Dynamic blog pages
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map(({ slug }) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // Dynamic news articles
  const newsPages: MetadataRoute.Sitemap = newsSlugs.map(({ slug }) => ({
    url: `${BASE_URL}/news/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...winePages, ...tourPages, ...eventPages, ...blogPages, ...newsPages]
}
