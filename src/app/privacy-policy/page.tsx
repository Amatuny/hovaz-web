// src/app/privacy-policy/page.tsx
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Image from 'next/image'
import { PrivacyToc } from '@/components/sections/PrivacyToc'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Hovaz Winery collects, uses and protects the information you share when you browse, book a tasting, or get in touch.',
}

// Bump this whenever the policy text changes (section 11 promises it).
const LAST_UPDATED = '14 November 2026'

const CONTACT = {
  name: 'Hovaz Winery',
  address: 'Proshyan Valley Road, Ararat Valley, Armenia',
  email: 'privacy@vineyardreserve.am',
  phone: '+374 91 234 567',
}

const IN_SHORT = [
  { title: 'We collect little', text: 'Just what we need to book and host your visit.' },
  { title: 'We never sell it', text: 'Your data stays with us and the people serving you.' },
  { title: 'Allergies stay private', text: 'Shared only with the kitchen, deleted 30 days after.' },
  { title: "You're in control", text: 'Ask to see, fix or delete your data any time.' },
]

type Row = [label: string, text: string]

interface Section {
  id: string
  title: string
  body: ReactNode
}

const COLORS = {
  heading: '#1a1d17',
  body: '#4f4542',
  accent: 'rgba(93,110,82,0.92)',
  line: '#e6e0d2',
}

function P({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-hanken)',
        fontSize: '15px',
        lineHeight: '24px',
        color: COLORS.body,
      }}
    >
      {children}
    </p>
  )
}

function Table({ rows }: { rows: Row[] }) {
  return (
    <dl className="overflow-hidden rounded-[14px] bg-white">
      {rows.map(([label, text]) => (
        <div
          key={label}
          className="grid gap-1 border-b px-4 py-3.5 last:border-b-0 sm:grid-cols-[180px_1fr] sm:gap-6"
          style={{ borderColor: '#efebe2', fontFamily: 'var(--font-hanken)', fontSize: '13px' }}
        >
          <dt style={{ fontWeight: 600, color: COLORS.heading }}>{label}</dt>
          <dd style={{ lineHeight: '19px', color: COLORS.body }}>{text}</dd>
        </div>
      ))}
    </dl>
  )
}

