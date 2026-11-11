import { defineType, defineField } from 'sanity'
import { translatable } from '../helpers/translatable'
import { MdWebAsset } from 'react-icons/md'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: MdWebAsset,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    ...translatable(
      defineField({
        name: 'title',
        title: 'Page Title',
        type: 'string',
        group: 'content',
        validation: (Rule) => Rule.required(),
      })
    ),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'section',
      title: 'Section',
      type: 'string',
      group: 'content',
      description: 'Which section this page belongs to',
      options: {
        list: [
          { title: 'About', value: 'about' },
          { title: 'Contact', value: 'contact' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    ...translatable(
      defineField({
        name: 'subtitle',
        title: 'Subtitle',
        type: 'string',
        group: 'content',
        description: 'Short subtitle shown below the page title',
      })
    ),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'imageWithAlt',
      group: 'content',
    }),
    ...translatable(
      defineField({
        name: 'body',
        title: 'Body',
        type: 'blockContent',
        group: 'content',
        validation: (Rule) => Rule.required(),
      })
    ),
    ...translatable(
      defineField({
        name: 'ctaText',
        title: 'CTA Button Text',
        type: 'string',
        group: 'content',
        description: 'e.g. Book a Wine Experience',
      })
    ),
    defineField({
      name: 'ctaLink',
      title: 'CTA Button Link',
      type: 'string',
      group: 'content',
      description: 'e.g. /events',
    }),
    // ── SEO ──
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoMetadata',
      group: 'seo',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'section',
      media: 'featuredImage.asset',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? 'Untitled Page',
        subtitle: subtitle ? `/${subtitle}` : '',
        media,
      }
    },
  },
})
