// src/content/defaults.ts
// Built-in English copy for every text editors can override in Sanity Studio.
// Used in two places so they can never drift apart:
//  - the Studio schema shows each value as the field's placeholder
//  - the site falls back to it whenever the Sanity field is empty

export interface LinkDefault {
  label: string
  href: string
}

export const HOME_DEFAULTS = {
  estates: {
    eyebrow: 'Two Estates',
    heading: 'Choose Your Location First',
    statLabel: 'Type Of Experiences',
    linkText: 'Find Your',
  },
  wineTour: {
    eyebrow: 'Wine Experience',
    heading: 'Experience that will make you back to us',
    text: 'Small-group tastings and dinners in the cellar and among the vines, held through the harvest season.',
    linkText: 'Find your experience',
  },
  wines: {
    eyebrow: 'The Cellar',
    heading: 'Wines of the Valley',
    text: 'Estate-grown across Vayots Dzor, Aragatsotn and the Ararat Valley — small lots, made slowly.',
    linkText: 'Explore The Cellar',
    /** Last card in the wines carousel — two lines each */
    endHeading: 'Browse\nAll Wines',
    endButton: 'See Every\nVintage',
  },
  story: {
    eyebrow: 'Our Story',
    heading: 'Our Story',
    subtitle:
      'Founded in 2018 on terraces above Proshyan, the winery sits where wild forest meets cultivated valley — a boundary we try to keep visible in every bottle. Fruit is picked by hand and fermented in small, native-yeast batches.',
    panelLabel: 'Our Story',
    /** Paragraphs separated by an empty line */
    panelText:
      'Founded in 2018 on terraces above Proshyan, the winery sits where wild forest meets cultivated valley — a boundary we try to keep visible in every bottle. Fruit is picked by hand and fermented in small, native-yeast batches.',
    linkText: 'Read Our Story',
  },
  awards: {
    eyebrow: 'Recognition',
    heading: 'Quietly Awarded',
    brandFactLabel: 'Women-led Winery',
    brandFactMeta: 'Since 2018',
    linkText: 'See All Awards',
  },
  events: {
    eyebrow: 'Upcoming',
    heading: 'Discover All Events',
    text: "Small-group tastings and dinners in the cellar and among the vines — see what's coming next, or look back at what we've hosted across both estates.",
    linkText: "See What's Coming",
    /** Last card in the events carousel — two lines each */
    endHeading: 'View the\nFull Calendar',
    endButton: 'See Every\nEvent',
  },
  mascot: {
    eyebrow: 'Meet The Mascot',
    storyLabel: 'His Story',
  },
  journal: {
    eyebrow: 'The Journal',
    heading: "A Taste Of What's New",
    text: 'New releases, harvest updates, and the small things worth knowing between visits — written by the people actually making the wine.',
    linkText: 'Read The Journal',
    /** Last card in the journal carousel — two lines each */
    endHeading: 'View the\nFull Journal',
    endButton: 'See All\nNews',
  },
  newsletter: {
    eyebrow: 'Stay Close',
    heading: 'Letters From The Forest',
    text: 'Upcoming evenings, new releases, and notes from the cellar — a few times a season.',
    placeholder: 'your email address',
    buttonText: 'Subscribe',
  },
}

