import { cn } from '@/lib/utils'

/** Props compartidas para capas de fondo decorativas */
type BackgroundLayerProps = {
  /** Clases extra para posicionar o ajustar la capa */
  className?: string
}

type SoftBrandGlowProps = BackgroundLayerProps & {
  /** Opacidad de la capa (0–1) */
  opacity?: number
  /** Porcentaje del radio antes de volverse transparente (más bajo = glow más pequeño) */
  fadeStopPercent?: number
  /** Posición horizontal del centro del gradiente */
  centerX?: string
  /** Posición vertical del centro del gradiente */
  centerY?: string
  /** Tamaño del gradiente (p. ej. `circle`, `ellipse 100% 140%`) */
  gradientSize?: string
}

/**
 * Resplandor radial suave con el color primary de Smartclic.
 * Usa multiply para integrarse con fondo blanco.
 */
export function SoftBrandGlow({
  className,
  opacity = 0.32,
  fadeStopPercent = 42,
  centerX = '50%',
  centerY = '50%',
  gradientSize = 'circle',
}: SoftBrandGlowProps) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 z-0 mix-blend-multiply', className)}
      style={{
        opacity,
        backgroundImage: `radial-gradient(${gradientSize} at ${centerX} ${centerY}, color-mix(in oklch, var(--sc-primary) 48%, transparent) 0%, transparent ${fadeStopPercent}%)`,
      }}
      aria-hidden
    />
  )
}

type SphereGridBackgroundProps = BackgroundLayerProps & {
  /** Opacidad de las líneas de la cuadrícula (0–1) */
  lineOpacity?: number
  /** Si false, solo muestra las líneas sin halo radial */
  showHalo?: boolean
}

/**
 * Cuadrícula 32px + halo radial opcional (demo "White Sphere Grid").
 */
export function SphereGridBackground({
  className,
  lineOpacity = 0.1,
  showHalo = false,
}: SphereGridBackgroundProps) {
  const lineColor = `rgba(71, 85, 105, ${lineOpacity})`
  const haloLayer = showHalo
    ? `,
          radial-gradient(
            circle at 50% 50%,
            color-mix(in oklch, var(--sc-primary) 16%, transparent) 0%,
            color-mix(in oklch, var(--sc-primary) 6%, transparent) 40%,
            transparent 75%
          )`
    : ''

  const backgroundSize = showHalo
    ? '32px 32px, 32px 32px, 100% 100%'
    : '32px 32px, 32px 32px'

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 z-0', className)}
      style={{
        background: 'white',
        backgroundImage: `
          linear-gradient(to right, ${lineColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)${haloLayer}
        `,
        backgroundSize,
      }}
      aria-hidden
    />
  )
}

type SectionBrandBackgroundProps = BackgroundLayerProps & {
  showGlow?: boolean
  showGrid?: boolean
}

/**
 * Fondo de sección completa: cuadrícula suave (sin halo; el glow va en el bento).
 */
export function SectionBrandBackground({
  className,
  showGlow = false,
  showGrid = true,
}: SectionBrandBackgroundProps) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 z-0', className)} aria-hidden>
      {showGrid ? <SphereGridBackground /> : null}
      {showGlow ? <SoftBrandGlow /> : null}
    </div>
  )
}

type BentoBrandGlowProps = BackgroundLayerProps &
  Pick<SoftBrandGlowProps, 'opacity' | 'fadeStopPercent' | 'centerX' | 'centerY' | 'gradientSize'>

/**
 * Glow centrado sobre el área del bento (radio amplio, opacidad suave).
 * Acepta overrides de posición/tamaño cuando el contenedor incluye encabezado + grid.
 */
export function BentoBrandGlow({
  className,
  opacity = 0.28,
  fadeStopPercent = 62,
  centerX = '50%',
  centerY = '48%',
  gradientSize = 'circle',
}: BentoBrandGlowProps) {
  return (
    <SoftBrandGlow
      className={className}
      opacity={opacity}
      fadeStopPercent={fadeStopPercent}
      centerX={centerX}
      centerY={centerY}
      gradientSize={gradientSize}
    />
  )
}

/**
 * Glow de sección completa: elipse alta, stops extendidos y sin multiply
 * para que el tinte llegue al padding superior y al título.
 */
export function SectionBrandGlow({ className }: BackgroundLayerProps) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 z-0', className)}
      style={{
        opacity: 0.38,
        backgroundImage: `radial-gradient(
          ellipse 125% 170% at 50% 46%,
          color-mix(in oklch, var(--sc-primary) 42%, transparent) 0%,
          color-mix(in oklch, var(--sc-primary) 26%, transparent) 42%,
          color-mix(in oklch, var(--sc-primary) 14%, transparent) 68%,
          color-mix(in oklch, var(--sc-primary) 6%, transparent) 86%,
          transparent 100%
        )`,
      }}
      aria-hidden
    />
  )
}
