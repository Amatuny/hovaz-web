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
      name: 'mainImage',
      title: 'Estate Image',
      type: 'imageWithAlt',
      validation: (Rule) => Rule.required().error('Estate image is required'),
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