export const WINES_DEFAULTS = {
  /** /wines — page header */
  list: {
    eyebrow: 'The Cellar',
    heading: 'Wines of the Valley',
    text: 'Estate-grown across Vayots Dzor, Aragatsotn and the Ararat Valley — small lots, made slowly.',
    comingSoon: 'Coming soon.',
  },
  hovaz: {
    eyebrow: 'Elegant · Characterful · Structured',
    heading: 'Hovaz Collection',
    text: 'Our signature wines, made from Armenian grape varieties and created for discovery, good food and special moments.',
  },
  gooneh: {
    eyebrow: 'Fresh · Fruity · Playful',
    heading: 'Gooneh Collection',
    text: 'Easy-going wines made for relaxed moments, parties, picnics and spontaneous gatherings.',
  },
  /** /wines/[slug] — labels around each wine's own content */
  detail: {
    breadcrumb: 'Wines',
    pairWithLabel: 'PAIR WITH',
    perfectForLabel: 'PERFECT FOR —',
    agingLabel: 'Aging',
    bottleSizeLabel: 'Bottle Size',
    vintageLabel: 'Vintage',
    regionLabel: 'Region',
    varietalLabel: 'Varietal',
    styleLabel: 'Style',
    eventsEyebrow: 'Taste It At',
    eventsHeading: 'Upcoming events pouring this wine',
    eventsButton: 'Reserve Your Seat',
    grapeLabel: 'The Grape',
    howWeDecidedLabel: 'How We Decided',
    moreEyebrow: 'The Cellar',
    moreHeading: 'Wines of the Valley',
    moreText:
      'Estate-grown across Vayots Dzor, Aragatsotn and the Ararat Valley — small lots, made slowly.',
    moreLink: 'Explore the Cellar',
  },
  /** Wine cards, everywhere they appear */
  card: {
    discover: 'Discover',
  },
  /** Wine type → label. Cards show it as is; the detail page swaps " · " for ", ". */
  wineTypes: {
    red: 'Red · Dry',
    white: 'White · Dry',
    rose: 'Rosé · Dry',
    sparkling: 'White · Sparkling',
    orange: 'Orange · Dry',
    dessert: 'Dessert · Sweet',
  },
  seo: {
    metaTitle: 'Our Wines',
    metaDescription:
      'Discover the HOVAZ wine collection — expressions of Armenian terroir crafted from indigenous grape varieties, across the Hovaz and Gooneh lines.',
  },
}

export const EVENTS_DEFAULTS = {
  /** /events — page header */
  list: {
    eyebrow: 'Events',
    heading: 'Evenings Worth The Drive',
    text: 'Tastings, dinners, and cellar evenings across our two estates. From crisp whites picked at first light to reds aged slow in old oak — each wine carries the same terraces, the same hands, the same patience.',
    empty: 'No events scheduled right now — check back soon.',
    /** Second, smaller heading above the search bar */
    searchHeading: 'Find Your Next Hovaz Experience',
    searchText: 'Search events by name, date, or location.',
  },
  /** /events — search bar above the grid */
  filters: {
    searchPlaceholder: 'Search events',
    dateLabel: 'Date',
    datePlaceholder: 'Choose date',
    clearDate: 'Clear date',
    locationLabel: 'Location',
    locationPlaceholder: 'Choose location',
    searchButton: 'Search',
    noResults: 'No events match your search.',
  },
  reviews: {
    eyebrow: 'Reviews',
    heading: 'What Guests Are Saying',
  },
  /** /events/[slug] — labels around each event's own content */
  detail: {
    breadcrumb: 'Experiences',
    welcomePrefix: 'welcome to',
    estateSuffix: 'Estate',
    defaultLocation: 'HOVAZ Wine Rooms',
    aboutEyebrow: 'Experience',
    aboutHeading: 'About the Experience',
    includesEyebrow: 'Experience',
    journalEyebrow: 'Journal',
    journalHeading: 'discover Our events',
    journalText:
      'From crisp whites picked at first light to reds aged slow in old oak — each wine carries the same terraces, the same hands, the same patience.',
    collectionTitle: 'Explore the Complete Collection',
    collectionButton: 'See All Events',
  },
  /** Reservation panel on each event page */
  form: {
    dateTimeLabel: 'Date & Time',
    locationLabel: 'Location',
    durationLabel: 'Duration',
    guestsLabel: 'Number of Guests',
    guestSingular: 'guest',
    guestPlural: 'guests',
    nameLabel: 'Full Name',
    namePlaceholder: 'Your name',
    emailLabel: 'Email for Confirmation',
    emailPlaceholder: 'you@example.com',
    phoneLabel: 'Phone Number',
    phonePlaceholder: '+374 77 000 000',
    notesLabel: 'Allergies or Special Requests',
    notesPlaceholder: 'e.g. nut allergy, dietary restrictions, accessibility needs',
    submitButton: 'Reserve Your Seat',
    sendingButton: 'Sending…',
    cancellationNote: 'Free cancellation up to 48 hours before',
    successTitle: 'Reservation Requested',
    successText:
      "Thank you for your interest in {title}. We'll confirm availability by email within 24 hours.",
  },
  /** Event cards, everywhere they appear (incl. the homepage strip) */
  card: {
    reserve: 'Reserve Your Seat',
    pastEvent: 'Past Event',
  },
  seo: {
    metaTitle: 'Evenings Worth The Drive',
    metaDescription:
      'Tastings, dinners, and cellar evenings across our two HOVAZ estates — browse and book upcoming events.',
  },
}

