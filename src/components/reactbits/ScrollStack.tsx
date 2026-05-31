import {
  useLayoutEffect,
  useRef,
  useCallback,
  Children,
  type ReactNode,
} from 'react'
import Lenis from 'lenis'
import { ScrollTrigger } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import 'lenis/dist/lenis.css'
import './ScrollStack.css'

type ScrollStackItemProps = {
  children: ReactNode
  itemClassName?: string
}

/** Cada tarjeta apilable dentro del ScrollStack */
export function ScrollStackItem({ children, itemClassName = '' }: ScrollStackItemProps) {
  return <div className={cn('scroll-stack-card', itemClassName)}>{children}</div>
}

type CardTransform = {
  translateX: number
  translateY: number
  scale: number
  rotation: number
  blur: number
}

type ScrollStackLayout = 'vertical' | 'horizontal'

type ScrollStackProps = {
  children: ReactNode
  className?: string
  innerClassName?: string
  itemDistance?: number
  itemScale?: number
  itemStackDistance?: number
  stackPosition?: string
  scaleEndPosition?: string
  baseScale?: number
  rotationAmount?: number
  blurAmount?: number
  useWindowScroll?: boolean
  onStackComplete?: () => void
  /** Padding inferior del track de scroll (modo ventana) */
  bottomPadding?: string
  /** vertical = apilado; horizontal = fila de tarjetas (blog desktop) */
  layout?: ScrollStackLayout
  /** Desactiva Lenis interno (p. ej. cuando hay ScrollTrigger pin) */
  enableLenis?: boolean
  /** Ancla triggers al inicio del inner — tarjetas superpuestas (blog pin) */
  anchorToSection?: boolean
  /** Píxeles de scroll por tarjeta en modo anclado */
  scrollPerCard?: number
}

/**
 * Stack de tarjetas con efecto de apilado al hacer scroll (React Bits + Lenis)
 */
