import { defineType, defineField } from 'sanity'
import { MdQuestionAnswer } from 'react-icons/md'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'document',
  icon: MdQuestionAnswer,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'i18n', title: 'Translations' },
  ],
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 5,
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Bookings', value: 'bookings' },
          { title: 'Wine Tours', value: 'wine_tours' },
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

    // ── TRANSLATIONS ──
    defineField({
      name: 'question_i18n',
      title: 'Question (Translations)',
      type: 'localizedString',
      group: 'i18n',
    }),
    defineField({
      name: 'answer_i18n',
      title: 'Answer (Translations)',
      type: 'localizedText',
      group: 'i18n',
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
