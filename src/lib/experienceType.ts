// src/lib/experienceType.ts
import type { BookingInput } from '@/lib/validations/booking'

// Tour.tourType / Event.eventType option values -> BookingInput's fixed enum.
// Anything not explicitly mapped falls back to 'custom'.
const EXPERIENCE_TYPE_MAP: Record<string, BookingInput['experienceType']> = {
  vineyard_walk: 'vineyard_walk',
  wine_tasting: 'wine_tasting',
  winemaking: 'winemaking_experience',
  harvest: 'harvest_experience',
  private: 'private_tour',
  group: 'group_tour',
  wine_dinner: 'wine_dinner',
  harvest_festival: 'harvest_experience',
  tasting_evening: 'wine_tasting',
  private_event: 'private_tour',
}

export function toExperienceType(typeValue?: string): BookingInput['experienceType'] {
  return typeValue ? (EXPERIENCE_TYPE_MAP[typeValue] ?? 'custom') : 'custom'
}
