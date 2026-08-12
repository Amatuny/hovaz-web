// src/lib/validations/contact.ts
import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),

  email: z.string().email('Please enter a valid email address'),

  phone: z.string().max(30, 'Phone number is too long').optional(),

  subject: z.string().max(200, 'Subject is too long').optional(),

  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message is too long'),

  turnstileToken: z.string().min(1, 'Security check failed — please try again'),
})

export type ContactInput = z.infer<typeof contactSchema>
