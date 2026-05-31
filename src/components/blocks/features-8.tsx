import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/i18n/LanguageProvider'
import { cn } from '@/lib/utils'
import {
  Code2,
  Heart,
  Megaphone,
  Palette,
  Share2,
  Shield,
  ShoppingCart,
  TrendingUp,
  Type,
  Users,
} from 'lucide-react'

/** Iconos de cada disciplina del equipo integrado */
const TEAM_DISCIPLINE_ICONS = [Palette, Code2, Megaphone] as const

/** Título unificado en todas las tarjetas del bento */
const BENTO_CARD_TITLE_CLASS =
  'font-[family-name:var(--font-display)] text-base font-semibold leading-snug tracking-tight lg:text-lg'

/** Shell de tarjeta — compacto en móvil, altura uniforme en desktop */
const BENTO_CARD_SHELL_CLASS = 'max-lg:gap-0 max-lg:py-0 lg:h-full lg:flex-col'

/** Contenido de tarjeta — padding reducido en móvil como el layout original */
const BENTO_CARD_CONTENT_CLASS =
  'flex flex-col px-4 pb-4 pt-5 max-lg:pt-6 lg:flex-1 lg:px-6 lg:pb-6 lg:pt-6'

/** Círculo decorativo de icono — más pequeño en móvil */
const BENTO_ICON_ORB_CLASS =
  'relative mx-auto flex aspect-square size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted/30 before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5 lg:size-32'

/** Bloque título + descripción bajo el icono/panel */
const BENTO_TEXT_BLOCK_CLASS = 'mt-4 flex flex-col max-lg:flex-none lg:mt-5 lg:flex-1'

/** Intervalo entre repeticiones de animaciones en #soluciones */
const SOLUCIONES_ANIM_INTERVAL_MS = 10_000

/** Alturas de las barras del panel de alcance (marketing) */
const REACH_BAR_HEIGHTS = [40, 52, 48, 64, 58, 76, 88] as const

/** Serie de cierre para la gráfica tipo bolsa (crecimiento) */
const GROWTH_CLOSE_SERIES = [35, 42, 48, 55, 62, 74, 92] as const

const CHART_WIDTH = 100
const CHART_HEIGHT = 48
const CHART_PAD_Y = 6

type OhlcBar = {
  open: number
  high: number
  low: number
  close: number
}

/** Convierte precios de cierre en velas OHLC para el mini chart */
function buildOhlcSeries(closes: readonly number[]): OhlcBar[] {
  return closes.map((close, index) => {
    const open = closes[index - 1] ?? close * 0.9
    const swing = 3.5
    return {
      open,
      close,
      high: Math.max(open, close) + swing,
      low: Math.min(open, close) - swing,
    }
  })
}

/** Coordenada Y en el viewBox según precio */
function priceToY(price: number, min: number, max: number) {
  const range = max - min || 1
  const usable = CHART_HEIGHT - CHART_PAD_Y * 2
  return CHART_HEIGHT - CHART_PAD_Y - ((price - min) / range) * usable
}

/** Puntos {x,y} de la línea de cierre */
function buildLinePoints(closes: readonly number[]) {
  const ohlc = buildOhlcSeries(closes)
  const min = Math.min(...ohlc.map((b) => b.low))
  const max = Math.max(...ohlc.map((b) => b.high))
  const step = CHART_WIDTH / (closes.length - 1)

  return closes.map((close, index) => ({
    x: index * step,
    y: priceToY(close, min, max),
  }))
}

/** Path SVG de la línea de tendencia */
function buildLinePath(points: { x: number; y: number }[]) {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')
}

/** Path SVG del área bajo la línea (estilo trading) */
function buildAreaPath(points: { x: number; y: number }[]) {
  if (!points.length) return ''
  const line = buildLinePath(points)
  const last = points[points.length - 1]
  const first = points[0]
  return `${line} L ${last.x.toFixed(2)} ${CHART_HEIGHT - CHART_PAD_Y} L ${first.x.toFixed(2)} ${CHART_HEIGHT - CHART_PAD_Y} Z`
}

