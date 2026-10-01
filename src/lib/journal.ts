// src/lib/journal.ts
// Shared "journal card" mapping — turns tours + events into the cards shown by
// EventCard, used by both the homepage strip and the experience detail page's
// "Discover Our Events" section.
import type { EventCardData } from '@/components/ui/EventCard'
import type { Event, Tour } from '@/types/sanity'

export function formatEventDate(startDate?: string) {
  if (!startDate) return null
  const date = new Date(startDate)
  const day = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase()
  const time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return `${day} · ${time}`
}

export function isEventPast(status?: string, startDate?: string) {
  if (status === 'completed') return true
  return !!startDate && new Date(startDate).getTime() < Date.now()
}

export interface JournalCard extends EventCardData {
  key: string
  slug: string
}

export function buildJournalCards(tours: Tour[], events: Event[]): JournalCard[] {
  const tourCards: JournalCard[] = (tours ?? []).map((tour) => ({
    key: `tour-${tour._id}`,
    slug: tour.slug.current,
    href: `/experiences/${tour.slug.current}`,
    title: tour.title,
    description: tour.description,
    image: tour.mainImage,
    badgeLabel: tour.estate?.name,
    badgeKey: tour.estate?._id,
    tags: tour.tags?.length
      ? tour.tags
      : tour.tourType
        ? [tour.tourType.replace(/_/g, ' ')]
        : undefined,
    dateLabel: null,
    isPast: false,
  }))

  const eventCards: JournalCard[] = (events ?? []).map((event) => ({
    key: `event-${event._id}`,
    slug: event.slug.current,
    href: `/events/${event.slug.current}`,
    title: event.title,
    description: event.description,
    image: event.mainImage,
    badgeLabel: event.estate?.name ?? event.location,
    badgeKey: event.estate?._id ?? event.location,
    tags: event.tags?.length
      ? event.tags
      : event.eventType
        ? [event.eventType.replace(/_/g, ' ')]
        : undefined,
    dateLabel: formatEventDate(event.startDate),
    isPast: isEventPast(event.status, event.startDate),
  }))

  return [...tourCards, ...eventCards]
}
