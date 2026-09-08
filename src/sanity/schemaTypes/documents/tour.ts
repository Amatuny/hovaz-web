import { defineType, defineField } from 'sanity'
import { MdDirectionsWalk } from 'react-icons/md'

export const tour = defineType({
  name: 'tour',
  title: 'Tour',
  type: 'document',
  icon: MdDirectionsWalk,
  groups: [
    { name: 'details', title: 'Tour Details', default: true },
    { name: 'pricing', title: 'Pricing & Capacity' },
    { name: 'media', title: 'Gallery' },
    { name: 'i18n', title: 'Translations' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── CORE DETAILS ───
    defineField({
      name: 'title',
      title: 'Tour Title',
      type: 'string',
      group: 'details',
      validation: (Rule) => Rule.required().error('Tour title is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'details',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('Slug is required for the tour URL'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      group: 'details',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      group: 'details',
      description: 'e.g. 2 hours, Half day, Full day',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tourType',
      title: 'Tour Type',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: 'Vineyard Walk', value: 'vineyard_walk' },
          { title: 'Wine Tasting', value: 'wine_tasting' },
          { title: 'Winemaking Experience', value: 'winemaking' },
          { title: 'Harvest Experience', value: 'harvest' },
          { title: 'Private Tour', value: 'private' },
          { title: 'Group Tour', value: 'group' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      group: 'details',
      initialValue: false,
    }),
    defineField({
      name: 'active',
      title: 'Currently Active',
      type: 'boolean',
      group: 'details',
      initialValue: true,
      description: 'Turn off to hide this tour from the website',
    }),
    defineField({
      name: 'includedServices',
      title: 'Included Services',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'e.g. Wine tasting, Vineyard walk, Light snacks, Transportation',
    }),
    defineField({
      name: 'estate',
      title: 'Estate',
      type: 'reference',
      to: [{ type: 'estate' }],
      group: 'details',
      description: 'Which estate hosts this tour — shown as a badge on the homepage journal strip',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'details',
      options: { layout: 'tags' },
      description: 'e.g. Tasting, Seasonal, Tours — shown as pills on the homepage journal strip',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      group: 'details',
      initialValue: 'Book This Tour',
      description: 'Text shown on the booking button',
    }),

    // ─── PRICING & CAPACITY ───
    defineField({
      name: 'pricePerPerson',
      title: 'Price Per Person (USD)',
      type: 'number',
      group: 'pricing',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'priceNote',
      title: 'Price Note',
      type: 'string',
      group: 'pricing',
      description: 'e.g. Includes wine tasting for 3 wines, Starting from price',
    }),
    defineField({
      name: 'minGroupSize',
      title: 'Minimum Group Size',
      type: 'number',
      group: 'pricing',
      initialValue: 1,
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'maxGroupSize',
      title: 'Maximum Group Size',
      type: 'number',
      group: 'pricing',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'privateAvailable',
      title: 'Private Booking Available',
      type: 'boolean',
      group: 'pricing',
      initialValue: true,
    }),

    // ─── GALLERY ───
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'imageWithAlt',
      group: 'media',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [{ type: 'imageWithAlt' }],
      options: { layout: 'grid' },
    }),

    // ─── TRANSLATIONS ───
    defineField({
      name: 'title_i18n',
      title: 'Title (Translations)',
      type: 'localizedString',
      group: 'i18n',
    }),
    defineField({
      name: 'description_i18n',
      title: 'Description (Translations)',
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

  preview: {
    select: {
      title: 'title',
      subtitle: 'tourType',
      price: 'pricePerPerson',
      media: 'mainImage.asset',
    },
    prepare({ title, subtitle, price, media }) {
      return {
        title: title ?? 'Untitled Tour',
        subtitle: `${subtitle ?? ''} ${price ? `· $${price}/person` : ''}`.trim(),
        media,
      }
    },
  },
})
