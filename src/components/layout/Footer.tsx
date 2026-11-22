import Link from 'next/link'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { FooterEstates } from '@/components/layout/FooterEstates'
import { FOOTER_DEFAULTS } from '@/content/defaults'
import { fig, fs } from '@/lib/figmaScale'

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

// Figma "Footer" (wine--reserve 3577:10659), 1900px canvas: 82px top padding,
// a centred 1280px column (310px either side) holding the 4-column link grid,
// the Estates panel and the bottom bar, 24px apart — plus the faint emblem
// watermark top-right.
//
// Like every other section, the WHOLE footer scales with --figma-scale
// (viewport : 1900): the column, gaps and type are all Figma px × scale, so
// it keeps Figma's proportions — centred, same layout — on any desktop
// width. Type, gaps and paddings use fs(px) = px × --fs (set on <footer>):
// the page scale on desktop (never under 0.75), a fixed 0.9 below lg.
const COLORS = {
  bg: '#130805',
  heading: '#8a9572',
  text: '#f2eddd',
  muted: '#a8a290',
  rule: 'rgba(242,237,221,0.12)',
}

const digits = (value: string) => value.replace(/\D/g, '')

const headingStyle = {
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 600,
  fontSize: fs(13),
  lineHeight: 'normal',
  letterSpacing: fs(2.5),
  color: COLORS.heading,
} as const

const linkStyle = {
  fontFamily: 'var(--font-hanken)',
  fontSize: fs(15),
  lineHeight: 'normal',
  color: COLORS.text,
} as const

const smallStyle = {
  fontFamily: 'var(--font-hanken)',
  fontSize: fs(13),
  lineHeight: 'normal',
  color: COLORS.muted,
} as const

/** Heading (a 19px box: 13px text + 6px padding) then the items, 14px apart */
function Column({
  heading,
  label,
  className = '',
  children,
}: {
  heading: string
  label?: string
  className?: string
  children: React.ReactNode
}) {
  const Tag = label ? 'nav' : 'div'
  return (
    <Tag
      aria-label={label}
      className={`flex flex-col items-start ${className}`}
      style={{ gap: fs(14) }}
    >
      <h4 className="uppercase" style={{ ...headingStyle, height: fs(19), paddingBottom: fs(6) }}>
        {heading}
      </h4>
      {children}
    </Tag>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="transition-colors hover:!text-[var(--color-brand-gold)]"
      style={linkStyle}
    >
      {children}
    </Link>
  )
}

