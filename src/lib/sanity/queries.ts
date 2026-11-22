// src/lib/sanity/queries.ts
import { client } from '@/sanity/lib/client'
import type {
  Wine,
  Tour,
  ExperienceTour,
  Event,
  NewsItem,
  FaqItem,
  SiteSettings,
  Estate,
  Testimonial,
  WinesPageDoc,
  PageTextsDoc,
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
      heroHeadline, heroSubheadline, heroLocation, heroCtaText, heroSecondaryCtaText,
      heroHeadline_i18n, heroSubheadline_i18n, heroLocation_i18n, heroCtaText_i18n,
      heroSecondaryCtaText_i18n,
      "heroGallery": heroGallery[]{${IMAGE_FIELDS}},
      "wineTourGallery": wineTourGallery[]{${IMAGE_FIELDS}},
      "ageGateImage": ageGateImage{${IMAGE_FIELDS}},
      homeEstates, homeWineTour, homeWines, homeAwards,
      "homeStory": homeStory{..., "image": image{${IMAGE_FIELDS}}},
      homeEvents, homeJournal, homeNewsletter,
      footer, footerExploreLinks, footerHelpLinks, footerLocations, footerLegalLinks,
      "navigation": navigation[]{
        _key, label, label_i18n, href,
        "children": children[]{ _key, label, label_i18n, href }
      },
      "mascot": mascot{
        ...,
        "image": image{${IMAGE_FIELDS}},
        "gallery": gallery[]{${IMAGE_FIELDS}}
      },
      email, phone, whatsapp, viber, telegram,
      instagramWineRooms, instagramWines, facebook
    }
  `)
}

// ── Page texts (singletons) ──
// Whole documents, so every text field and its `_i18n` translations come along.
export async function getWinesPage(): Promise<WinesPageDoc | null> {
  return client.fetch(`*[_type == "winesPage" && _id == "winesPage"][0]`)
}

export async function getEventsPage(): Promise<PageTextsDoc | null> {
  return client.fetch(`*[_type == "eventsPage" && _id == "eventsPage"][0]`)
}

export async function getNewsPage(): Promise<PageTextsDoc | null> {
  return client.fetch(`*[_type == "newsPage" && _id == "newsPage"][0]`)
}

export async function getContactPage(): Promise<PageTextsDoc | null> {
  return client.fetch(`*[_type == "contactPage" && _id == "contactPage"][0]`)
}

export async function getOurStoryPage(): Promise<PageTextsDoc | null> {
  return client.fetch(`
    *[_type == "ourStoryPage" && _id == "ourStoryPage"][0] {
      ...,
      "heroImage": heroImage{${IMAGE_FIELDS}},
      "mosaicMain": mosaicMain{${IMAGE_FIELDS}},
      "mosaicSmall1": mosaicSmall1{${IMAGE_FIELDS}},
      "mosaicSmall2": mosaicSmall2{${IMAGE_FIELDS}},
      "teamMembers": teamMembers[]{..., "photo": photo{${IMAGE_FIELDS}}}
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

// The single soonest upcoming event — featured on the 404 page's "Next Up" card.
export async function getNextUpcomingEvent(): Promise<Event | null> {
  return client.fetch(
    `
    *[_type == "event" && status == "upcoming" && startDate >= $now] | order(startDate asc) [0] {
      _id, title, slug, startDate, location,
      "mainImage": mainImage{${IMAGE_FIELDS}},
      "estate": estate->{_id, name}
    }
  `,
    { now: new Date().toISOString() }
  )
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

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  return client.fetch(
    `
    *[_type == "newsItem" && slug.current == $slug][0] {
      _id, title, slug, category, date, excerpt, place, intro, body, quote,
      detailsTitle, detailsText, highlights[]{_key, label, text},
      "featuredImage": featuredImage{${IMAGE_FIELDS}},
      "gallery": gallery[]{${IMAGE_FIELDS}},
      externalUrl, seo
    }
  `,
    { slug }
  )
}

export async function getAllNewsSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(`*[_type == "newsItem" && defined(slug.current)]{ "slug": slug.current }`)
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
