// src/lib/sanity/queries.ts
import { client } from '@/sanity/lib/client'
import type {
  Wine,
  Tour,
  Event,
  BlogPost,
  NewsItem,
  FaqItem,
  Page,
  SiteSettings,
} from '@/types/sanity'

// ── Site Settings ──
export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(`
    *[_type == "siteSettings"][0] {
      heroHeadline, heroSubheadline, heroImage, heroCtaText,
      email, phone, address,
      instagramWineRooms, instagramWines, facebook,
      siteName, siteDescription, defaultOgImage,
      "featuredWines": featuredWines[]->{
        _id, name, slug, mainImage, grapeVariety, vintage, wineType
      },
      "featuredTours": featuredTours[]->{
        _id, title, slug, mainImage, pricePerPerson, duration, tourType
      },
      "featuredEvents": featuredEvents[]->{
        _id, title, slug, mainImage, startDate, status, eventType
      },
      "featuredPosts": featuredBlogPosts[]->{
        _id, title, slug, featuredImage, publishedAt, excerpt, author
      }
    }
  `)
}

// ── Wines ──
export async function getAllWines(): Promise<Wine[]> {
  return client.fetch(`
    *[_type == "wine" && available == true] | order(vintage desc) {
      _id, name, slug, grapeVariety, vintage,
      region, wineType, featured, mainImage,
      description, tastingNotes
    }
  `)
}

export async function getWineBySlug(slug: string): Promise<Wine | null> {
  return client.fetch(
    `
    *[_type == "wine" && slug.current == $slug][0] {
      _id, name, slug, grapeVariety, vintage, region,
      wineType, description, tastingNotes, pairingNotes,
      alcohol, servingTemp, featured, mainImage, gallery,
      name_i18n, description_i18n, tastingNotes_i18n, seo
    }
  `,
    { slug }
  )
}

export async function getAllWineSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(`
    *[_type == "wine" && available == true] { "slug": slug.current }
  `)
}

// ── Tours ──
export async function getAllTours(): Promise<Tour[]> {
  return client.fetch(`
    *[_type == "tour" && active == true] | order(_createdAt asc) {
      _id, title, slug, description, duration,
      tourType, pricePerPerson, priceNote,
      minGroupSize, maxGroupSize, featured,
      mainImage, includedServices, ctaText
    }
  `)
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  return client.fetch(
    `
    *[_type == "tour" && slug.current == $slug][0] {
      _id, title, slug, description, duration,
      tourType, pricePerPerson, priceNote,
      minGroupSize, maxGroupSize, privateAvailable,
      featured, mainImage, gallery,
      includedServices, ctaText,
      title_i18n, description_i18n, seo
    }
  `,
    { slug }
  )
}

export async function getAllTourSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(`
    *[_type == "tour" && active == true] { "slug": slug.current }
  `)
}

// ── Events ──
export async function getUpcomingEvents(): Promise<Event[]> {
  return client.fetch(`
    *[_type == "event" && status == "upcoming"] | order(startDate asc) {
      _id, title, slug, eventType, startDate, endDate,
      location, capacity, price, priceNote,
      status, featured, mainImage, description
    }
  `)
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  return client.fetch(
    `
    *[_type == "event" && slug.current == $slug][0] {
      _id, title, slug, description, eventType,
      startDate, endDate, location, capacity,
      price, priceNote, status, featured,
      mainImage, gallery, ctaText, ctaEmail,
      title_i18n, description_i18n, seo
    }
  `,
    { slug }
  )
}

export async function getAllEventSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(`
    *[_type == "event"] { "slug": slug.current }
  `)
}

// ── Blog Posts ──
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return client.fetch(`
    *[_type == "blogPost"] | order(publishedAt desc) {
      _id, title, slug, excerpt, featuredImage,
      author, publishedAt, categories, readingTime, featured
    }
  `)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return client.fetch(
    `
    *[_type == "blogPost" && slug.current == $slug][0] {
      _id, title, slug, excerpt, featuredImage,
      body, author, publishedAt, categories,
      readingTime, featured,
      title_i18n, excerpt_i18n, seo
    }
  `,
    { slug }
  )
}

export async function getAllBlogSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(`
    *[_type == "blogPost"] { "slug": slug.current }
  `)
}

// ── News & Awards ──
export async function getAllNews(): Promise<NewsItem[]> {
  return client.fetch(`
    *[_type == "newsItem"] | order(date desc) {
      _id, title, slug, category, date, excerpt,
      featuredImage, awardOrganization, publication,
      externalUrl, featured
    }
  `)
}

export async function getNewsByCategory(category: string): Promise<NewsItem[]> {
  return client.fetch(
    `
    *[_type == "newsItem" && category == $category] | order(date desc) {
      _id, title, slug, category, date, excerpt,
      featuredImage, awardOrganization, publication,
      externalUrl, featured
    }
  `,
    { category }
  )
}

export async function getNewsItemBySlug(slug: string): Promise<NewsItem | null> {
  return client.fetch(
    `
    *[_type == "newsItem" && slug.current == $slug][0] {
      _id, title, slug, category, date, excerpt,
      body, featuredImage, awardOrganization, awardYear,
      publication, externalUrl, featured, seo
    }
  `,
    { slug }
  )
}

// ── Pages (About section) ──
export async function getPageBySlug(slug: string): Promise<Page | null> {
  return client.fetch(
    `
    *[_type == "page" && slug.current == $slug][0] {
      _id, title, slug, section, subtitle,
      featuredImage, body, ctaText, ctaLink,
      location, teamMembers,
      title_i18n, subtitle_i18n, seo
    }
  `,
    { slug }
  )
}

export async function getPagesBySection(section: string): Promise<Page[]> {
  return client.fetch(
    `
    *[_type == "page" && section == $section] | order(_createdAt asc) {
      _id, title, slug, subtitle, featuredImage
    }
  `,
    { section }
  )
}

// ── FAQ ──
export async function getFaqByCategory(category?: string): Promise<FaqItem[]> {
  const filter = category
    ? `*[_type == "faqItem" && category == $category]`
    : `*[_type == "faqItem"]`

  return client.fetch(
    `
    ${filter} | order(order asc) {
      _id, question, answer, category, order,
      question_i18n, answer_i18n
    }
  `,
    { category }
  )
}
