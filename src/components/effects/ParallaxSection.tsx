import {
  createContext,
  useContext,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useParallaxMotionEnabled } from '@/hooks/use-parallax-motion-enabled'
import { cn } from '@/lib/utils'

/** Progreso de scroll de la sección (0 al entrar, 1 al salir del viewport) */
const ParallaxProgressContext = createContext<MotionValue<number> | null>(null)

/** Hook para leer el progreso parallax de la sección contenedora */
export function useParallaxProgress() {
  return useContext(ParallaxProgressContext)
}

type ParallaxSectionProps = ComponentPropsWithoutRef<'section'>

/**
 * Contenedor de sección con seguimiento de scroll para efectos parallax en hijos
 */
export function ParallaxSection({ className, children, ...props }: ParallaxSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  return (
    <ParallaxProgressContext.Provider value={scrollYProgress}>
      <section ref={ref} className={cn('relative', className)} {...props}>
        {children}
      </section>
    </ParallaxProgressContext.Provider>
  )
}

type ParallaxLayerProps = {
  className?: string
  /** Multiplicador de velocidad (mayor = más movimiento) */
  speed?: number
  /** Desplazamiento máximo en píxeles */
  distance?: number
  children?: ReactNode
}

/** Fondo global con parallax ligado al scroll de la página (montar solo en desktop vía App) */
export function SiteParallaxBackdrop() {
  const { scrollYProgress } = useScroll()
  const leftY = useTransform(scrollYProgress, [0, 1], [50, -120])
  const rightY = useTransform(scrollYProgress, [0, 1], [-40, 100])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <motion.div
        style={{ y: leftY }}
        className="absolute left-[8%] top-[18%] h-[420px] w-[420px] rounded-full bg-primary/4 blur-[140px]"
      />
      <motion.div
        style={{ y: rightY }}
        className="absolute right-[6%] top-[52%] h-[480px] w-[480px] rounded-full bg-accent/4 blur-[150px]"
      />
    </div>
  )
}

/** Usa el progreso de la sección o un valor fijo si se renderiza fuera del contexto */
function useSectionProgress(): MotionValue<number> {
  const progress = useParallaxProgress()
  const fallback = useMotionValue(0)
  return progress ?? fallback
}

/** Capa de fondo o decoración con movimiento parallax vertical */
export function ParallaxLayer({
  className,
  speed = 0.35,
  distance = 120,
  children,
}: ParallaxLayerProps) {
  const progress = useSectionProgress()
  const motionEnabled = useParallaxMotionEnabled()
  const y = useTransform(
    progress,
    [0, 1],
    motionEnabled ? [distance * speed, -distance * speed] : [0, 0],
  )

  return (
    <motion.div
      style={{ y }}
      className={cn('pointer-events-none absolute', className)}
      aria-hidden
    >
      {children}
    </motion.div>
  )
}

type ParallaxContentProps = {
  className?: string
  children: ReactNode
  speed?: number
  distance?: number
}

/** Bloque de contenido con desplazamiento parallax suave */
export function ParallaxContent({
  className,
  children,
  speed = 0.14,
  distance = 56,
}: ParallaxContentProps) {
  const progress = useSectionProgress()
  const motionEnabled = useParallaxMotionEnabled()
  const y = useTransform(
    progress,
    [0, 1],
    motionEnabled ? [distance * speed, -distance * speed] : [0, 0],
  )

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

type ParallaxRevealProps = {
  className?: string
  children: ReactNode
  /** Desplazamiento inicial al entrar la sección (px) */
  distance?: number
}

/**
 * Entrada de sección: el contenido sube y aparece al hacer scroll
 * (ideal para la primera sección después del hero)
 */
export function ParallaxReveal({
  className,
  children,
  distance = 88,
}: ParallaxRevealProps) {
  const progress = useSectionProgress()
  const motionEnabled = useParallaxMotionEnabled()
  const y = useTransform(
    progress,
    [0, 0.42, 1],
    motionEnabled ? [distance, 0, -distance * 0.4] : [0, 0, 0],
  )
  const opacity = useTransform(
    progress,
    [0, 0.18, 0.42, 1],
    motionEnabled ? [0, 0.55, 1, 1] : [1, 1, 1, 1],
  )

  return (
    <motion.div style={{ y, opacity }} className={className}>
      {children}
    </motion.div>
  )
}

type ParallaxItemProps = {
  className?: string
  children: ReactNode
  /** Profundidad relativa — valores distintos crean efecto de capas */
  depth?: number
}

/** Elemento hijo (tarjeta, bloque) con parallax individual */
export function ParallaxItem({ className, children, depth = 1 }: ParallaxItemProps) {
  const progress = useSectionProgress()
  const motionEnabled = useParallaxMotionEnabled()
  const shift = 28 * depth
  const y = useTransform(
    progress,
    [0, 0.5, 1],
    motionEnabled ? [shift * 0.35, 0, -shift * 0.35] : [0, 0, 0],
  )

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}
