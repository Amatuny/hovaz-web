import { defineField, type FieldDefinition } from 'sanity'
import { translatable } from './translatable'

export interface TextSpec {
  /** Key in the defaults object, also the stored field name */
  key: string
  title: string
  /** Multi-line textarea instead of a single line */
  rows?: number
  description?: string
}

/**
 * A collapsible box of translatable text fields for one section of a page.
 * Each field shows the site's built-in text as its placeholder, so editors
 * can see what's displayed while the field is still empty.
 *
 *   textGroup({ name: 'homeWines', title: 'Wines Section', group: 'homepage',
 *     defaults: HOME_DEFAULTS.wines, fields: [{ key: 'heading', title: 'Heading' }] })
 */
export function textGroup({
  name,
  title,
  group,
  description,
  defaults,
  fields,
  extraFields = [],
}: {
  name: string
  title: string
  group?: string
  description?: string
  defaults: Record<string, string>
  fields: TextSpec[]
  extraFields?: FieldDefinition[]
}): FieldDefinition {
  return defineField({
    name,
    title,
    type: 'object',
    ...(group ? { group } : {}),
    description,
    options: { collapsible: true, collapsed: true },
    fields: [...fields.flatMap((spec) => textField(spec, defaults[spec.key])), ...extraFields],
  })
}

/** One translatable string/text field whose placeholder is the built-in default. */
export function textField(spec: TextSpec, placeholder?: string): FieldDefinition[] {
  return translatable(
    defineField({
      name: spec.key,
      title: spec.title,
      type: spec.rows ? 'text' : 'string',
      ...(spec.rows ? { rows: spec.rows } : {}),
      description:
        spec.description ?? (placeholder ? 'Leave empty to use the text shown in grey' : undefined),
      placeholder,
    } as FieldDefinition)
  )
}

/**
 * A list of items editors can add, remove and reorder (timeline entries,
 * team members, …). Each item gets translatable text fields plus any
 * extra fields (e.g. a photo). An empty list means the built-in items.
 */
export function itemList({
  name,
  title,
  group,
  description,
  itemName,
  itemTitle,
  fields,
  extraFields = [],
  preview,
}: {
  name: string
  title: string
  group?: string
  description?: string
  itemName: string
  itemTitle: string
  fields: TextSpec[]
  extraFields?: FieldDefinition[]
  /** Item fields shown in the list row */
  preview: { title: string; subtitle?: string; media?: string }
}): FieldDefinition {
  return defineField({
    name,
    title,
    type: 'array',
    ...(group ? { group } : {}),
    description: description ?? 'Leave empty to show the built-in items.',
    of: [
      {
        type: 'object',
        name: itemName,
        title: itemTitle,
        fields: [
          ...fields.flatMap((spec) => textField({ ...spec, description: spec.description ?? '' })),
          ...extraFields,
        ],
        preview: { select: preview },
      },
    ],
  })
}

/**
 * A list of links (label + path), e.g. a footer column. Empty list = the
 * site's built-in links, which are listed in the field description.
 */
export function linkList({
  name,
  title,
  group,
  defaults,
}: {
  name: string
  title: string
  group?: string
  defaults: { label: string; href: string }[]
}): FieldDefinition {
  return defineField({
    name,
    title,
    type: 'array',
    ...(group ? { group } : {}),
    description: `Leave empty to use the default links: ${defaults.map((l) => l.label).join(', ')}`,
    of: [
      {
        type: 'object',
        name: 'linkItem',
        title: 'Link',
        fields: [
          ...textField({ key: 'label', title: 'Label', description: '' }),
          defineField({
            name: 'href',
            title: 'Link',
            type: 'string',
            description: 'Site path like /wines, or a full URL',
            validation: (Rule) => Rule.required(),
          }),
        ],
        preview: { select: { title: 'label', subtitle: 'href' } },
      },
    ],
  })
}
