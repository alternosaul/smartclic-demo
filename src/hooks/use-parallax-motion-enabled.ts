import { useReducedMotion } from 'motion/react'
import { useMediaQuery } from '@/hooks/use-media-query'

/**
 * Parallax ligado al scroll solo en desktop.
 * En móvil desactiva transforms para evitar jank y flicker con scroll nativo.
 */
export function useParallaxMotionEnabled() {
  const reduced = useReducedMotion()
  const isMobile = useMediaQuery('(max-width: 767px)')
  return !reduced && !isMobile
}