/** Dispara y repite animaciones al entrar en #soluciones */
function useSolucionesSectionReplay(active: boolean) {
  const [playKey, setPlayKey] = useState(0)
  const inSectionRef = useRef(false)

  useEffect(() => {
    if (!active) return

    const section = document.getElementById('soluciones')
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        inSectionRef.current = entry.isIntersecting
        if (entry.isIntersecting) setPlayKey((k) => k + 1)
      },
      { threshold: 0.12, rootMargin: '-8% 0px -35% 0px' },
    )
    observer.observe(section)

    const interval = window.setInterval(() => {
      if (inSectionRef.current) setPlayKey((k) => k + 1)
    }, SOLUCIONES_ANIM_INTERVAL_MS)

    return () => {
      observer.disconnect()
      window.clearInterval(interval)
    }
  }, [active])

  return playKey
}

/**
 * Carrito que entra desde la izquierda, se inclina al avanzar y frena al centro.
 * Se reproduce al entrar en #soluciones y cada 10 s mientras la sección sigue visible.
 */
function AnimatedShoppingCart({
  playKey,
}: {
  playKey: number | string
}) {

  return (
    <motion.div
      key={playKey}
      className="flex items-center justify-center"
      style={{ transformOrigin: '50% 65%' }}
      initial={{ x: -52, rotate: -14, opacity: 0 }}
      animate={{
        x: [-52, 7, 0],
        rotate: [-14, 10, 0],
        opacity: [0, 1, 1],
      }}
      transition={{
        duration: 0.8,
        times: [0, 0.7, 1],
        ease: ['easeOut', 'easeInOut', 'easeOut'],
      }}
    >
      <ShoppingCart className="size-12 text-primary lg:size-14" strokeWidth={1.25} />
    </motion.div>
  )
}

/** Barras de alcance que crecen en secuencia al entrar en #soluciones (cada 10 s) */
function AnimatedReachChart({ playKey }: { playKey: number | string }) {
  return (
    <div className="mt-3 flex h-10 items-end justify-between gap-1 px-0.5 lg:h-12">
      {REACH_BAR_HEIGHTS.map((height, index) => (
        <motion.div
          key={`${playKey}-${index}`}
          className="w-full flex-1 origin-bottom rounded-full bg-primary"
          initial={{ height: '0%', opacity: 0.35 }}
          animate={{
            height: [`0%`, `${height}%`, `${Math.max(height - 6, 8)}%`, `${height}%`],
            opacity: [0.35, 1, 1, 1],
          }}
          transition={{
            duration: 1.1,
            delay: index * 0.08,
            times: [0, 0.55, 0.78, 1],
            ease: ['easeOut', [0.22, 1, 0.36, 1], 'easeInOut', 'easeOut'],
          }}
        />
      ))}
    </div>
  )
}

/** Gráfica estilo mercado: rejilla, velas, línea de cierre y área animada */
function AnimatedGrowthStockChart({ playKey }: { playKey: number | string }) {
  const ohlc = buildOhlcSeries(GROWTH_CLOSE_SERIES)
  const linePoints = buildLinePoints(GROWTH_CLOSE_SERIES)
  const linePath = buildLinePath(linePoints)
  const areaPath = buildAreaPath(linePoints)
  const min = Math.min(...ohlc.map((b) => b.low))
  const max = Math.max(...ohlc.map((b) => b.high))
  const slotWidth = CHART_WIDTH / ohlc.length
  const lastPoint = linePoints[linePoints.length - 1]

  return (
    <div className="relative mt-3 h-14 w-full lg:h-20">
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="h-full w-full overflow-visible text-primary"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* Rejilla horizontal tipo terminal de trading */}
        {[0.25, 0.5, 0.75].map((ratio) => {
          const y = CHART_PAD_Y + (CHART_HEIGHT - CHART_PAD_Y * 2) * ratio
          return (
            <line
              key={ratio}
              x1={0}
              y1={y}
              x2={CHART_WIDTH}
              y2={y}
              className="stroke-border/50"
              strokeWidth={0.35}
              strokeDasharray="2 3"
            />
          )
        })}

        {/* Velas japonesas */}
        {ohlc.map((bar, index) => {
          const x = slotWidth * index + slotWidth / 2
          const yOpen = priceToY(bar.open, min, max)
          const yClose = priceToY(bar.close, min, max)
          const yHigh = priceToY(bar.high, min, max)
          const yLow = priceToY(bar.low, min, max)
          const bullish = bar.close >= bar.open
          const bodyTop = Math.min(yOpen, yClose)
          const bodyHeight = Math.max(1.2, Math.abs(yClose - yOpen))

          return (
            <g key={`${playKey}-candle-${index}`}>
              <motion.line
                x1={x}
                x2={x}
                y1={yHigh}
                y2={yLow}
                stroke="currentColor"
                strokeWidth={0.55}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ duration: 0.35, delay: index * 0.07 }}
              />
              <motion.rect
                x={x - slotWidth * 0.22}
                y={bodyTop}
                width={slotWidth * 0.44}
                height={bodyHeight}
                rx={0.4}
                className={bullish ? 'fill-primary' : 'fill-primary/35 stroke-primary'}
                strokeWidth={bullish ? 0 : 0.4}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                style={{ transformOrigin: `${x}px ${bodyTop + bodyHeight}px` }}
                transition={{ duration: 0.4, delay: 0.05 + index * 0.07, ease: 'easeOut' }}
              />
            </g>
          )
        })}

        {/* Área bajo la línea de cierre */}
        <motion.path
          key={`${playKey}-area`}
          d={areaPath}
          className="fill-primary/15 stroke-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        />

        {/* Línea de cierre animada */}
        <motion.path
          key={`${playKey}-line`}
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.35}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0.5 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Punto final pulsante */}
        {lastPoint ? (
          <motion.circle
            key={`${playKey}-dot`}
            cx={lastPoint.x}
            cy={lastPoint.y}
            r={1.8}
            className="fill-primary"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.25, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.45, delay: 0.95 }}
          />
        ) : null}
      </svg>
    </div>
  )
}

