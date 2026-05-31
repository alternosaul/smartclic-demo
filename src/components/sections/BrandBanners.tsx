import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'motion/react'
import { useLanguage } from '@/i18n/LanguageProvider'
import { cn } from '@/lib/utils'

const brandsRowRight = [
  'airtable',
  'amazon',
  'box',
  'bytedance',
  'chase',
  'cloudbees',
  'nike',
  '3m',
  'abstract',
  'stripe',
  'slack',
  'spotify',
  'google',
  'meta',
  'netflix',
  'shopify',
  'uber',
  'airbnb',
  'tesla',
  'adobe',
  'oracle',
  'salesforce',
  'zoom',
] as const

const brandsRowLeft = [
  'epic',
  'genius',
  'godaddy',
  'heroku',
  'bmw',
  'burton',
  'buildkite',
  'couchbase',
  'microsoft',
  'visa',
  'dell',
  'intel',
  'cisco',
  'paypal',
  'dropbox',
  'twilio',
  'figma',
  'notion',
  'hubspot',
  'datadog',
  'mongodb',
  'redis',
] as const

type BrandId =
  | (typeof brandsRowRight)[number]
  | (typeof brandsRowLeft)[number]

const brandLabels: Record<BrandId, { es: string; en: string }> = {
  airtable: { es: 'AIRTABLE', en: 'AIRTABLE' },
  amazon: { es: 'AMAZON', en: 'AMAZON' },
  box: { es: 'BOX', en: 'BOX' },
  bytedance: { es: 'BYTEDANCE', en: 'BYTEDANCE' },
  chase: { es: 'CHASE', en: 'CHASE' },
  cloudbees: { es: 'CLOUDBEES', en: 'CLOUDBEES' },
  nike: { es: 'NIKE', en: 'NIKE' },
  '3m': { es: '3M', en: '3M' },
  abstract: { es: 'ABSTRACT', en: 'ABSTRACT' },
  stripe: { es: 'STRIPE', en: 'STRIPE' },
  slack: { es: 'SLACK', en: 'SLACK' },
  spotify: { es: 'SPOTIFY', en: 'SPOTIFY' },
  google: { es: 'GOOGLE', en: 'GOOGLE' },
  meta: { es: 'META', en: 'META' },
  netflix: { es: 'NETFLIX', en: 'NETFLIX' },
  shopify: { es: 'SHOPIFY', en: 'SHOPIFY' },
  uber: { es: 'UBER', en: 'UBER' },
  airbnb: { es: 'AIRBNB', en: 'AIRBNB' },
  tesla: { es: 'TESLA', en: 'TESLA' },
  adobe: { es: 'ADOBE', en: 'ADOBE' },
  oracle: { es: 'ORACLE', en: 'ORACLE' },
  salesforce: { es: 'SALESFORCE', en: 'SALESFORCE' },
  zoom: { es: 'ZOOM', en: 'ZOOM' },
  epic: { es: 'EPIC GAMES', en: 'EPIC GAMES' },
  genius: { es: 'GENIUS', en: 'GENIUS' },
  godaddy: { es: 'GODADDY', en: 'GODADDY' },
  heroku: { es: 'HEROKU', en: 'HEROKU' },
  bmw: { es: 'BMW', en: 'BMW' },
  burton: { es: 'BURTON', en: 'BURTON' },
  buildkite: { es: 'BUILDKITE', en: 'BUILDKITE' },
  couchbase: { es: 'COUCHBASE', en: 'COUCHBASE' },
  microsoft: { es: 'MICROSOFT', en: 'MICROSOFT' },
  visa: { es: 'VISA', en: 'VISA' },
  dell: { es: 'DELL', en: 'DELL' },
  intel: { es: 'INTEL', en: 'INTEL' },
  cisco: { es: 'CISCO', en: 'CISCO' },
  paypal: { es: 'PAYPAL', en: 'PAYPAL' },
  dropbox: { es: 'DROPBOX', en: 'DROPBOX' },
  twilio: { es: 'TWILIO', en: 'TWILIO' },
  figma: { es: 'FIGMA', en: 'FIGMA' },
  notion: { es: 'NOTION', en: 'NOTION' },
  hubspot: { es: 'HUBSPOT', en: 'HUBSPOT' },
  datadog: { es: 'DATADOG', en: 'DATADOG' },
  mongodb: { es: 'MONGODB', en: 'MONGODB' },
  redis: { es: 'REDIS', en: 'REDIS' },
}

