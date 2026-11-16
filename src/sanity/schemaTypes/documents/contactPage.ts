import { defineType, defineField } from 'sanity'
import { MdContactMail } from 'react-icons/md'
import { itemList, textGroup } from '../helpers/textGroup'
import { CONTACT_DEFAULTS as D } from '../../../content/defaults'

/**
 * Singleton: every fixed text on the Contact pages — Contact Us
 * (/contact/form), FAQ (/contact/faq) and For Tour Agencies
 * (/contact/agencies). Email and phone numbers stay in Site Settings →
 * Contact & Social; FAQ questions stay in "FAQ".
 * Empty fields fall back to the built-in text shown in grey.
 */
export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: MdContactMail,
  groups: [
    { name: 'contact', title: 'Contact Us', default: true },
    { name: 'form', title: 'Message Form' },
    { name: 'faq', title: 'FAQ Page' },
    { name: 'agencies', title: 'Agencies Page' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── /contact/form ──
    textGroup({
      name: 'contact',
      title: 'Page Header',
      group: 'contact',
      defaults: D.contact,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        { key: 'text', title: 'Intro Text', rows: 2 },
      ],
    }),
    textGroup({
      name: 'channels',
      title: 'Channel Labels',
      group: 'contact',
      description:
        'Titles on the contact cards. The email and numbers themselves are in Site Settings → Contact & Social; a card only shows when its value is filled in there.',
      defaults: D.channels,
      fields: [
        { key: 'email', title: 'Email' },
        { key: 'whatsapp', title: 'WhatsApp' },
        { key: 'viber', title: 'Viber' },
        { key: 'telegram', title: 'Telegram' },
      ],
    }),
    itemList({
      name: 'addresses',
      title: 'Addresses',
      group: 'contact',
      description:
        'Lines at the bottom of the page. Leave empty to show the built-in two estate addresses.',
      itemName: 'addressLine',
      itemTitle: 'Address',
      fields: [
        {
          key: 'text',
          title: 'Address',
          description: 'e.g. Dilijan Estate — Dilijan National Park Road, Armenia',
        },
      ],
      preview: { title: 'text' },
    }),

    // ── Message form ──
    textGroup({
      name: 'form',
      title: 'Form Texts',
      group: 'form',
      description: 'The dark "Send a Message" card on the Contact Us page',
      defaults: D.form,
      fields: [
        { key: 'heading', title: 'Heading' },
        { key: 'namePlaceholder', title: 'Name Placeholder' },
        { key: 'emailPlaceholder', title: 'Email Placeholder' },
        { key: 'messagePlaceholder', title: 'Message Placeholder' },
        { key: 'submitButton', title: 'Button Text' },
        { key: 'sendingButton', title: 'Button Text While Sending' },
        { key: 'successMessage', title: 'Thank-You Message', rows: 2 },
      ],
    }),

    // ── /contact/faq ──
    textGroup({
      name: 'faq',
      title: 'Page Texts',
      group: 'faq',
      description: 'The questions themselves are managed under "FAQ"',
      defaults: D.faq,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        {
          key: 'empty',
          title: 'No Questions Text',
          description: 'Shown while there are no FAQ items',
        },
      ],
    }),
    textGroup({
      name: 'faqCategories',
      title: 'Category Names',
      group: 'faq',
      description: 'Headings above each group of questions',
      defaults: D.faqCategories,
      fields: [
        { key: 'bookings', title: 'Bookings' },
        { key: 'wine_tours', title: 'Wine Tours' },
        { key: 'getting_here', title: 'Getting Here' },
        { key: 'wine', title: 'Wine' },
        { key: 'general', title: 'General' },
      ],
    }),

    // ── /contact/agencies ──
    textGroup({
      name: 'agencies',
      title: 'Page Texts',
      group: 'agencies',
      defaults: D.agencies,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        { key: 'text', title: 'Intro Text', rows: 2 },
        { key: 'specsLabel', title: 'Specs — Section Label' },
        { key: 'offersLabel', title: 'Offers — Section Label' },
        { key: 'button', title: 'Button Text', description: 'Links to the Contact Us page' },
      ],
    }),
    itemList({
      name: 'agencySpecs',
      title: 'Operational Specs',
      group: 'agencies',
      description: `Leave empty to show the built-in specs (${D.agencySpecs.map((s) => s.label).join(', ')}).`,
      itemName: 'agencySpec',
      itemTitle: 'Spec',
      fields: [
        { key: 'label', title: 'Label', description: 'e.g. Commission' },
        { key: 'value', title: 'Value', description: 'e.g. 10%' },
      ],
      preview: { title: 'label', subtitle: 'value' },
    }),
    itemList({
      name: 'agencyOffers',
      title: 'What We Offer',
      group: 'agencies',
      description: `Leave empty to show the built-in offers (${D.agencyOffers.map((o) => o.title).join(', ')}).`,
      itemName: 'agencyOffer',
      itemTitle: 'Offer',
      fields: [
        { key: 'title', title: 'Title' },
        { key: 'text', title: 'Description', rows: 2 },
      ],
      preview: { title: 'title', subtitle: 'text' },
    }),

    // ── SEO ──
    defineField({
      name: 'seo',
      title: 'SEO — Contact Us',
      type: 'seoMetadata',
      group: 'seo',
      description: `Leave empty to use: "${D.seo.contact.metaTitle}"`,
    }),
    defineField({
      name: 'faqSeo',
      title: 'SEO — FAQ',
      type: 'seoMetadata',
      group: 'seo',
      description: `Leave empty to use: "${D.seo.faq.metaTitle}"`,
    }),
    defineField({
      name: 'agenciesSeo',
      title: 'SEO — For Tour Agencies',
      type: 'seoMetadata',
      group: 'seo',
      description: `Leave empty to use: "${D.seo.agencies.metaTitle}"`,
    }),
  ],

  preview: {
    prepare: () => ({ title: 'Contact Page', subtitle: 'Contact Us, FAQ, For Tour Agencies' }),
  },
})