const SECTIONS: Section[] = [
  {
    id: 'who-we-are',
    title: 'Who we are',
    body: (
      <>
        <P>
          Hovaz Winery (“we”, “us”) operates two estates in Armenia — Dilijan Wine Rooms, our
          founding estate, and Hovaz Wine Boutique in Proshyan, Ararat Valley — and this website. We
          are the controller of the personal data described in this policy.
        </P>
        <P>
          We follow the Law of the Republic of Armenia on Protection of Personal Data. Where
          visitors from the EU or UK book with us, we also apply the principles of the GDPR.
        </P>
      </>
    ),
  },
  {
    id: 'what-we-collect',
    title: 'What we collect',
    body: (
      <>
        <P>
          We only ask for what we need to host you well. Depending on how you use the site, this may
          include:
        </P>
        <Table
          rows={[
            [
              'Booking details',
              'Name, email, phone number, estate, experience, date, time, number of guests and any food you add.',
            ],
            [
              'Your notes',
              'Anything you write in the comment field — for example allergies, dietary needs or accessibility requests.',
            ],
            ['Messages', 'What you send us by email, WhatsApp, Viber or Telegram.'],
            ['Newsletter', 'Your email address, if you subscribe to Letters from the valley.'],
            [
              'Partner agencies',
              'Company name, contact person, business email and phone, and group booking history.',
            ],
            [
              'Technical data',
              'Browser type, device, approximate location from IP address and pages visited.',
            ],
          ]}
        />
      </>
    ),
  },
  {
    id: 'allergies',
    title: 'Allergies and dietary needs',
    body: (
      <>
        <P>
          Information about allergies or health conditions is sensitive. We use it only to prepare
          your tasting and meal safely, share it only with the kitchen and host on the day, and
          delete it 30 days after your visit.
        </P>
        <P>You never have to tell us — but if you do, it helps us look after you.</P>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: 'How we use your information',
    body: (
      <>
        <P>We use your data for clear, limited purposes:</P>
        <Table
          rows={[
            [
              'Your booking',
              'To confirm, prepare, change or cancel your visit, and to contact you about it. Necessary to fulfil our agreement with you.',
            ],
            [
              'Custom requests',
              'So a manager can review anything bespoke and confirm the final price.',
            ],
            ['Newsletter', 'To send seasonal news and event invitations — only with your consent.'],
            [
              'Improving the site',
              'To understand which pages are useful, using aggregated analytics.',
            ],
            ['Legal duties', 'To keep records required by Armenian tax and accounting law.'],
          ]}
        />
      </>
    ),
  },
  {
    id: 'age-verification',
    title: 'Age verification',
    body: (
      <P>
        Our site is for people of legal drinking age (18+). When you confirm your age, we store a
        small note in your browser so we don&apos;t ask again. We don&apos;t record your date of
        birth, and we don&apos;t knowingly collect data from anyone under 18.
      </P>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and local storage',
    body: (
      <>
        <P>We use a small number of cookies and similar technologies:</P>
        <Table
          rows={[
            [
              'Essential',
              'Age confirmation, language choice and keeping your booking form intact while you fill it in.',
            ],
            ['Analytics', 'Anonymous visit statistics. Only set if you accept them.'],
          ]}
        />
      </>
    ),
  },
  {
    id: 'sharing',
    title: 'Who we share it with',
    body: (
      <>
        <P>
          We never sell your data. We share it only with people who help us run your visit, under
          agreements that protect it:
        </P>
        <Table
          rows={[
            ['Our team', "Hosts, sommeliers and kitchen staff at the estate you're visiting."],
            ['Service providers', 'Email delivery, website hosting and analytics providers.'],
            [
              'Messaging apps',
              "If you contact us on WhatsApp, Viber or Telegram, that app's own privacy policy also applies.",
            ],
            [
              'Travel agencies',
              'If an agency booked for you, we share booking status with that agency.',
            ],
            ['Authorities', 'Only where the law requires it.'],
          ]}
        />
      </>
    ),
  },
  {
    id: 'retention',
    title: 'How long we keep it',
    body: (
      <P>
        Booking records are kept for 3 years, then deleted or anonymised; financial records are kept
        as long as Armenian law requires. Allergy and dietary notes are deleted 30 days after your
        visit. Newsletter data is kept until you unsubscribe.
      </P>
    ),
  },
  {
    id: 'security',
    title: 'How we protect it',
    body: (
      <P>
        Data is sent over encrypted connections, stored with providers who meet recognised security
        standards, and accessible only to staff who need it. You can manage or cancel a booking with
        your confirmation number and email — no account or password is needed, so there&apos;s less
        for anyone to steal.
      </P>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your rights',
    body: (
      <>
        <P>You can ask us at any time to:</P>
        <Table
          rows={[
            ['Access', 'Get a copy of the data we hold about you.'],
            ['Correct', "Fix anything that's wrong or out of date."],
            ['Delete', 'Erase your data where we no longer need it.'],
            ['Object or restrict', 'Stop or limit certain uses, including marketing.'],
            [
              'Withdraw consent',
              'Unsubscribe from the newsletter in one click, or turn off analytics.',
            ],
            [
              'Complain',
              "Contact the Personal Data Protection Agency of Armenia, or your local authority if you're in the EU or UK.",
            ],
          ]}
        />
      </>
    ),
  },
  {
    id: 'changes-and-contact',
    title: 'Changes and contact',
    body: (
      <>
        <P>
          If we change this policy, we&apos;ll update the date at the top and, for significant
          changes, let recent guests know by email.
        </P>
        <P>
          {CONTACT.name} · {CONTACT.address} ·{' '}
          <a href={`mailto:${CONTACT.email}`} className="underline-offset-2 hover:underline">
            {CONTACT.email}
          </a>{' '}
          ·{' '}
          <a
            href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
            className="underline-offset-2 hover:underline"
          >
            {CONTACT.phone}
          </a>
        </P>
      </>
    ),
  },
]

const eyebrow = {
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 600,
  fontSize: '10px',
  letterSpacing: '2.5px',
} as const

const chip = {
  fontFamily: 'var(--font-hanken)',
  fontSize: '12px',
  color: COLORS.heading,
} as const

export default function PrivacyPolicyPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="mx-auto w-full max-w-[1100px] px-4 pt-24 pb-16 sm:px-6 lg:pt-36">
        {/* ── Header ── */}
        <header className="max-w-[540px]">
          <p className="uppercase" style={{ ...eyebrow, color: COLORS.accent }}>
            Legal
          </p>
          <h1
            className="mt-3"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 600,
              fontSize: 'clamp(36px, 3.6vw, 52px)',
              lineHeight: 1.15,
              color: COLORS.heading,
            }}
          >
            Privacy Policy
          </h1>
          <div className="mt-3">
            <P>
              How we collect, use and protect the information you share when you browse, book a
              tasting, or get in touch with us.
            </P>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#f1ebdc] px-3.5 py-1.5" style={chip}>
              Last updated {LAST_UPDATED}
            </span>
            <span className="rounded-full bg-[#f1ebdc] px-3.5 py-1.5" style={chip}>
              About 6 min read
            </span>
          </div>
        </header>

        {/* ── In short ── */}
        <section
          aria-labelledby="in-short"
          className="mt-16 rounded-[20px] px-6 py-8 sm:px-9 lg:mt-28"
          style={{ backgroundColor: 'var(--color-brand-olive)' }}
        >
          <h2
            id="in-short"
            className="uppercase"
            style={{ ...eyebrow, color: 'rgba(255,255,255,0.7)' }}
          >
            In short
          </h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {IN_SHORT.map((item) => (
              <li
                key={item.title}
                className="border-t pt-6"
                style={{ borderColor: 'rgba(255,255,255,0.15)' }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 500,
                    fontSize: '17px',
                    color: '#ffffff',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-2"
                  style={{
                    fontFamily: 'var(--font-hanken)',
                    fontSize: '12.5px',
                    lineHeight: '19px',
                    color: 'rgba(255,255,255,0.78)',
                  }}
                >
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Contents + body ── */}
        <div className="mt-16 grid gap-12 lg:mt-28 lg:grid-cols-[220px_1fr] lg:gap-11">
          <aside className="lg:self-start">
            <PrivacyToc items={SECTIONS.map(({ id, title }) => ({ id, title }))} />
          </aside>

          <div>
            {SECTIONS.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="scroll-mt-32 border-t pt-10 pb-8"
                style={{ borderColor: COLORS.line }}
              >
                <h2
                  id={`${section.id}-title`}
                  className="flex items-baseline gap-3"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 600,
                    fontSize: 'clamp(22px, 1.9vw, 27px)',
                    lineHeight: 1.25,
                    color: COLORS.heading,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: 'var(--font-hanken)',
                      fontWeight: 400,
                      fontSize: '11px',
                      color: COLORS.accent,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {section.title}
                </h2>
                <div className="mt-4 flex flex-col gap-4">{section.body}</div>
              </section>
            ))}
          </div>
        </div>

        <Image
          src="/about/ornament-bottom.svg"
          alt=""
          width={666.622}
          height={83.3613}
          className="mx-auto mt-24 h-auto w-full max-w-[560px]"
        />
      </div>
    </div>
  )
}
