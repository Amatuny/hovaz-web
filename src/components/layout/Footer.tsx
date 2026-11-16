import Link from 'next/link'
import { TbBrandFacebook, TbBrandInstagram, TbBrandTelegram, TbBrandWhatsapp } from 'react-icons/tb'
import { LiaViber } from 'react-icons/lia'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { FOOTER_DEFAULTS } from '@/content/defaults'

export interface FooterContent {
  texts: typeof FOOTER_DEFAULTS.texts
  exploreLinks: { label: string; href: string }[]
  helpLinks: { label: string; href: string }[]
  locations: typeof FOOTER_DEFAULTS.locations
  legalLinks: { label: string; href: string }[]
}

interface FooterProps {
  settings: {
    email?: string
    phone?: string
    whatsapp?: string
    viber?: string
    telegram?: string
    instagramWineRooms?: string
    instagramWines?: string
    facebook?: string
  } | null
  /** Texts and links resolved from Site Settings → Footer (defaults when empty) */
  content?: FooterContent
}

const DEFAULT_CONTENT: FooterContent = {
  texts: FOOTER_DEFAULTS.texts,
  exploreLinks: FOOTER_DEFAULTS.exploreLinks,
  helpLinks: FOOTER_DEFAULTS.helpLinks,
  locations: FOOTER_DEFAULTS.locations,
  legalLinks: FOOTER_DEFAULTS.legalLinks,
}

const COLORS = {
  bg: '#130805',
  heading: '#8a9572',
  text: '#f2eddd',
  muted: '#aaa492',
  rule: 'rgba(242,237,221,0.08)',
}

const digits = (value: string) => value.replace(/\D/g, '')

const headingStyle = {
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 600,
  fontSize: '11px',
  letterSpacing: '2.5px',
  color: COLORS.heading,
} as const

const linkStyle = {
  fontFamily: 'var(--font-hanken)',
  fontSize: '13px',
  lineHeight: '18px',
  color: COLORS.text,
} as const

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-4 uppercase" style={headingStyle}>
      {children}
    </h4>
  )
}

function LinkList({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {links.map((link, i) => (
        <li key={`${link.href}-${i}`}>
          <Link
            href={link.href}
            className="transition-colors hover:!text-[var(--color-brand-gold)]"
            style={linkStyle}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function Footer({ settings, content = DEFAULT_CONTENT }: FooterProps) {
  const { texts, exploreLinks, helpLinks, locations, legalLinks } = content
  const currentYear = new Date().getFullYear()
  const instagram = settings?.instagramWineRooms ?? settings?.instagramWines

  const socialLinks = [
    instagram && { label: 'Instagram', href: instagram, icon: <TbBrandInstagram /> },
    settings?.telegram && {
      label: 'Telegram',
      href: `https://t.me/${settings.telegram.replace(/^@/, '')}`,
      icon: <TbBrandTelegram />,
    },
    settings?.facebook && { label: 'Facebook', href: settings.facebook, icon: <TbBrandFacebook /> },
    settings?.whatsapp && {
      label: 'WhatsApp',
      href: `https://wa.me/${digits(settings.whatsapp)}`,
      icon: <TbBrandWhatsapp />,
    },
    settings?.viber && {
      label: 'Viber',
      href: `viber://chat?number=%2B${digits(settings.viber)}`,
      icon: <LiaViber />,
    },
  ].filter(Boolean) as { label: string; href: string; icon: React.ReactNode }[]

  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: COLORS.bg, color: COLORS.text }}
    >
      <div className="relative mx-auto max-w-[1190px] px-4 pt-20 pb-10 sm:px-6 lg:pt-28">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="block uppercase"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 500,
                fontSize: '22px',
                letterSpacing: '3.5px',
                lineHeight: 1,
                color: '#ffffff',
              }}
            >
              {texts.brandName}
            </Link>
            <p
              className="mt-6 max-w-[200px]"
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: '13px',
                lineHeight: '20px',
                color: '#ffffff',
              }}
            >
              {texts.tagline}
            </p>
          </div>

          {/* Explore */}
          <nav aria-label={texts.exploreHeading}>
            <ColumnHeading>{texts.exploreHeading}</ColumnHeading>
            <LinkList links={exploreLinks} />
          </nav>

          {/* Help */}
          <nav aria-label={texts.helpHeading}>
            <ColumnHeading>{texts.helpHeading}</ColumnHeading>
            <LinkList links={helpLinks} />
          </nav>

          {/* Locations */}
          <div>
            <ColumnHeading>{texts.locationsHeading}</ColumnHeading>
            <ul className="flex flex-col gap-6">
              {locations.map((loc, i) => (
                <li key={`${loc.name}-${i}`}>
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={loc.href}
                      className="transition-colors hover:!text-[var(--color-brand-gold)]"
                      style={{
                        fontFamily: 'var(--font-hanken)',
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '19px',
                        color: COLORS.text,
                      }}
                    >
                      {loc.name}
                    </Link>
                    {loc.isNew && (
                      <span
                        className="mt-0.5 shrink-0 rounded-full px-2 py-1 uppercase"
                        style={{
                          fontFamily: 'var(--font-montserrat)',
                          fontWeight: 700,
                          fontSize: '8px',
                          letterSpacing: '1px',
                          lineHeight: 1,
                          color: COLORS.text,
                          backgroundColor: 'var(--color-brand-burgundy)',
                        }}
                      >
                        {texts.newBadge}
                      </span>
                    )}
                  </div>
                  <p
                    className="mt-2"
                    style={{
                      fontFamily: 'var(--font-hanken)',
                      fontSize: '12px',
                      lineHeight: '19px',
                      color: COLORS.muted,
                    }}
                  >
                    {loc.detail}
                    <br />
                    {loc.hours}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <ColumnHeading>{texts.contactHeading}</ColumnHeading>
            <ul className="flex flex-col gap-3">
              {settings?.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="break-all transition-colors hover:!text-[var(--color-brand-gold)]"
                    style={linkStyle}
                  >
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.phone && (
                <li>
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, '')}`}
                    className="transition-colors hover:!text-[var(--color-brand-gold)]"
                    style={linkStyle}
                  >
                    {settings.phone}
                  </a>
                </li>
              )}
            </ul>

            {socialLinks.length > 0 && (
              <div className="mt-6 grid w-max grid-cols-4 gap-x-5 gap-y-4 pl-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex items-center justify-center text-[16px] text-[#f2eddd] transition-colors hover:text-[var(--color-brand-gold)]"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-20 flex flex-col gap-6 border-t pt-6 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: COLORS.rule }}
        >
          <div
            className="flex flex-wrap items-center gap-x-6 gap-y-2"
            style={{ fontFamily: 'var(--font-hanken)', fontSize: '11.5px', color: COLORS.muted }}
          >
            <span>
              © {currentYear} {texts.copyright}
            </span>
            {legalLinks.map((link, i) => (
              <Link
                key={`${link.href}-${i}`}
                href={link.href}
                className="transition-colors hover:text-[#f2eddd]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <span
              style={{ fontFamily: 'var(--font-hanken)', fontSize: '11.5px', color: COLORS.muted }}
            >
              {texts.responsibleText}
            </span>
            <LanguageSwitcher variant="pill" />
          </div>
        </div>
      </div>
    </footer>
  )
}
