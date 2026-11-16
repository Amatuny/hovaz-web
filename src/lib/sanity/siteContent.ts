// src/lib/sanity/siteContent.ts
// Turns raw Site Settings into ready-to-render, localized content for the
// homepage and footer. Every value falls back to src/content/defaults.ts.
import type { Locale } from '@/i18n/config'
import type { MascotSettings, SanityImage, SiteSettings } from '@/types/sanity'
import { FOOTER_DEFAULTS, HOME_DEFAULTS } from '@/content/defaults'
import type { FooterContent } from '@/components/layout/Footer'
import { pick, resolveLinks, resolveTexts, type TextSource } from './localize'

export function resolveHomeContent(settings: SiteSettings | null, locale: Locale) {
  const s = settings as TextSource

  return {
    hero: {
      headline: pick(s, 'heroHeadline', locale),
      subheadline: pick(s, 'heroSubheadline', locale),
      location: pick(s, 'heroLocation', locale),
      ctaText: pick(s, 'heroCtaText', locale),
      secondaryCtaText: pick(s, 'heroSecondaryCtaText', locale),
    },
    estates: resolveTexts(settings?.homeEstates, HOME_DEFAULTS.estates, locale),
    wineTour: resolveTexts(settings?.homeWineTour, HOME_DEFAULTS.wineTour, locale),
    wines: resolveTexts(settings?.homeWines, HOME_DEFAULTS.wines, locale),
    story: resolveTexts(settings?.homeStory, HOME_DEFAULTS.story, locale),
    storyImage: settings?.homeStory?.image as SanityImage | undefined,
    awards: resolveTexts(settings?.homeAwards, HOME_DEFAULTS.awards, locale),
    events: resolveTexts(settings?.homeEvents, HOME_DEFAULTS.events, locale),
    journal: resolveTexts(settings?.homeJournal, HOME_DEFAULTS.journal, locale),
    newsletter: resolveTexts(settings?.homeNewsletter, HOME_DEFAULTS.newsletter, locale),
    mascot: localizeMascot(settings?.mascot, locale),
  }
}

function localizeMascot(
  mascot: MascotSettings | undefined,
  locale: Locale
): MascotSettings | undefined {
  if (!mascot) return undefined
  const m = mascot as unknown as TextSource
  return {
    ...mascot,
    eyebrow: pick(m, 'eyebrow', locale) ?? HOME_DEFAULTS.mascot.eyebrow,
    storyLabel: pick(m, 'storyLabel', locale) ?? HOME_DEFAULTS.mascot.storyLabel,
    heading: pick(m, 'heading', locale),
    subtitle: pick(m, 'subtitle', locale),
    imageBadgeTitle: pick(m, 'imageBadgeTitle', locale),
    imageBadgeSubtitle: pick(m, 'imageBadgeSubtitle', locale),
    story: pick<string[]>(m, 'story', locale),
  }
}

export function resolveFooterContent(settings: SiteSettings | null, locale: Locale): FooterContent {
  const locations = (settings?.footerLocations ?? []).flatMap((loc) => {
    const name = pick(loc, 'name', locale)
    if (!name) return []
    return [
      {
        name,
        href: typeof loc.href === 'string' && loc.href ? loc.href : '#',
        detail: pick(loc, 'detail', locale) ?? '',
        hours: pick(loc, 'hours', locale) ?? '',
        isNew: loc.isNew === true,
      },
    ]
  })

  return {
    texts: resolveTexts(settings?.footer, FOOTER_DEFAULTS.texts, locale),
    exploreLinks: resolveLinks(settings?.footerExploreLinks, FOOTER_DEFAULTS.exploreLinks, locale),
    helpLinks: resolveLinks(settings?.footerHelpLinks, FOOTER_DEFAULTS.helpLinks, locale),
    locations: locations.length ? locations : FOOTER_DEFAULTS.locations,
    legalLinks: resolveLinks(settings?.footerLegalLinks, FOOTER_DEFAULTS.legalLinks, locale),
  }
}
