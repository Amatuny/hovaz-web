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
    { name: 'story', title: 'Detail Page Story' },
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
      name: 'collection',
      title: 'Collection',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: 'Hovaz Collection', value: 'hovaz' },
          { title: 'Gooneh Collection', value: 'gooneh' },
        ],
        layout: 'radio',
      },
      initialValue: 'hovaz',
      description: 'Which product line this wine belongs to — grouped separately on the Wines page',
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
      name: 'tastingTags',
      title: 'Tasting Tags',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'tasting',
      options: { layout: 'tags' },
      description: 'Short flavor descriptors, e.g. Rich, Spicy, Complex — shown on the wine card',
      validation: (Rule) => Rule.max(3),
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

    // ─── DETAIL PAGE STORY ───
    defineField({
      name: 'award',
      title: 'Award Badge',
      type: 'string',
      group: 'story',
      description: 'e.g. Gold — Brussels 2023 — shown as a badge above the wine name',
    }),
    defineField({
      name: 'pairWith',
      title: 'Pair With',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'story',
      options: { layout: 'tags' },
      description: 'Dishes this wine pairs with, e.g. Lamb, Steak, Beef Ribs',
    }),
    defineField({
      name: 'perfectFor',
      title: 'Perfect For',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'story',
      options: { layout: 'tags' },
      description: 'Occasions, e.g. Special dinners, Rich dishes, Gifting',
    }),
    defineField({
      name: 'agingNotes',
      title: 'Aging',
      type: 'string',
      group: 'story',
      description: 'e.g. 12 months, Caucasian oak',
    }),
    defineField({
      name: 'bottleSize',
      title: 'Bottle Size',
      type: 'string',
      group: 'story',
      initialValue: '750ml',
    }),
    defineField({
      name: 'relatedEvents',
      title: 'Events Pouring This Wine',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'event' }] }],
      group: 'story',
      description: "Upcoming events featured on this wine's page",
    }),
    defineField({
      name: 'storyIntro',
      title: 'Story Intro Paragraph',
      type: 'text',
      rows: 3,
      group: 'story',
      description: 'Short paragraph about how this specific wine was made',
    }),
    defineField({
      name: 'grapeStoryText',
      title: 'The Grape — Description',
      type: 'text',
      rows: 4,
      group: 'story',
      description: 'Shown alongside the grape variety name in "The Grape" card',
    }),
    defineField({
      name: 'howWeDecidedTitle',
      title: 'How We Decided — Title',
      type: 'string',
      group: 'story',
      description: 'e.g. Built for the long table',
    }),
    defineField({
      name: 'howWeDecidedText',
      title: 'How We Decided — Description',
      type: 'text',
      rows: 4,
      group: 'story',
    }),
    defineField({
      name: 'storyOutro',
      title: 'Story Outro Paragraphs',
      type: 'array',
      of: [{ type: 'text', rows: 3 }],
      group: 'story',
      description: 'Closing paragraphs, e.g. background on the grape variety',
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
      title: 'Story Images',
      type: 'array',
      group: 'media',
      of: [{ type: 'imageWithAlt' }],
      options: { layout: 'grid' },
      description:
        'Used on the wine detail page: 1st image is the large story photo, 2nd and 3rd are the small side photos',
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
