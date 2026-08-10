export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-brand-cream)' }}
    >
      <div className="text-center">
        <p
          className="font-serif text-4xl animate-pulse"
          style={{ color: 'var(--color-brand-gold)' }}
        >
          HOVAZ
        </p>
        <div
          className="w-px h-12 mx-auto mt-4"
          style={{
            background: 'linear-gradient(to bottom, var(--color-brand-gold), transparent)',
            animation: 'fadeIn 1s ease-in-out infinite alternate',
          }}
        />
      </div>
    </div>
  )
}
