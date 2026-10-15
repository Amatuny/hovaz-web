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
  tagline?: string
}

export interface FoodOption {
  _key: string
  name: string
  priceAmd: number
}

export interface MenuItem {
  _key: string
  course?: string
  dish: string
  pairing?: string
  image?: SanityImage
}

// The estate as expanded on an experience detail page — adds what the
// booking form's "Add Food" step and the menu section need.
export interface ExperienceEstate extends EstateRef {
  foodOptions?: FoodOption[]
  menuItems?: MenuItem[]
  menuUrl?: string
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
  experienceHeading?: string
  includedServices?: string[]
  estate?: EstateRef
  addOnEvents?: Event[]
  tags?: string[]
  ctaText?: string
  mainImage?: SanityImage
  gallery?: SanityImage[]
  includesHeading?: string
  title_i18n?: LocalizedString
  description_i18n?: LocalizedText
  seo?: SeoMetadata
}

export interface ExperienceTour extends Omit<Tour, 'estate'> {
  estate?: ExperienceEstate
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
  duration?: string
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
  includesHeading?: string
  title_i18n?: LocalizedString
  description_i18n?: LocalizedText
  seo?: SeoMetadata
}

export interface Testimonial {
  _id: string
  guestName: string
  quote: string
  rating?: number
  context?: string
  avatar?: SanityImage
  order?: number
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
  category?: 'award' | 'press' | 'brand_news' | 'release' | 'event'
  date?: string
  excerpt?: string
  featuredImage?: SanityImage
  body?: SanityBlock[]
  place?: string
  intro?: string
  gallery?: SanityImage[]
  highlights?: { _key: string; label: string; text: string }[]
  quote?: string
  detailsTitle?: string
  detailsText?: string
  awardOrganization?: string
  awardYear?: number
  awardTier?: string
  awardedWine?: string
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
  tagline?: string
  mainImage: SanityImage
  heroImage?: SanityImage
  heroHeading?: string
  gallery?: SanityImage[]
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
  title_i18n?: LocalizedString
  subtitle_i18n?: LocalizedString
  seo?: SeoMetadata
}

export interface MascotSettings {
  heading?: string
  subtitle?: string
  image?: SanityImage
  imageBadgeTitle?: string
  imageBadgeSubtitle?: string
  story?: string[]
  gallery?: SanityImage[]
}

export interface SiteSettings {
  heroHeadline?: string
  heroSubheadline?: string
  heroLocation?: string
  heroGallery?: SanityImage[]
  wineTourGallery?: SanityImage[]
  mascot?: MascotSettings
  heroCtaText?: string
  featuredWines?: Wine[]
  featuredTours?: Tour[]
  featuredEvents?: Event[]
  featuredPosts?: BlogPost[]
  email?: string
  phone?: string
  whatsapp?: string
  viber?: string
  telegram?: string
  address?: string
  instagramWineRooms?: string
  instagramWines?: string
  facebook?: string
  siteName?: string
  siteDescription?: string
  defaultOgImage?: SanityImage
  googleVerification?: string
}
