import { defineType, defineField } from 'sanity'
import { MdEvent } from 'react-icons/md'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: MdEvent,
  groups: [
    { name: 'details', title: 'Event Details', default: true },
    { name: 'logistics', title: 'Date & Capacity' },
    { name: 'media', title: 'Gallery' },
    { name: 'i18n', title: 'Translations' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── CORE DETAILS ───
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      group: 'details',
      validation: (Rule) => Rule.required().error('Event title is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'details',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      group: 'details',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: 'Wine Dinner', value: 'wine_dinner' },
          { title: 'Harvest Festival', value: 'harvest_festival' },
          { title: 'Tasting Evening', value: 'tasting_evening' },
          { title: 'Private Event', value: 'private_event' },
          { title: 'Masterclass', value: 'masterclass' },
          { title: 'Seasonal Event', value: 'seasonal' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      group: 'details',
      initialValue: false,
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      group: 'details',
      initialValue: 'Inquire About This Event',
    }),
    defineField({
      name: 'ctaEmail',
      title: 'Inquiry Email',
      type: 'string',
      group: 'details',
      description: 'Email address for event inquiries — defaults to admin email if empty',
    }),

    // ─── DATE & CAPACITY ───
    defineField({
      name: 'startDate',
      title: 'Start Date & Time',
      type: 'datetime',
      group: 'logistics',
      options: {
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
        timeStep: 30,
      },
      validation: (Rule) => Rule.required().error('Start date is required'),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date & Time',
      type: 'datetime',
      group: 'logistics',
      options: {
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
        timeStep: 30,
      },
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'logistics',
      description: 'e.g. HOVAZ Wine Rooms, Yerevan',
      initialValue: 'HOVAZ Wine Rooms',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      group: 'logistics',
      description: 'e.g. "2.5 hours, seated" — shown on the reservation panel',
    }),
    defineField({
      name: 'estate',
      title: 'Estate',
      type: 'reference',
      to: [{ type: 'estate' }],
      group: 'logistics',
      description: 'Which estate hosts this event — shown as a badge on the homepage journal strip',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'details',
      options: { layout: 'tags' },
      description:
        'e.g. Tasting, Seasonal, Experiences — shown as pills on the homepage journal strip',
    }),
    defineField({
      name: 'capacity',
      title: 'Maximum Capacity',
      type: 'number',
      group: 'logistics',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'price',
      title: 'Price Per Person (USD)',
      type: 'number',
      group: 'logistics',
      description: 'Leave empty if price is on request',
    }),
    defineField({
      name: 'priceNote',
      title: 'Price Note',
      type: 'string',
      group: 'logistics',
      description: 'e.g. Includes 5-course dinner and wine pairing',
    }),
    defineField({
      name: 'status',
      title: 'Event Status',
      type: 'string',
      group: 'logistics',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'Sold Out', value: 'sold_out' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Completed', value: 'completed' },
        ],
        layout: 'radio',
      },
      initialValue: 'upcoming',
      validation: (Rule) => Rule.required(),
    }),

    // ─── GALLERY ───
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'imageWithAlt',
      group: 'media',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [{ type: 'imageWithAlt' }],
      options: { layout: 'grid' },
      description:
        'The first 3 images appear in the "About" section grid on the detail page; the next 3 appear in the "What\'s Included" row (if Included Heading is set).',
    }),
    defineField({
      name: 'includesHeading',
      title: 'Included Heading',
      type: 'string',
      group: 'media',
      description:
        'e.g. "The event includes a tasting plate." Shown above the 4th–6th gallery images on the detail page. Leave empty to hide that section.',
    }),

    // ─── TRANSLATIONS ───
    defineField({
      name: 'title_i18n',
      title: 'Title (Translations)',
      type: 'localizedString',
      group: 'i18n',
    }),
    defineField({
      name: 'description_i18n',
      title: 'Description (Translations)',
      type: 'localizedText',
      group: 'i18n',
    }),

    // ─── SEO ───
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
      subtitle: 'startDate',
      status: 'status',
      media: 'mainImage.asset',
    },
    prepare({ title, subtitle, status, media }) {
      const date = subtitle
        ? new Date(subtitle).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'No date set'
      return {
        title: title ?? 'Untitled Event',
        subtitle: `${date} · ${status ?? 'upcoming'}`,
        media,
      }
    },
  },
})
