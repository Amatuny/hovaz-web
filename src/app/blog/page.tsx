// src/app/blog/page.tsx
import type { Metadata } from 'next'
import { getAllBlogPosts } from '@/lib/sanity/queries'
import { BlogCard } from '@/components/ui/BlogCard'

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'Stories, guides and insights from HOVAZ Wine Rooms — Armenian wine, culture and hospitality.',
  openGraph: {
    title: 'Journal — HOVAZ',
    description: 'Stories and insights from HOVAZ Wine Rooms.',
    url: 'https://hovazwines.com/blog',
  },
}

export const revalidate = 3600

const categoryLabels: Record<string, string> = {
  wine_education: 'Wine Education',
  armenian_wine: 'Armenian Wine',
  behind_scenes: 'Behind the Scenes',
  events_news: 'Events & News',
  food_pairing: 'Food & Pairing',
  travel_lifestyle: 'Travel & Lifestyle',
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts()
  const featuredPost = posts.find((p) => p.featured) ?? posts[0]
  const remainingPosts = posts.filter((p) => p._id !== featuredPost?._id)

  // Get unique categories
  const categories = Array.from(new Set(posts.flatMap((p) => p.categories ?? [])))

  return (
    <>
      {/* Page header */}
      <div className="pt-32 pb-16" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
        <div className="container-content text-center">
          <p className="text-label mb-4" style={{ color: 'var(--color-brand-gold)' }}>
            Stories & Insights
          </p>
          <h1 className="heading-display mb-6">The Journal</h1>
          <p
            className="text-body max-w-prose mx-auto"
            style={{ color: 'var(--color-brand-stone)' }}
          >
            Dispatches from the vineyard — wine education, Armenian culture, and stories from behind
            the cellar door.
          </p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="section-padding text-center" style={{ backgroundColor: 'white' }}>
          <p className="text-body" style={{ color: 'var(--color-brand-stone)' }}>
            No posts yet — check back soon.
          </p>
        </div>
      ) : (
        <>
          {/* Featured post */}
          {featuredPost && (
            <div className="section-padding-sm" style={{ backgroundColor: 'white' }}>
              <div className="container-content">
                <p className="text-label mb-6" style={{ color: 'var(--color-brand-gold)' }}>
                  Featured
                </p>
                <BlogCard post={featuredPost} featured />
              </div>
            </div>
          )}

          {/* Category filter */}
          {categories.length > 0 && (
            <div
              className="py-6 border-y"
              style={{
                backgroundColor: 'var(--color-brand-cream)',
                borderColor: 'color-mix(in srgb, var(--color-brand-stone) 20%, transparent)',
              }}
            >
              <div className="container-content">
                <div className="flex flex-wrap gap-3">
                  <span
                    className="text-label px-4 py-2 cursor-pointer"
                    style={{
                      backgroundColor: 'var(--color-brand-burgundy)',
                      color: 'white',
                    }}
                  >
                    All
                  </span>
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className="text-label px-4 py-2 cursor-pointer transition-colors"
                      style={{
                        backgroundColor: 'white',
                        color: 'var(--color-brand-charcoal)',
                        border:
                          '1px solid color-mix(in srgb, var(--color-brand-stone) 30%, transparent)',
                      }}
                    >
                      {categoryLabels[cat] ?? cat.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Posts grid */}
          {remainingPosts.length > 0 && (
            <div className="section-padding" style={{ backgroundColor: 'white' }}>
              <div className="container-content">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {remainingPosts.map((post) => (
                    <BlogCard key={post._id} post={post} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
