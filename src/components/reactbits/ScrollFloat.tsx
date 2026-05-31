import { useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react'
import { gsap } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import './ScrollFloat.css'

type ScrollFloatProps = {
  /** Texto a animar — se divide en caracteres si es string */
  children: ReactNode
  scrollContainerRef?: RefObject<HTMLElement | null>
  containerClassName?: string
  textClassName?: string
  animationDuration?: number
  ease?: string
  scrollStart?: string
  scrollEnd?: string
  stagger?: number
  /** Fracción del recorrido de scroll que mantiene el texto visible al 100% */
  holdRatio?: number
}

/**
 * Efecto React Bits: cada letra flota al entrar mientras haces scroll (GSAP + ScrollTrigger)
 */
export function ScrollFloat({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
  holdRatio = 0,
}: ScrollFloatProps) {
  const containerRef = useRef<HTMLHeadingElement>(null)
  const text = typeof children === 'string' ? children : ''

  // Divide el string en spans por carácter (espacios → nbsp)
  const splitText = useMemo(
    () =>
      text.split('').map((char, index) => (
        <span className="char" key={`${char}-${index}`}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      )),
    [text],
  )

  useEffect(() => {
    const el = containerRef.current
    if (!el || text.length === 0) return

    const scroller =
      scrollContainerRef?.current != null ? scrollContainerRef.current : window

    const ctx = gsap.context(() => {
      const charElements = el.querySelectorAll<HTMLElement>('.char')

      gsap.matchMedia().add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          motion: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean; motion: boolean }

          if (reduce) {
            gsap.set(charElements, {
              opacity: 1,
              yPercent: 0,
              scaleY: 1,
              scaleX: 1,
            })
            return
          }

          const enterPortion = Math.max(0.15, 1 - Math.min(holdRatio, 0.85))

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              scroller,
              start: scrollStart,
              end: scrollEnd,
              scrub: true,
            },
          })

          tl.fromTo(
            charElements,
            {
              willChange: 'opacity, transform',
              opacity: 0,
              yPercent: 85,
              scaleY: 1.85,
              scaleX: 0.82,
              transformOrigin: '50% 0%',
            },
            {
              duration: enterPortion * animationDuration,
              ease,
              opacity: 1,
              yPercent: 0,
              scaleY: 1,
              scaleX: 1,
              stagger,
            },
          )

          if (holdRatio > 0) {
            tl.to(
              charElements,
              {
                opacity: 1,
                yPercent: 0,
                scaleY: 1,
                scaleX: 1,
                duration: holdRatio * animationDuration,
                ease: 'none',
              },
              '>',
            )
          }
        },
      )
    }, el)

    return () => ctx.revert()
  }, [
    text,
    scrollContainerRef,
    animationDuration,
    ease,
    scrollStart,
    scrollEnd,
    stagger,
    holdRatio,
  ])

  return (
    <h2 ref={containerRef} className={cn('scroll-float', containerClassName)}>
      <span className={cn('scroll-float-text', textClassName)}>{splitText}</span>
    </h2>
  )
}

export default ScrollFloat
