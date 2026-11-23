// src/lib/sanity/pageContent.ts
// Resolves the "Pages" singletons (one per page) into localized,
// ready-to-render strings. Every value falls back to src/content/defaults.ts.
import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { defaultLocale, isLocale, type Locale } from '@/i18n/config'
import type { PageTextsDoc, WinesPageDoc } from '@/types/sanity'
import {
  CONTACT_DEFAULTS,
  EVENTS_DEFAULTS,
  NEWS_DEFAULTS,
  OUR_STORY_DEFAULTS,
  WINES_DEFAULTS,
  type EventCardLabels,
  type NewsCardLabels,
  type WineCardLabels,
} from '@/content/defaults'
import { urlFor } from './image'
import { pick, resolveTexts, type TextSource } from './localize'

/** The visitor's locale, narrowed to one the site supports. */
export async function currentLocale(): Promise<Locale> {
  const raw = await getLocale()
  return isLocale(raw) ? raw : defaultLocale
}

export function resolveWinesContent(doc: WinesPageDoc | null, locale: Locale) {
  return {
    list: resolveTexts(doc?.header, WINES_DEFAULTS.list, locale),
    hovaz: resolveTexts(doc?.hovazCollection, WINES_DEFAULTS.hovaz, locale),
    gooneh: resolveTexts(doc?.goonehCollection, WINES_DEFAULTS.gooneh, locale),
    // The detail labels are split into three boxes in Studio; merge them back
    detail: resolveTexts(
      { ...doc?.detailLabels, ...doc?.detailEvents, ...doc?.detailMore },
      WINES_DEFAULTS.detail,
      locale
    ),
    cards: resolveWineCardLabels(doc, locale),
  }
}

export function resolveWineCardLabels(doc: WinesPageDoc | null, locale: Locale): WineCardLabels {
  return {
    card: resolveTexts(doc?.card, WINES_DEFAULTS.card, locale),
    wineTypes: resolveTexts(doc?.wineTypes, WINES_DEFAULTS.wineTypes, locale),
  }
}

export function resolveEventsContent(doc: PageTextsDoc | null, locale: Locale) {
  return {
    list: resolveTexts(doc?.header, EVENTS_DEFAULTS.list, locale),
    filters: resolveTexts(doc?.filters, EVENTS_DEFAULTS.filters, locale),
    reviews: resolveTexts(doc?.reviews, EVENTS_DEFAULTS.reviews, locale),
    // Split into two boxes in Studio; merged back here
    detail: resolveTexts(
      { ...doc?.detailTop, ...doc?.detailJournal },
      EVENTS_DEFAULTS.detail,
      locale
    ),
    form: resolveTexts(doc?.form, EVENTS_DEFAULTS.form, locale),
    cards: resolveEventCardLabels(doc, locale),
  }
}

export function resolveEventCardLabels(doc: PageTextsDoc | null, locale: Locale): EventCardLabels {
  return resolveTexts(doc?.card, EVENTS_DEFAULTS.card, locale)
}

export function resolveNewsContent(doc: PageTextsDoc | null, locale: Locale) {
  return {
    list: resolveTexts(doc?.header, NEWS_DEFAULTS.list, locale),
    awards: resolveTexts(doc?.awards, NEWS_DEFAULTS.awards, locale),
    awardsPage: resolveTexts(doc?.awardsPage, NEWS_DEFAULTS.awardsPage, locale),
    stories: resolveTexts(doc?.stories, NEWS_DEFAULTS.stories, locale),
    cards: resolveNewsCardLabels(doc, locale),
  }
}

export type NewsContent = ReturnType<typeof resolveNewsContent>

export function resolveNewsCardLabels(doc: PageTextsDoc | null, locale: Locale): NewsCardLabels {
  return {
    card: resolveTexts(doc?.card, NEWS_DEFAULTS.card, locale),
    categories: resolveTexts(doc?.categories, NEWS_DEFAULTS.categories, locale),
  }
}

/**
 * A list managed in Sanity, each item resolved to the given text keys in the
 * visitor's language. Items without their first key are skipped; an empty
 * result means the built-in defaults are used.
 */
export function resolveList<K extends string>(
  items: TextSource[] | null | undefined,
  keys: readonly K[],
  defaults: Record<K, string>[],
  locale: Locale
): Record<K, string>[] {
  const resolved = (items ?? []).flatMap((item) => {
    const out = {} as Record<K, string>
    for (const key of keys) out[key] = pick<string>(item, key, locale) ?? ''
    return out[keys[0]] ? [out] : []
  })
  return resolved.length ? resolved : defaults
}

/** A CMS photo as a ready URL, or undefined so the page keeps its built-in photo. */
export interface ResolvedImage {
  src: string
  alt: string
}

