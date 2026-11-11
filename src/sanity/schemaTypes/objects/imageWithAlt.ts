import { defineType, defineField } from 'sanity'
import { translatable } from '../helpers/translatable'

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'asset',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true, // allows editors to set focal point for cropping
      },
      validation: (Rule) => Rule.required(),
    }),
    ...translatable(
      defineField({
        name: 'alt',
        title: 'Alt Text',
        type: 'string',
        description: 'Describe the image for screen readers and SEO',
        validation: (Rule) => Rule.required().error('Alt text is required for accessibility'),
      })
    ),
    ...translatable(
      defineField({
        name: 'caption',
        title: 'Caption (optional)',
        type: 'string',
      })
    ),
  ],
  preview: {
    select: {
      title: 'alt',
      media: 'asset',
    },
  },
})
