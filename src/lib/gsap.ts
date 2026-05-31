import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** Registro único de plugins GSAP usados en la landing */
gsap.registerPlugin(ScrollTrigger)

// normalizeScroll intercepta el gesto en touch y compite con sticky nativo en móvil — no activar

let refreshTimeout: ReturnType<typeof setTimeout> | undefined

/** Recalcula ScrollTrigger sin disparar refresh en cada evento de resize */
export function debouncedScrollTriggerRefresh(delayMs = 150) {
  if (refreshTimeout) clearTimeout(refreshTimeout)
  refreshTimeout = setTimeout(() => {
    ScrollTrigger.refresh()
    refreshTimeout = undefined
  }, delayMs)
}

export { gsap, ScrollTrigger }
