// src/app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

// Sanity sends this secret to verify the request is genuine
const REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET

export async function POST(request: Request) {
  // ── 1. Verify secret ──
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (!REVALIDATE_SECRET) {
    logger.error('SANITY_REVALIDATE_SECRET not configured')
    return NextResponse.json({ error: 'Revalidation not configured' }, { status: 500 })
  }

  if (secret !== REVALIDATE_SECRET) {
    logger.warn('Invalid revalidation secret attempt')
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  // ── 2. Parse webhook body ──
  let body: { _type?: string; slug?: { current?: string } } = {}
  try {
    body = await request.json()
  } catch {
    // Body is optional — revalidate everything if no body
  }

  const documentType = body._type
  const slug = body.slug?.current

  logger.info('Revalidation triggered', { documentType, slug })

  // ── 3. Revalidate based on document type ──
  try {
    switch (documentType) {
      case 'wine':
        revalidatePath('/wines')
        revalidatePath('/')
        if (slug) revalidatePath(`/wines/${slug}`)
        break

      case 'tour':
        revalidatePath('/events')
        revalidatePath('/experiences')
        revalidatePath('/estates')
        revalidatePath('/')
        if (slug) revalidatePath(`/experiences/${slug}`)
        break

      case 'event':
        revalidatePath('/events')
        revalidatePath('/')
        if (slug) revalidatePath(`/events/${slug}`)
        // Events appear as add-ons and journal cards on experience pages.
        revalidatePath('/experiences/[slug]', 'page')
        break

      case 'estate':
        revalidatePath('/experiences')
        revalidatePath('/estates')
        // Experience pages show their estate's menu and booking food options.
        revalidatePath('/experiences/[slug]', 'page')
        revalidatePath('/')
        break

      case 'blogPost':
        revalidatePath('/')
        if (slug) revalidatePath(`/blog/${slug}`)
        break

      case 'newsItem':
        revalidatePath('/news')
        revalidatePath('/news/awards')
        revalidatePath('/news/press')
        revalidatePath('/news/brand-news')
        // Every article shows "Up Next" and "More Stories" from the other items.
        revalidatePath('/news/[slug]', 'page')
        break

      case 'page':
        // The only page document left is Our Story, shown on the homepage.
        revalidatePath('/')
        break

      case 'faqItem':
        revalidatePath('/contact/faq')
        break

      case 'siteSettings':
        // Site settings affect every page
        revalidatePath('/', 'layout')
        break

      default:
        // Unknown type — revalidate everything
        revalidatePath('/', 'layout')
        logger.info('Unknown document type — revalidating all', { documentType })
    }

    return NextResponse.json({
      revalidated: true,
      documentType,
      slug,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('Revalidation failed', error)
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}

// Also handle GET for easy testing
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  revalidatePath('/', 'layout')

  return NextResponse.json({
    revalidated: true,
    message: 'Full site revalidation triggered',
    timestamp: new Date().toISOString(),
  })
}
