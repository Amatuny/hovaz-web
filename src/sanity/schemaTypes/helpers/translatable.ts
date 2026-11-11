import { defineField, type FieldDefinition } from 'sanity'

/** Non-default locales editors translate into. English is the main field itself. */
export const TRANSLATION_LOCALES = [
  { id: 'hy', title: 'Armenian (Հայերեն)' },
  { id: 'ru', title: 'Russian (Русский)' },
] as const

type LooseField = FieldDefinition & {
  name: string
  title?: string
  rows?: number
  of?: unknown
  options?: { layout?: string; list?: unknown }
}

/**
 * Returns the English field unchanged, followed by a collapsible
 * `<name>_i18n` object holding `hy` and `ru` versions of the same type.
 * Lives in the same group/fieldset as the English field, so translations sit
 * right under the original in Studio. Translations have no validation — the
 * site falls back to English when they're empty.
 *
 * Usage:  fields: [...translatable(defineField({ name: 'title', type: 'string' }))]
 */
export function translatable(field: FieldDefinition): FieldDefinition[] {
  const f = field as LooseField
  const label = f.title ?? f.name

  const shape: Record<string, unknown> = { type: f.type }
  if (f.rows) shape.rows = f.rows
  if (f.of) shape.of = f.of
  if (f.options?.layout && !f.options.list) shape.options = { layout: f.options.layout }

  const i18n = defineField({
    name: `${f.name}_i18n`,
    title: `${label} — Translations`,
    type: 'object',
    ...(f.group ? { group: f.group } : {}),
    ...(f.fieldset ? { fieldset: f.fieldset } : {}),
    ...(f.hidden ? { hidden: f.hidden } : {}),
    options: { collapsible: true, collapsed: true },
    fields: TRANSLATION_LOCALES.map(
      (locale) => ({ name: locale.id, title: locale.title, ...shape }) as FieldDefinition
    ),
  })

  return [field, i18n as FieldDefinition]
}
