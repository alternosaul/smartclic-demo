import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** Registro único de plugins GSAP usados en la landing */
gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
