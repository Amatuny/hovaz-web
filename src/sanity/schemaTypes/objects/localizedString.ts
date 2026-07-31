import { defineType, defineField } from 'sanity'

export const localizedString = defineType({
  name: 'localizedString',
  title: 'Localized String',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
      validation: (Rule) => Rule.required().error('English is required'),
    }),
    defineField({
      name: 'hy',
      title: 'Armenian (Հայերեն)',
      type: 'string',
    }),
    defineField({
      name: 'ru',
      title: 'Russian (Русский)',
      type: 'string',
    }),
  ],
})
