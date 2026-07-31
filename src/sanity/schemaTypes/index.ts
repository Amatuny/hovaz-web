import type { SchemaTypeDefinition } from 'sanity'
import { localizedString } from './objects/localizedString'
import { localizedText } from './objects/localizedText'
import { imageWithAlt } from './objects/imageWithAlt'
import { seoMetadata } from './objects/seoMetadata'
import { blockContent } from './objects/blockContent'
import { wine } from './documents/wine'
import { tour } from './documents/tour'
import { event } from './documents/event'
import { blogPost } from './documents/blogPost'

export const schemaTypes: SchemaTypeDefinition[] = [
  localizedString,
  localizedText,
  imageWithAlt,
  seoMetadata,
  blockContent,
  wine,
  tour,
  event,
  blogPost,
]
