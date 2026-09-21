import { defineType, defineField } from 'sanity'
import { MdSettings } from 'react-icons/md'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: MdSettings,
  groups: [
    { name: 'homepage', title: 'Homepage', default: true },
    { name: 'contact', title: 'Contact & Social' },
    { name: 'seo', title: 'Global SEO' },
  ],
  fields: [
    // ─── HOMEPAGE ───
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      group: 'homepage',
      description: 'Main headline shown on homepage hero section',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Subheadline',
      type: 'string',
      group: 'homepage',
      description: 'Subtitle shown below the main headline',
    }),
    defineField({
      name: 'heroLocation',
      title: 'Hero Location Label',
      type: 'string',
      group: 'homepage',
      description: 'Small eyebrow label above the headline, e.g. "Proshyan Valley, Armenia"',
    }),
    defineField({
      name: 'heroGallery',
      title: 'Hero Gallery',
      type: 'array',
      group: 'homepage',
      of: [{ type: 'imageWithAlt' }],
      description:
        'Images shown in the homepage hero carousel. The active slide carries the headline and CTAs — add at least 3 for the full carousel effect.',
      validation: (Rule) =>
        Rule.required().min(3).error('Add at least 3 images for the hero carousel'),
    }),
    defineField({
      name: 'heroCtaText',
      title: 'Hero CTA Button Text',
      type: 'string',
      group: 'homepage',
      initialValue: 'Book Your Experience',
    }),
    defineField({
      name: 'featuredWines',
      title: 'Featured Wines',
      type: 'array',
      group: 'homepage',
      of: [{ type: 'reference', to: [{ type: 'wine' }] }],
      validation: (Rule) => Rule.max(6).warning('Show maximum 6 featured wines'),
      description: 'Select wines to feature on the homepage — max 6',
    }),
    defineField({
      name: 'featuredTours',
      title: 'Featured Tours',
      type: 'array',
      group: 'homepage',
      of: [{ type: 'reference', to: [{ type: 'tour' }] }],
      validation: (Rule) => Rule.max(3).warning('Show maximum 3 featured tours'),
      description: 'Select tours to feature on the homepage — max 3',
    }),
    defineField({
      name: 'wineTourGallery',
      title: 'Wine Tour Gallery',
      type: 'array',
      group: 'homepage',
      of: [{ type: 'imageWithAlt' }],
      description:
        'Photos for the homepage "Wine Tour" section — one large image plus 4 smaller ones (5 total).',
      validation: (Rule) => Rule.min(5).warning('Add 5 images: 1 large + 4 smaller'),
    }),
    defineField({
      name: 'featuredEvents',
      title: 'Featured Events',
      type: 'array',
      group: 'homepage',
      of: [{ type: 'reference', to: [{ type: 'event' }] }],
      validation: (Rule) => Rule.max(3).warning('Show maximum 3 featured events'),
      description: 'Select upcoming events to show on homepage — max 3',
    }),
    defineField({
      name: 'featuredBlogPosts',
      title: 'Featured Blog Posts',
      type: 'array',
      group: 'homepage',
      of: [{ type: 'reference', to: [{ type: 'blogPost' }] }],
      validation: (Rule) => Rule.max(3).warning('Show maximum 3 featured posts'),
      description: 'Select blog posts to feature on homepage — max 3',
    }),

    // ─── CONTACT & SOCIAL ───
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.required().email().error('Enter a valid email address'),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      group: 'contact',
      description: 'e.g. +374 77 123 456',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 3,
      group: 'contact',
    }),
    defineField({
      name: 'instagramWineRooms',
      title: 'Instagram — Wine Rooms',
      type: 'url',
      group: 'contact',
      description: '@hovazwinerooms profile URL',
    }),
    defineField({
      name: 'instagramWines',
      title: 'Instagram — Wines',
      type: 'url',
      group: 'contact',
      description: '@hovaz_wines profile URL',
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook URL',
      type: 'url',
      group: 'contact',
    }),

    // ─── GLOBAL SEO ───
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      group: 'seo',
      initialValue: 'HOVAZ Wine Rooms',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'siteDescription',
      title: 'Default Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Used on pages without their own meta description',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default Social Share Image',
      type: 'image',
      group: 'seo',
      description: 'Fallback image when sharing pages that have no specific OG image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'googleVerification',
      title: 'Google Search Console Verification',
      type: 'string',
      group: 'seo',
      description: 'Paste the content value from the Google verification meta tag',
    }),
  ],

  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Global configuration',
      }
    },
  },
})
