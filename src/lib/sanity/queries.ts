// src/lib/sanity/queries.ts
import { client } from '@/sanity/lib/client'
import type {
  Wine,
  Tour,
  ExperienceTour,
  Event,
  BlogPost,
  NewsItem,
  FaqItem,
  Page,
  SiteSettings,
  Estate,
  Testimonial,
} from '@/types/sanity'

// `imageWithAlt` stores the actual image one level deeper (`asset.asset._ref`)
// than a plain Sanity `image` field — this projection flattens it back to
// `{alt, caption, asset: {_ref, _type}}` so every component's `image.asset._ref`
// / `urlFor(image)` calls resolve correctly.
const IMAGE_FIELDS = `alt, caption, "asset": asset.asset`

// ── Estates ──
export async function getAllEstates(): Promise<Estate[]> {
  return client.fetch(`
    *[_type == "estate"] | order(order asc) {
      _id, name, description, tagline, "mainImage": mainImage{${IMAGE_FIELDS}},
      "heroImage": heroImage{${IMAGE_FIELDS}}, heroHeading,
      "gallery": gallery[]{${IMAGE_FIELDS}},
      eventsCount, link, order
    }
  `)
}

// ── Site Settings ──
export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(`
    *[_type == "siteSettings"][0] {
      heroHeadline, heroSubheadline, heroLocation, heroCtaText,
      "heroGallery": heroGallery[]{${IMAGE_FIELDS}},
      "wineTourGallery": wineTourGallery[]{${IMAGE_FIELDS}},
      email, phone, whatsapp, viber, telegram, address,
      instagramWineRooms, instagramWines, facebook,
      siteName, siteDescription, defaultOgImage,
      "featuredWines": featuredWines[]->{
        _id, name, slug, "mainImage": mainImage{${IMAGE_FIELDS}}, grapeVariety, vintage, wineType
      },
      "featuredTours": featuredTours[]->{
        _id, title, slug, "mainImage": mainImage{${IMAGE_FIELDS}}, pricePerPerson, duration, tourType
      },
      "featuredEvents": featuredEvents[]->{
        _id, title, slug, "mainImage": mainImage{${IMAGE_FIELDS}}, startDate, status, eventType
      },
      "featuredPosts": featuredBlogPosts[]->{
        _id, title, slug, "featuredImage": featuredImage{${IMAGE_FIELDS}}, publishedAt, excerpt, author
      }
    }
  `)
}

// ── Wines ──
export async function getAllWines(): Promise<Wine[]> {
  return client.fetch(`
    *[_type == "wine" && available == true] | order(vintage desc) {
      _id, name, slug, grapeVariety, vintage,
      region, wineType, collection, featured, "mainImage": mainImage{${IMAGE_FIELDS}},
      description, tastingNotes, tastingTags
    }
  `)
}

export async function getWineBySlug(slug: string): Promise<Wine | null> {
  return client.fetch(
    `
    *[_type == "wine" && slug.current == $slug][0] {
      _id, name, slug, grapeVariety, vintage, region,
      wineType, collection, description, tastingNotes, tastingTags, pairingNotes,
      alcohol, servingTemp, featured,
      award, pairWith, perfectFor, agingNotes, bottleSize,
      storyIntro, grapeStoryText, howWeDecidedTitle, howWeDecidedText, storyOutro,
      "relatedEvents": relatedEvents[]->{
        _id, title, slug, startDate, location, status
      },
      "mainImage": mainImage{${IMAGE_FIELDS}},
      "gallery": gallery[]{${IMAGE_FIELDS}},
      name_i18n, description_i18n, tastingNotes_i18n, seo
    }
  `,
    { slug }
  )
}

