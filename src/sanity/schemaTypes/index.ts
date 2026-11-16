import type { SchemaTypeDefinition } from 'sanity'
import { imageWithAlt } from './objects/imageWithAlt'
import { seoMetadata } from './objects/seoMetadata'
import { blockContent } from './objects/blockContent'
import { wine } from './documents/wine'
import { tour } from './documents/tour'
import { event } from './documents/event'
import { siteSettings } from './documents/siteSettings'
import { faqItem } from './documents/faqItem'
import { newsItem } from './documents/newsItem'
import { estate } from './documents/estate'
import { testimonial } from './documents/testimonial'
import { winesPage } from './documents/winesPage'
import { eventsPage } from './documents/eventsPage'
import { ourStoryPage } from './documents/ourStoryPage'
import { newsPage } from './documents/newsPage'
import { contactPage } from './documents/contactPage'

export const schemaTypes: SchemaTypeDefinition[] = [
  imageWithAlt,
  seoMetadata,
  blockContent,
  wine,
  tour,
  event,
  siteSettings,
  faqItem,
  newsItem,
  estate,
  testimonial,
  winesPage,
  eventsPage,
  ourStoryPage,
  newsPage,
  contactPage,
]
