// src/components/sections/ContactUs.tsx
// The /contact/form page body (Figma "contuct us" frame, node 722:13269).
import Image from 'next/image'
import { fig } from '@/lib/figmaScale'
import { ContactMessageForm } from '@/components/ui/ContactMessageForm'
import type { SiteSettings } from '@/types/sanity'

const INK = '#1a1d17'

const ESTATES = [
  'Proshyan Estate — Proshyan Valley Road, Yerevan, Armenia',
  'Dilijan Estate — Dilijan National Park Road, Armenia',
]

interface Channel {
  label: string
  value: string
  href: string
  glyph: string
  color: string
}

const digits = (phone: string) => phone.replace(/\D/g, '')

// Only channels with a value in Site Settings are shown.
function getChannels(settings: SiteSettings | null): Channel[] {
  const channels: (Channel | null)[] = [
    settings?.email
      ? {
          label: 'Email',
          value: settings.email,
          href: `mailto:${settings.email}`,
          glyph: '✉',
          color: '#2e3a28',
        }
      : null,
    settings?.whatsapp
      ? {
          label: 'WhatsApp',
          value: settings.whatsapp,
          href: `https://wa.me/${digits(settings.whatsapp)}`,
          glyph: '☏',
          color: '#4c8d56',
        }
      : null,
    settings?.viber
      ? {
          label: 'Viber',
          value: settings.viber,
          href: `viber://chat?number=%2B${digits(settings.viber)}`,
          glyph: '◔',
          color: '#7a59b5',
        }
      : null,
    settings?.telegram
      ? {
          label: 'Telegram',
          value: settings.telegram,
          href: `https://t.me/${settings.telegram.replace(/^@/, '')}`,
          glyph: '➤',
          color: '#357fb2',
        }
      : null,
  ]
  return channels.filter((channel): channel is Channel => channel !== null)
}

function ChannelCard({ channel }: { channel: Channel }) {
  const external = channel.href.startsWith('https://')
  return (
    <a
      href={channel.href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="flex w-full items-center bg-white transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
      style={{
        borderRadius: fig(24),
        padding: fig(22),
        gap: fig(18),
        filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.05))',
      }}
    >
      <span
        aria-hidden
        className="flex shrink-0 items-center justify-center"
        style={{
          width: fig(48),
          height: fig(48),
          borderRadius: fig(24),
          backgroundColor: channel.color,
          fontFamily: 'var(--font-hanken)',
          fontSize: fig(20),
          color: '#fdfcf8',
        }}
      >
        {channel.glyph}
      </span>
      <span className="flex min-w-0 flex-col" style={{ gap: fig(2) }}>
        <span
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 500,
            fontSize: fig(17),
            lineHeight: 1.33,
            color: INK,
          }}
        >
          {channel.label}
        </span>
        <span
          className="break-all"
          style={{
            fontFamily: 'var(--font-hanken)',
            fontSize: fig(14),
            lineHeight: 1.2,
            color: '#4f4542',
          }}
        >
          {channel.value}
        </span>
      </span>
    </a>
  )
}

export function ContactUs({ settings }: { settings: SiteSettings | null }) {
  const channels = getChannels(settings)

  return (
    <div style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div
        className="container-content flex flex-col items-center"
        style={{ gap: fig(82), paddingBlock: fig(82) }}
      >
        <div className="w-full">
          <div className="flex flex-col" style={{ gap: fig(16), maxWidth: fig(860) }}>
            <p
              className="uppercase"
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 600,
                fontSize: fig(12),
                letterSpacing: fig(3),
                color: '#8a9572',
              }}
            >
              Get in Touch
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 600,
                fontSize: fig(44),
                lineHeight: 1.33,
                color: INK,
              }}
            >
              Contact Us
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: fig(17),
                lineHeight: fig(27.2),
                color: '#4f4542',
              }}
            >
              Questions about a visit, a booking, or the wines themselves — reach us however&apos;s
              easiest.
            </p>
          </div>
        </div>

        <div
          className="flex w-full flex-wrap items-start"
          style={{ maxWidth: fig(1200), gap: fig(56) }}
        >
          {channels.length > 0 && (
            <div
              className="flex min-w-[min(300px,100%)] flex-[478_0_0] flex-col"
              style={{ gap: fig(27) }}
            >
              {channels.map((channel) => (
                <ChannelCard key={channel.label} channel={channel} />
              ))}
            </div>
          )}
          <div className="flex min-w-[min(320px,100%)] flex-[538_0_0]">
            <ContactMessageForm />
          </div>
        </div>

        <address className="flex w-full flex-col not-italic" style={{ gap: fig(10) }}>
          {ESTATES.map((estate) => (
            <p
              key={estate}
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: fig(24),
                lineHeight: 1.2,
                color: INK,
              }}
            >
              {estate}
            </p>
          ))}
        </address>

        <div
          className="flex w-full items-center justify-center overflow-hidden"
          style={{ height: fig(100) }}
        >
          <Image
            src="/about/ornament-bottom.svg"
            alt=""
            width={666.622}
            height={83.3613}
            style={{ width: fig(666.622), height: fig(83.3613) }}
          />
        </div>
      </div>
    </div>
  )
}
