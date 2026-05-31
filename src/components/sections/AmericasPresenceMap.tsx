import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { geoCentroid, geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import type { Topology } from 'topojson-specification'
import { cn } from '@/lib/utils'

/** País destacado en el mapa de presencia */
export type PresenceCountry = {
  id: 'mx' | 'us' | 'pe' | 'ar'
  name: string
  city: string
  role: string
}

/** ISO numérico (world-atlas) por mercado */
const PRESENCE_ISO = {
  mx: '484',
  us: '840',
  pe: '604',
  ar: '032',
} as const

/** Coordenadas [lng, lat] de cada sede / mercado */
const MARKER_COORDS: Record<PresenceCountry['id'], [number, number]> = {
  mx: [-99.1332, 19.4326],
  us: [-95.7129, 37.0902],
  pe: [-77.0428, -12.0464],
  ar: [-58.3816, -34.6037],
}

const SVG_WIDTH = 820
const SVG_HEIGHT = 520
/** Márgenes del viewBox para que países, rutas y etiquetas no se recorten */
const MAP_PADDING = { top: 36, right: 96, bottom: 44, left: 48 }
const GEO_URL = '/geo/countries-110m.json'

/** Filtra países cuyo centroide cae en el continente americano */
function isAmericasCountry(country: Feature<Geometry>): boolean {
  const [lng, lat] = geoCentroid(country)
  return lng >= -172 && lng <= -34 && lat >= -56 && lat <= 72
}

/** Convierte lng/lat a píxeles SVG con la proyección activa */
function projectPoint(
  projection: ReturnType<typeof geoNaturalEarth1>,
  coords: [number, number],
): { x: number; y: number } | null {
  const point = projection(coords)
  if (!point) return null
  return { x: point[0], y: point[1] }
}

type AmericasPresenceMapProps = {
  countries: readonly PresenceCountry[]
  activeId: PresenceCountry['id'] | null
  onSelect: (id: PresenceCountry['id']) => void
  /** Atenúa países y rutas que no están activos (scroll-driven) */
  dimInactive?: boolean
}

/**
 * Mapa geográfico real de las Américas (Natural Earth 110m)
 * con México, USA, Perú y Argentina resaltados
 */
export function AmericasPresenceMap({
  countries,
  activeId,
  onSelect,
  dimInactive = false,
}: AmericasPresenceMapProps) {
  const [geoFeatures, setGeoFeatures] = useState<Feature<Geometry>[]>([])
  const [loadError, setLoadError] = useState(false)

  // Carga del TopoJSON con los contornos reales de cada país
  useEffect(() => {
    let cancelled = false

    fetch(GEO_URL)
      .then((response) => {
        if (!response.ok) throw new Error('geo fetch failed')
        return response.json() as Promise<Topology>
      })
      .then((topology) => {
        if (cancelled) return
        const collection = feature(
          topology,
          topology.objects.countries as Parameters<typeof feature>[1],
        ) as FeatureCollection<Geometry>
        setGeoFeatures(collection.features.filter(isAmericasCountry))
      })
      .catch(() => {
        if (!cancelled) setLoadError(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Proyección ajustada al continente americano
  const { projection, pathGenerator } = useMemo(() => {
    const proj = geoNaturalEarth1()
    const generator = geoPath(proj)

    if (geoFeatures.length > 0) {
      proj.fitExtent(
        [
          [MAP_PADDING.left, MAP_PADDING.top],
          [SVG_WIDTH - MAP_PADDING.right, SVG_HEIGHT - MAP_PADDING.bottom],
        ],
        { type: 'FeatureCollection', features: geoFeatures },
      )
    } else {
      proj
        .scale(180)
        .translate([SVG_WIDTH / 2, SVG_HEIGHT / 2])
        .center([-74, 12])
    }

    return { projection: proj, pathGenerator: generator }
  }, [geoFeatures])

  // Líneas de conexión desde México hacia los demás mercados
  const hubPoint = projectPoint(projection, MARKER_COORDS.mx)
  const connectionLines = (['us', 'pe', 'ar'] as const)
    .map((id) => {
      const target = projectPoint(projection, MARKER_COORDS[id])
      if (!hubPoint || !target) return null
      const midX = (hubPoint.x + target.x) / 2
      const midY = (hubPoint.y + target.y) / 2 - 28
      return {
        id,
        d: `M ${hubPoint.x} ${hubPoint.y} Q ${midX} ${midY} ${target.x} ${target.y}`,
      }
    })
    .filter(Boolean) as { id: PresenceCountry['id']; d: string }[]

  /** Resuelve qué mercado corresponde a un ISO numérico del TopoJSON */
  const isoToPresenceId = (iso: string): PresenceCountry['id'] | null => {
    if (iso === PRESENCE_ISO.mx) return 'mx'
    if (iso === PRESENCE_ISO.us) return 'us'
    if (iso === PRESENCE_ISO.pe) return 'pe'
    if (iso === PRESENCE_ISO.ar) return 'ar'
    return null
  }

  return (
    <div className="relative w-full min-w-0">
      {/* Solo aspect-ratio: evita min-height fijos que rompen el grid y provocan solapamiento */}
      <div className="relative aspect-[41/26] w-full overflow-hidden rounded-3xl border border-border bg-[#e8f4f8] shadow-sm">
        {/* Océano con degradado suave */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#dceef5] via-[#e8f4f8] to-[#d4e8f0]"
          aria-hidden
        />

        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="relative z-10 mx-auto block h-full w-full max-w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Mapa de presencia en las Américas"
        >
          {/* Mensaje si falla la carga del geojson */}
          {loadError && (
            <text x={SVG_WIDTH / 2} y={SVG_HEIGHT / 2} textAnchor="middle" className="fill-muted-foreground text-sm">
              No se pudo cargar el mapa
            </text>
          )}

          {/* Contornos reales de países americanos */}
          <g>
            {geoFeatures.map((country) => {
              const iso = String(country.id ?? '')
              const presenceId = isoToPresenceId(iso)
              const isPresence = presenceId !== null
              const isActive = presenceId !== null && activeId === presenceId
              const isHub = iso === PRESENCE_ISO.mx
              const path = pathGenerator(country)

              if (!path) return null

              const isDimmed = dimInactive && isPresence && !isActive

              return (
                <path
                  key={iso}
                  d={path}
                  className={cn(
                    'cursor-pointer stroke-white transition-all duration-500',
                    isPresence
                      ? cn(
                          'stroke-[1.2]',
                          isActive
                            ? 'fill-primary/60 stroke-primary'
                            : isDimmed
                              ? 'fill-primary/12 stroke-primary/25 opacity-50'
                              : isHub
                                ? 'fill-primary/35 stroke-primary/70'
                                : 'fill-primary/22 stroke-primary/45 hover:fill-primary/32',
                        )
                      : 'fill-[#f4f7f9] stroke-[#cfd8de] hover:fill-[#eef2f5]',
                  )}
                  strokeWidth={isPresence ? 1.2 : 0.6}
                  onMouseEnter={() => presenceId && onSelect(presenceId)}
                  onFocus={() => presenceId && onSelect(presenceId)}
                  onClick={() => presenceId && onSelect(presenceId)}
                  tabIndex={presenceId ? 0 : -1}
                  role={presenceId ? 'button' : undefined}
                  aria-label={presenceId ? countries.find((c) => c.id === presenceId)?.name : undefined}
                />
              )
            })}
          </g>

          {/* Rutas punteadas entre México y los otros mercados */}
          {connectionLines.map((line) => (
            <motion.path
              key={line.id}
              d={line.d}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 7"
              className={cn(
                'text-primary transition-opacity duration-500',
                dimInactive
                  ? activeId === line.id
                    ? 'opacity-80'
                    : 'opacity-15'
                  : activeId === line.id || activeId === 'mx'
                    ? 'opacity-70'
                    : 'opacity-35',
              )}
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: activeId === line.id || activeId === 'mx' ? 0.7 : 0.35 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          ))}

          {/* Marcadores en cada ciudad */}
          {countries.map((country) => {
            const point = projectPoint(projection, MARKER_COORDS[country.id])
            if (!point) return null

            const isActive = activeId === country.id
            const isHub = country.id === 'mx'
            const isDimmed = dimInactive && !isActive

            return (
              <g
                key={country.id}
                className={cn(
                  'cursor-pointer transition-opacity duration-500',
                  isDimmed && 'opacity-40',
                )}
                onMouseEnter={() => onSelect(country.id)}
                onFocus={() => onSelect(country.id)}
                onClick={() => onSelect(country.id)}
                tabIndex={0}
                role="button"
                aria-label={country.name}
              >
                {!isActive && !dimInactive && (
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r={isHub ? 14 : 11}
                    className="fill-none stroke-primary/50"
                    animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isActive ? 9 : isHub ? 8 : 6.5}
                  className={cn(
                    'fill-primary stroke-white stroke-[2.5] transition-all duration-500',
                    isActive && 'fill-primary',
                    isDimmed && 'fill-primary/35',
                  )}
                />
                <text
                  x={
                    point.x +
                    (country.id === 'pe' || country.id === 'ar' ? -12 : 12)
                  }
                  y={
                    point.y +
                    (country.id === 'us'
                      ? -12
                      : country.id === 'ar'
                        ? 14
                        : 4)
                  }
                  textAnchor={
                    country.id === 'pe' || country.id === 'ar' ? 'end' : 'start'
                  }
                  className={cn(
                    'text-[12px] font-semibold sm:text-[13px]',
                    isActive ? 'fill-foreground' : 'fill-muted-foreground',
                  )}
                  style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: 4 }}
                >
                  {country.name}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Skeleton mientras carga el geojson */}
        {geoFeatures.length === 0 && !loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#e8f4f8]/80">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          </div>
        )}
      </div>
    </div>
  )
}
