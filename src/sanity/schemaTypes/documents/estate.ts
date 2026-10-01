import { defineType, defineField } from 'sanity'
import { MdLocationOn } from 'react-icons/md'

export const estate = defineType({
  name: 'estate',
  title: 'Estate',
  type: 'document',
  icon: MdLocationOn,
  fields: [
    defineField({
      name: 'name',
      title: 'Estate Name',
      type: 'string',
      description: 'e.g. Proshyan, Dilijan',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Short description shown on the homepage estate card',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Full Display Name',
      type: 'string',
      description:
        'e.g. "Hovaz Wine Boutique, Proshyan village" — used in the Experiences page location switcher and headings. Falls back to Estate Name if empty.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Estate Image',
      type: 'imageWithAlt',
      validation: (Rule) => Rule.required().error('Estate image is required'),
    }),
    defineField({
      name: 'heroImage',
      title: 'Experiences Page Hero Image',
      type: 'imageWithAlt',
      description:
        'Banner image shown on the Experiences page when this estate is selected. Falls back to Estate Image if empty — independent of any tour/experience.',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Experiences Page Hero Heading',
      type: 'string',
      description:
        'Headline shown over the hero image on the Experiences page, e.g. "Evening Among the Vines". Independent of any tour/experience.',
    }),
    defineField({
      name: 'gallery',
      title: 'Experiences Page Gallery ("Days with Us" series)',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
      options: { layout: 'grid' },
      validation: (Rule) => Rule.max(5),
      description:
        'Up to 5 photos shown in the gallery mosaic on the Experiences page. Independent of any tour/experience.',
    }),
    defineField({
      name: 'foodOptions',
      title: 'Booking Form Food Options',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'foodOption',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              description: 'e.g. Lunch — Light',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'priceAmd',
              title: 'Price per Portion (AMD)',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
          preview: {
            select: { title: 'name', price: 'priceAmd' },
            prepare({ title, price }) {
              return { title, subtitle: price != null ? `${price} AMD each` : undefined }
            },
          },
        },
      ],
      description:
        'Food guests can add, in any quantity, in the "Add Food" step of the booking form on this estate\'s experience pages.',
    }),
    defineField({
      name: 'menuItems',
      title: 'Menu Highlights',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'menuItem',
          fields: [
            defineField({
              name: 'course',
              title: 'Course',
              type: 'string',
              description: 'e.g. First, Second, Dessert',
            }),
            defineField({
              name: 'dish',
              title: 'Dish',
              type: 'string',
              description: 'e.g. Charred eggplant, walnut, pomegranate',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'pairing',
              title: 'Wine Pairing',
              type: 'string',
              description: 'e.g. Paired with Voskehat Estate',
            }),
            defineField({ name: 'image', title: 'Photo', type: 'imageWithAlt' }),
          ],
          preview: {
            select: { title: 'dish', subtitle: 'course', media: 'image.asset' },
          },
        },
      ],
      validation: (Rule) => Rule.max(6),
      description: 'Up to 6 dishes shown in the "Menu" section of this estate\'s experience pages.',
    }),
    defineField({
      name: 'menuFile',
      title: 'Full Menu (PDF)',
      type: 'file',
      options: { accept: 'application/pdf' },
      description: 'Linked from the "See Full Menu" button. The button is hidden if empty.',
    }),
    defineField({
      name: 'eventsCount',
      title: 'Events Count',
      type: 'number',
      description:
        'Number of events hosted at this estate — shown as the large stat on the homepage card',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'string',
      description: 'Page this card links to, e.g. /about/proshyan',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first (left to right)',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'eventsCount',
      media: 'mainImage.asset',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? 'Untitled Estate',
        subtitle: subtitle ? `${subtitle} events` : undefined,
        media,
      }
    },
  },
})
