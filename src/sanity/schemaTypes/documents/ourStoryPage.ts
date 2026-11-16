import { defineType, defineField } from 'sanity'
import { MdAutoStories } from 'react-icons/md'
import { itemList, textGroup } from '../helpers/textGroup'
import { OUR_STORY_DEFAULTS as D } from '../../../content/defaults'

const PARAGRAPHS = 'Separate paragraphs with an empty line.'

function photo(name: string, title: string, group: string, description?: string) {
  return defineField({
    name,
    title,
    type: 'imageWithAlt',
    group,
    description: description ?? 'Leave empty to keep the current photo.',
  })
}

/**
 * Singleton: the whole /about/our-story page — texts, lists and photos.
 * Empty fields fall back to the current built-in content (shown in grey).
 * The homepage "Our Story" section is separate: Pages → our-story.
 */
export const ourStoryPage = defineType({
  name: 'ourStoryPage',
  title: 'Our Story Page',
  type: 'document',
  icon: MdAutoStories,
  groups: [
    { name: 'intro', title: 'Intro', default: true },
    { name: 'beginning', title: 'The Beginning' },
    { name: 'mosaic', title: 'Photo Mosaic' },
    { name: 'values', title: 'Values' },
    { name: 'milestones', title: 'Milestones' },
    { name: 'principles', title: 'Principles' },
    { name: 'team', title: 'Team' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── Intro ──
    textGroup({
      name: 'intro',
      title: 'Intro Texts',
      group: 'intro',
      defaults: D.intro,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        { key: 'text', title: 'Intro Text', rows: 3 },
      ],
    }),
    photo(
      'heroImage',
      'Hero Photo',
      'intro',
      'Large photo under the intro. Leave empty to keep the current cellar photo.'
    ),

    // ── The Beginning ──
    textGroup({
      name: 'beginning',
      title: 'Section Texts',
      group: 'beginning',
      defaults: D.beginning,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
        { key: 'text', title: 'Story Text', rows: 5, description: PARAGRAPHS },
        { key: 'highlight', title: 'Highlighted Line', description: 'Bold line under the story' },
      ],
    }),
    itemList({
      name: 'timeline',
      title: 'Timeline',
      group: 'beginning',
      description: `Entries under the story, in order. Leave empty to show the built-in timeline (${D.timeline.map((t) => t.title.split(' ')[0]).join(', ')}).`,
      itemName: 'timelineEntry',
      itemTitle: 'Timeline Entry',
      fields: [
        { key: 'title', title: 'Title', description: 'Bold line, e.g. "2018 — HOVAZ begins"' },
        { key: 'text', title: 'Text', rows: 4, description: PARAGRAPHS },
      ],
      preview: { title: 'title', subtitle: 'text' },
    }),

    // ── Photo mosaic ──
    photo(
      'mosaicMain',
      'Large Photo',
      'mosaic',
      'Left, big photo. Leave empty to keep the current grapes photo.'
    ),
    photo('mosaicSmall1', 'Small Photo 1', 'mosaic'),
    photo('mosaicSmall2', 'Small Photo 2', 'mosaic'),
    textGroup({
      name: 'mosaicCard1',
      title: 'Dark Card 1 (top right)',
      group: 'mosaic',
      defaults: D.mosaicCard1,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'title', title: 'Title' },
        { key: 'text', title: 'Text', rows: 4 },
      ],
    }),
    textGroup({
      name: 'mosaicCard2',
      title: 'Dark Card 2 (bottom, full width)',
      group: 'mosaic',
      defaults: D.mosaicCard2,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'title', title: 'Title' },
        { key: 'text', title: 'Text', rows: 4 },
      ],
    }),

    // ── Values ──
    textGroup({
      name: 'values',
      title: 'Section Texts',
      group: 'values',
      defaults: D.values,
      fields: [{ key: 'heading', title: 'Heading' }],
    }),
    itemList({
      name: 'valueItems',
      title: 'Values',
      group: 'values',
      description: `Leave empty to show the built-in values (${D.valueItems.map((v) => v.title.replace(':', '')).join(', ')}).`,
      itemName: 'valueItem',
      itemTitle: 'Value',
      fields: [
        { key: 'title', title: 'Title' },
        { key: 'text', title: 'Text', rows: 5 },
      ],
      preview: { title: 'title', subtitle: 'text' },
    }),

    // ── Milestones ──
    textGroup({
      name: 'milestones',
      title: 'Section Texts',
      group: 'milestones',
      defaults: D.milestones,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
      ],
    }),
    itemList({
      name: 'milestoneItems',
      title: 'Milestones',
      group: 'milestones',
      description: 'Leave empty to show the built-in milestones (2018 – 2026).',
      itemName: 'milestoneItem',
      itemTitle: 'Milestone',
      fields: [
        { key: 'year', title: 'Year' },
        {
          key: 'text',
          title: 'Text',
          rows: 2,
          description: 'Each line is shown on its own line on desktop',
        },
      ],
      preview: { title: 'year', subtitle: 'text' },
    }),

    // ── Principles ──
    textGroup({
      name: 'principles',
      title: 'Section Texts',
      group: 'principles',
      defaults: D.principles,
      fields: [
        { key: 'eyebrow', title: 'Small Label' },
        { key: 'heading', title: 'Heading' },
      ],
    }),
    itemList({
      name: 'principleItems',
      title: 'Principles',
      group: 'principles',
      description: `Leave empty to show the built-in principles (${D.principleItems.map((p) => p.title).join(', ')}).`,
      itemName: 'principleItem',
      itemTitle: 'Principle',
      fields: [
        { key: 'title', title: 'Title' },
        { key: 'text', title: 'Text', rows: 3 },
      ],
      extraFields: [
        defineField({
          name: 'symbol',
          title: 'Symbol',
          type: 'string',
          description: 'One decorative character, e.g. ◈ ✦ ❖',
          validation: (Rule) => Rule.max(3),
        }),
      ],
      preview: { title: 'title', subtitle: 'text' },
    }),

    // ── Team ──
    textGroup({
      name: 'team',
      title: 'Section Texts',
      group: 'team',
      defaults: D.team,
      fields: [
        { key: 'heading', title: 'Heading' },
        { key: 'text', title: 'Intro Text', rows: 4 },
        { key: 'subheading', title: 'Subheading' },
      ],
    }),
    itemList({
      name: 'teamMembers',
      title: 'Team Members',
      group: 'team',
      description: `Leave empty to show the built-in team (${D.teamMembers.map((m) => m.name).join(', ')}).`,
      itemName: 'teamMember',
      itemTitle: 'Team Member',
      fields: [
        { key: 'name', title: 'Name' },
        { key: 'role', title: 'Role' },
      ],
      extraFields: [
        defineField({
          name: 'photo',
          title: 'Photo',
          type: 'imageWithAlt',
          description: 'Portrait — use the hotspot to keep the face in frame',
        }),
      ],
      preview: { title: 'name', subtitle: 'role', media: 'photo.asset' },
    }),

    // ── SEO ──
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoMetadata',
      group: 'seo',
      description: `Leave empty to use: "${D.seo.metaTitle}" and the default description.`,
    }),
  ],

  preview: {
    prepare: () => ({ title: 'Our Story Page', subtitle: '/about/our-story' }),
  },
})
