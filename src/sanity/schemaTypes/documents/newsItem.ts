import { defineType, defineField } from 'sanity'
import { MdNewspaper } from 'react-icons/md'

export const newsItem = defineType({
  name: 'newsItem',
  title: 'News & Awards',
  type: 'document',
  icon: MdNewspaper,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'article', title: 'Article Page' },
    { name: 'i18n', title: 'Translations' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Award', value: 'award' },
          { title: 'Press & Media', value: 'press' },
          { title: 'Brand News', value: 'brand_news' },
          { title: 'Release', value: 'release' },
          { title: 'Event', value: 'event' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'imageWithAlt',
      group: 'content',
      description: 'Card photo, and the large photo at the top of the article page',
    }),

    // ── ARTICLE PAGE (/news/[slug]) — every section is hidden when left empty ──
    defineField({
      name: 'place',
      title: 'Place',
      type: 'string',
      group: 'article',
      description: 'e.g. Proshyan Estate — shown next to the date under the title',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 5,
      group: 'article',
      description: 'Opening text under the photo. Leave a blank line between paragraphs.',
    }),
    defineField({
      name: 'gallery',
      title: 'Photo Grid Images',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
      options: { layout: 'grid' },
      group: 'article',
      validation: (Rule) => Rule.max(2),
      description: 'Up to 2 photos, shown in the grid alongside the highlight cards',
    }),
    defineField({
      name: 'highlights',
      title: 'Highlight Cards',
      type: 'array',
      group: 'article',
      validation: (Rule) => Rule.max(2),
      description: 'Up to 2 dark text cards in the photo grid, e.g. "The Vintage", "In the Glass"',
      of: [
        {
          type: 'object',
          name: 'highlight',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g. The Vintage',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Text',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'text' } },
        },
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      group: 'article',
      description: 'Main text, shown after the photo grid',
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 2,
      group: 'article',
    }),
    defineField({
      name: 'detailsTitle',
      title: 'Closing Section Label',
      type: 'string',
      group: 'article',
      description: 'e.g. Where to try it',
    }),
    defineField({
      name: 'detailsText',
      title: 'Closing Section Text',
      type: 'text',
      rows: 6,
      group: 'article',
      description: 'Leave a blank line between paragraphs.',
    }),

    // Award specific fields
    defineField({
      name: 'awardOrganization',
      title: 'Award Organization',
      type: 'string',
      group: 'content',
      description: 'e.g. Decanter World Wine Awards',
    }),
    defineField({
      name: 'awardYear',
      title: 'Award Year',
      type: 'number',
      group: 'content',
    }),
    defineField({
      name: 'awardTier',
      title: 'Award Tier',
      type: 'string',
      group: 'content',
      description: 'e.g. Gold, Silver, Medal, Trophy — shown alongside the award year',
    }),
    defineField({
      name: 'awardedWine',
      title: 'Awarded Wine',
      type: 'string',
      group: 'content',
      description:
        'e.g. Areni Reserve 2019 — shown under the organization on the News & Awards page',
    }),

    // Press specific fields
    defineField({
      name: 'publication',
      title: 'Publication',
      type: 'string',
      group: 'content',
      description: 'e.g. Wine Spectator, Decanter',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External Article URL',
      type: 'url',
      group: 'content',
      description: 'Link to the original article',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'content',
      initialValue: false,
      description:
        'Show as one of the (up to 3) large story cards at the top of the News & Awards page. Awards always appear in the awards section instead.',
    }),

    // ── TRANSLATIONS ──
    defineField({
      name: 'title_i18n',
      title: 'Title (Translations)',
      type: 'localizedString',
      group: 'i18n',
    }),
    defineField({
      name: 'excerpt_i18n',
      title: 'Excerpt (Translations)',
      type: 'localizedText',
      group: 'i18n',
    }),

    // ── SEO ──
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoMetadata',
      group: 'seo',
    }),
  ],

  orderings: [
    {
      title: 'Date, Newest First',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      date: 'date',
      media: 'featuredImage.asset',
    },
    prepare({ title, subtitle, date, media }) {
      return {
        title: title ?? 'Untitled',
        subtitle: `${subtitle ?? ''} · ${date ?? ''}`.trim(),
        media,
      }
    },
  },
})
