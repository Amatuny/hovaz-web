// src/lib/validations/newsletter.ts
import { z } from 'zod'

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),

  source: z.string().max(50).optional(),

  turnstileToken: z.string().min(1, 'Security check failed — please try again'),
})

export type NewsletterInput = z.infer<typeof newsletterSchema>