export type EventCardLabels = typeof EVENTS_DEFAULTS.card
export type EventFilterLabels = typeof EVENTS_DEFAULTS.filters
export type ReservationFormLabels = typeof EVENTS_DEFAULTS.form

/**
 * /about/our-story. Lists (timeline, values, …) are used as a whole: once
 * editors add their own items in Sanity, these defaults are no longer shown.
 * Paragraphs in long texts are separated by an empty line.
 */
export const OUR_STORY_DEFAULTS = {
  intro: {
    eyebrow: 'Our Story',
    heading: 'The forest and the valley',
    text: 'Founded in 2018 on terraces above Proshyan, Vineyard Reserve sits where wild forest meets cultivated valley — a boundary we try to keep visible in every bottle.',
  },
  beginning: {
    eyebrow: 'The Beginning',
    heading: 'From family table to estate',
    text: 'HOVAZ began in 2018 with a passion for Armenian wine and a desire to explore how people could experience it differently. From the beginning, we have believed that wine is more interesting when you can get closer to what happens behind the bottle— to the craft, the decisions, the people and the process.',
    highlight: 'That idea has shaped how HOVAZ has evolved.',
  },
  timeline: [
    {
      title: '2018 — HOVAZ begins',
      text: 'HOVAZ is founded by a group of young Armenian wine enthusiasts with a shared passion for wine and viticulture.',
    },
    {
      title: '2022 — HOVAZ Wine Rooms, Dilijan',
      text: 'Our Wine Rooms became the first expression of our idea of bringing people closer to wine.\n\nIn Dilijan, we created an experience that allows guests to engage directly with the sparkling wine production process — going beyond tasting to discover how sparkling wine is actually made. It remains the only experience of its kind in Armenia.',
    },
    {
      title: '2026 — HOVAZ Wine Boutique, Proshyan',
      text: 'Our new Wine Boutique takes participation one step further.',
    },
  ],
  mosaicCard1: {
    eyebrow: 'The Beginning',
    title: 'From family table to estate',
    text: 'Hovaz began with a handful of family rows above Dilijan, planted for the household table long before they were planted for a label. In 2018 that plot became an estate — small, deliberately so, working with growers who still pick fruit by hand and ferment in native-yeast batches.',
  },
  mosaicCard2: {
    eyebrow: 'How we decided',
    title: 'Built for the long table',
    text: "We wanted a red that could sit through a whole evening — poured early, still good three hours later. Twelve months in Caucasian oak softened the tannins without masking the fruit, and it's stayed our benchmark for every reserve since.",
  },
  values: {
    heading: 'What we stand for',
  },
  valueItems: [
    {
      title: 'SUSTAINABILITY:',
      text: 'We believe a modern wine business should take responsibility for the resources it uses. Our HOVAZ Wine Boutique in Proshyan operates entirely on solar energy, supported by solar generators. It is one of the practical ways we are working to reduce our environmental footprint and make our operations more sustainable. For us, sustainability is not simply a principle. It is something we put into practice.',
    },
    {
      title: 'WILDLIFE CONSERVATION:',
      text: "HOVAZ takes its name from the Armenian word for leopard. The leopard is one of Armenia's most threatened wild animals, and its survival depends on it on continued protection of its habitat and population. HOVAZ has adopted an Armenian leopard and supports its conservation as part of: our commitment to protecting Armenia's wildlife. The leopard is not simply part of our name. It is part of what we stand behind.",
    },
    {
      title: 'WOMEN EMPOWERMENT',
      text: "HOVAZ is a women-founded business, and promoting women's participation in wine is an important part of who we are. We believe there should be more opportunities for women to build careers, lead, create and shape the future of the wine industry. We want HOVAZ to contribute to a wine culture where women are visible not only as: wine lovers, but as professionals, leaders, entrepreneurs and creators.",
    },
  ],
  milestones: {
    eyebrow: 'Milestones',
    heading: 'Along the way',
  },
  /** Each line of `text` is shown on its own line on desktop */
  milestoneItems: [
    { year: '2018', text: 'Family rows above Dilijan become a working estate.' },
    { year: '2019', text: 'First vintage released — 800 bottles, sold locally.' },
    { year: '2021', text: "Plans begin for a second site in Proshyan's Ararat Valley." },
    { year: '2023', text: 'Reserve Collection introduced, our first library wines.' },
    {
      year: '2026',
      text: 'Proshyan Wine Rooms opens — two estates\nnow welcome tastings, tours and private events.',
    },
  ],
  principles: {
    eyebrow: 'What Guides Us',
    heading: 'Principles over process',
  },
  principleItems: [
    {
      symbol: '◈',
      title: 'Hand-Grown',
      text: 'Every parcel is hand-harvested and fermented in small, native-yeast batches.',
    },
    {
      symbol: '✦',
      title: 'Two Terroirs',
      text: "Proshyan's high valley and Dilijan's forested hills, kept distinct, never blended for convenience.",
    },
    {
      symbol: '❖',
      title: 'Slow, on Purpose',
      text: 'Small lots, patient aging, and releases only when a wine is ready — not on a schedule.',
    },
  ],
  team: {
    heading: 'The people behind HOVAZ',
    text: 'HOVAZ is built by people who care about wine and about what happens around it. Our team brings together winemaking, hospitality, creativity and a willingness to experiment. We believe the best experiences come from people who know their craft, enjoy sharing it and remain curious about what comes next.',
    subheading: 'Meet the HOVAZ team',
  },
  teamMembers: [
    { name: 'Lilit Avetisyan', role: 'Founder & Winemaker' },
    { name: 'Nelli Petrosyan', role: 'Estate Director, Dilijan' },
    { name: 'Sirvard Amatuni', role: 'Estate Director, Proshyan' },
  ],
  seo: {
    metaTitle: 'Our Story',
    metaDescription:
      'The story behind HOVAZ Wine Rooms — passion for Armenian wine and hospitality.',
  },
}

