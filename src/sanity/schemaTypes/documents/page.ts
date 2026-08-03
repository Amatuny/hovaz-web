import { defineType, defineField } from 'sanity'
import { MdWebAsset } from 'react-icons/md'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: MdWebAsset,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'i18n', title: 'Translations' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
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
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      group: 'content',
      description: 'Short subtitle shown below the page title',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'imageWithAlt',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      group: 'content',
      description: 'e.g. Book a Wine Experience',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Button Link',
      type: 'string',
      group: 'content',
      description: 'e.g. /events',
    }),

    // Location details — for Wine Rooms pages (Dilijan, Proshyan)
    defineField({
      name: 'location',
      title: 'Location Details',
      type: 'object',
      group: 'content',
      description: 'Fill in only for Wine Rooms location pages',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'address', title: 'Address', type: 'text', rows: 3 },
        { name: 'phone', title: 'Phone', type: 'string' },
        { name: 'email', title: 'Email', type: 'string' },
        { name: 'googleMapsUrl', title: 'Google Maps URL', type: 'url' },
        { name: 'openingHours', title: 'Opening Hours', type: 'text', rows: 4 },
      ],
    }),

    // Team members — for The Team page
    defineField({
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      group: 'content',
      description: 'Fill in only for The Team page',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'role', title: 'Role', type: 'string' },
            { name: 'bio', title: 'Bio', type: 'text', rows: 3 },
            { name: 'photo', title: 'Photo', type: 'imageWithAlt' },
          ],
          preview: {
            select: { title: 'name', subtitle: 'role', media: 'photo.asset' },
          },
        },
      ],
    }),

    // ── TRANSLATIONS ──
    defineField({
      name: 'title_i18n',
      title: 'Title (Translations)',
      type: 'localizedString',
      group: 'i18n',
    }),
    defineField({
      name: 'subtitle_i18n',
      title: 'Subtitle (Translations)',
      type: 'localizedString',
      group: 'i18n',
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
