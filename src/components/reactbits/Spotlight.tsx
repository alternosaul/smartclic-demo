import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type SpotlightProps = {
  className?: string
}

/**
 * Spotlight que sigue el cursor — efecto de luz en el hero
 */
export function Spotlight({ className }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      el.style.setProperty('--spot-x', `${x}px`)
      el.style.setProperty('--spot-y', `${y}px`)
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={ref}
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      style={
        {
          '--spot-x': '50%',
          '--spot-y': '40%',
        } as React.CSSProperties
      }
    >
      <div
        className="absolute h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
        style={{
          left: 'var(--spot-x)',
          top: 'var(--spot-y)',
          background:
            'radial-gradient(circle, oklch(0.78 0.19 195 / 0.35) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
