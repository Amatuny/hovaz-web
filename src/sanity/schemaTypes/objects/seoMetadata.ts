import { defineType, defineField } from 'sanity'

export const seoMetadata = defineType({
  name: 'seoMetadata',
  title: 'SEO Metadata',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true, // collapsed by default — editors focus on content first
  },
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Shown in browser tab and Google results. 50-60 characters ideal.',
      validation: (Rule) => Rule.max(60).warning('Keep under 60 characters for Google'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Shown in Google search results. 150-160 characters ideal.',
      validation: (Rule) => Rule.max(160).warning('Keep under 160 characters for Google'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      description:
        'Image shown when shared on Facebook, Instagram, WhatsApp. 1200x630px recommended.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
      description: 'Turn on to prevent Google from indexing this page',
    }),
  ],
})