const brandIconPaths: Partial<Record<BrandId, string>> = {
  airtable:
    'M16 4 4 10v12l12 6 12-6V10L16 4zm0 3.2 7.8 4.4L16 16l-7.8-4.4L16 7.2z',
  amazon:
    'M16 6c-5 0-9 2.5-9 6.5 0 3 2.5 4.5 5 6.5 2.5 1.5 4 3 4 5h2c0-2.5-2-4.5-5-6.5-2.5-1.5-4-3.5-4-6 0-2.5 2.5-4.5 7-4.5s7 2 7 4.5c0 2.5-1.5 4.5-4 6.5-3 2-5 4-5 6.5h2c0-2 2-4 4.5-6.5C25 14.5 21 12 16 12z',
  box: 'M6 10h20v14H6V10zm2 2v10h16V12H8zm4-6h8l2 4H10l2-4z',
  bytedance:
    'M14 6h4v8.5c1.2-.8 2.7-1.2 4.2-1 2.5.3 4.4 2.4 4.4 5.2 0 3.2-2.6 5.3-6 5.3-2.2 0-4-.9-5.2-2.4V6z',
  chase: 'M8 8h16l-2 16H10L8 8zm4 4h8l-.8 8h-6.4L12 12z',
  cloudbees:
    'M10 18c-3 0-5-2-5-4.5S7 9 10 9c.5-2.5 2.8-4.5 5.5-4.5 3.2 0 5.8 2.4 5.8 5.5C23 12.5 25 14.5 25 17s-2.5 4.5-5.5 4.5H10z',
  nike: 'M6 20 26 10l-4 2-10 8z',
  '3m': 'M8 8h6v16H8V8zm10 0h6v16h-6V8z',
  abstract: 'M8 22 16 6l8 16h-3l-2-4h-6l-2 4H8z',
  epic: 'M16 6 8 26h4l1.5-4h9L24 26h4L16 6z',
  genius: 'M16 6a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12z',
  godaddy: 'M16 8c-4 0-7 2-8 5h3c1-2 3-3 5-3s4 1 5 3c1 2 0 4-2 4-4 0-5-4-9-9-9S6 9 6 14h20c0 5-4 8-10 8z',
  heroku: 'M8 8h16v16H8V8zm3 3v10h3v-4h4v4h3V11h-3v4h-4v-4H11z',
  bmw: 'M16 6a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12z',
  burton: 'M8 10h16v3H8v-3zm0 5h12v3H8v-3zm0 5h8v3H8v-3z',
  buildkite: 'M6 22 16 6l10 16h-4l-2-3.5-8 3.5H6z',
  couchbase: 'M10 10h12c3 0 5 2 5 5s-2 5-5 5h-4c-2.5 0-4-1.5-4-3.5V10z',
  stripe: 'M6 14h20v4H6v-4zm2-6h16v4H8V8z',
  slack: 'M10 8h4v4h4v4h-4v4h-4v-4H6v-4h4V8z',
  spotify: 'M16 6a10 10 0 0 0-10 10 10 10 0 0 0 10-10zm-5 14v-8l8 4-8 4z',
  google: 'M16 8c-2 0-4 1-5 3l3 2c.5-1 1.5-2 3-2 2.5 0 4 2 4 4.5H10v2h12c0-4-3-7.5-6-7.5z',
  meta: 'M8 16c0-4 3.5-8 8-8s8 4 8 8-3.5 8-8 8-8-4-8-8z',
  netflix: 'M8 8h6l2 8 2-8h6l-4 16h-4L8 8z',
  shopify: 'M16 6 8 12v14h16V12L16 6zm0 4 6 3.5V22h-3v-6h-6v6H10V13.5l6-3.5z',
  uber: 'M8 22h16l-2-6H10l-2 6zm4-10h8l2-6H10l2 6z',
  airbnb: 'M16 8c-4 0-7 3-7 7 0 5 7 11 7 11s7-6 7-11c0-4-3-7-7-7z',
  tesla: 'M8 18h16l-2-4H10l-2 4zm4-8h8l2-4h-12l2 4z',
  adobe: 'M8 26 16 6l8 20h-4l-2-5h-4l-2 5H8z',
  oracle: 'M16 6a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-4 6h8v8h-8v-8z',
  salesforce: 'M10 18c-3 0-5-2-5-4.5S7 9 10 9c2-3 6-4 9-2 3 2 2 5-1 7 2 2 4 4.5 4 4.5S19 15 16 18H10z',
  zoom: 'M8 12h8v8H8v-8zm10 0h6v8h-6v-8z',
  microsoft: 'M8 8h7v7H8V8zm9 0h7v7h-7V8zM8 17h7v7H8v-7zm9 0h7v7h-7v-7z',
  visa: 'M8 12h16v8H8v-8zm2 2v4h12v-4H10z',
  dell: 'M8 10h16v12H8V10zm2 2v8h12v-8H10z',
  intel: 'M8 8h16v4H8V8zm0 6h16v4H8v-4zm0 6h10v4H8v-4z',
  cisco: 'M16 6 6 26h4l6-14 6 14h4L16 6z',
  paypal: 'M8 14h16v6H8v-6zm2-6h12v4H10V8z',
  dropbox: 'M16 6 6 14l10 8 10-8-10-8zm0 6-6 5 6 5 6-5-6-5z',
  twilio: 'M8 8h16v16H8V8zm4 4v8h8v-8h-8z',
  figma: 'M16 6c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zm-4 8c-2 0-4 2-4 4v4h8v-4c0-2-2-4-4-4z',
  notion: 'M8 8h12l4 4v12H8V8zm4 4v12h8V14h-8z',
  hubspot: 'M16 6a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12z',
  datadog: 'M8 22 16 6l8 16h-4l-2-4h-4l-2 4H8z',
  mongodb: 'M16 6c-5 0-8 4-8 10s3 10 8 10 8-4 8-10-3-10-8-10z',
  redis: 'M8 10h16l-2 12H10L8 10zm4 2v8h8v-8h-8z',
}

