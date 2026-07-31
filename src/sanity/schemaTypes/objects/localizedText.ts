import { defineType, defineField } from 'sanity'

export const localizedText = defineType({
  name: 'localizedText',
  title: 'Localized Text',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().error('English is required'),
    }),
    defineField({
      name: 'hy',
      title: 'Armenian (Հայերեն)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'ru',
      title: 'Russian (Русский)',
      type: 'text',
      rows: 4,
    }),
  ],
})