export function Footer({ settings, content = DEFAULT_CONTENT }: FooterProps) {
  const { texts, exploreLinks, helpLinks, locations, legalLinks } = content
  const currentYear = new Date().getFullYear()
  const instagram = settings?.instagramWineRooms ?? settings?.instagramWines

  const socialLinks = [
    instagram && { label: 'Instagram', href: instagram, icon: 'instagram' },
    settings?.telegram && {
      label: 'Telegram',
      href: `https://t.me/${settings.telegram.replace(/^@/, '')}`,
      icon: 'telegram',
    },
    settings?.facebook && { label: 'Facebook', href: settings.facebook, icon: 'facebook' },
    settings?.whatsapp && {
      label: 'WhatsApp',
      href: `https://wa.me/${digits(settings.whatsapp)}`,
      icon: 'whatsapp',
    },
    settings?.viber && {
      label: 'Viber',
      href: `viber://chat?number=%2B${digits(settings.viber)}`,
      icon: 'viber',
    },
  ].filter(Boolean) as { label: string; href: string; icon: string }[]

  return (
    <footer
      className="site-footer relative overflow-hidden"
      style={{ backgroundColor: COLORS.bg, color: COLORS.text }}
    >
      {/* Figma "Group": the emblem at 3% opacity, 752×833, hanging off the
          top-right corner (64% from the left, 150px above the top), flipped
          upside down. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG */}
      <img
        src="/home/emblem-footer.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute hidden max-w-none lg:block"
        style={{
          left: '64%',
          top: fig(-150),
          width: fig(752),
          height: fig(833),
          transform: 'scaleY(-1)',
        }}
      />

      {/* Column: full width with side padding on small screens; on desktop
          exactly 1280 × scale, centred (310 × scale either side at any width). */}
      <div
        className="relative mx-auto flex w-full flex-col px-4 pt-16 sm:px-6 lg:w-[calc(var(--figma-scale)*1280px)] lg:px-0 lg:pt-[calc(var(--figma-scale)*82px)]"
        style={{ gap: fs(24) }}
      >
        <div
          // Mobile: brand, then Explore + Help side by side (as in the mobile
          // Figma), then Contact. Desktop: four fixed 204.8px columns, 122px
          // apart (not stretched).
          className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[repeat(4,calc(var(--figma-scale)*204.8px))] lg:gap-x-[calc(var(--figma-scale)*122px)] lg:gap-y-0"
          style={{ minHeight: fig(259) }}
        >
          {/* Brand */}
          <div
            className="col-span-2 flex flex-col items-start lg:col-span-1"
            style={{ gap: fs(18) }}
          >
            <Link
              href="/"
              className="block uppercase"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 600,
                fontSize: fs(26),
                lineHeight: 'normal',
                letterSpacing: fs(4),
                color: '#faf7ee',
              }}
            >
              {texts.brandName}
            </Link>
            <p
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: fs(16),
                lineHeight: fs(24),
                maxWidth: fs(260),
                color: '#ffffff',
              }}
            >
              {texts.tagline}
            </p>
          </div>

          <Column heading={texts.exploreHeading} label={texts.exploreHeading}>
            {exploreLinks.map((link, i) => (
              <FooterLink key={`${link.href}-${i}`} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </Column>

          <Column heading={texts.helpHeading} label={texts.helpHeading}>
            {helpLinks.map((link, i) => (
              <FooterLink key={`${link.href}-${i}`} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </Column>

          <Column heading={texts.contactHeading} className="col-span-2 lg:col-span-1">
            {settings?.email && (
              <a
                href={`mailto:${settings.email}`}
                className="break-all transition-colors hover:!text-[var(--color-brand-gold)]"
                style={linkStyle}
              >
                {settings.email}
              </a>
            )}
            {settings?.phone && (
              <a
                href={`tel:${settings.phone.replace(/\s/g, '')}`}
                className="transition-colors hover:!text-[var(--color-brand-gold)]"
                style={linkStyle}
              >
                {settings.phone}
              </a>
            )}
            {socialLinks.length > 0 && (
              // Figma: 42px round hit areas with 19px icons, wrapping 4 per row
              <div
                className="flex flex-wrap items-center"
                style={{ paddingTop: fig(6), maxWidth: fs(205) }}
              >
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex items-center justify-center rounded-full transition-colors hover:bg-[rgba(242,237,221,0.1)]"
                    style={{ width: fs(42), height: fs(42) }}
                  >
                    {/* Figma's own 19px line icons (public/footer) */}
                    {/* eslint-disable-next-line @next/next/no-img-element -- tiny static SVG */}
                    <img
                      src={`/footer/${social.icon}.svg`}
                      alt=""
                      width={19}
                      height={19}
                      style={{ width: fs(19), height: fs(19) }}
                    />
                  </a>
                ))}
              </div>
            )}
          </Column>
        </div>

        {locations.length > 0 && (
          <FooterEstates
            locations={locations}
            heading={texts.locationsHeading}
            newBadge={texts.newBadge}
            directions={texts.directionsButton ?? FOOTER_DEFAULTS.texts.directionsButton}
          />
        )}

        {/* Bottom bar — Figma: 1px rule, 24px top / 32px bottom padding */}
        <div
          className="flex flex-col gap-5 border-t md:flex-row md:items-center md:justify-between"
          style={{ borderColor: COLORS.rule, paddingTop: fs(24), paddingBottom: fs(32) }}
        >
          <div
            className="flex flex-wrap items-center gap-y-2"
            style={{ ...smallStyle, columnGap: fs(24) }}
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

          <div className="flex flex-wrap items-center" style={{ gap: fs(20) }}>
            <span style={smallStyle}>{texts.responsibleText}</span>
            <LanguageSwitcher variant="pill" />
          </div>
        </div>
      </div>
    </footer>
  )
}
