import { defineType, defineField } from 'sanity'
import { GiWineBottle } from 'react-icons/gi'

export const wine = defineType({
  name: 'wine',
  title: 'Wine',
  type: 'document',
  icon: GiWineBottle,
  groups: [
    { name: 'details', title: 'Wine Details', default: true },
    { name: 'tasting', title: 'Tasting & Pairing' },
    { name: 'media', title: 'Images' },
    { name: 'i18n', title: 'Translations' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── CORE DETAILS ───
    defineField({
      name: 'name',
      title: 'Wine Name',
      type: 'string',
      group: 'details',
      validation: (Rule) => Rule.required().error('Wine name is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'details',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('Slug is required for the wine URL'),
    }),
    defineField({
      name: 'grapeVariety',
      title: 'Grape Variety',
      type: 'string',
      group: 'details',
      description: 'e.g. Areni Noir, Voskehat, Kangun',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'vintage',
      title: 'Vintage Year',
      type: 'number',
      group: 'details',
      validation: (Rule) =>
        Rule.required().min(1900).max(new Date().getFullYear()).error('Enter a valid vintage year'),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      group: 'details',
      description: 'e.g. Vayots Dzor, Ararat Valley, Tavush',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'wineType',
      title: 'Wine Type',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: 'Red', value: 'red' },
          { title: 'White', value: 'white' },
          { title: 'Rosé', value: 'rose' },
          { title: 'Sparkling', value: 'sparkling' },
          { title: 'Orange', value: 'orange' },
          { title: 'Dessert', value: 'dessert' },
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
      description: 'Turn on to show this wine in the homepage featured section',
    }),
    defineField({
      name: 'available',
      title: 'Currently Available',
      type: 'boolean',
      group: 'details',
      initialValue: true,
      description: 'Turn off to hide this wine from the catalog',
    }),

    // ─── TASTING & PAIRING ───
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      group: 'tasting',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tastingNotes',
      title: 'Tasting Notes',
      type: 'text',
      rows: 4,
      group: 'tasting',
      description: 'Describe aromas, palate, and finish',
    }),
    defineField({
      name: 'pairingNotes',
      title: 'Pairing Notes',
      type: 'text',
      rows: 3,
      group: 'tasting',
      description: 'Food and occasion pairings',
    }),
    defineField({
      name: 'alcohol',
      title: 'Alcohol %',
      type: 'number',
      group: 'tasting',
      validation: (Rule) => Rule.min(0).max(25),
    }),
    defineField({
      name: 'servingTemp',
      title: 'Serving Temperature',
      type: 'string',
      group: 'tasting',
      description: 'e.g. 14-16°C',
    }),

    // ─── MEDIA ───
    defineField({
      name: 'mainImage',
      title: 'Main Bottle Image',
      type: 'imageWithAlt',
      group: 'media',
      validation: (Rule) => Rule.required().error('Main image is required'),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      group: 'media',
      of: [{ type: 'imageWithAlt' }],
      options: { layout: 'grid' },
    }),

    // ─── TRANSLATIONS ───
    defineField({
      name: 'name_i18n',
      title: 'Wine Name (Translations)',
      type: 'localizedString',
      group: 'i18n',
      description: 'Translated wine name — English is pre-filled from the main name above',
    }),
    defineField({
      name: 'description_i18n',
      title: 'Description (Translations)',
      type: 'localizedText',
      group: 'i18n',
    }),
    defineField({
      name: 'tastingNotes_i18n',
      title: 'Tasting Notes (Translations)',
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

  // Controls how this document appears in Studio lists
  preview: {
    select: {
      title: 'name',
      subtitle: 'grapeVariety',
      vintage: 'vintage',
      media: 'mainImage.asset',
    },
    prepare({ title, subtitle, vintage, media }) {
      return {
        title: title ?? 'Untitled Wine',
        subtitle: `${subtitle ?? ''} ${vintage ? `· ${vintage}` : ''}`.trim(),
        media,
      }
    },
  },
})
