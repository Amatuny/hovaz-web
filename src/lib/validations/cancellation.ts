// src/lib/validations/cancellation.ts
import { z } from 'zod'

// Accepts "HVZ-48213", "hvz 48213", "HVZ48213" or just "48213".
export const confirmationCodeSchema = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase().replace(/[\s-]/g, ''))
  .transform((value) => (value.startsWith('HVZ') ? value.slice(3) : value))
  .pipe(z.string().regex(/^\d{5}$/, 'Enter the confirmation number from your booking email'))
  .transform((digits) => `HVZ-${digits}`)

export const cancellationLookupSchema = z.object({
  confirmationCode: confirmationCodeSchema,
  email: z.string().trim().toLowerCase().email('Enter the email address you booked with').max(254),
})

export const CANCELLATION_REASONS = {
  change_of_plans: 'Change of plans',
  booked_by_mistake: 'Booked by mistake',
  other: 'Other',
} as const

export type CancellationReason = keyof typeof CANCELLATION_REASONS

export const cancellationReasonSchema = z
  .enum(Object.keys(CANCELLATION_REASONS) as [CancellationReason, ...CancellationReason[]])
  .optional()

export type CancellationLookupInput = z.infer<typeof cancellationLookupSchema>