/** Colores del kit de marca (círculos superiores) */
const BRAND_COLOR_DOTS = [
  'bg-primary shadow-sm ring-2 ring-background',
  'bg-accent shadow-sm ring-2 ring-background',
  'bg-foreground/15 ring-2 ring-background',
] as const

const BRAND_TYPEWRITER_TEXT = 'Aa'

/** Efecto máquina de escribir para la muestra tipográfica */
function BrandingTypewriterText({ playKey }: { playKey: number | string }) {
  const [visibleChars, setVisibleChars] = useState(BRAND_TYPEWRITER_TEXT.length)

  useEffect(() => {
    setVisibleChars(0)
    let index = 0

    const timer = window.setInterval(() => {
      index += 1
      setVisibleChars(index)
      if (index >= BRAND_TYPEWRITER_TEXT.length) window.clearInterval(timer)
    }, 140)

    return () => window.clearInterval(timer)
  }, [playKey])

  const showCursor = visibleChars < BRAND_TYPEWRITER_TEXT.length

  return (
    <span className="inline-flex min-w-[2.25rem] items-center font-[family-name:var(--font-display)] text-xl font-bold leading-none tracking-tight text-foreground">
      {BRAND_TYPEWRITER_TEXT.slice(0, visibleChars)}
      <motion.span
        aria-hidden
        className="ml-px inline-block w-[2px] text-primary"
        animate={{ opacity: showCursor ? [1, 0, 1] : 0 }}
        transition={
          showCursor
            ? { duration: 0.55, repeat: Infinity, ease: 'linear' }
            : { duration: 0.15 }
        }
      >
        |
      </motion.span>
    </span>
  )
}

