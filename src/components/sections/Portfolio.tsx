import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CardSwap, { SwapCard, type CardSwapHandle } from '@/components/reactbits/CardSwap'
import { PortfolioServicesGrid } from '@/components/sections/PortfolioServicesGrid'
import { useLanguage } from '@/i18n/LanguageProvider'
import { cn } from '@/lib/utils'

const projectStyles = [
  { gradient: 'from-cyan-500/20 to-blue-600/20', accent: '#22d3ee' },
  { gradient: 'from-violet-500/20 to-purple-600/20', accent: '#a78bfa' },
  { gradient: 'from-emerald-500/20 to-teal-600/20', accent: '#34d399' },
  { gradient: 'from-rose-500/20 to-pink-600/20', accent: '#fb7185' },
  { gradient: 'from-amber-500/20 to-orange-600/20', accent: '#fbbf24' },
  { gradient: 'from-indigo-500/20 to-sky-600/20', accent: '#818cf8' },
]

type PortfolioProject = {
  title: string
  category: string
}

/** Mockup visual de cada proyecto dentro de la tarjeta */
function PortfolioProjectCard({
  project,
  styleIndex,
}: {
  project: PortfolioProject
  styleIndex: number
}) {
  const style = projectStyles[styleIndex]

  return (
    <article className="flex h-full flex-col overflow-hidden bg-white">
      <div className={`relative flex-1 bg-gradient-to-br ${style.gradient} p-4 sm:p-5`}>
        <div className="absolute inset-3 rounded-lg border border-border bg-white shadow-md sm:inset-4">
          <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-red-400/80" />
            <span className="h-2 w-2 rounded-full bg-yellow-400/80" />
            <span className="h-2 w-2 rounded-full bg-green-400/80" />
          </div>
          <div className="space-y-2 p-3 sm:p-4">
            <div
              className="h-3 w-3/4 rounded"
              style={{ backgroundColor: `${style.accent}40` }}
            />
            <div className="h-2 w-1/2 rounded bg-muted" />
            <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="aspect-square rounded-md"
                  style={{
                    backgroundColor: n === 1 ? `${style.accent}30` : 'oklch(0.96 0 0)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="shrink-0 border-t border-border p-4 sm:p-5">
        <p className="text-xs text-primary">{project.category}</p>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold text-foreground sm:text-lg">
          {project.title}
        </h3>
      </div>
    </article>
  )
}

/** Grid estático cuando el usuario prefiere menos movimiento */
function PortfolioGrid({ projects }: { projects: PortfolioProject[] }) {
  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2">
      {projects.map((project, i) => (
        <Link
          key={project.title}
          to="/demo"
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
        >
          <PortfolioProjectCard project={project} styleIndex={i} />
        </Link>
      ))}
    </div>
  )
}

/** CardSwap fijo — rota automáticamente, cada tarjeta enlaza a la demo */
function PortfolioCardSwap({ projects }: { projects: PortfolioProject[] }) {
  const { t } = useLanguage()
  const cardSwapRef = useRef<CardSwapHandle>(null)
  const [cardSize, setCardSize] = useState({ width: 300, height: 390 })
  // En móvil/tablet el stack crece hacia abajo para no invadir el grid de servicios
  const [stackDown, setStackDown] = useState(false)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 640) setCardSize({ width: Math.min(w - 48, 320), height: 380 })
      else if (w < 1024) setCardSize({ width: 420, height: 420 })
      else setCardSize({ width: 480, height: 440 })
      setStackDown(w < 1024)
    }
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  const cardCount = projects.length
  const stackPad = Math.max(0, cardCount - 1) * 52
  // Distancia vertical entre tarjetas en el stack (debe coincidir con CardSwap)
  const verticalDistance = stackDown ? 48 : 70
  const stackOverflowY = stackDown ? Math.max(0, cardCount - 1) * verticalDistance : 0
  const stackPaddingUp = stackPad * 0.45

  return (
    <div
      className={cn(
        'relative flex w-full items-center justify-center gap-1 overflow-visible sm:gap-3',
        'max-lg:mt-4 max-lg:pt-2',
        'lg:max-w-[min(100%,42rem)] lg:justify-end lg:justify-self-end lg:gap-2 xl:max-w-[min(100%,44rem)]',
      )}
      style={
        stackDown
          ? { paddingTop: 12, paddingBottom: stackOverflowY + 20 }
          : { paddingTop: stackPaddingUp, paddingBottom: 8 }
      }
    >
      <button
        type="button"
        onClick={() => cardSwapRef.current?.prev()}
        aria-label={t.portfolio.prevProject}
        className={cn(
          'z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-sm',
          'transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary',
        )}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>

      <CardSwap
        ref={cardSwapRef}
        width={cardSize.width}
        height={cardSize.height}
        cardDistance={60}
        verticalDistance={verticalDistance}
        delay={4500}
        autoStart={false}
        pauseOnHover
        skewAmount={6}
        easing="linear"
        stackDown={stackDown}
        className="card-swap-container--center shrink-0"
      >
        {projects.map((project, i) => (
          <SwapCard key={project.title} className="cursor-pointer">
            <Link to="/demo" className="block h-full w-full" aria-label={project.title}>
              <PortfolioProjectCard project={project} styleIndex={i} />
            </Link>
          </SwapCard>
        ))}
      </CardSwap>

      <button
        type="button"
        onClick={() => cardSwapRef.current?.next()}
        aria-label={t.portfolio.nextProject}
        className={cn(
          'z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-sm',
          'transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary',
        )}
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>
    </div>
  )
}

/**
 * Galería de trabajos destacados (mockups visuales)
 */
export function Portfolio() {
  const { t } = useLanguage()
  const reducedMotion = useReducedMotion()
  const projects = [...t.portfolio.projects]

  return (
    <section
      id="trabajos"
      className="relative overflow-x-clip overflow-y-visible bg-white pt-8 pb-6 sm:pt-12 sm:pb-8"
    >
      {/* Orbes decorativos fijos — sin parallax */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-1/4 top-12 h-64 w-64 rounded-full bg-primary/6 blur-[100px]" />
        <div className="absolute right-1/4 bottom-8 h-72 w-72 rounded-full bg-accent/6 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 pb-5 sm:flex-row sm:items-end sm:pb-7">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground sm:text-4xl">
              {t.portfolio.title}
            </h2>
          </div>
          <Button variant="outline" className="rounded-full border-border">
            {t.portfolio.cta}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {reducedMotion ? (
          <PortfolioGrid projects={projects} />
        ) : (
          <div className="relative z-0 mt-8 overflow-visible sm:mt-10">
            {/*
              Desktop: servicios a la izquierda, carrusel desplazado a la derecha.
              Móvil: servicios arriba en 2 columnas, carrusel centrado abajo.
            */}
            <div className="grid grid-cols-1 items-start gap-12 max-lg:gap-14 lg:grid-cols-[minmax(240px,30%)_minmax(0,1fr)] lg:items-center lg:gap-6 xl:grid-cols-[minmax(260px,28%)_minmax(0,1fr)] xl:gap-10">
              <div className="relative z-10 w-full max-lg:pb-2">
                <PortfolioServicesGrid />
              </div>
              <PortfolioCardSwap projects={projects} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
