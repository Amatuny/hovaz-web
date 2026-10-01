import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemaTypes'

const SINGLETON_TYPES = ['siteSettings']

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
            S.documentTypeListItem('testimonial').title('Testimonials'),
            S.documentTypeListItem('blogPost').title('Blog Posts'),

            S.divider(),

            S.documentTypeListItem('newsItem').title('News & Awards'),
            S.documentTypeListItem('page').title('Pages'),
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