/** Copias del listado hasta cubrir al menos 1.5× el ancho de pantalla por ciclo */
function expandBrandsToFillViewport(brands: readonly BrandId[]): BrandId[] {
  const base = [...brands]
  const viewport =
    typeof window !== 'undefined' ? window.innerWidth : 1440
  const minItems = Math.max(
    base.length,
    Math.ceil((viewport * 1.5) / 140),
  )
  const expanded: BrandId[] = []
  while (expanded.length < minItems) {
    expanded.push(...base)
  }
  return expanded
}

type BrandBannersProps = {
  variant?: 'hero' | 'section'
}

function BrandIcon({ id }: { id: BrandId }) {
  const path =
    brandIconPaths[id] ??
    'M10 10h12c2 0 4 1.5 4 4v4c0 2.5-2 4-4 4H10V10z'

  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center text-primary sm:h-9 sm:w-9"
      aria-hidden
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current sm:h-8 sm:w-8">
        <path d={path} />
      </svg>
    </span>
  )
}

/**
 * Offset infinito: translateX siempre ≤ 0 (marquee clásico sin huecos a la izquierda).
 * reverse = scroll down mueve marcas hacia la izquierda en pantalla.
 */
function useInfiniteMarquee(
  cycleWidth: number,
  reverse = false,
  scrollSpeed = 0.85,
  initialPhase = 0,
) {
  const offset = useMotionValue(0)
  const ready = useRef(false)

  useEffect(() => {
    if (cycleWidth <= 0 || ready.current) return
    offset.set(cycleWidth * initialPhase)
    ready.current = true
  }, [cycleWidth, initialPhase, offset])

  useEffect(() => {
    if (cycleWidth <= 0) return

    const step = reverse ? -0.5 : 0.5
    let lastY = window.scrollY

    const onScroll = () => {
      const deltaY = window.scrollY - lastY
      if (deltaY === 0) return
      const scrollDelta = reverse ? -deltaY * scrollSpeed : deltaY * scrollSpeed
      offset.set(offset.get() + scrollDelta)
      lastY = window.scrollY
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    let raf = 0
    const drift = () => {
      offset.set(offset.get() + step)
      raf = requestAnimationFrame(drift)
    }
    raf = requestAnimationFrame(drift)

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [offset, scrollSpeed, reverse, cycleWidth])

  // Módulo solo en render: el estado crece sin saltos bruscos
  const x = useTransform(offset, (v) => {
    if (cycleWidth <= 0) return 0
    const mod = ((v % cycleWidth) + cycleWidth) % cycleWidth
    return -mod
  })

  return x
}

type BrandStripProps = {
  brands: BrandId[]
  locale: 'es' | 'en'
  copyIndex: number
}

function BrandStrip({ brands, locale, copyIndex }: BrandStripProps) {
  return (
    <div className="flex w-max shrink-0 items-center" aria-hidden={copyIndex > 0}>
      {brands.map((id, i) => (
        <div
          key={`${copyIndex}-${id}-${i}`}
          className="flex shrink-0 items-center gap-2.5 px-5 sm:gap-3 sm:px-8"
        >
          <BrandIcon id={id} />
          <span className="whitespace-nowrap text-[10px] font-bold tracking-[0.18em] text-foreground sm:text-xs">
            {brandLabels[id][locale]}
          </span>
        </div>
      ))}
    </div>
  )
}

type BrandRowProps = {
  brands: readonly BrandId[]
  reverse?: boolean
  initialPhase?: number
  locale: 'es' | 'en'
  rowTilt: string
  compact?: boolean
}

/** Carrusel infinito: 2 ciclos idénticos + translateX negativo */
function BrandRow({
  brands,
  reverse = false,
  initialPhase = 0,
  locale,
  rowTilt,
  compact,
}: BrandRowProps) {
  const cycleRef = useRef<HTMLDivElement>(null)
  const [cycleWidth, setCycleWidth] = useState(0)
  const [viewportKey, setViewportKey] = useState(0)

  const denseBrands = useMemo(
    () => expandBrandsToFillViewport(brands),
    [brands, viewportKey],
  )

  const x = useInfiniteMarquee(cycleWidth, reverse, 0.85, initialPhase)

  useLayoutEffect(() => {
    const el = cycleRef.current
    if (!el) return

    const measure = () => setCycleWidth(el.getBoundingClientRect().width)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [denseBrands, locale])

  useEffect(() => {
    const onResize = () => setViewportKey((k) => k + 1)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div
      className={cn(
        'relative min-h-[44px] overflow-hidden border-y border-border bg-white sm:min-h-[52px]',
        rowTilt,
        compact ? 'py-3' : 'py-4 sm:py-5',
      )}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-20"
        aria-hidden
      />
      <motion.div className="flex w-max items-center will-change-transform" style={{ x }}>
        <div ref={cycleRef}>
          <BrandStrip brands={denseBrands} locale={locale} copyIndex={0} />
        </div>
        <BrandStrip brands={denseBrands} locale={locale} copyIndex={1} />
      </motion.div>
    </div>
  )
}

export function BrandBanners({ variant = 'section' }: BrandBannersProps) {
  const { locale, t } = useLanguage()
  const isHero = variant === 'hero'

  const banners = (
    <div
      className={cn(
        'w-full',
        isHero &&
          'pointer-events-none relative mx-auto w-full max-w-none shrink-0 overflow-hidden pb-3 max-md:mb-0 max-md:rotate-0 max-md:pb-3 sm:mb-2 sm:w-[140vw] sm:-rotate-[3deg] sm:pb-6 sm:origin-center',
      )}
    >
      <div className="flex flex-col">
        <BrandRow
          brands={brandsRowRight}
          locale={locale}
          rowTilt={isHero ? 'rotate-[0.8deg]' : 'rotate-[1deg]'}
          compact={isHero}
        />
        <BrandRow
          brands={brandsRowLeft}
          reverse
          initialPhase={0.5}
          locale={locale}
          rowTilt={isHero ? '-rotate-[0.6deg]' : '-rotate-[0.8deg]'}
          compact={isHero}
        />
      </div>
    </div>
  )

  if (isHero) return banners

  return (
    <section id="marcas" className="relative overflow-hidden bg-white py-10 sm:py-14">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        {t.brands.title}
      </p>
      <div className="-rotate-[2deg] scale-[1.02]">{banners}</div>
    </section>
  )
}
