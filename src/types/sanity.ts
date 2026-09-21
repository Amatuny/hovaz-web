// src/types/sanity.ts
// Shared TypeScript types for all Sanity content

export interface SanityImage {
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  alt?: string
  caption?: string
}

export interface SanitySlug {
  current: string
}

export interface SanityBlock {
  _type: 'block'
  _key: string
  style?: string
  children: {
    _type: 'span'
    _key: string
    text: string
    marks?: string[]
  }[]
  markDefs?: {
    _type: string
    _key: string
    href?: string
    blank?: boolean
  }[]
}

export interface LocalizedString {
  en?: string
  hy?: string
  ru?: string
}

export interface LocalizedText {
  en?: string
  hy?: string
  ru?: string
}

export interface SeoMetadata {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
  noIndex?: boolean
}

// ── Document types ──

export interface Wine {
  _id: string
  name: string
  slug: SanitySlug
  grapeVariety?: string
  vintage?: number
  region?: string
  wineType?: 'red' | 'white' | 'rose' | 'sparkling' | 'orange' | 'dessert'
  collection?: 'hovaz' | 'gooneh'
  description?: string
  tastingNotes?: string
  tastingTags?: string[]
  pairingNotes?: string
  alcohol?: number
  servingTemp?: string
  featured?: boolean
  available?: boolean
  award?: string
  pairWith?: string[]
  perfectFor?: string[]
  agingNotes?: string
  bottleSize?: string
  relatedEvents?: Event[]
  storyIntro?: string
  grapeStoryText?: string
  howWeDecidedTitle?: string
  howWeDecidedText?: string
  storyOutro?: string[]
  mainImage?: SanityImage
  gallery?: SanityImage[]
  name_i18n?: LocalizedString
  description_i18n?: LocalizedText
  tastingNotes_i18n?: LocalizedText
  seo?: SeoMetadata
}

export interface EstateRef {
  _id: string
  name: string
}

export interface Tour {
  _id: string
  title: string
  slug: SanitySlug
  description?: string
  duration?: string
  tourType?: string
  pricePerPerson?: number
  priceNote?: string
  minGroupSize?: number
  maxGroupSize?: number
  privateAvailable?: boolean
  featured?: boolean
  active?: boolean
  includedServices?: string[]
  estate?: EstateRef
  tags?: string[]
  ctaText?: string
  mainImage?: SanityImage
  gallery?: SanityImage[]
  title_i18n?: LocalizedString
  description_i18n?: LocalizedText
  seo?: SeoMetadata
}

export interface Event {
  _id: string
  title: string
  slug: SanitySlug
  description?: string
  eventType?: string
  startDate?: string
  endDate?: string
  location?: string
  estate?: EstateRef
  tags?: string[]
  capacity?: number
  price?: number
  priceNote?: string
  status?: 'upcoming' | 'sold_out' | 'cancelled' | 'completed'
  featured?: boolean
  ctaText?: string
  ctaEmail?: string
  mainImage?: SanityImage
  gallery?: SanityImage[]
  title_i18n?: LocalizedString
  description_i18n?: LocalizedText
  seo?: SeoMetadata
}

export interface BlogPost {
  _id: string
  title: string
  slug: SanitySlug
  excerpt?: string
  featuredImage?: SanityImage
  body?: SanityBlock[]
  author?: string
  publishedAt?: string
  categories?: string[]
  readingTime?: number
  featured?: boolean
  title_i18n?: LocalizedString
  excerpt_i18n?: LocalizedText
  seo?: SeoMetadata
}

export interface NewsItem {
  _id: string
  title: string
  slug: SanitySlug
  category?: 'award' | 'press' | 'brand_news'
  date?: string
  excerpt?: string
  featuredImage?: SanityImage
  body?: SanityBlock[]
  awardOrganization?: string
  awardYear?: number
  awardTier?: string
  publication?: string
  externalUrl?: string
  featured?: boolean
  seo?: SeoMetadata
}

export interface FaqItem {
  _id: string
  question: string
  answer: string
  category?: string
  order?: number
  question_i18n?: LocalizedString
  answer_i18n?: LocalizedText
}

export interface Estate {
  _id: string
  name: string
  description: string
  mainImage: SanityImage
  eventsCount: number
  link: string
  order?: number
}

export interface Page {
  _id: string
  title: string
  slug: SanitySlug
  section?: 'about' | 'contact' | 'other'
  subtitle?: string
  featuredImage?: SanityImage
  body?: SanityBlock[]
  ctaText?: string
  ctaLink?: string
  imageBadgeTitle?: string
  imageBadgeSubtitle?: string
  gallery?: SanityImage[]
  location?: {
    address?: string
    phone?: string
    email?: string
    googleMapsUrl?: string
    openingHours?: string
  }
  teamMembers?: {
    name?: string
    role?: string
    bio?: string
    photo?: SanityImage
  }[]
  title_i18n?: LocalizedString
  subtitle_i18n?: LocalizedString
  seo?: SeoMetadata
}

export interface SiteSettings {
  heroHeadline?: string
  heroSubheadline?: string
  heroLocation?: string
  heroGallery?: SanityImage[]
  wineTourGallery?: SanityImage[]
  heroCtaText?: string
  featuredWines?: Wine[]
  featuredTours?: Tour[]
  featuredEvents?: Event[]
  featuredPosts?: BlogPost[]
  email?: string
  phone?: string
  address?: string
  instagramWineRooms?: string
  instagramWines?: string
  facebook?: string
  siteName?: string
  siteDescription?: string
  defaultOgImage?: SanityImage
  googleVerification?: string
}
