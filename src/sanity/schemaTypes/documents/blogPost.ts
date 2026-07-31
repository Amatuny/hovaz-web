import { defineType, defineField } from 'sanity'
import { MdArticle } from 'react-icons/md'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  icon: MdArticle,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Publishing' },
    { name: 'i18n', title: 'Translations' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── CONTENT ───
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().error('Title is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('Slug is required for the post URL'),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Short summary shown in blog listing and social shares',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'imageWithAlt',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Wine Education', value: 'wine_education' },
          { title: 'Armenian Wine', value: 'armenian_wine' },
          { title: 'Behind the Scenes', value: 'behind_scenes' },
          { title: 'Events & News', value: 'events_news' },
          { title: 'Food & Pairing', value: 'food_pairing' },
          { title: 'Travel & Lifestyle', value: 'travel_lifestyle' },
        ],
        layout: 'tags',
      },
    }),

    // ─── PUBLISHING ───
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'meta',
      initialValue: 'HOVAZ Team',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'datetime',
      group: 'meta',
      options: {
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
      },
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Show this post in the featured blog section on homepage',
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
      group: 'meta',
      description: 'Estimated reading time — shown on the post card',
      validation: (Rule) => Rule.min(1).max(60),
    }),

    // ─── TRANSLATIONS ───
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

    // ─── SEO ───
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoMetadata',
      group: 'seo',
    }),
  ],

  orderings: [
    {
      title: 'Publish Date, Newest First',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Publish Date, Oldest First',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author',
      publishedAt: 'publishedAt',
      media: 'featuredImage.asset',
    },
    prepare({ title, author, publishedAt, media }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Unpublished'
      return {
        title: title ?? 'Untitled Post',
        subtitle: `${author ?? 'HOVAZ Team'} · ${date}`,
        media,
      }
    },
  },
})
