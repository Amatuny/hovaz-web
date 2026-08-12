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
        revalidatePath('/')
        if (slug) revalidatePath(`/events/${slug}`)
        break

      case 'event':
        revalidatePath('/events')
        revalidatePath('/events/whats-on')
        revalidatePath('/')
        if (slug) revalidatePath(`/events/${slug}`)
        break

      case 'blogPost':
        revalidatePath('/blog')
        revalidatePath('/')
        if (slug) revalidatePath(`/blog/${slug}`)
        break

      case 'newsItem':
        revalidatePath('/news/awards')
        revalidatePath('/news/press')
        revalidatePath('/news/brand-news')
        break

      case 'page':
        if (slug) revalidatePath(`/about/${slug}`)
        revalidatePath('/contact')
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
