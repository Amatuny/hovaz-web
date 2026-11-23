import { defineType, defineField } from 'sanity'
import { MdNewspaper } from 'react-icons/md'
import { textGroup } from '../helpers/textGroup'
import { NEWS_DEFAULTS } from '../../../content/defaults'

/**
 * Singleton: every fixed text on the News & Awards pages (/news and each
 * article) plus the news cards. The stories and awards themselves live in
 * "News & Awards". Empty fields fall back to the built-in text shown in grey.
 */
export const newsPage = defineType({
  name: 'newsPage',
  title: 'News & Awards Page',
  type: 'document',
  icon: MdNewspaper,
  groups: [
    { name: 'page', title: 'Page Texts', default: true },
    { name: 'cards', title: 'Cards & Categories' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    textGroup({
      name: 'header',
      title: 'Page Header',
      group: 'page',
      defaults: NEWS_DEFAULTS.list,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        { key: 'empty', title: 'No News Text', description: 'Shown when there are no stories' },
      ],
    }),
    textGroup({
      name: 'awards',
      title: 'Awards Block',
      group: 'page',
      description: 'Shown when at least one item has category "Award"',
      defaults: NEWS_DEFAULTS.awards,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        {
          key: 'showAll',
          title: '"See All" Button',
          description: 'Opens the Awards page (/awards)',
        },
      ],
    }),
    textGroup({
      name: 'awardsPage',
      title: 'Awards Page (/awards)',
      group: 'page',
      description:
        'The full awards list. Each award row comes from News & Awards items with category "Award".',
      defaults: NEWS_DEFAULTS.awardsPage,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        { key: 'text', title: 'Intro Text', rows: 2 },
        {
          key: 'medalWord',
          title: '"Medal" Word',
          description: 'Added after the tier in each row, e.g. "Gold Medal"',
        },
        { key: 'discover', title: '"Discover the wine" Link' },
        { key: 'ctaHeading', title: 'Banner Heading', rows: 2 },
        { key: 'ctaText', title: 'Banner Text' },
        { key: 'ctaButton', title: 'Banner Button' },
        { key: 'metaTitle', title: 'SEO Title' },
        { key: 'metaDescription', title: 'SEO Description', rows: 2 },
      ],
    }),
    textGroup({
      name: 'stories',
      title: 'Story Sections',
      group: 'page',
      defaults: NEWS_DEFAULTS.stories,
      fields: [
        {
          key: 'moreHeading',
          title: '"More Stories" Heading',
          description: 'Carousel on /news and under each article',
        },
        {
          key: 'upNext',
          title: '"Up Next" Label',
          description: 'Above the next story at the end of each article',
        },
      ],
    }),

    textGroup({
      name: 'card',
      title: 'Card Texts',
      group: 'cards',
      description: 'News cards on /news, articles and the homepage Journal',
      defaults: NEWS_DEFAULTS.card,
      fields: [{ key: 'learnMore', title: '"Learn More" Link' }],
    }),
    textGroup({
      name: 'categories',
      title: 'Category Names',
      group: 'cards',
      description: 'How each News & Awards category is labelled on cards and articles',
      defaults: NEWS_DEFAULTS.categories,
      fields: [
        { key: 'award', title: 'Award' },
        { key: 'press', title: 'Press' },
        { key: 'brand_news', title: 'Brand News' },
        { key: 'release', title: 'Release' },
        { key: 'event', title: 'Event' },
      ],
    }),

    defineField({
      name: 'seo',
      title: 'SEO — News & Awards Page',
      type: 'seoMetadata',
      group: 'seo',
      description: `Leave empty to use: "${NEWS_DEFAULTS.seo.metaTitle}" and the default description. Each article's own SEO is set on the article itself.`,
    }),
  ],

  preview: {
    prepare: () => ({ title: 'News & Awards Page', subtitle: '/news, /awards and articles' }),
  },
})