/** Paleta animada: círculos que pulsan tamaño + Aa con typewriter */
function AnimatedBrandingKit({ playKey }: { playKey: number | string }) {
  return (
    <div className="flex flex-col items-center gap-2.5 px-3">
      <div className="flex h-8 items-center gap-2">
        {BRAND_COLOR_DOTS.map((dotClass, index) => (
          <motion.span
            key={`${playKey}-dot-${index}`}
            className={cn('block size-6 shrink-0 rounded-full', dotClass)}
            initial={{ scale: 0.35, opacity: 0.5 }}
            animate={{
              scale: [0.35, 1.35, 0.88, 1.12, 1],
              opacity: [0.5, 1, 1, 1, 1],
            }}
            transition={{
              duration: 1,
              delay: index * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </div>
      <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-2.5 py-1.5 shadow-sm">
        <Palette className="size-4 shrink-0 text-primary" strokeWidth={1.5} />
        <BrandingTypewriterText playKey={playKey} />
        <Type className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div className="flex size-7 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/25">
        <span className="font-[family-name:var(--font-display)] text-xs font-bold text-primary">S</span>
      </div>
    </div>
  )
}

/** Kit de marca estático (sin animación) */
function BrandingKitStatic() {
  return (
    <div className="flex flex-col items-center gap-2.5 px-3">
      <div className="flex items-center gap-2">
        {BRAND_COLOR_DOTS.map((dotClass, index) => (
          <span key={index} className={cn('size-6 rounded-full', dotClass)} />
        ))}
      </div>
      <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-2.5 py-1.5 shadow-sm">
        <Palette className="size-4 text-primary" strokeWidth={1.5} />
        <span className="font-[family-name:var(--font-display)] text-xl font-bold leading-none tracking-tight text-foreground">
          {BRAND_TYPEWRITER_TEXT}
        </span>
        <Type className="size-4 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div className="flex size-7 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/25">
        <span className="font-[family-name:var(--font-display)] text-xs font-bold text-primary">S</span>
      </div>
    </div>
  )
}

/** Versión estática para prefers-reduced-motion */
function GrowthStockChartStatic() {
  const linePoints = buildLinePoints(GROWTH_CLOSE_SERIES)
  const ohlc = buildOhlcSeries(GROWTH_CLOSE_SERIES)
  const min = Math.min(...ohlc.map((b) => b.low))
  const max = Math.max(...ohlc.map((b) => b.high))
  const slotWidth = CHART_WIDTH / ohlc.length

  return (
    <div className="relative mt-3 h-14 w-full lg:h-20">
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="h-full w-full text-primary"
        preserveAspectRatio="none"
        aria-hidden
      >
        {ohlc.map((bar, index) => {
          const x = slotWidth * index + slotWidth / 2
          const yOpen = priceToY(bar.open, min, max)
          const yClose = priceToY(bar.close, min, max)
          const yHigh = priceToY(bar.high, min, max)
          const yLow = priceToY(bar.low, min, max)
          const bodyTop = Math.min(yOpen, yClose)
          const bodyHeight = Math.max(1.2, Math.abs(yClose - yOpen))
          const bullish = bar.close >= bar.open

          return (
            <g key={index}>
              <line x1={x} x2={x} y1={yHigh} y2={yLow} stroke="currentColor" strokeWidth={0.55} opacity={0.85} />
              <rect
                x={x - slotWidth * 0.22}
                y={bodyTop}
                width={slotWidth * 0.44}
                height={bodyHeight}
                rx={0.4}
                className={bullish ? 'fill-primary' : 'fill-primary/35'}
              />
            </g>
          )
        })}
        <path d={buildAreaPath(linePoints)} className="fill-primary/15" />
        <path
          d={buildLinePath(linePoints)}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.35}
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

type BentoCardId = 'web' | 'branding' | 'marketing' | 'growth' | 'team'

/** Estilos compartidos al pasar el cursor por una tarjeta del bento */
const BENTO_CARD_HOVER_CLASS =
  'cursor-default outline-none transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:outline hover:outline-[3px] hover:outline-offset-[3px] hover:outline-primary hover:shadow-xl hover:shadow-[0_14px_44px_-14px] hover:shadow-primary/30'

/** Tarjeta del bento — al hover relanza la animación interna */
function BentoHoverCard({
  cardId,
  className,
  onHoverReplay,
  children,
}: {
  cardId: BentoCardId
  className?: string
  onHoverReplay: (id: BentoCardId) => void
  children: ReactNode
}) {
  return (
    <Card
      className={cn(BENTO_CARD_HOVER_CLASS, className)}
      onMouseEnter={() => onHoverReplay(cardId)}
    >
      {children}
    </Card>
  )
}

/** Disciplinas del equipo — animación escalonada al hover de la tarjeta */
function AnimatedTeamDisciplines({
  playKey,
  disciplines,
}: {
  playKey: number | string
  disciplines: readonly { label: string; detail: string }[]
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {disciplines.map((item, index) => {
        const Icon = TEAM_DISCIPLINE_ICONS[index]

        return (
          <motion.div
            key={`${playKey}-${item.label}`}
            className="flex flex-col items-center rounded-xl border border-border/70 bg-card px-2 py-3 text-center shadow-sm"
            initial={{ opacity: 0.7, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, delay: index * 0.07, ease: 'easeOut' }}
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
              <Icon className="size-4 text-primary" strokeWidth={1.5} />
            </div>
            <p className="mt-2 text-xs font-semibold leading-tight text-foreground">{item.label}</p>
            <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
              {item.detail}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}

export function FeaturesBento() {
  const { t } = useLanguage()
  const { bento } = t.solutions
  const reducedMotion = useReducedMotion()
  const playKey = useSolucionesSectionReplay(!reducedMotion)
  const [hoverKeys, setHoverKeys] = useState<Record<BentoCardId, number>>({
    web: 0,
    branding: 0,
    marketing: 0,
    growth: 0,
    team: 0,
  })

  const replayOnHover = (id: BentoCardId) => {
    if (reducedMotion) return
    setHoverKeys((prev) => ({ ...prev, [id]: prev[id] + 1 }))
  }

  const animKey = (id: BentoCardId) => `${playKey}-${hoverKeys[id]}`

  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="relative">
        {/* Grid asimétrico de 6 columnas para las tarjetas de servicio */}
        <div className="relative z-10 grid auto-rows-auto grid-cols-6 gap-2 lg:auto-rows-fr lg:items-stretch lg:gap-3">
            <BentoHoverCard
              cardId="web"
              onHoverReplay={replayOnHover}
              className={cn(
                'relative col-span-full flex overflow-hidden lg:col-span-2',
                BENTO_CARD_SHELL_CLASS,
              )}
            >
              <CardContent
                className={cn(
                  BENTO_CARD_CONTENT_CLASS,
                  'items-center text-center max-lg:relative max-lg:m-auto max-lg:size-fit max-lg:pb-0',
                )}
              >
                {/* Icono de ecommerce — carrito de compras */}
                <div className={BENTO_ICON_ORB_CLASS} aria-hidden>
                  {reducedMotion ? (
                    <ShoppingCart className="size-12 text-primary lg:size-14" strokeWidth={1.25} />
                  ) : (
                    <AnimatedShoppingCart playKey={animKey('web')} />
                  )}
                </div>
                <div className={BENTO_TEXT_BLOCK_CLASS}>
                  <h2 className={cn(BENTO_CARD_TITLE_CLASS, 'text-center')}>
                    {bento.web.title}
                  </h2>
                  <p className="mt-1.5 text-center text-sm leading-relaxed text-muted-foreground lg:mt-2">
                    {bento.web.description}
                  </p>
                </div>
              </CardContent>
            </BentoHoverCard>
            <BentoHoverCard
              cardId="branding"
              onHoverReplay={replayOnHover}
              className={cn(
                'relative col-span-full flex overflow-hidden sm:col-span-3 lg:col-span-2',
                BENTO_CARD_SHELL_CLASS,
              )}
            >
              <CardContent className={cn(BENTO_CARD_CONTENT_CLASS, 'items-center text-center')}>
                {/* Mini kit de marca: paleta, tipografía y logotipo */}
                <div className={BENTO_ICON_ORB_CLASS} aria-hidden>
                  {reducedMotion ? (
                    <BrandingKitStatic />
                  ) : (
                    <AnimatedBrandingKit playKey={animKey('branding')} />
                  )}
                </div>
                <div className={BENTO_TEXT_BLOCK_CLASS}>
                  <h2 className={cn(BENTO_CARD_TITLE_CLASS, 'text-center')}>
                    {bento.branding.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground lg:mt-2">
                    {bento.branding.description}
                  </p>
                </div>
              </CardContent>
            </BentoHoverCard>
            <BentoHoverCard
              cardId="marketing"
              onHoverReplay={replayOnHover}
              className={cn(
                'relative col-span-full flex overflow-hidden sm:col-span-3 lg:col-span-2',
                BENTO_CARD_SHELL_CLASS,
              )}
            >
              <CardContent className={BENTO_CARD_CONTENT_CLASS}>
                {/* Panel de campaña: alcance, engagement y crecimiento */}
                <div
                  className="mx-auto w-full max-w-sm rounded-xl border border-border bg-muted/20 p-2.5 shadow-sm lg:p-3"
                  aria-hidden
                >
                  <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/15">
                        <Megaphone
                          className="size-4 text-primary"
                          strokeWidth={1.5}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground">
                        {bento.marketing.reachLabel}
                      </span>
                    </div>
                    <span className="flex items-center gap-0.5 text-xs font-semibold text-primary">
                      <TrendingUp className="size-3.5" strokeWidth={2} />
                      {bento.marketing.growthBadge}
                    </span>
                  </div>
                  {reducedMotion ? (
                    <div className="mt-3 flex h-10 items-end justify-between gap-1 px-0.5 lg:h-12">
                      {REACH_BAR_HEIGHTS.map((height, index) => (
                        <div
                          key={index}
                          className="w-full flex-1 rounded-full bg-primary"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  ) : (
                    <AnimatedReachChart playKey={animKey('marketing')} />
                  )}
                  <div className="mt-2.5 flex items-center justify-center gap-4 text-muted-foreground">
                    <Heart className="size-3.5" strokeWidth={1.5} />
                    <Share2 className="size-3.5" strokeWidth={1.5} />
                    <TrendingUp
                      className="size-3.5 text-primary"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
                <div className={cn(BENTO_TEXT_BLOCK_CLASS, 'text-center')}>
                  <h2 className={cn(BENTO_CARD_TITLE_CLASS, 'text-center')}>
                    {bento.marketing.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground lg:mt-2">
                    {bento.marketing.description}
                  </p>
                </div>
              </CardContent>
            </BentoHoverCard>
            <BentoHoverCard
              cardId="growth"
              onHoverReplay={replayOnHover}
              className={cn(
                'relative col-span-full flex overflow-hidden lg:col-span-3',
                BENTO_CARD_SHELL_CLASS,
              )}
            >
              <CardContent className={cn(BENTO_CARD_CONTENT_CLASS, 'gap-3 lg:gap-4')}>
                {/* Encabezado compacto: icono + título + descripción */}
                <div className="flex items-start gap-2.5 lg:gap-3">
                  <div className="relative flex size-9 shrink-0 items-center justify-center rounded-full border bg-muted/30 lg:size-11">
                    <Shield className="size-4 text-primary lg:size-5" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h2 className={BENTO_CARD_TITLE_CLASS}>{bento.growth.title}</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {bento.growth.description}
                    </p>
                  </div>
                </div>
                {/* Panel de métricas — ocupa el ancho restante sin overflow */}
                <div className="rounded-xl border border-border bg-muted/20 p-2.5 shadow-sm lg:p-3">
                  <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
                    <span className="text-xs font-medium text-foreground">
                      {bento.growth.metricsLabel}
                    </span>
                    <span className="flex items-center gap-0.5 text-xs font-semibold text-primary">
                      <TrendingUp className="size-3.5" strokeWidth={2} />
                      {bento.growth.trendBadge}
                    </span>
                  </div>
                  {reducedMotion ? (
                    <GrowthStockChartStatic />
                  ) : (
                    <AnimatedGrowthStockChart playKey={animKey('growth')} />
                  )}
                </div>
              </CardContent>
            </BentoHoverCard>
            <BentoHoverCard
              cardId="team"
              onHoverReplay={replayOnHover}
              className={cn(
                'relative col-span-full flex overflow-hidden lg:col-span-3',
                BENTO_CARD_SHELL_CLASS,
              )}
            >
              <CardContent className={cn(BENTO_CARD_CONTENT_CLASS, 'gap-3 lg:gap-4')}>
                {/* Encabezado compacto: icono + título + descripción */}
                <div className="flex items-start gap-2.5 lg:gap-3">
                  <div className="relative flex size-9 shrink-0 items-center justify-center rounded-full border bg-muted/30 lg:size-11">
                    <Users className="size-4 text-primary lg:size-5" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h2 className={BENTO_CARD_TITLE_CLASS}>{bento.team.title}</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {bento.team.description}
                    </p>
                  </div>
                </div>
                {/* Disciplinas en grid horizontal — llena el ancho de la tarjeta */}
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {bento.team.flowLabel}
                  </p>
                  {reducedMotion ? (
                    <div className="grid gap-2 sm:grid-cols-3">
                      {bento.team.disciplines.map((item, index) => {
                        const Icon = TEAM_DISCIPLINE_ICONS[index]
                        return (
                          <div
                            key={item.label}
                            className="flex flex-col items-center rounded-xl border border-border/70 bg-card px-2 py-3 text-center shadow-sm"
                          >
                            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                              <Icon className="size-4 text-primary" strokeWidth={1.5} />
                            </div>
                            <p className="mt-2 text-xs font-semibold leading-tight text-foreground">
                              {item.label}
                            </p>
                            <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                              {item.detail}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <AnimatedTeamDisciplines
                      playKey={animKey('team')}
                      disciplines={bento.team.disciplines}
                    />
                  )}
                </div>
              </CardContent>
            </BentoHoverCard>
        </div>
      </div>
    </div>
  )
}
