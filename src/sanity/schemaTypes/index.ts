import type { SchemaTypeDefinition } from 'sanity'

// Objects — reusable building blocks
import { localizedString } from './objects/localizedString'
import { localizedText } from './objects/localizedText'
import { imageWithAlt } from './objects/imageWithAlt'
import { seoMetadata } from './objects/seoMetadata'
import { blockContent } from './objects/blockContent'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  localizedString,
  localizedText,
  imageWithAlt,
  seoMetadata,
  blockContent,
]
