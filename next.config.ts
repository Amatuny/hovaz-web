import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Security headers
  async headers() {
    return [
      {
        // Negative lookahead excludes /studio so it doesn't also get
        // the strict CSP below — Next.js applies ALL matching header
        // blocks cumulatively, it does not let a later, more specific
        // match override an earlier one.
        source: '/((?!studio).*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://cdn.sanity.io https://www.google-analytics.com https://www.facebook.com https://www.googletagmanager.com",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://challenges.cloudflare.com https://api.resend.com https://*.cloudflare.com",
              "frame-src 'self' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.facebook.com",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
      // Studio gets its own, more permissive CSP — Sanity's Studio UI
      // needs to reach its API/CDN, its core bridge script, and (in
      // some setups) Vercel's live preview toolbar.
      {
        source: '/studio/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.sanity-cdn.com https://vercel.live",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io",
              "connect-src 'self' https://*.sanity.io https://*.api.sanity.io https://*.sanity-cdn.com wss://*.sanity.io https://*.supabase.co wss://*.supabase.co https://vercel.live",
              "frame-src 'self' https://vercel.live",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
