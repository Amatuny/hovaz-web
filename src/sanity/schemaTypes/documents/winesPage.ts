import { defineType, defineField } from 'sanity'
import { MdWineBar } from 'react-icons/md'
import { textGroup } from '../helpers/textGroup'
import { WINES_DEFAULTS } from '../../../content/defaults'

/**
 * Singleton: every fixed text on the Our Wines pages (/wines and each wine's
 * own page) plus the wine cards. The wines themselves live in "Wines".
 * Empty fields fall back to the built-in text shown in grey.
 */
export const winesPage = defineType({
  name: 'winesPage',
  title: 'Our Wines Page',
  type: 'document',
  icon: MdWineBar,
  groups: [
    { name: 'list', title: 'Wines List', default: true },
    { name: 'detail', title: 'Wine Detail Page' },
    { name: 'cards', title: 'Wine Cards' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── /wines ──
    textGroup({
      name: 'header',
      title: 'Page Header',
      group: 'list',
      defaults: WINES_DEFAULTS.list,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        { key: 'text', title: 'Intro Text', rows: 2 },
        {
          key: 'comingSoon',
          title: '"Coming Soon" Text',
          description: 'Shown when a collection has no wines yet',
        },
      ],
    }),
    textGroup({
      name: 'hovazCollection',
      title: 'Hovaz Collection',
      group: 'list',
      defaults: WINES_DEFAULTS.hovaz,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        { key: 'text', title: 'Description', rows: 2 },
      ],
    }),
    textGroup({
      name: 'goonehCollection',
      title: 'Gooneh Collection',
      group: 'list',
      defaults: WINES_DEFAULTS.gooneh,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        { key: 'text', title: 'Description', rows: 2 },
      ],
    }),

    // ── /wines/[slug] ──
    textGroup({
      name: 'detailLabels',
      title: 'Labels',
      group: 'detail',
      description: 'Fixed labels around each wine’s own content',
      defaults: WINES_DEFAULTS.detail,
      fields: [
        { key: 'breadcrumb', title: 'Breadcrumb Link' },
        { key: 'pairWithLabel', title: '"Pair With" Label' },
        { key: 'perfectForLabel', title: '"Perfect For" Label' },
        { key: 'agingLabel', title: 'Aging Label' },
        { key: 'bottleSizeLabel', title: 'Bottle Size Label' },
        { key: 'vintageLabel', title: 'Vintage Label' },
        { key: 'regionLabel', title: 'Region Label' },
        { key: 'varietalLabel', title: 'Varietal Label' },
        { key: 'styleLabel', title: 'Style Label' },
        { key: 'grapeLabel', title: '"The Grape" Card Label' },
        { key: 'howWeDecidedLabel', title: '"How We Decided" Card Label' },
      ],
    }),
    textGroup({
      name: 'detailEvents',
      title: 'Upcoming Events Block',
      group: 'detail',
      description: 'Shown when the wine is linked to upcoming events',
      defaults: WINES_DEFAULTS.detail,
      fields: [
        { key: 'eventsEyebrow', title: 'Small Label' },
        { key: 'eventsHeading', title: 'Heading' },
        { key: 'eventsButton', title: 'Button Text' },
      ],
    }),
    textGroup({
      name: 'detailMore',
      title: '"More Wines" Section',
      group: 'detail',
      description: 'The other wines carousel at the bottom of each wine page',
      defaults: WINES_DEFAULTS.detail,
      fields: [
        { key: 'moreEyebrow', title: 'Small Label' },
        { key: 'moreHeading', title: 'Heading' },
        { key: 'moreText', title: 'Intro Text', rows: 2 },
        { key: 'moreLink', title: 'Link Text' },
      ],
    }),

    // ── Wine cards ──
    textGroup({
      name: 'card',
      title: 'Card Texts',
      group: 'cards',
      defaults: WINES_DEFAULTS.card,
      fields: [{ key: 'discover', title: 'Hover Button Text' }],
    }),
    textGroup({
      name: 'wineTypes',
      title: 'Wine Type Labels',
      group: 'cards',
      description:
        'Shown on cards and as "Style" on the wine page. Use " · " between parts — the wine page shows it as a comma.',
      defaults: WINES_DEFAULTS.wineTypes,
      fields: [
        { key: 'red', title: 'Red' },
        { key: 'white', title: 'White' },
        { key: 'rose', title: 'Rosé' },
        { key: 'sparkling', title: 'Sparkling' },
        { key: 'orange', title: 'Orange' },
        { key: 'dessert', title: 'Dessert' },
      ],
    }),

    // ── SEO for /wines ──
    defineField({
      name: 'seo',
      title: 'SEO — Wines List Page',
      type: 'seoMetadata',
      group: 'seo',
      description: `Leave empty to use: "${WINES_DEFAULTS.seo.metaTitle}" and the default description. Each wine's own SEO is set on the wine itself.`,
    }),
  ],

  preview: {
    prepare: () => ({ title: 'Our Wines Page', subtitle: '/wines and wine detail pages' }),
  },
})
