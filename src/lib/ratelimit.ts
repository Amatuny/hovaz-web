// src/lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Sliding window: max 5 requests per IP per 60 minutes
export const bookingRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60 m'),
  analytics: true,
  prefix: 'hovaz:booking',
})

// Lighter limit for contact form: 10 per hour
export const contactRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60 m'),
  analytics: true,
  prefix: 'hovaz:contact',
})

// Newsletter signups: 5 per hour per IP
export const newsletterRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60 m'),
  analytics: true,
  prefix: 'hovaz:newsletter',
})
