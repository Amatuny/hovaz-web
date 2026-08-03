// src/components/layout/Footer.tsx
import Link from 'next/link'

interface FooterProps {
  settings: {
    email?: string
    phone?: string
    address?: string
    instagramWineRooms?: string
    instagramWines?: string
    facebook?: string
  } | null
}

const footerLinks = {
  Wines: [
    { label: 'Areni Reserve', href: '/wines/areni-reserve' },
    { label: 'Areni Red', href: '/wines/areni-red' },
    { label: 'Areni Rosé', href: '/wines/areni-rose' },
    { label: 'Kangun White', href: '/wines/kangun-white' },
    { label: 'Kangun Reserve', href: '/wines/kangun-reserve' },
    { label: 'Sparkling Rosé', href: '/wines/sparkling-rose' },
  ],
  Experiences: [
    { label: 'Guided Tasting', href: '/events/guided-tasting' },
    { label: 'Wine & Guitar', href: '/events/wine-guitar' },
    { label: 'Wine Blending', href: '/events/wine-blending' },
    { label: 'Food & Wine Pairing', href: '/events/food-wine-pairing' },
    { label: 'Group Events', href: '/events/group-events' },
    { label: "What's On", href: '/events/whats-on' },
  ],
  About: [
    { label: 'Our Story', href: '/about/our-story' },
    { label: 'The Leopard', href: '/about/the-leopard' },
    { label: 'The Team', href: '/about/the-team' },
    { label: 'Dilijan Wine Rooms', href: '/about/dilijan' },
    { label: 'Proshyan Wine Rooms', href: '/about/proshyan' },
    { label: 'Sustainability', href: '/about/sustainability' },
  ],
  Info: [
    { label: 'News & Awards', href: '/news/awards' },
    { label: 'Press & Media', href: '/news/press' },
    { label: 'For Agencies', href: '/contact/agencies' },
    { label: 'FAQ', href: '/contact/faq' },
    { label: 'Find Us', href: '/contact' },
    { label: 'Contact Form', href: '/contact/form' },
  ],
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{ backgroundColor: 'var(--color-brand-dark)', color: 'rgba(255,255,255,0.7)' }}>
      {/* Main footer content */}
      <div className="container-content section-padding-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="font-serif text-2xl tracking-widest text-white block mb-4">
              HOVAZ
            </Link>
            <p className="text-caption mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Wine Rooms & Hospitality
              <br />
              Armenia
            </p>

            {/* Social links */}
            <div className="flex flex-col gap-2">
              {settings?.instagramWineRooms && (
                <a
                  href={settings.instagramWineRooms}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-caption transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  @hovazwinerooms
                </a>
              )}
              {settings?.instagramWines && (
                <a
                  href={settings.instagramWines}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-caption transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  @hovaz_wines
                </a>
              )}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-label mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {section}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-caption transition-colors hover:text-white"
                      style={{ color: 'rgba(255,255,255,0.6)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Addresses */}
        <div className="divider-gold mt-16 pt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-label mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Dilijan Wine Rooms
            </p>
            <p className="text-caption" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Dilijan, Armenia
            </p>
          </div>
          <div>
            <p className="text-label mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Proshyan Wine Rooms
            </p>
            <p className="text-caption" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Proshyan Village, Armenia
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="container-content py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-caption" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © {currentYear} HOVAZ Wine Rooms. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {settings?.email && (
              <a
                href={`mailto:${settings.email}`}
                className="text-caption transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {settings.email}
              </a>
            )}
            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="text-caption transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {settings.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
