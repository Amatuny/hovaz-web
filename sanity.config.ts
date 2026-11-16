import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemaTypes'

const SINGLETON_TYPES = [
  'siteSettings',
  'winesPage',
  'eventsPage',
  'ourStoryPage',
  'newsPage',
  'contactPage',
]

export default defineConfig({
  name: 'default',
  basePath: '/studio',
  title: 'HOVAZ',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton — Site Settings appears once, no list view
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),

            // Fixed texts of each page — one document per page
            S.listItem()
              .title('Pages')
              .child(
                S.list()
                  .title('Pages')
                  .items([
                    S.listItem()
                      .title('Events Page')
                      .id('eventsPage')
                      .schemaType('eventsPage')
                      .child(S.document().schemaType('eventsPage').documentId('eventsPage')),
                    S.listItem()
                      .title('Our Wines Page')
                      .id('winesPage')
                      .schemaType('winesPage')
                      .child(S.document().schemaType('winesPage').documentId('winesPage')),
                    S.listItem()
                      .title('Our Story Page')
                      .id('ourStoryPage')
                      .schemaType('ourStoryPage')
                      .child(S.document().schemaType('ourStoryPage').documentId('ourStoryPage')),
                    S.listItem()
                      .title('News & Awards Page')
                      .id('newsPage')
                      .schemaType('newsPage')
                      .child(S.document().schemaType('newsPage').documentId('newsPage')),
                    S.listItem()
                      .title('Contact Page')
                      .id('contactPage')
                      .schemaType('contactPage')
                      .child(S.document().schemaType('contactPage').documentId('contactPage')),
                  ])
              ),

            S.divider(),

            // Regular document types
            S.documentTypeListItem('estate').title('Estates'),

            S.listItem()
              .title('Wines')
              .child(
                S.list()
                  .title('Wines')
                  .items([
                    S.listItem()
                      .title('Hovaz Collection')
                      .child(
                        S.documentList()
                          .title('Hovaz Collection')
                          .schemaType('wine')
                          .filter(
                            '_type == "wine" && (collection == "hovaz" || !defined(collection))'
                          )
                      ),
                    S.listItem()
                      .title('Gooneh Collection')
                      .child(
                        S.documentList()
                          .title('Gooneh Collection')
                          .schemaType('wine')
                          .filter('_type == "wine" && collection == "gooneh"')
                      ),
                    S.divider(),
                    S.listItem()
                      .title('All Wines')
                      .child(S.documentTypeList('wine').title('All Wines')),
                  ])
              ),

            S.documentTypeListItem('tour').title('Experiences'),
            S.documentTypeListItem('event').title('Events'),
            S.documentTypeListItem('newsItem').title('News & Awards'),

            S.divider(),

            S.documentTypeListItem('testimonial').title('Testimonials'),
            S.documentTypeListItem('faqItem').title('FAQ'),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    // Prevent creating more than one siteSettings document
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.includes(schemaType)),
  },
})
