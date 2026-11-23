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

/** Armenian/Russian versions of a field, stored as `<field>_i18n` (see translatable() schema helper). English is the field itself. */
export interface Translations<T = string> {
  hy?: T
  ru?: T
}

export type LocalizedString = Translations<string>
export type LocalizedText = Translations<string>

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

/** A News & Awards item with category "award", as listed on /awards */
export interface AwardItem {
  _id: string
  title: string
  excerpt?: string
  date?: string
  featuredImage?: SanityImage
  awardOrganization?: string
  awardYear?: number
  awardTier?: string
  awardedWine?: string
  awardWineLine?: string
  wine?: Pick<Wine, 'name' | 'slug' | 'grapeVariety' | 'vintage' | 'mainImage'> | null
  [key: `${string}_i18n`]: Record<string, string> | undefined
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

export interface MascotSettings {
  eyebrow?: string
  storyLabel?: string
  heading?: string
  subtitle?: string
  image?: SanityImage
  imageBadgeTitle?: string
  imageBadgeSubtitle?: string
  story?: string[]
  gallery?: SanityImage[]
  certificate?: SanityImage
}

export interface NavSubItem {
  _key: string
  label?: string
  label_i18n?: { hy?: string; ru?: string }
  href?: string
}

export interface NavItem extends NavSubItem {
  children?: NavSubItem[]
}

/** Raw Sanity object of translatable texts — resolve with resolveTexts() */
export type TextSource = Record<string, unknown>

/** Any "Pages" singleton: named groups of translatable texts, plus `seo`. */
export type PageTextsDoc = { [group: string]: TextSource | undefined }

/** "Our Wines Page" singleton — raw text groups, resolved by resolveWinesContent() */
export interface WinesPageDoc {
  header?: TextSource
  hovazCollection?: TextSource
  goonehCollection?: TextSource
  detailLabels?: TextSource
  detailEvents?: TextSource
  detailMore?: TextSource
  card?: TextSource
  wineTypes?: TextSource
  seo?: TextSource
}

export interface SiteSettings {
  navigation?: NavItem[]
  homeEstates?: TextSource
  homeWineTour?: TextSource
  homeWines?: TextSource
  homeStory?: TextSource
  homeAwards?: TextSource
  homeEvents?: TextSource
  homeJournal?: TextSource
  homeNewsletter?: TextSource
  footer?: TextSource
  footerExploreLinks?: TextSource[]
  footerHelpLinks?: TextSource[]
  footerLocations?: TextSource[]
  footerLegalLinks?: TextSource[]
  heroHeadline_i18n?: LocalizedString
  heroSubheadline_i18n?: LocalizedString
  heroLocation_i18n?: LocalizedString
  heroCtaText_i18n?: LocalizedString
  heroSecondaryCtaText_i18n?: LocalizedString
  heroHeadline?: string
  heroSubheadline?: string
  heroLocation?: string
  heroGallery?: SanityImage[]
  wineTourGallery?: SanityImage[]
  ageGateImage?: SanityImage
  mascot?: MascotSettings
  heroCtaText?: string
  heroSecondaryCtaText?: string
  email?: string
  phone?: string
  whatsapp?: string
  viber?: string
  telegram?: string
  instagramWineRooms?: string
  instagramWines?: string
  facebook?: string
}
