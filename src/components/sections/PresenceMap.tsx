import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  AmericasPresenceMap,
  type PresenceCountry,
} from '@/components/sections/AmericasPresenceMap'
import { CountUpStat } from '@/components/reactbits/CountUp'
import {
  partnerLogoSources,
  PRESENCE_PARTNERS,
  type PresencePartner,
} from '@/data/presencePartners'
import { useLanguage } from '@/i18n/LanguageProvider'
import { useMediaQuery } from '@/hooks/use-media-query'
import { ScrollTrigger, debouncedScrollTriggerRefresh } from '@/lib/gsap'
import { cn } from '@/lib/utils'

/** Offset del navbar para alinear el pin con el scroll */
const NAVBAR_OFFSET = 64

/** Píxeles de scroll por país en desktop (pin GSAP) */
const SCROLL_PER_COUNTRY_DESKTOP = 0.38

/** Tramo de scroll por país en móvil (sticky nativo + spacer, sin pin GSAP) */
const SCROLL_PER_COUNTRY_MOBILE = 0.34

/** Top del bloque sticky en móvil — alineado con navbar fijo */
const MOBILE_STICKY_TOP = 'calc(4rem + env(safe-area-inset-top, 0px))'

/** Bandera (ISO alpha-2) por mercado — mismo id que en traducciones */
const FLAG_CDN: Record<PresenceCountry['id'], string> = {
  mx: 'mx',
  us: 'us',
  pe: 'pe',
  ar: 'ar',
}

/** Logo en tarjeta individual — a color, glow y varias fuentes de imagen */
function PartnerBrandLogo({
  partner,
  compact = false,
}: {
  partner: PresencePartner
  compact?: boolean
}) {
  const sources = partnerLogoSources(partner)
  const [sourceIndex, setSourceIndex] = useState(0)
  const failed = sourceIndex >= sources.length
  const brandColor = `#${partner.color}`
  const initials = partner.name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const tryNextSource = () => {
    setSourceIndex((i) => i + 1)
  }

  // Reinicia la fuente al cambiar de marca
  useEffect(() => {
    setSourceIndex(0)
  }, [partner.domain])

  return (
    <div
      className={cn(
        'flex w-full items-center justify-center rounded-xl border border-border/60 bg-white px-2 shadow-sm',
        compact ? 'h-11' : 'h-14 px-3 sm:h-16',
      )}
      title={partner.name}
    >
      {failed ? (
        <span className="text-xs font-bold tracking-wide" style={{ color: brandColor }}>
          {initials}
        </span>
      ) : (
        <span
          className="relative flex max-h-full max-w-full items-center justify-center transition-transform duration-300 hover:scale-105"
          style={{
            filter: `drop-shadow(0 0 8px color-mix(in srgb, ${brandColor} 55%, transparent)) drop-shadow(0 0 18px color-mix(in srgb, ${brandColor} 30%, transparent))`,
          }}
        >
          <img
            key={sources[sourceIndex]}
            src={sources[sourceIndex]}
            alt={partner.name}
            width={120}
            height={48}
            className={cn(
              'w-auto object-contain',
              compact
                ? 'max-h-7 max-w-[4.5rem]'
                : 'max-h-9 max-w-[6.5rem] sm:max-h-10 sm:max-w-[7.5rem]',
            )}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={tryNextSource}
          />
        </span>
      )}
    </div>
  )
}

/**
 * Franja de logos — ancho completo (mapa + tarjetas), cambia con el país activo
 */
