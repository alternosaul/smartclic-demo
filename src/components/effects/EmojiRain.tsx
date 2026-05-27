import { useMemo, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/** Emojis que caen como lluvia — likes, corazones, risa y patos */
const RAIN_EMOJIS = ['👍', '❤️', '😂', '🦆', '💖', '😍', '👍🏻', '🦆'] as const

type Particle = {
  id: number
  emoji: (typeof RAIN_EMOJIS)[number]
  left: number
  delay: number
  duration: number
  size: number
  opacity: number
  drift: number
}

type EmojiRainProps = {
  className?: string
  /** Cantidad de emojis en pantalla */
  count?: number
}

/**
 * Capa decorativa de emojis cayendo (solo fondo, sin interacción)
 */
export function EmojiRain({ className, count = 42 }: EmojiRainProps) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, id) => ({
      id,
      emoji: RAIN_EMOJIS[id % RAIN_EMOJIS.length],
      left: Math.random() * 100,
      delay: Math.random() * 12,
      duration: 10 + Math.random() * 14,
      size: 1 + Math.random() * 1.1,
      opacity: 0.12 + Math.random() * 0.22,
      drift: -30 + Math.random() * 60,
    }))
  }, [count])

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden
    >
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="emoji-rain-particle absolute top-0 select-none will-change-transform"
          style={
            {
              left: `${particle.left}%`,
              fontSize: `${particle.size}rem`,
              opacity: particle.opacity,
              '--rain-duration': `${particle.duration}s`,
              '--rain-delay': `${particle.delay}s`,
              '--rain-drift': `${particle.drift}px`,
            } as CSSProperties
          }
        >
          {particle.emoji}
        </span>
      ))}
    </div>
  )
}