export const NEWS_DEFAULTS = {
  /** /news — page header */
  list: {
    eyebrow: 'Journal',
    heading: 'News & Awards',
    empty: 'News coming soon.',
  },
  /** /news — awards block (items come from News & Awards, category Award) */
  awards: {
    eyebrow: 'Recognition',
    heading: 'Award-winning estate wines',
    showAll: 'See All Awards',
    showFewer: 'Show Fewer Awards',
  },
  /** /awards — the full list of awards (Figma "Awards"); "See All Awards" on /news links here */
  awardsPage: {
    eyebrow: 'Recognition',
    heading: 'Awards & Honors',
    text: 'Every medal below was won by a wine from our Dilijan cellar — the founding estate where Hovaz began in 2019.',
    medalWord: 'Medal',
    discover: 'Discover the wine',
    ctaHeading: 'Taste the medal winners in Dilijan Rooms and Proshyan Boutique.',
    ctaText: 'Every award-winning wine is poured at our Reserve Tasting.',
    ctaButton: 'Book an Experience',
    metaTitle: 'Awards & Honors',
    metaDescription: 'Medals and trophies won by HOVAZ wines at international competitions.',
  },
  /** /news and each article */
  stories: {
    moreHeading: 'More Stories',
    upNext: 'Up Next',
  },
  /** News cards, everywhere they appear (incl. the homepage Journal) */
  card: {
    learnMore: 'Learn More',
  },
  /** Category name shown on cards and articles */
  categories: {
    award: 'Award',
    press: 'Feature',
    brand_news: 'News',
    release: 'Release',
    event: 'Event',
  },
  seo: {
    metaTitle: 'News & Awards',
    metaDescription: 'Awards, new releases, press features and estate news from HOVAZ.',
  },
}

