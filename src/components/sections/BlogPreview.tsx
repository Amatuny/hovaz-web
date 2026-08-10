// src/components/sections/BlogPreview.tsx
import Link from 'next/link'
import { BlogCard } from '@/components/ui/BlogCard'
import type { BlogPost } from '@/types/sanity'

interface BlogPreviewProps {
  posts: BlogPost[]
}

export function BlogPreview({ posts }: BlogPreviewProps) {
  if (!posts?.length) return null

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-label mb-3" style={{ color: 'var(--color-brand-gold)' }}>
              Stories & Insights
            </p>
            <h2 className="heading-section">The Journal</h2>
          </div>
          <Link href="/blog" className="btn-ghost hidden md:inline-flex">
            All stories
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/blog" className="btn-ghost">
            All stories
          </Link>
        </div>
      </div>
    </section>
  )
}
