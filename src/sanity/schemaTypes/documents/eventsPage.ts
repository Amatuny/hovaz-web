import { defineType, defineField } from 'sanity'
import { MdEvent } from 'react-icons/md'
import { textGroup } from '../helpers/textGroup'
import { EVENTS_DEFAULTS } from '../../../content/defaults'

/**
 * Singleton: every fixed text on the Events pages (/events and each event's
 * own page), the reservation form and the event cards. The events themselves
 * live in "Events". Empty fields fall back to the built-in text shown in grey.
 */
export const eventsPage = defineType({
  name: 'eventsPage',
  title: 'Events Page',
  type: 'document',
  icon: MdEvent,
  groups: [
    { name: 'list', title: 'Events List', default: true },
    { name: 'detail', title: 'Event Detail Page' },
    { name: 'form', title: 'Reservation Form' },
    { name: 'cards', title: 'Event Cards' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── /events ──
    textGroup({
      name: 'header',
      title: 'Page Header',
      group: 'list',
      defaults: EVENTS_DEFAULTS.list,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        { key: 'text', title: 'Intro Text', rows: 3 },
        { key: 'empty', title: 'No Events Text', description: 'Shown when there are no events' },
        {
          key: 'searchHeading',
          title: 'Search Heading',
          description: 'Smaller heading above the search bar',
        },
        {
          key: 'searchText',
          title: 'Search Text',
          rows: 2,
          description: 'Line under the search heading',
        },
      ],
    }),
    textGroup({
      name: 'filters',
      title: 'Search Bar',
      group: 'list',
      defaults: EVENTS_DEFAULTS.filters,
      fields: [
        { key: 'searchPlaceholder', title: 'Search Field Placeholder' },
        { key: 'dateLabel', title: 'Date Label' },
        { key: 'datePlaceholder', title: 'Date Placeholder' },
        { key: 'clearDate', title: '"Clear Date" Button' },
        { key: 'locationLabel', title: 'Location Label' },
        { key: 'locationPlaceholder', title: 'Location Placeholder' },
        { key: 'searchButton', title: 'Search Button' },
        { key: 'noResults', title: 'No Results Text' },
      ],
    }),
    textGroup({
      name: 'reviews',
      title: 'Reviews Section',
      group: 'list',
      description: 'The reviews themselves come from "Testimonials"',
      defaults: EVENTS_DEFAULTS.reviews,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
      ],
    }),

    // ── /events/[slug] ──
    textGroup({
      name: 'detailTop',
      title: 'Top of Page',
      group: 'detail',
      defaults: EVENTS_DEFAULTS.detail,
      fields: [
        { key: 'breadcrumb', title: 'Breadcrumb Label' },
        {
          key: 'welcomePrefix',
          title: 'Heading Prefix',
          description: 'Shown before the estate name, e.g. "welcome to Hovaz Wine Rooms"',
        },
        {
          key: 'estateSuffix',
          title: 'Estate Badge Suffix',
          description: 'Added after the estate name on the photo badge',
        },
        {
          key: 'defaultLocation',
          title: 'Default Location',
          description: 'Used when an event has no location of its own',
        },
        { key: 'aboutEyebrow', title: 'About — Small Label' },
        { key: 'aboutHeading', title: 'About — Heading' },
        { key: 'includesEyebrow', title: '"Includes" Row — Small Label' },
      ],
    }),
    textGroup({
      name: 'detailJournal',
      title: 'More Events Section',
      group: 'detail',
      description: 'The other events at the bottom of each event page',
      defaults: EVENTS_DEFAULTS.detail,
      fields: [
        { key: 'journalEyebrow', title: 'Small Label' },
        { key: 'journalHeading', title: 'Heading' },
        { key: 'journalText', title: 'Intro Text', rows: 2 },
        { key: 'collectionTitle', title: 'Last Card — Title' },
        { key: 'collectionButton', title: 'Last Card — Button' },
      ],
    }),

    // ── Reservation form ──
    textGroup({
      name: 'form',
      title: 'Form Texts',
      group: 'form',
      description: 'The reservation panel next to each event',
      defaults: EVENTS_DEFAULTS.form,
      fields: [
        { key: 'dateTimeLabel', title: 'Date & Time Label' },
        { key: 'locationLabel', title: 'Location Label' },
        { key: 'durationLabel', title: 'Duration Label' },
        { key: 'guestsLabel', title: 'Guests Label' },
        { key: 'guestSingular', title: 'Guest (one)', description: 'e.g. "1 guest"' },
        { key: 'guestPlural', title: 'Guests (many)', description: 'e.g. "2 guests"' },
        { key: 'nameLabel', title: 'Name Label' },
        { key: 'namePlaceholder', title: 'Name Placeholder' },
        { key: 'emailLabel', title: 'Email Label' },
        { key: 'emailPlaceholder', title: 'Email Placeholder' },
        { key: 'phoneLabel', title: 'Phone Label' },
        { key: 'phonePlaceholder', title: 'Phone Placeholder' },
        { key: 'notesLabel', title: 'Notes Label' },
        { key: 'notesPlaceholder', title: 'Notes Placeholder' },
        {
          key: 'submitButton',
          title: 'Button Text',
          description: 'Used unless the event sets its own button text',
        },
        { key: 'sendingButton', title: 'Button Text While Sending' },
        { key: 'cancellationNote', title: 'Note Under the Button' },
        { key: 'successTitle', title: 'Success — Title' },
        {
          key: 'successText',
          title: 'Success — Message',
          rows: 2,
          description: 'Write {title} where the event name should appear (shown in bold)',
        },
      ],
    }),

    // ── Event cards ──
    textGroup({
      name: 'card',
      title: 'Card Texts',
      group: 'cards',
      description: 'Event cards on the Events page, event pages and the homepage',
      defaults: EVENTS_DEFAULTS.card,
      fields: [
        { key: 'reserve', title: 'Hover Button Text' },
        { key: 'pastEvent', title: '"Past Event" Badge' },
      ],
    }),

    // ── SEO for /events ──
    defineField({
      name: 'seo',
      title: 'SEO — Events List Page',
      type: 'seoMetadata',
      group: 'seo',
      description: `Leave empty to use: "${EVENTS_DEFAULTS.seo.metaTitle}" and the default description. Each event's own SEO is set on the event itself.`,
    }),
  ],

  preview: {
    prepare: () => ({ title: 'Events Page', subtitle: '/events and event detail pages' }),
  },
})
