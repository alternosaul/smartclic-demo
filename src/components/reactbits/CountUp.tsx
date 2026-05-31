import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

type CountUpProps = {
  /** Valor final del contador */
  value: number
  /** Texto antes del número (ej. "Más de") */
  prefix?: string
  /** Texto después del número (ej. "+") */
  suffix?: string
  /** Duración de la animación en segundos */
  duration?: number
  className?: string
}

/**
 * Anima un número de 0 al valor final cuando entra en pantalla
 */
export function CountUp({
  value,
  prefix = '',
  suffix = '',
  duration = 2.2,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()
  // once: false — al salir de vista se reinicia y vuelve a contar al regresar
  const isInView = useInView(ref, { once: false, margin: '-10% 0px' })
  const [display, setDisplay] = useState(reducedMotion ? value : 0)

  useEffect(() => {
    if (!isInView) {
      if (!reducedMotion) setDisplay(0)
      return
    }

    if (reducedMotion) {
      setDisplay(value)
      return
    }

    setDisplay(0)
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })

    return () => controls.stop()
  }, [isInView, value, duration, reducedMotion])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix ? (
        <span className="mb-0.5 block text-[0.32em] font-semibold uppercase leading-none tracking-wide text-muted-foreground sm:mb-0 sm:mr-1.5 sm:inline sm:text-[0.45em]">
          {prefix}
        </span>
      ) : null}
      {display}
      {suffix}
    </span>
  )
}

type CountUpStatProps = {
  value: number
  label: string
  prefix?: string
  suffix?: string
  duration?: number
}

/**
 * Tarjeta de estadística con número animado y etiqueta
 */
export function CountUpStat({
  value,
  label,
  prefix,
  suffix = '',
  duration,
}: CountUpStatProps) {
  return (
    <div className="flex h-full min-w-0 flex-col items-center px-2 py-4 text-center sm:px-5 sm:py-8">
      <CountUp
        value={value}
        prefix={prefix}
        suffix={suffix}
        duration={duration}
        className="font-[family-name:var(--font-display)] text-2xl font-bold leading-none text-primary [text-shadow:0_0_8px_color-mix(in_srgb,var(--color-primary)_28%,transparent)] sm:text-4xl lg:text-5xl"
      />
      <p className="mt-2 text-[10px] leading-tight text-muted-foreground sm:mt-3 sm:max-w-[12rem] sm:text-sm lg:text-base">
        {label}
      </p>
    </div>
  )
}