function cmsImage(
  value: unknown,
  width: number,
  height: number,
  locale: Locale
): ResolvedImage | undefined {
  const image = value as (TextSource & { asset?: { _ref?: string } }) | undefined
  if (!image?.asset?._ref) return undefined
  return {
    src: urlFor(image as never)
      .width(width)
      .height(height)
      .url(),
    alt: pick<string>(image, 'alt', locale) ?? '',
  }
}

export function resolveOurStoryContent(doc: PageTextsDoc | null, locale: Locale) {
  const D = OUR_STORY_DEFAULTS
  const list = (name: string) => doc?.[name] as TextSource[] | undefined

  // Team photos come with each member; built-in members keep their static photos.
  const cmsTeam = (list('teamMembers') ?? []).flatMap((member) => {
    const name = pick<string>(member, 'name', locale)
    if (!name) return []
    return [
      {
        name,
        role: pick<string>(member, 'role', locale) ?? '',
        photo: cmsImage(member?.photo, 800, 600, locale),
      },
    ]
  })

  return {
    intro: resolveTexts(doc?.intro, D.intro, locale),
    heroImage: cmsImage(doc?.heroImage, 2400, 1136, locale),
    beginning: resolveTexts(doc?.beginning, D.beginning, locale),
    timeline: resolveList(list('timeline'), ['title', 'text'], D.timeline, locale),
    mosaicMain: cmsImage(doc?.mosaicMain, 1200, 1100, locale),
    mosaicSmall1: cmsImage(doc?.mosaicSmall1, 600, 500, locale),
    mosaicSmall2: cmsImage(doc?.mosaicSmall2, 600, 500, locale),
    mosaicCard1: resolveTexts(doc?.mosaicCard1, D.mosaicCard1, locale),
    mosaicCard2: resolveTexts(doc?.mosaicCard2, D.mosaicCard2, locale),
    values: resolveTexts(doc?.values, D.values, locale),
    valueItems: resolveList(list('valueItems'), ['title', 'text'], D.valueItems, locale),
    milestones: resolveTexts(doc?.milestones, D.milestones, locale),
    milestoneItems: resolveList(list('milestoneItems'), ['year', 'text'], D.milestoneItems, locale),
    principles: resolveTexts(doc?.principles, D.principles, locale),
    principleItems: resolveList(
      list('principleItems'),
      ['title', 'text', 'symbol'],
      D.principleItems,
      locale
    ),
    team: resolveTexts(doc?.team, D.team, locale),
    /** undefined = show the built-in team with its static photos */
    teamMembers: cmsTeam.length ? cmsTeam : undefined,
  }
}

export type OurStoryContent = ReturnType<typeof resolveOurStoryContent>

export function resolveContactContent(doc: PageTextsDoc | null, locale: Locale) {
  const D = CONTACT_DEFAULTS
  const list = (name: string) => doc?.[name] as TextSource[] | undefined
  return {
    contact: resolveTexts(doc?.contact, D.contact, locale),
    channels: resolveTexts(doc?.channels, D.channels, locale),
    addresses: resolveList(list('addresses'), ['text'], D.addresses, locale),
    form: resolveTexts(doc?.form, D.form, locale),
    faq: resolveTexts(doc?.faq, D.faq, locale),
    faqCategories: resolveTexts(doc?.faqCategories, D.faqCategories, locale),
    agencies: resolveTexts(doc?.agencies, D.agencies, locale),
    agencySpecs: resolveList(list('agencySpecs'), ['label', 'value'], D.agencySpecs, locale),
    agencyOffers: resolveList(list('agencyOffers'), ['title', 'text'], D.agencyOffers, locale),
  }
}

export type ContactContent = ReturnType<typeof resolveContactContent>

/**
 * Page metadata from a `seoMetadata` object, falling back to the given
 * title/description. Covers title, description, share image and noindex.
 */
export function seoToMetadata(
  seo: TextSource | undefined,
  locale: Locale,
  fallback: { title: string; description?: string; url?: string; image?: string }
): Metadata {
  const title = pick(seo, 'metaTitle', locale) ?? fallback.title
  const description = pick(seo, 'metaDescription', locale) ?? fallback.description
  const ogImage = seo?.ogImage as { asset?: { _ref?: string } } | undefined
  const image = ogImage?.asset?._ref
    ? urlFor(ogImage).width(1200).height(630).url()
    : fallback.image

  return {
    title,
    description,
    openGraph: {
      title: `${title} — HOVAZ`,
      description,
      ...(fallback.url ? { url: fallback.url } : {}),
      ...(image ? { images: [image] } : {}),
    },
    ...(seo?.noIndex === true ? { robots: { index: false, follow: true } } : {}),
  }
}