export const CONTACT_DEFAULTS = {
  /** /contact/form */
  contact: {
    eyebrow: 'Get in Touch',
    heading: 'Contact Us',
    text: "Questions about a visit, a booking, or the wines themselves — reach us however's easiest.",
  },
  /** Labels on the channel cards; the numbers come from Site Settings → Contact & Social */
  channels: {
    email: 'Email',
    whatsapp: 'WhatsApp',
    viber: 'Viber',
    telegram: 'Telegram',
  },
  addresses: [
    { text: 'Proshyan Estate — Proshyan Valley Road, Yerevan, Armenia' },
    { text: 'Dilijan Estate — Dilijan National Park Road, Armenia' },
  ],
  form: {
    heading: 'Send a Message',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'Email address',
    messagePlaceholder: 'How can we help?',
    submitButton: 'Send Message',
    sendingButton: 'Sending…',
    successMessage: 'Thank you for reaching out. We will get back to you within 24 hours.',
  },
  /** /contact/faq — the questions themselves live in "FAQ" */
  faq: {
    eyebrow: 'Help',
    heading: 'Frequently Asked Questions',
    empty: 'FAQ coming soon.',
  },
  faqCategories: {
    bookings: 'Bookings',
    wine_tours: 'Wine Experiences',
    getting_here: 'Getting Here',
    wine: 'Wine',
    general: 'General',
  },
  /** /contact/agencies */
  agencies: {
    eyebrow: 'Partners',
    heading: 'For Tour Agencies',
    text: 'We work with tour operators and travel agencies to create memorable wine experiences for groups visiting Armenia.',
    specsLabel: 'Operational Specs',
    offersLabel: 'What We Offer',
    button: 'Send a Group Inquiry',
  },
  agencySpecs: [
    { label: 'Minimum group', value: '8 guests' },
    { label: 'Maximum group', value: '40 guests' },
    { label: 'Languages', value: 'EN · HY · RU' },
    { label: 'Private venue hire', value: 'Available' },
    { label: 'Custom menus', value: 'On request' },
    { label: 'Invoice billing', value: 'Available' },
    { label: 'Commission', value: '10%' },
    { label: 'Lead time', value: '48 hours min' },
  ],
  agencyOffers: [
    {
      title: 'Guided Wine Tastings',
      text: 'Led by our sommelier — covers HOVAZ wines and Armenian wine history.',
    },
    {
      title: 'Vineyard & Cellar Tours',
      text: 'Behind-the-scenes access to our winemaking process.',
    },
    { title: 'Food & Wine Pairings', text: 'Traditional Armenian cuisine paired with our wines.' },
    { title: 'Private Events', text: 'Full venue hire for exclusive group experiences.' },
  ],
  seo: {
    contact: {
      metaTitle: 'Contact Us',
      metaDescription:
        'Questions about a visit, a booking, or the wines — get in touch with HOVAZ.',
    },
    faq: {
      metaTitle: 'FAQ',
      metaDescription: 'Frequently asked questions about HOVAZ Wine Rooms.',
    },
    agencies: {
      metaTitle: 'For Tour Agencies',
      metaDescription:
        'Partner with HOVAZ Wine Rooms — group bookings, pricing and media kit for tour agencies.',
    },
  },
}

export type ContactFormLabels = typeof CONTACT_DEFAULTS.form

export type NewsCardLabels = {
  card: typeof NEWS_DEFAULTS.card
  categories: typeof NEWS_DEFAULTS.categories
}

export type WineCardLabels = {
  card: typeof WINES_DEFAULTS.card
  wineTypes: typeof WINES_DEFAULTS.wineTypes
}

export const FOOTER_DEFAULTS = {
  texts: {
    brandName: 'Hovaz',
    tagline:
      "Dedicated to the pursuit of excellence in viticulture across Armenia's most historic terroirs.",
    exploreHeading: 'Explore',
    helpHeading: 'Help',
    locationsHeading: 'Estates',
    directionsButton: 'Get directions →',
    contactHeading: 'Contact',
    newBadge: 'New',
    copyright: 'Hovaz Winery',
    responsibleText: '18+ · Please enjoy responsibly',
  },
  exploreLinks: [
    { label: 'Our Wines', href: '/wines' },
    { label: 'Experiences', href: '/experiences' },
    { label: 'Events', href: '/events' },
    { label: 'Our Story', href: '/about/our-story' },
    { label: 'Hovaz, the Leopard', href: '/#leopard' },
    { label: 'News & Awards', href: '/news' },
  ] as LinkDefault[],
  helpLinks: [
    { label: 'Contact us', href: '/contact/form' },
    { label: 'FAQ', href: '/contact/faq' },
    { label: 'Manage or cancel booking', href: '/booking/cancel' },
    { label: 'For travel agencies', href: '/contact/agencies' },
    { label: 'Partner portal', href: '/contact/agencies' },
  ] as LinkDefault[],
  locations: [
    {
      name: 'Dilijan Wine Rooms',
      href: '/estates?estate=dilijan',
      detail: 'Founding estate · Dilijan, Tavush, Armenia',
      hours: 'Tue–Sun · 11:00–20:00',
      isNew: false,
      /** Footer map pin / directions — address or "lat,lng"; empty = name + place */
      mapQuery: '',
    },
    {
      name: 'Hovaz Wine Boutique',
      href: '/estates?estate=proshyan',
      detail: 'Proshyan · Ararat Valley, Armenia',
      hours: 'Tue–Sun · 11:00–20:00',
      isNew: true,
      mapQuery: '',
    },
  ],
  legalLinks: [
    { label: 'Privacy', href: '/privacy-policy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Cookies', href: '/cookies' },
  ] as LinkDefault[],
}
