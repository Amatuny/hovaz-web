import { defineType, defineField } from 'sanity'
import { translatable } from '../helpers/translatable'
import { MdQuestionAnswer } from 'react-icons/md'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'document',
  icon: MdQuestionAnswer,
  groups: [{ name: 'content', title: 'Content', default: true }],
  fields: [
    ...translatable(
      defineField({
        name: 'question',
        title: 'Question',
        type: 'string',
        group: 'content',
        validation: (Rule) => Rule.required(),
      })
    ),
    ...translatable(
      defineField({
        name: 'answer',
        title: 'Answer',
        type: 'text',
        rows: 5,
        group: 'content',
        validation: (Rule) => Rule.required(),
      })
    ),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Bookings', value: 'bookings' },
          { title: 'Wine Experiences', value: 'wine_tours' },
          { title: 'Getting Here', value: 'getting_here' },
          { title: 'Wine', value: 'wine' },
          { title: 'General', value: 'general' },
        ],
        layout: 'radio',
      },
      initialValue: 'general',
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
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [{ field: 'category', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'question',
      subtitle: 'category',
    },
    prepare({ title, subtitle }) {
      return {
        title: title ?? 'Untitled Question',
        subtitle: subtitle ?? 'general',
      }
    },
  },
})