function PresencePartnerLogos({
  countries,
  activeId,
  sectionLabel,
  compact = false,
}: {
  countries: readonly PresenceCountry[]
  activeId: PresenceCountry['id']
  sectionLabel: string
  /** Móvil: logos más pequeños y menos padding */
  compact?: boolean
}) {
  const reducedMotion = useReducedMotion()
  const activeCountry = countries.find((c) => c.id === activeId) ?? countries[0]
  const partners = PRESENCE_PARTNERS[activeId] ?? PRESENCE_PARTNERS.mx

  return (
    <div
      className={cn(
        'w-full',
        compact ? 'pt-1 pb-0' : 'pt-2 pb-4 sm:pt-4 sm:pb-5 lg:pb-8',
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <p
        className={cn(
          'text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground',
          compact ? 'text-center' : 'text-center sm:text-left',
        )}
      >
        {sectionLabel}
        <span className="text-foreground"> · {activeCountry?.name}</span>
      </p>

      <motion.ul
        key={activeId}
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={cn(
          'mt-3 grid grid-cols-3 gap-2',
          !compact && 'mt-4 gap-3 sm:grid-cols-6 sm:gap-4',
        )}
      >
        {partners.map((partner) => (
          <li key={`${activeId}-${partner.domain}`} className="min-w-0">
            <PartnerBrandLogo partner={partner} compact={compact} />
          </li>
        ))}
      </motion.ul>
    </div>
  )
}

/** Imagen de bandera con tamaño fijo dentro de la tarjeta */
function CountryFlag({ id, name }: { id: PresenceCountry['id']; name: string }) {
  const code = FLAG_CDN[id]
  return (
    <img
      src={`https://flagcdn.com/w80/${code}.png`}
      srcSet={`https://flagcdn.com/w160/${code}.png 2x`}
      width={40}
      height={28}
      alt={name}
      className="h-7 w-10 rounded object-cover shadow-sm"
      loading="lazy"
      decoding="async"
    />
  )
}

/**
 * Mapa de presencia regional — título fijo al hacer scroll e iluminación por país
 */
export function PresenceMap() {
  const { t, locale } = useLanguage()
  const countries = t.presence.countries as readonly PresenceCountry[]
  const reducedMotion = useReducedMotion()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const scrollTrackRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [activeId, setActiveId] = useState<PresenceCountry['id']>('mx')
  // Ref evita setState en cada frame de scroll (solo cuando cambia el país)
  const activeIdRef = useRef<PresenceCountry['id']>('mx')
  const scrollDriven = !reducedMotion
  // Altura mínima del bloque pinneado solo en desktop (móvil: altura natural)
  const useDesktopPinMinHeight = scrollDriven && !isMobile

  const syncActiveFromProgress = (progress: number) => {
    const clamped = Math.min(1, Math.max(0, progress))
    // Un tramo por país (0–25% → MX, 25–50% → US, …)
    const index = Math.min(
      countries.length - 1,
      Math.floor(clamped * countries.length),
    )
    const nextId = countries[index]?.id
    if (nextId && nextId !== activeIdRef.current) {
      activeIdRef.current = nextId
      setActiveId(nextId)
    }
  }

  useLayoutEffect(() => {
    if (!scrollDriven || !scrollTrackRef.current) return

    let trigger: ScrollTrigger | undefined
    let resizeTimer: ReturnType<typeof setTimeout> | undefined

    const setup = () => {
      trigger?.kill()
      const mobile = window.matchMedia('(max-width: 767px)').matches
      const trackEl = scrollTrackRef.current
      if (!trackEl) return

      if (mobile) {
        // Móvil: sticky CSS + spacer — el mapa permanece visible mientras avanza el scroll
        trigger = ScrollTrigger.create({
          trigger: trackEl,
          start: `top ${NAVBAR_OFFSET}`,
          end: 'bottom bottom',
          invalidateOnRefresh: true,
          onUpdate: (self) => syncActiveFromProgress(self.progress),
        })
      } else {
        const contentEl = contentRef.current
        if (!contentEl) return

        const scrollPerCountry = Math.round(
          window.innerHeight * SCROLL_PER_COUNTRY_DESKTOP,
        )
        const endDistance = scrollPerCountry * countries.length

        trigger = ScrollTrigger.create({
          trigger: contentEl,
          start: `top ${NAVBAR_OFFSET}`,
          end: `+=${endDistance}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          pinType: 'fixed',
          onUpdate: (self) => syncActiveFromProgress(self.progress),
        })
      }

      debouncedScrollTriggerRefresh(0)
    }

    const debouncedSetup = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(setup, 150)
    }

    setup()
    window.addEventListener('resize', debouncedSetup)

    return () => {
      window.removeEventListener('resize', debouncedSetup)
      if (resizeTimer) clearTimeout(resizeTimer)
      trigger?.kill()
    }
  }, [countries.length, locale, scrollDriven, isMobile])

  const handleSelect = (id: PresenceCountry['id']) => {
    activeIdRef.current = id
    setActiveId(id)
  }

  return (
    <section
      id="presencia"
      className="relative border-y border-border bg-white"
      aria-labelledby="presencia-heading"
    >
      {/* Fondos decorativos recortados para no provocar scroll horizontal */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-primary/8 blur-[110px]" />
        <div className="absolute -left-20 bottom-1/3 h-72 w-72 rounded-full bg-accent/8 blur-[100px]" />
      </div>

      {/* Track de scroll: en móvil incluye spacer para animación por país con sticky nativo */}
      <div ref={scrollTrackRef} className="relative">
        <div
          ref={contentRef}
          className={cn(
            'relative z-10 mx-auto flex max-w-7xl flex-col px-4 sm:px-6 lg:px-8',
            isMobile && scrollDriven ? 'sticky z-20 bg-white py-4' : 'py-8 sm:py-12',
            useDesktopPinMinHeight && 'min-h-[min(100svh,920px)]',
          )}
          style={
            isMobile && scrollDriven
              ? { top: MOBILE_STICKY_TOP }
              : undefined
          }
        >
        {/* Cabecera: en móvil sticky anidado para que el título no desaparezca si el bloque supera el viewport */}
        <header
          className={cn(
            'shrink-0 border-b border-border bg-white',
            isMobile ? 'pb-3' : 'pb-4 sm:pb-8',
            isMobile && scrollDriven && 'sticky z-30',
          )}
          style={
            isMobile && scrollDriven
              ? { top: MOBILE_STICKY_TOP }
              : undefined
          }
        >
          <div
            className={cn(
              'flex flex-col gap-4',
              !isMobile && 'sm:flex-row sm:items-end sm:justify-between',
            )}
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                {t.presence.badge}
              </p>
              <h2
                id="presencia-heading"
                className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-[2rem]"
              >
                {t.presence.scrollTitle}
              </h2>
            </div>
            {scrollDriven ? (
              <p
                className={cn(
                  'text-sm text-muted-foreground',
                  !isMobile && 'max-w-xs sm:text-right',
                )}
              >
                {t.presence.scrollHint}
              </p>
            ) : null}
          </div>

          {/* Indicador de progreso por mercado */}
          <div
            className="mt-4 flex gap-1.5 sm:mt-5"
            role="tablist"
            aria-label={t.presence.mapHint}
          >
            {countries.map((country) => {
              const isActive = activeId === country.id
              return (
                <span
                  key={country.id}
                  role="tab"
                  aria-selected={isActive}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors duration-500',
                    isActive ? 'bg-primary' : 'bg-border',
                  )}
                />
              )
            })}
          </div>
        </header>

        {/* Móvil: columna mapa → país activo → logos. Desktop: grid mapa + tarjetas */}
        <div
          className={cn(
            'grid grid-cols-1 gap-4 sm:mt-8 sm:gap-8',
            isMobile ? 'mt-0' : 'mt-4',
            !isMobile &&
              'min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(260px,22rem)] lg:items-stretch lg:gap-10 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,24rem)]',
          )}
        >
          <div className="min-w-0 w-full">
            <AmericasPresenceMap
              countries={countries}
              activeId={activeId}
              onSelect={handleSelect}
              dimInactive={scrollDriven}
              compact={isMobile}
            />

            {/* Chips para elegir mercado en móvil (además del scroll) */}
            {isMobile && (
              <div
                className="mt-3 flex flex-wrap gap-2"
                role="tablist"
                aria-label={t.presence.mapHint}
              >
                {countries.map((country) => {
                  const isActive = activeId === country.id
                  return (
                    <button
                      key={country.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleSelect(country.id)}
                      className={cn(
                        'flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                        isActive
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-secondary text-muted-foreground',
                      )}
                    >
                      <CountryFlag id={country.id} name={country.name} />
                      <span>{country.name}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {isMobile ? (
            <div className="flex min-w-0 flex-col gap-3">
              {countries
                .filter((country) => country.id === activeId)
                .map((country) => (
                  <button
                    key={country.id}
                    type="button"
                    onClick={() => handleSelect(country.id)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-primary/50 bg-primary/8 p-3 text-left shadow-md shadow-primary/10 ring-1 ring-primary/20"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-white ring-2 ring-primary/40">
                      <CountryFlag id={country.id} name={country.name} />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                      <span className="text-sm font-semibold leading-snug text-foreground">
                        {country.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{country.city}</span>
                      <span className="text-xs font-medium leading-snug text-primary">
                        {country.role}
                      </span>
                    </span>
                  </button>
                ))}

              <PresencePartnerLogos
                countries={countries}
                activeId={activeId}
                sectionLabel={t.presence.partnersLabel}
                compact
              />
            </div>
          ) : (
            <ul className="grid min-w-0 w-full list-none grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 lg:flex lg:h-full lg:flex-col lg:justify-between lg:gap-2.5 lg:self-stretch">
              {countries.map((country) => {
                const isActive = activeId === country.id
                const dimOthers = scrollDriven && !isActive

                return (
                  <li key={country.id} className="min-w-0 lg:flex-1 lg:flex lg:min-h-0">
                    <button
                      type="button"
                      onMouseEnter={() => handleSelect(country.id)}
                      onFocus={() => handleSelect(country.id)}
                      onClick={() => handleSelect(country.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left shadow-sm transition-all duration-500 sm:min-h-[6.75rem] lg:h-full lg:min-h-0 lg:p-3',
                        isActive
                          ? 'scale-100 border-primary/50 bg-primary/8 opacity-100 shadow-lg shadow-primary/15 ring-1 ring-primary/25'
                          : 'border-border bg-secondary',
                        dimOthers
                          ? 'scale-[0.98] opacity-35'
                          : !isActive && 'opacity-70 hover:border-primary/25 hover:opacity-90',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-white transition-all duration-500 sm:h-11 sm:w-11',
                          isActive && 'ring-2 ring-primary/40',
                          dimOthers && 'grayscale',
                        )}
                      >
                        <CountryFlag id={country.id} name={country.name} />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                        <span
                          className={cn(
                            'line-clamp-2 text-sm font-semibold leading-snug sm:text-base',
                            isActive ? 'text-foreground' : 'text-muted-foreground',
                          )}
                        >
                          {country.name}
                        </span>
                        <span className="line-clamp-1 text-xs text-muted-foreground sm:text-sm">
                          {country.city}
                        </span>
                        <span
                          className={cn(
                            'line-clamp-2 text-xs font-medium leading-snug',
                            isActive ? 'text-primary' : 'text-muted-foreground/80',
                          )}
                        >
                          {country.role}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          {!isMobile && (
            <div className="min-w-0 lg:col-span-2">
              <PresencePartnerLogos
                countries={countries}
                activeId={activeId}
                sectionLabel={t.presence.partnersLabel}
              />
            </div>
          )}
        </div>
        </div>

        {/* Spacer invisible: extiende el scroll en móvil (~0.34 svh por país) */}
        {isMobile && scrollDriven ? (
          <div
            aria-hidden
            className="pointer-events-none w-full"
            style={{
              height: `calc(100svh * ${SCROLL_PER_COUNTRY_MOBILE} * ${countries.length})`,
            }}
          />
        ) : null}
      </div>

      {/* Estadísticas — fuera del pin para no alargar el scroll de países */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-14 lg:px-8">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {t.presence.statsTitle}
        </p>
        <div className="grid grid-cols-3 gap-2 sm:gap-6">
          {t.presence.stats.map((stat, i) => (
            <CountUpStat
              key={stat.label}
              value={stat.value}
              label={stat.label}
              prefix={stat.prefix || undefined}
              suffix={stat.suffix}
              duration={2 + i * 0.25}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
