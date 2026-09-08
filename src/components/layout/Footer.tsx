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

const discoverLinks = [
  { label: 'Wines', href: '/wines' },
  { label: 'Experiences', href: '/events' },
  { label: 'Our Story', href: '/about/our-story' },
]

const supportLinks = [
  { label: 'Contact', href: '/contact/form' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
]

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M15 8.5h-2c-1.1 0-2 .9-2 2V13H9v3h2v6h3v-6h2.2l.8-3H14v-2c0-.4.3-.5.6-.5H15z" />
    </svg>
  )
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    settings?.instagramWineRooms && { href: settings.instagramWineRooms, icon: <InstagramIcon /> },
    settings?.instagramWines && { href: settings.instagramWines, icon: <InstagramIcon /> },
    settings?.facebook && { href: settings.facebook, icon: <FacebookIcon /> },
  ].filter(Boolean) as { href: string; icon: React.ReactNode }[]

  return (
    <footer style={{ backgroundColor: 'var(--color-brand-dark)', color: 'rgba(255,255,255,0.7)' }}>
      <div className="container-content section-padding-sm">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div>
            <Link href="/" className="mb-4 block font-serif text-2xl tracking-widest text-white">
              HOVAZ
            </Link>
            <p className="text-caption mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Dedicated to the pursuit of excellence in Armenian winemaking, across our estates in
              Proshyan and Dilijan.
            </p>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Discover */}
          <div>
            <h4 className="text-label mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Discover
            </h4>
            <ul className="flex flex-col gap-3">
              {discoverLinks.map((link) => (
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

          {/* Support */}
          <div>
            <h4 className="text-label mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Support
            </h4>
            <ul className="flex flex-col gap-3">
              {supportLinks.map((link) => (
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
              {settings?.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-caption transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.phone && (
                <li>
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-caption transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    {settings.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-label mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Location
            </h4>
            {settings?.address ? (
              <p
                className="text-caption mb-6"
                style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}
              >
                {settings.address}
              </p>
            ) : (
              <div className="mb-6 flex flex-col gap-4">
                <p
                  className="text-caption"
                  style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}
                >
                  Proshyan Wine Rooms
                  <br />
                  Proshyan Village, Armenia
                </p>
                <p
                  className="text-caption"
                  style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}
                >
                  Dilijan Wine Rooms
                  <br />
                  Dilijan, Armenia
                </p>
              </div>
            )}
            <p className="text-caption" style={{ color: 'rgba(255,255,255,0.35)' }}>
              © {currentYear} HOVAZ Wine Rooms. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
