// src/lib/validations/booking.ts
import { z } from 'zod'

export const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),

  email: z.string().email('Please enter a valid email address'),

  phone: z.string().min(6, 'Please enter a valid phone number').max(30, 'Phone number is too long'),

  experienceType: z.enum(
    [
      'wine_tasting',
      'vineyard_walk',
      'private_tour',
      'group_tour',
      'winemaking_experience',
      'harvest_experience',
      'wine_dinner',
      'custom',
    ] as const,
    {
      error: 'Please select a valid experience type',
    }
  ),

  preferredDate: z
    .string()
    .min(1, 'Please select a preferred date')
    .refine((date) => {
      const selected = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selected >= today
    }, 'Date must be today or in the future'),

  // 24h "HH:mm". Stored in notes (there's no column for it) and used to spot
  // a duplicate booking for the same slot.
  preferredTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Choose a valid time')
    .optional(),

  groupSize: z
    .number()
    .int('Group size must be a whole number')
    .min(1, 'Group size must be at least 1')
    .max(100, 'Please contact us for groups over 100'),

  notes: z.string().max(1000, 'Notes are too long').optional(),

  // Shown back to the guest when they manage the booking.
  estate: z.string().trim().max(120).optional(),
  experienceName: z.string().trim().max(200).optional(),
  addOns: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(120),
        quantity: z.number().int().min(1).max(100),
      })
    )
    .max(20)
    .optional(),
  depositAmd: z.number().int().min(0).max(100_000_000).optional(),

  turnstileToken: z.string().min(1, 'Security check failed — please try again'),
})

export type BookingInput = z.infer<typeof bookingSchema>
