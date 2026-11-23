// src/components/ui/AwardMedal.tsx
// Figma award medal (Awards page, e.g. 3322:7927): a 210px metal disc on a
// 120px ribbon, a 176px inner ring with year / competition name, and a tier
// plaque over the ribbon. Gold, silver or bronze, picked from the award tier
// text; anything else gets gold. Every px is scaled by --figma-scale.
import { mfig } from '@/lib/figmaScale'

type Metal = 'gold' | 'silver' | 'bronze'

// Radial gradient stops and the ribbon/plaque colour, straight from Figma
const METALS: Record<Metal, { stops: string; ribbon: string }> = {
  gold: {
    stops: 'rgb(232,205,140) 0%, rgb(206,174,105) 27.5%, rgb(180,142,70) 55%, rgb(130,98,42) 100%',
    ribbon: '#8c682c',
  },
  silver: {
    stops:
      'rgb(236,236,234) 0%, rgb(178,178,176) 55%, rgb(149,149,147) 77.5%, rgb(120,120,118) 100%',
    ribbon: '#7a7a78',
  },
  bronze: {
    stops: 'rgb(214,160,112) 0%, rgb(185,128,83) 27.5%, rgb(156,96,54) 55%, rgb(104,60,32) 100%',
    ribbon: '#6e4022',
  },
}

export function metalOf(tier?: string): Metal {
  const t = tier?.toLowerCase() ?? ''
  if (t.includes('silver')) return 'silver'
  if (t.includes('bronze')) return 'bronze'
  return 'gold'
}

/** Medal px — 0.75× on phones, the Figma px × --figma-scale on desktop */
const m = (px: number) => mfig(px * 0.75, px)

interface AwardMedalProps {
  year?: number
  /** First word of the competition, big ("Berliner") */
  name: string
  /** The rest of the competition name, small caps ("Wine Trophy") */
  subname?: string
  /** Shown on the plaque ("Gold") */
  tier?: string
}

export function AwardMedal({ year, name, subname, tier }: AwardMedalProps) {
  const { stops, ribbon } = METALS[metalOf(tier)]

  return (
    <div className="relative shrink-0" style={{ width: m(210), height: m(250) }} aria-hidden>
      {/* Ribbon behind the disc */}
      <div
        className="absolute"
        style={{ left: m(45), top: m(150), width: m(120), height: m(88), backgroundColor: ribbon }}
      />

      {/* Disc: light source top-left, inner highlight + lower shade */}
      <div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full"
        style={{
          width: m(210),
          height: m(210),
          background: `radial-gradient(circle ${m(208)} at 32% 28%, ${stops})`,
          boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.5), inset 0 -4px 10px rgba(0,0,0,0.25)',
          filter: 'drop-shadow(0 18px 20px rgba(26,29,23,0.22))',
        }}
      >
        {/* Inner ring with the text */}
        <div
          className="flex flex-col items-center justify-center rounded-full text-center"
          style={{
            width: m(176),
            height: m(176),
            gap: m(4),
            boxShadow: '0 0 0 1px rgba(0,0,0,0.08), inset 0 0 0 2px rgba(255,255,255,0.55)',
            lineHeight: 'normal',
          }}
        >
          {year && (
            <p
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 700,
                fontSize: m(11),
                letterSpacing: m(3),
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              {year}
            </p>
          )}
          <p
            className="whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 600,
              fontSize: m(26),
              lineHeight: 1,
              color: '#fff',
            }}
          >
            {name}
          </p>
          {subname && (
            <p
              className="uppercase"
              style={{
                width: m(130),
                fontFamily: 'var(--font-playfair)',
                fontWeight: 500,
                fontSize: m(11),
                lineHeight: 1.3,
                letterSpacing: m(1.5),
                color: 'rgba(255,255,255,0.92)',
              }}
            >
              {subname}
            </p>
          )}
        </div>
      </div>

      {/* Tier plaque over the ribbon */}
      {tier && (
        <div
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap uppercase"
          style={{
            top: m(196),
            paddingInline: m(18),
            paddingBlock: m(6),
            backgroundColor: ribbon,
            filter: 'drop-shadow(0 4px 5px rgba(0,0,0,0.2))',
            fontFamily: 'var(--font-playfair)',
            fontWeight: 700,
            fontSize: m(15),
            lineHeight: 'normal',
            letterSpacing: m(3),
            color: '#fff',
          }}
        >
          {tier}
        </div>
      )}
    </div>
  )
}
