import { defineType, defineField } from 'sanity'
import { MdRateReview } from 'react-icons/md'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: MdRateReview,
  groups: [{ name: 'content', title: 'Content', default: true }],
  fields: [
    defineField({
      name: 'guestName',
      title: 'Guest Name',
      type: 'string',
      group: 'content',
      description: 'e.g. Marine A. — first name and last initial reads best',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      group: 'content',
      options: {
        list: [1, 2, 3, 4, 5],
      },
      initialValue: 5,
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'context',
      title: 'Context',
      type: 'string',
      group: 'content',
      description: 'e.g. Guided Tasting, Dilijan',
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'imageWithAlt',
      group: 'content',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'content',
      description: 'Lower numbers appear first',
      initialValue: 99,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'guestName',
      subtitle: 'context',
      media: 'avatar.asset',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? 'Untitled Testimonial',
        subtitle,
        media,
      }
    },
  },
})