// Other available wines, for the "Wines of the Valley" teaser on a wine's own detail page
export async function getOtherWines(excludeSlug: string): Promise<Wine[]> {
  return client.fetch(
    `
    *[_type == "wine" && available == true && slug.current != $excludeSlug] | order(vintage desc) {
      _id, name, slug, grapeVariety, vintage,
      region, wineType, collection, featured, "mainImage": mainImage{${IMAGE_FIELDS}},
      description, tastingNotes, tastingTags
    }
  `,
    { excludeSlug }
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
      "mainImage": mainImage{${IMAGE_FIELDS}},
      "gallery": gallery[]{${IMAGE_FIELDS}},
      includedServices, ctaText,
      "estate": estate->{_id, name}, tags
    }
  `)
}

export async function getTourBySlug(slug: string): Promise<ExperienceTour | null> {
  return client.fetch(
    `
    *[_type == "tour" && slug.current == $slug][0] {
      _id, title, slug, description, duration,
      tourType, pricePerPerson, priceNote,
      minGroupSize, maxGroupSize, privateAvailable,
      featured,
      "mainImage": mainImage{${IMAGE_FIELDS}},
      "gallery": gallery[]{${IMAGE_FIELDS}},
      includesHeading, experienceHeading,
      includedServices, ctaText,
      "estate": estate->{
        _id, name, tagline,
        foodOptions[]{_key, name, priceAmd},
        menuItems[]{_key, course, dish, pairing, "image": image{${IMAGE_FIELDS}}},
        "menuUrl": menuFile.asset->url
      },
      "addOnEvents": addOnEvents[]->{
        _id, title, slug, "mainImage": mainImage{${IMAGE_FIELDS}},
        location, "estate": estate->{_id, name}
      },
      tags,
      title_i18n, description_i18n, seo
    }
  `,
    { slug }
  )
}

export async function tourSlugExists(slug: string): Promise<boolean> {
  const count: number = await client.fetch(`count(*[_type == "tour" && slug.current == $slug])`, {
    slug,
  })
  return count > 0
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
      status, featured, "mainImage": mainImage{${IMAGE_FIELDS}}, description
    }
  `)
}

// Mixes upcoming and recently-completed events for the homepage journal strip,
// where past events are shown alongside what's coming next.
export async function getJournalEvents(): Promise<Event[]> {
  return client.fetch(`
    *[_type == "event" && status in ["upcoming", "completed"]] | order(startDate desc) [0...8] {
      _id, title, slug, eventType, startDate, endDate,
      location, capacity, price, priceNote,
      status, featured, "mainImage": mainImage{${IMAGE_FIELDS}}, description,
      "estate": estate->{_id, name}, tags
    }
  `)
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  return client.fetch(
    `
    *[_type == "event" && slug.current == $slug][0] {
      _id, title, slug, description, eventType,
      startDate, endDate, location, duration, capacity,
      price, priceNote, status, featured,
      "mainImage": mainImage{${IMAGE_FIELDS}},
      "gallery": gallery[]{${IMAGE_FIELDS}},
      includesHeading,
      ctaText, ctaEmail,
      "estate": estate->{_id, name, tagline}, tags,
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

// Full event listing (any status except cancelled) with tags/location for the
// events browse page's search, date and location filters.
export async function getAllEventsForListing(): Promise<Event[]> {
  return client.fetch(`
    *[_type == "event" && status != "cancelled"] | order(startDate asc) {
      _id, title, slug, eventType, startDate, endDate,
      location, capacity, price, priceNote,
      status, featured, "mainImage": mainImage{${IMAGE_FIELDS}}, description, tags,
      "estate": estate->{_id, name}
    }
  `)
}

// ── Testimonials ──
export async function getTestimonials(): Promise<Testimonial[]> {
  return client.fetch(`
    *[_type == "testimonial"] | order(order asc) {
      _id, guestName, quote, rating, context, "avatar": avatar{${IMAGE_FIELDS}}, order
    }
  `)
}

// ── Blog Posts ──
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return client.fetch(`
    *[_type == "blogPost"] | order(publishedAt desc) {
      _id, title, slug, excerpt, "featuredImage": featuredImage{${IMAGE_FIELDS}},
      author, publishedAt, categories, readingTime, featured
    }
  `)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return client.fetch(
    `
    *[_type == "blogPost" && slug.current == $slug][0] {
      _id, title, slug, excerpt, "featuredImage": featuredImage{${IMAGE_FIELDS}},
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
      "featuredImage": featuredImage{${IMAGE_FIELDS}}, awardOrganization, awardYear, awardTier,
      awardedWine, publication, externalUrl, featured
    }
  `)
}

export async function getNewsByCategory(category: string): Promise<NewsItem[]> {
  return client.fetch(
    `
    *[_type == "newsItem" && category == $category] | order(date desc) {
      _id, title, slug, category, date, excerpt,
      "featuredImage": featuredImage{${IMAGE_FIELDS}}, awardOrganization, publication,
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
      body, "featuredImage": featuredImage{${IMAGE_FIELDS}}, awardOrganization, awardYear,
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
      "featuredImage": featuredImage{${IMAGE_FIELDS}}, body, ctaText, ctaLink,
      imageBadgeTitle, imageBadgeSubtitle,
      "gallery": gallery[]{${IMAGE_FIELDS}},
      location,
      "teamMembers": teamMembers[]{name, role, bio, "photo": photo{${IMAGE_FIELDS}}},
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
      _id, title, slug, subtitle, "featuredImage": featuredImage{${IMAGE_FIELDS}}
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
