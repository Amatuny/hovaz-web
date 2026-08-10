import Link from 'next/link'

export function WineRoomsBlock() {
  const rooms = [
    {
      name: 'Dilijan Wine Rooms',
      description:
        'Nestled in the forest town of Dilijan, our first Wine Rooms offers an intimate tasting experience surrounded by nature.',
      href: '/about/dilijan',
      location: 'Dilijan, Armenia',
    },
    {
      name: 'Proshyan Wine Rooms',
      description:
        'Set in the historic village of Proshyan, our second location brings you closer to the vineyards and the winemaking process.',
      href: '/about/proshyan',
      location: 'Proshyan Village, Armenia',
    },
  ]

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-blush)' }}>
      <div className="container-content">
        {/* Header */}
        <div className="section-header">
          <p className="text-label mb-3" style={{ color: 'var(--color-brand-gold)' }}>
            Our Locations
          </p>
          <h2 className="heading-section mb-4">HOVAZ Wine Rooms</h2>
          <p
            className="text-body max-w-prose mx-auto"
            style={{ color: 'var(--color-brand-stone)' }}
          >
            Two unique spaces, one shared passion for Armenian wine culture.
          </p>
        </div>

        {/* Rooms grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rooms.map((room) => (
            <div key={room.name} className="card-wine p-10" style={{ backgroundColor: 'white' }}>
              <p className="text-label mb-4" style={{ color: 'var(--color-brand-gold)' }}>
                {room.location}
              </p>
              <h3 className="heading-card mb-4">{room.name}</h3>
              <p className="text-body mb-8" style={{ color: 'var(--color-brand-stone)' }}>
                {room.description}
              </p>
              <Link href={room.href} className="btn-ghost">
                Learn more
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
