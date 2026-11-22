import { defineType, defineField } from 'sanity'
import { translatable } from '../helpers/translatable'
import { linkList, textField, textGroup } from '../helpers/textGroup'
import { FOOTER_DEFAULTS, HOME_DEFAULTS } from '../../../content/defaults'
import { MdSettings } from 'react-icons/md'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: MdSettings,
  groups: [
    { name: 'homepage', title: 'Homepage', default: true },
    { name: 'navigation', title: 'Navigation' },
    { name: 'footer', title: 'Footer' },
    { name: 'contact', title: 'Contact & Social' },
  ],
  fields: [
    // ─── HOMEPAGE ───
    ...translatable(
      defineField({
        name: 'heroHeadline',
        title: 'Hero Headline',
        type: 'string',
        group: 'homepage',
        description: 'Main headline shown on homepage hero section',
        validation: (Rule) => Rule.required(),
      })
    ),
    ...translatable(
      defineField({
        name: 'heroSubheadline',
        title: 'Hero Subheadline',
        type: 'string',
        group: 'homepage',
        description: 'Subtitle shown below the main headline',
      })
    ),
    ...translatable(
      defineField({
        name: 'heroLocation',
        title: 'Hero Location Label',
        type: 'string',
        group: 'homepage',
        description: 'Small eyebrow label above the headline, e.g. "Proshyan Valley, Armenia"',
      })
    ),
    defineField({
      name: 'heroGallery',
      title: 'Hero Gallery',
      type: 'array',
      group: 'homepage',
      of: [{ type: 'imageWithAlt' }],
      description:
        'Images shown in the homepage hero carousel. The active slide carries the headline and CTAs — add at least 3 for the full carousel effect.',
      validation: (Rule) =>
        Rule.required().min(3).error('Add at least 3 images for the hero carousel'),
    }),
    ...translatable(
      defineField({
        name: 'heroCtaText',
        title: 'Hero CTA Button Text',
        type: 'string',
        group: 'homepage',
        initialValue: 'Book Your Experience',
      })
    ),
    ...translatable(
      defineField({
        name: 'heroSecondaryCtaText',
        title: 'Hero Secondary Button Text',
        type: 'string',
        group: 'homepage',
        description: 'Outline button next to the main CTA — links to the Wines page',
        initialValue: 'Explore Our Wines',
      })
    ),
    defineField({
      name: 'ageGateImage',
      title: 'Age Check Image',
      type: 'imageWithAlt',
      group: 'homepage',
      description:
        'Photo in the "Are you 18 or older?" window shown on a first visit. Falls back to the first hero image.',
    }),
    defineField({
      name: 'wineTourGallery',
      title: 'Wine Experience Gallery',
      type: 'array',
      group: 'homepage',
      of: [{ type: 'imageWithAlt' }],
      description:
        'Photos for the homepage "Wine Experience" section — one large image plus 4 smaller ones (5 total).',
      validation: (Rule) => Rule.min(5).warning('Add 5 images: 1 large + 4 smaller'),
    }),

    // Homepage section texts — one collapsible box per section, top to bottom
    textGroup({
      name: 'homeEstates',
      title: 'Estates Section — Texts',
      group: 'homepage',
      description: '"Choose Your Location First" — the two estate cards',
      defaults: HOME_DEFAULTS.estates,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        {
          key: 'statLabel',
          title: 'Card Stat Label',
          description: 'Shown next to the big number on each card, one word per line',
        },
        { key: 'linkText', title: 'Card Link Text' },
      ],
    }),
    textGroup({
      name: 'homeWineTour',
      title: 'Wine Experience Section — Texts',
      group: 'homepage',
      defaults: HOME_DEFAULTS.wineTour,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        { key: 'text', title: 'Intro Text', rows: 3 },
        { key: 'linkText', title: 'Link Text' },
      ],
    }),
    textGroup({
      name: 'homeWines',
      title: 'Wines Section — Texts',
      group: 'homepage',
      defaults: HOME_DEFAULTS.wines,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        { key: 'text', title: 'Intro Text', rows: 3 },
        { key: 'linkText', title: 'Link Text' },
        {
          key: 'endHeading',
          title: 'Last Card — Heading',
          rows: 2,
          description:
            'Two lines — press Enter between them. Leave empty to use the text shown in grey',
        },
        {
          key: 'endButton',
          title: 'Last Card — Button',
          rows: 2,
          description:
            'Two lines — press Enter between them. Leave empty to use the text shown in grey',
        },
      ],
    }),
    textGroup({
      name: 'homeStory',
      title: 'Our Story Section',
      group: 'homepage',
      description: 'The short story teaser on the homepage, linking to the Our Story page',
      defaults: HOME_DEFAULTS.story,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        { key: 'subtitle', title: 'Subtitle', rows: 3 },
        { key: 'panelLabel', title: 'Dark Panel Label' },
        {
          key: 'panelText',
          title: 'Dark Panel Text',
          rows: 5,
          description: 'Separate paragraphs with an empty line',
        },
        { key: 'linkText', title: 'Link Text' },
      ],
      extraFields: [
        defineField({
          name: 'image',
          title: 'Photo',
          type: 'imageWithAlt',
          description: 'Shown left of the dark panel. Leave empty for a plain burgundy block.',
        }),
      ],
    }),
    textGroup({
      name: 'homeAwards',
      title: 'Recognition Section — Texts',
      group: 'homepage',
      description: 'Awards themselves come from News & Awards (category: Award)',
      defaults: HOME_DEFAULTS.awards,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        { key: 'brandFactLabel', title: 'Last Item — Title' },
        { key: 'brandFactMeta', title: 'Last Item — Subtitle' },
        {
          key: 'linkText',
          title: 'Link Text',
          description: 'Link under the awards (e.g. "See All Awards")',
        },
      ],
    }),
    textGroup({
      name: 'homeEvents',
      title: 'Events Section — Texts',
      group: 'homepage',
      defaults: HOME_DEFAULTS.events,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        { key: 'text', title: 'Intro Text', rows: 3 },
        { key: 'linkText', title: 'Link Text' },
        {
          key: 'endHeading',
          title: 'Last Card — Heading',
          rows: 2,
          description:
            'Two lines — press Enter between them. Leave empty to use the text shown in grey',
        },
        {
          key: 'endButton',
          title: 'Last Card — Button',
          rows: 2,
          description:
            'Two lines — press Enter between them. Leave empty to use the text shown in grey',
        },
      ],
    }),
    defineField({
      name: 'mascot',
      title: 'Mascot Section',
      type: 'object',
      group: 'homepage',
      description:
        'The homepage "Meet The Mascot" section. The section is hidden if Heading is empty.',
      options: { collapsible: true, collapsed: true },
      fields: [
        ...textField({ key: 'eyebrow', title: 'Small Label' }, HOME_DEFAULTS.mascot.eyebrow),
        ...textField(
          { key: 'storyLabel', title: 'Story Card Label' },
          HOME_DEFAULTS.mascot.storyLabel
        ),
        ...translatable(
          defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            description: 'e.g. Meet Hovaz, Our Leopard',
          })
        ),
        ...translatable(
          defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'text',
            rows: 2,
            description: 'Short intro shown under the heading',
          })
        ),
        defineField({
          name: 'image',
          title: 'Main Photo',
          type: 'imageWithAlt',
        }),
        ...translatable(
          defineField({
            name: 'imageBadgeTitle',
            title: 'Photo Badge Title',
            type: 'string',
            description: 'e.g. Rescued 2021 — overlaid on the main photo',
          })
        ),
        ...translatable(
          defineField({
            name: 'imageBadgeSubtitle',
            title: 'Photo Badge Subtitle',
            type: 'string',
            description: 'e.g. Found injured, now thriving under full-time care.',
          })
        ),
        ...translatable(
          defineField({
            name: 'story',
            title: 'His Story',
            type: 'array',
            of: [{ type: 'text', rows: 4 }],
            validation: (Rule) => Rule.max(3),
            description: 'Up to 3 paragraphs shown in the dark "His Story" card',
          })
        ),
        defineField({
          name: 'gallery',
          title: 'Gallery',
          type: 'array',
          of: [{ type: 'imageWithAlt' }],
          options: { layout: 'grid' },
          validation: (Rule) => Rule.max(2),
          description: 'Up to 2 photos shown under the story card',
        }),
      ],
    }),
    textGroup({
      name: 'homeJournal',
      title: 'Journal Section — Texts',
      group: 'homepage',
      defaults: HOME_DEFAULTS.journal,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        { key: 'text', title: 'Intro Text', rows: 3 },
        { key: 'linkText', title: 'Link Text' },
        {
          key: 'endHeading',
          title: 'Last Card — Heading',
          rows: 2,
          description:
            'Two lines — press Enter between them. Leave empty to use the text shown in grey',
        },
        {
          key: 'endButton',
          title: 'Last Card — Button',
          rows: 2,
          description:
            'Two lines — press Enter between them. Leave empty to use the text shown in grey',
        },
      ],
    }),
    textGroup({
      name: 'homeNewsletter',
      title: 'Newsletter Section — Texts',
      group: 'homepage',
      defaults: HOME_DEFAULTS.newsletter,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        { key: 'text', title: 'Intro Text', rows: 2 },
        { key: 'placeholder', title: 'Email Field Placeholder' },
        { key: 'buttonText', title: 'Button Text' },
      ],
    }),

    // ─── FOOTER ───
    textGroup({
      name: 'footer',
      title: 'Footer Texts',
      group: 'footer',
      defaults: FOOTER_DEFAULTS.texts,
      fields: [
        { key: 'brandName', title: 'Brand Name' },
        { key: 'tagline', title: 'Tagline', rows: 2 },
        { key: 'exploreHeading', title: 'Column 1 Heading' },
        { key: 'helpHeading', title: 'Column 2 Heading' },
        { key: 'locationsHeading', title: 'Estates Heading' },
        { key: 'directionsButton', title: 'Get Directions Button' },
        { key: 'contactHeading', title: 'Contact Heading' },
        { key: 'newBadge', title: '"New" Badge Text' },
        {
          key: 'copyright',
          title: 'Copyright Name',
          description: 'Shown after "© <current year>"',
        },
        { key: 'responsibleText', title: 'Responsible Drinking Note' },
      ],
    }),
    linkList({
      name: 'footerExploreLinks',
      title: 'Column 1 Links',
      group: 'footer',
      defaults: FOOTER_DEFAULTS.exploreLinks,
    }),
    linkList({
      name: 'footerHelpLinks',
      title: 'Column 2 Links',
      group: 'footer',
      defaults: FOOTER_DEFAULTS.helpLinks,
    }),
    defineField({
      name: 'footerLocations',
      title: 'Locations',
      type: 'array',
      group: 'footer',
      description: `Leave empty to use the defaults: ${FOOTER_DEFAULTS.locations.map((l) => l.name).join(', ')}`,
      of: [
        {
          type: 'object',
          name: 'footerLocation',
          title: 'Location',
          fields: [
            ...textField({ key: 'name', title: 'Name', description: '' }),
            defineField({
              name: 'href',
              title: 'Link',
              type: 'string',
              description: 'e.g. /estates?estate=dilijan',
            }),
            ...textField({
              key: 'detail',
              title: 'Detail Line',
              description: 'e.g. Proshyan · Ararat Valley',
            }),
            ...textField({
              key: 'hours',
              title: 'Opening Hours',
              description: 'e.g. Tue-Sun · 11:00-20:00',
            }),
            defineField({
              name: 'isNew',
              title: 'Show "New" Badge',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'mapQuery',
              title: 'Map Location',
              type: 'string',
              description:
                'Where the footer map pin and "Get directions" point. Best: coordinates as "lat,lng" (in Google Maps, right-click the spot and click the numbers to copy them), e.g. 40.7406,44.8630. A full address also works. Leave empty to search by name + detail line.',
              validation: (rule) => rule.max(200),
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'detail' } },
        },
      ],
    }),
    linkList({
      name: 'footerLegalLinks',
      title: 'Bottom Bar Links',
      group: 'footer',
      defaults: FOOTER_DEFAULTS.legalLinks,
    }),

    // ─── NAVIGATION ───
    defineField({
      name: 'navigation',
      title: 'Header Navigation',
      type: 'array',
      group: 'navigation',
      description:
        'Links in the top navigation bar, in display order. Leave empty to use the built-in default menu.',
      of: [
        {
          type: 'object',
          name: 'navItem',
          title: 'Menu Item',
          fields: [
            ...translatable(
              defineField({
                name: 'label',
                title: 'Label',
                type: 'string',
                validation: (Rule) => Rule.required(),
              })
            ),
            defineField({
              name: 'href',
              title: 'Link',
              type: 'string',
              description:
                'Site path, e.g. /wines or /about/our-story. Optional when the item has dropdown items.',
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as { children?: unknown[] } | undefined
                  if (value || parent?.children?.length) return true
                  return 'Add a link, or add dropdown items below'
                }),
            }),
            defineField({
              name: 'children',
              title: 'Dropdown Items',
              type: 'array',
              description: 'Optional — turns this item into a dropdown menu',
              of: [
                {
                  type: 'object',
                  name: 'navSubItem',
                  title: 'Dropdown Item',
                  fields: [
                    ...translatable(
                      defineField({
                        name: 'label',
                        title: 'Label',
                        type: 'string',
                        validation: (Rule) => Rule.required(),
                      })
                    ),
                    defineField({
                      name: 'href',
                      title: 'Link',
                      type: 'string',
                      description: 'e.g. /estates?estate=proshyan',
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                  preview: { select: { title: 'label', subtitle: 'href' } },
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href', children: 'children' },
            prepare({ title, subtitle, children }) {
              const count = Array.isArray(children) ? children.length : 0
              return {
                title,
                subtitle: count ? `${subtitle} · ${count} dropdown item(s)` : subtitle,
              }
            },
          },
        },
      ],
    }),

    // ─── CONTACT & SOCIAL ───
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.required().email().error('Enter a valid email address'),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      group: 'contact',
      description: 'e.g. +374 77 123 456',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Number',
      type: 'string',
      group: 'contact',
      description: 'Shown on the Contact page, e.g. +374 77 123 456',
    }),
    defineField({
      name: 'viber',
      title: 'Viber Number',
      type: 'string',
      group: 'contact',
      description: 'Shown on the Contact page, e.g. +374 77 123 456',
    }),
    defineField({
      name: 'telegram',
      title: 'Telegram Username',
      type: 'string',
      group: 'contact',
      description: 'Shown on the Contact page, e.g. @hovazwines',
    }),
    defineField({
      name: 'instagramWineRooms',
      title: 'Instagram — Wine Rooms',
      type: 'url',
      group: 'contact',
      description: '@hovazwinerooms profile URL',
    }),
    defineField({
      name: 'instagramWines',
      title: 'Instagram — Wines',
      type: 'url',
      group: 'contact',
      description: '@hovaz_wines profile URL',
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook URL',
      type: 'url',
      group: 'contact',
    }),
  ],

  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Global configuration',
      }
    },
  },
})
