// src/app/about/the-team/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import { getPageBySlug } from '@/lib/sanity/queries'
import { PageLayout } from '@/components/layout/PageLayout'
import { urlFor } from '@/lib/sanity/image'

export const metadata: Metadata = {
  title: 'The Team',
  description: 'Meet the people behind HOVAZ Wine Rooms.',
}

export const revalidate = 3600

export default async function TheTeamPage() {
  const page = await getPageBySlug('the-team')

  return (
    <>
      <PageLayout
        label="The People"
        title={page?.title ?? 'The Team'}
        subtitle={page?.subtitle}
        featuredImage={page?.featuredImage}
        body={page?.body}
        ctaText="Book an Experience"
        ctaLink="/events"
        backHref="/about/our-story"
        backLabel="About"
      />

      {/* Team members grid */}
      {page?.teamMembers && page.teamMembers.length > 0 && (
        <div className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
          <div className="container-content">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {page.teamMembers.map((member, i) => (
                <div key={i} className="card-wine p-6 text-center">
                  {/* Photo */}
                  <div
                    className="relative w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full"
                    style={{ backgroundColor: 'var(--color-brand-blush)' }}
                  >
                    {member.photo?.asset?._ref ? (
                      <Image
                        src={urlFor(member.photo).width(200).height(200).url()}
                        alt={member.photo.alt ?? member.name ?? ''}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
                      >
                        <span className="font-serif text-2xl text-white">
                          {member.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3
                    className="font-serif text-xl mb-1"
                    style={{ color: 'var(--color-brand-charcoal)' }}
                  >
                    {member.name}
                  </h3>
                  <p className="text-label mb-3" style={{ color: 'var(--color-brand-gold)' }}>
                    {member.role}
                  </p>
                  {member.bio && (
                    <p
                      className="text-body"
                      style={{ fontSize: '0.875rem', color: 'var(--color-brand-stone)' }}
                    >
                      {member.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