export function ScrollStack({
  children,
  className = '',
  innerClassName = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
  bottomPadding,
  layout = 'vertical',
  enableLenis = true,
  anchorToSection = false,
  scrollPerCard: scrollPerCardProp,
}: ScrollStackProps) {
  const isHorizontal = layout === 'horizontal'
  const scrollerRef = useRef<HTMLDivElement>(null)
  const stackCompletedRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const cardsRef = useRef<HTMLElement[]>([])
  const lastTransformsRef = useRef<Map<number, CardTransform>>(new Map())
  const isUpdatingRef = useRef(false)

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0
    if (scrollTop > end) return 1
    return (scrollTop - start) / (end - start)
  }, [])

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight
    }
    return parseFloat(String(value))
  }, [])

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
      }
    }

    const scroller = scrollerRef.current
    return {
      scrollTop: scroller?.scrollTop ?? 0,
      containerHeight: scroller?.clientHeight ?? window.innerHeight,
    }
  }, [useWindowScroll])

  const getElementOffset = useCallback(
    (element: HTMLElement) => {
      if (useWindowScroll) {
        const rect = element.getBoundingClientRect()
        return rect.top + window.scrollY
      }
      return element.offsetTop
    },
    [useWindowScroll],
  )

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return

    isUpdatingRef.current = true

    const { scrollTop, containerHeight } = getScrollData()
    const stackPositionPx = parsePercentage(stackPosition, containerHeight)
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight)
    const root = scrollerRef.current
    const inner = root?.querySelector('.scroll-stack-inner') as HTMLElement | null

    const endElement = root?.querySelector('.scroll-stack-end')
    const endElementTop = endElement ? getElementOffset(endElement as HTMLElement) : 0

    // Modo React Bits clásico — scroll de ventana, tarjetas con margen que se apilan al pin
    if (!anchorToSection && !isHorizontal) {
      let topCardIndex = 0
      for (let j = 0; j < cardsRef.current.length; j++) {
        const jCard = cardsRef.current[j]
        if (!jCard) continue
        const jCardTop = getElementOffset(jCard)
        const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j
        if (scrollTop >= jTriggerStart) topCardIndex = j
      }

      const pinEndScroll = endElementTop - containerHeight / 2

      cardsRef.current.forEach((card, i) => {
        if (!card) return

        const cardTop = getElementOffset(card)
        const triggerStart = cardTop - stackPositionPx - itemStackDistance * i
        const triggerEnd = cardTop - scaleEndPositionPx
        const pinStart = triggerStart
        const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd)
        const targetScale = baseScale + i * itemScale
        const scale = 1 - scaleProgress * (1 - targetScale)
        const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0

        let blur = 0
        if (blurAmount && i < topCardIndex) {
          blur = (topCardIndex - i) * blurAmount
        }

        let translateY = 0
        const isPinned = scrollTop >= pinStart && scrollTop <= pinEndScroll
        if (isPinned) {
          translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i
        } else if (scrollTop > pinEndScroll) {
          translateY = pinEndScroll - cardTop + stackPositionPx + itemStackDistance * i
        }

        card.style.zIndex = String(i + 1)
        card.style.opacity = '1'
        card.style.pointerEvents = ''

        const newTransform: CardTransform = {
          translateX: 0,
          translateY: Math.round(translateY * 100) / 100,
          scale: Math.round(scale * 1000) / 1000,
          rotation: Math.round(rotation * 100) / 100,
          blur: Math.round(blur * 100) / 100,
        }

        const lastTransform = lastTransformsRef.current.get(i)
        const hasChanged =
          !lastTransform ||
          Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
          Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
          Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
          Math.abs(lastTransform.blur - newTransform.blur) > 0.1

        if (hasChanged) {
          card.style.transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`
          card.style.filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : ''
          lastTransformsRef.current.set(i, newTransform)
        }

        if (i === cardsRef.current.length - 1) {
          const isInView = scrollTop >= pinStart && scrollTop <= pinEndScroll
          if (isInView && !stackCompletedRef.current) {
            stackCompletedRef.current = true
            onStackComplete?.()
          } else if (!isInView && stackCompletedRef.current) {
            stackCompletedRef.current = false
          }
        }
      })

      isUpdatingRef.current = false
      return
    }

    // Punto de inicio del track de scroll (horizontal: todas las tarjetas comparten altura)
    const sectionTop = inner ? getElementOffset(inner) : getElementOffset(cardsRef.current[0])
    const firstCard = cardsRef.current[0]
    const firstCardOffsetLeft = firstCard?.offsetLeft ?? 0
    const scrollSegment = itemDistance + itemStackDistance
    const scrollPerCard =
      scrollPerCardProp ?? (anchorToSection ? containerHeight * 0.45 : scrollSegment)
    const anchorBaseTop = sectionTop
    const firstCardTop = firstCard ? getElementOffset(firstCard) : sectionTop

    // Índice de la tarjeta activa (la visible al frente del stack)
    let topCardIndex = 0
    for (let j = 0; j < cardsRef.current.length; j++) {
      const jCard = cardsRef.current[j]
      if (!jCard) continue
      const jTriggerStart = anchorToSection
        ? anchorBaseTop - stackPositionPx + j * scrollPerCard
        : isHorizontal
          ? sectionTop - stackPositionPx + j * scrollSegment
          : getElementOffset(jCard) - stackPositionPx - itemStackDistance * j
      if (scrollTop >= jTriggerStart) topCardIndex = j
    }

    const pinEndScroll = anchorToSection
      ? anchorBaseTop - stackPositionPx + cardsRef.current.length * scrollPerCard
      : endElementTop - containerHeight / 2

    cardsRef.current.forEach((card, i) => {
      if (!card) return

      const cardTop = anchorToSection ? firstCardTop : getElementOffset(card)
      const horizontalOffset = card.offsetLeft - firstCardOffsetLeft

      const triggerStart = anchorToSection
        ? anchorBaseTop - stackPositionPx + i * scrollPerCard
        : isHorizontal
          ? sectionTop - stackPositionPx + i * scrollSegment
          : cardTop - stackPositionPx - itemStackDistance * i
      const triggerEnd = anchorToSection
        ? triggerStart + scrollPerCard * 0.85
        : isHorizontal
          ? triggerStart + scrollSegment * 0.9
          : cardTop - scaleEndPositionPx

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd)
      const targetScale = baseScale + i * itemScale

      // Tarjetas anteriores: escala reducida y desenfoque; activa: tamaño completo
      let scale: number
      let blur = 0
      if (i < topCardIndex) {
        scale = targetScale
        if (blurAmount) blur = (topCardIndex - i) * blurAmount
      } else {
        scale = 1
      }

      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0

      let translateX = 0
      let translateY = 0

      if (isHorizontal) {
        translateX = scaleProgress * (itemStackDistance * i - horizontalOffset)
      } else {
        const pinStart = anchorToSection
          ? anchorBaseTop - stackPositionPx + i * scrollPerCard
          : cardTop - stackPositionPx - itemStackDistance * i
        const stackOffset = itemStackDistance * (topCardIndex - i)

        if (anchorToSection) {
          if (scrollTop >= pinStart) {
            translateY = scrollTop - cardTop + stackPositionPx + stackOffset
            if (scrollTop > pinEndScroll) {
              translateY = pinEndScroll - cardTop + stackPositionPx + stackOffset
            }
          } else if (i > 0) {
            // Entradas futuras: fuera del slot hasta que les toque
            translateY = containerHeight * 0.55
          }
        } else {
          const isPinned = scrollTop >= pinStart && scrollTop <= pinEndScroll
          if (isPinned) {
            translateY = scrollTop - cardTop + stackPositionPx + stackOffset
          } else if (scrollTop > pinEndScroll) {
            translateY = pinEndScroll - cardTop + stackPositionPx + stackOffset
          }
        }
      }

      // z-index: la tarjeta activa siempre al frente del stack
      const totalCards = cardsRef.current.length
      if (i === topCardIndex) {
        card.style.zIndex = String(totalCards + 10)
      } else if (i < topCardIndex) {
        card.style.zIndex = String(i + 1)
      } else {
        card.style.zIndex = String(1)
      }

      // Ocultar entradas que aún no entran en el stack
      if (anchorToSection && i > topCardIndex) {
        card.style.opacity = '0'
        card.style.pointerEvents = 'none'
      } else {
        card.style.opacity = '1'
        card.style.pointerEvents = ''
      }

      const newTransform: CardTransform = {
        translateX: Math.round(translateX * 100) / 100,
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      }

      const lastTransform = lastTransformsRef.current.get(i)
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateX - newTransform.translateX) > 0.1 ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1

      if (hasChanged) {
        card.style.transform = `translate3d(${newTransform.translateX}px, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`
        card.style.filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : ''
        lastTransformsRef.current.set(i, newTransform)
      }

      if (i === cardsRef.current.length - 1) {
        const lastTriggerStart = isHorizontal
          ? sectionTop - stackPositionPx + i * scrollSegment
          : cardTop - stackPositionPx - itemStackDistance * i
        const lastTriggerEnd = isHorizontal
          ? lastTriggerStart + scrollSegment * 0.9
          : cardTop - scaleEndPositionPx
        const isInView =
          scrollTop >= lastTriggerStart && scrollTop <= lastTriggerEnd + containerHeight
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true
          onStackComplete?.()
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false
        }
      }
    })

    isUpdatingRef.current = false
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset,
    isHorizontal,
    anchorToSection,
    scrollPerCardProp,
  ])

  const handleScroll = useCallback(() => {
    updateCardTransforms()
  }, [updateCardTransforms])

  const setupLenis = useCallback(() => {
    if (!enableLenis) return

    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
      })

      lenis.on('scroll', () => {
        ScrollTrigger.update()
        handleScroll()
      })

      const raf = (time: number) => {
        lenis.raf(time)
        animationFrameRef.current = requestAnimationFrame(raf)
      }
      animationFrameRef.current = requestAnimationFrame(raf)

      lenisRef.current = lenis
      return lenis
    }

    const scroller = scrollerRef.current
    if (!scroller) return

    const content = scroller.querySelector('.scroll-stack-inner')
    if (!content) return

    const lenis = new Lenis({
      wrapper: scroller,
      content: content as HTMLElement,
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    })

    lenis.on('scroll', handleScroll)

    const raf = (time: number) => {
      lenis.raf(time)
      animationFrameRef.current = requestAnimationFrame(raf)
    }
    animationFrameRef.current = requestAnimationFrame(raf)

    lenisRef.current = lenis
    return lenis
  }, [handleScroll, useWindowScroll, enableLenis])

  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const cards = Array.from(scroller.querySelectorAll<HTMLElement>('.scroll-stack-card'))
    cardsRef.current = cards

    cards.forEach((card, i) => {
      if (anchorToSection) {
        // Tarjetas superpuestas: la primera define la altura del contenedor
        card.style.marginBottom = '0'
        card.style.marginRight = '0'
        if (i === 0) {
          card.style.position = 'relative'
        } else {
          card.style.position = 'absolute'
          card.style.top = '0'
          card.style.left = '0'
          card.style.right = '0'
        }
      } else if (i < cards.length - 1) {
        if (isHorizontal) {
          card.style.marginRight = `${itemDistance}px`
          card.style.marginBottom = '0'
        } else {
          card.style.marginBottom = `${itemDistance}px`
          card.style.marginRight = '0'
        }
      }
      card.style.willChange = 'transform, filter'
      card.style.transformOrigin = isHorizontal ? 'top left' : 'top center'
      card.style.backfaceVisibility = 'hidden'
      card.style.transform = 'translateZ(0)'
      card.style.zIndex = String(i + 1)
    })

    setupLenis()
    updateCardTransforms()

    if (useWindowScroll) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleScroll, { passive: true })
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      lenisRef.current?.destroy()
      lenisRef.current = null

      if (useWindowScroll) {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleScroll)
      }

      stackCompletedRef.current = false
      cardsRef.current = []
      lastTransformsRef.current.clear()
      isUpdatingRef.current = false
    }
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    updateCardTransforms,
    handleScroll,
    isHorizontal,
    layout,
    enableLenis,
    anchorToSection,
  ])

  const cardCount = Children.count(children)
  const anchorScrollTrack =
    anchorToSection && scrollPerCardProp
      ? Math.max(cardCount, 1) * scrollPerCardProp
      : 0

  return (
    <div
      ref={scrollerRef}
      className={cn(
        'scroll-stack-scroller',
        useWindowScroll && 'scroll-stack-scroller--window',
        className,
      )}
    >
      <div
        className={cn(
          'scroll-stack-inner',
          useWindowScroll && 'scroll-stack-inner--window',
          isHorizontal && 'scroll-stack-inner--horizontal',
          anchorToSection && 'scroll-stack-inner--anchored',
          innerClassName,
        )}
        style={
          useWindowScroll && bottomPadding && !anchorToSection
            ? { paddingBottom: bottomPadding }
            : undefined
        }
      >
        {children}
        <div
          className={cn('scroll-stack-end', isHorizontal && 'scroll-stack-end--horizontal')}
          style={anchorScrollTrack > 0 ? { height: anchorScrollTrack } : undefined}
          aria-hidden
        />
      </div>
    </div>
  )
}

export default ScrollStack
