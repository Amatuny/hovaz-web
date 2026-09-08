import { defineType, defineField } from 'sanity'
import { MdNewspaper } from 'react-icons/md'

export const newsItem = defineType({
  name: 'newsItem',
  title: 'News & Awards',
  type: 'document',
  icon: MdNewspaper,
  groups: [
    { name: 'content', title: 'Content', default: true },
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
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'imageWithAlt',
      group: 'content',
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
      description: 'Show on homepage awards strip',
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
