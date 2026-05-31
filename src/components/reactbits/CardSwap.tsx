import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import './CardSwap.css'

type SwapCardProps = React.HTMLAttributes<HTMLDivElement> & {
  customClass?: string
}

/** Tarjeta individual del stack CardSwap */
export const SwapCard = forwardRef<HTMLDivElement, SwapCardProps>(
  ({ customClass, className, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={cn('card-swap-card', customClass, className)}
    />
  ),
)
SwapCard.displayName = 'SwapCard'

type Slot = {
  x: number
  y: number
  z: number
  zIndex: number
}

type CardSwapProps = {
  width?: number | string
  height?: number | string
  cardDistance?: number
  verticalDistance?: number
  delay?: number
  pauseOnHover?: boolean
  onCardClick?: (idx: number) => void
  skewAmount?: number
  easing?: 'linear' | 'elastic'
  className?: string
  autoStart?: boolean
  stackDown?: boolean
  /** Índice activo ligado al scroll — avanza/retrocede con scroll down/up */
  scrollDriven?: boolean
  scrollTriggerRef?: RefObject<HTMLElement | null>
  /** Duración de transición al cambiar de tarjeta con scroll (segundos) */
  scrollTransitionDuration?: number
  /** Píxeles de scroll para recorrer todas las tarjetas (modo scrollDriven) */
  scrollDistance?: number
  children: ReactNode
}

/** API imperativa — flechas u otros controles externos */
export type CardSwapHandle = {
  next: () => void
  prev: () => void
}

const makeSlot = (
  stackPos: number,
  distX: number,
  distY: number,
  total: number,
  stackDown = false,
): Slot => ({
  x: stackPos * distX,
  y: stackDown ? stackPos * distY : -stackPos * distY,
  z: -stackPos * distX * 1.5,
  zIndex: total - stackPos,
})

const placeNow = (el: HTMLElement, slot: Slot, skew: number, stackDown = false) => {
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    left: '50%',
    top: stackDown ? 0 : '50%',
    xPercent: -50,
    yPercent: stackDown ? 0 : -50,
    skewY: skew,
    transformOrigin: stackDown ? 'top center' : 'center center',
    zIndex: slot.zIndex,
    force3D: true,
  })
}

/**
 * Stack de tarjetas con animación GSAP — autoplay o controlado por scroll
 */
const CardSwap = forwardRef<CardSwapHandle, CardSwapProps>(function CardSwap(
  {
    width = 500,
    height = 400,
    cardDistance = 60,
    verticalDistance = 70,
    delay = 5000,
    pauseOnHover = false,
    onCardClick,
    skewAmount = 6,
    easing = 'elastic',
    className,
    autoStart = true,
    stackDown = false,
    scrollDriven = false,
    scrollTriggerRef,
    scrollTransitionDuration = 0.48,
    scrollDistance = 420,
    children,
  },
  ref,
) {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05,
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2,
        }

  const childArr = useMemo(() => Children.toArray(children), [children])
  const refs = useMemo(
    () => childArr.map(() => ({ current: null as HTMLDivElement | null })),
    [childArr.length],
  )

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i))
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const intervalRef = useRef<number | undefined>(undefined)
  const activeIndexRef = useRef(0)
  const animatingRef = useRef(false)
  const pendingRef = useRef<'next' | 'prev' | null>(null)
  const container = useRef<HTMLDivElement>(null)
  const swapRef = useRef<() => void>(() => {})
  const swapPrevRef = useRef<() => void>(() => {})
  const resetAutoplayRef = useRef<() => void>(() => {})

  useImperativeHandle(ref, () => ({
    next: () => {
      resetAutoplayRef.current()
      swapRef.current()
    },
    prev: () => {
      resetAutoplayRef.current()
      swapPrevRef.current()
    },
  }))

  useEffect(() => {
    const total = refs.length

    /** Coloca cada tarjeta según el índice activo (0 = frontal) */
    const applyStackState = (
      activeIndex: number,
      animate: boolean,
      direction: 'forward' | 'back' = 'forward',
    ) => {
      refs.forEach((r, cardIdx) => {
        const el = r.current
        if (!el) return

        const stackPos = (cardIdx - activeIndex + total) % total
        const slot = makeSlot(stackPos, cardDistance, verticalDistance, total, stackDown)

        if (animate) {
          gsap.to(el, {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            skewY: skewAmount,
            duration: scrollTransitionDuration,
            ease: direction === 'forward' ? 'power2.out' : 'power2.inOut',
            overwrite: 'auto',
          })
          gsap.set(el, { zIndex: slot.zIndex })
        } else {
          placeNow(el, slot, skewAmount, stackDown)
        }
      })
    }

    /** Detiene tweens y alinea el DOM con el orden lógico actual */
    const snapStackToOrder = () => {
      tlRef.current?.kill()
      tlRef.current = null
      order.current.forEach((cardIdx, stackPos) => {
        const el = refs[cardIdx]?.current
        if (!el) return
        gsap.killTweensOf(el)
        const slot = makeSlot(stackPos, cardDistance, verticalDistance, total, stackDown)
        placeNow(el, slot, skewAmount, stackDown)
      })
    }

    /** Coloca el stack inicial según el orden actual (mismo skew en todas las tarjetas) */
    const syncStackFromOrder = (animate: boolean, onDone?: () => void) => {
      if (!animate) {
        snapStackToOrder()
        onDone?.()
        return
      }

      animatingRef.current = true
      const tl = gsap.timeline({
        onComplete: () => {
          snapStackToOrder()
          animatingRef.current = false
          onDone?.()
        },
      })
      tlRef.current = tl

      order.current.forEach((cardIdx, stackPos) => {
        const el = refs[cardIdx]?.current
        if (!el) return
        const slot = makeSlot(stackPos, cardDistance, verticalDistance, total, stackDown)
        tl.set(el, { zIndex: slot.zIndex }, stackPos === 0 ? undefined : '<')
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            skewY: skewAmount,
            duration: config.durMove,
            ease: config.ease,
            overwrite: 'auto',
          },
          stackPos * 0.06,
        )
      })
    }

    const flushPending = () => {
      const pending = pendingRef.current
      pendingRef.current = null
      if (pending === 'next') swap()
      else if (pending === 'prev') swapPrev()
    }

    snapStackToOrder()

    const swap = () => {
      if (order.current.length < 2) return
      if (animatingRef.current) {
        pendingRef.current = 'next'
        return
      }

      snapStackToOrder()

      const [front, ...rest] = order.current
      const elFront = refs[front]?.current
      if (!elFront) return

      animatingRef.current = true
      const tl = gsap.timeline({
        onComplete: () => {
          order.current = [...rest, front]
          snapStackToOrder()
          animatingRef.current = false
          flushPending()
        },
      })
      tlRef.current = tl

      tl.to(elFront, {
        y: stackDown ? '+=500' : '+=500',
        duration: config.durDrop,
        ease: config.ease,
      })

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`)
      rest.forEach((idx, i) => {
        const el = refs[idx]?.current
        if (!el) return
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length, stackDown)
        tl.set(el, { zIndex: slot.zIndex }, 'promote')
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            skewY: skewAmount,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * 0.15}`,
        )
      })

      const backSlot = makeSlot(
        refs.length - 1,
        cardDistance,
        verticalDistance,
        refs.length,
        stackDown,
      )
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`)
      tl.call(() => {
        gsap.set(elFront, { zIndex: backSlot.zIndex })
      }, undefined, 'return')
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          skewY: skewAmount,
          duration: config.durReturn,
          ease: config.ease,
        },
        'return',
      )
    }

    /** Retrocede una tarjeta — la del fondo pasa al frente */
    const swapPrev = () => {
      if (order.current.length < 2) return
      if (animatingRef.current) {
        pendingRef.current = 'prev'
        return
      }

      snapStackToOrder()

      const last = order.current[order.current.length - 1]!
      const rest = order.current.slice(0, -1)
      order.current = [last, ...rest]
      syncStackFromOrder(true, flushPending)
    }

    const clearIntervalSafe = () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }

    let scrollTrigger: ScrollTrigger | undefined

    if (scrollDriven) {
      const triggerEl = scrollTriggerRef?.current ?? container.current
      if (triggerEl) {
        activeIndexRef.current = 0
        applyStackState(0, false)

        scrollTrigger = ScrollTrigger.create({
          trigger: triggerEl,
          start: 'top 68%',
          end: `+=${scrollDistance}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const targetIndex = Math.round(self.progress * Math.max(total - 1, 0))
            if (targetIndex === activeIndexRef.current) return

            const direction = targetIndex > activeIndexRef.current ? 'forward' : 'back'
            applyStackState(targetIndex, true, direction)
            activeIndexRef.current = targetIndex
          },
        })
        ScrollTrigger.refresh()
      }
    } else {
      intervalRef.current = window.setInterval(() => {
        if (!animatingRef.current) swap()
      }, delay)
    }

    const resetAutoplay = () => {
      if (scrollDriven) return
      clearIntervalSafe()
      intervalRef.current = window.setInterval(() => {
        if (!animatingRef.current) swap()
      }, delay)
    }

    swapRef.current = swap
    swapPrevRef.current = swapPrev
    resetAutoplayRef.current = resetAutoplay

    if (pauseOnHover && !scrollDriven) {
      const node = container.current
      if (!node) {
        return () => {
          clearIntervalSafe()
          scrollTrigger?.kill()
        }
      }

      /** Solo pausa el autoplay — la animación en curso debe terminar para no romper el stack */
      const pause = () => {
        clearIntervalSafe()
      }
      const resume = () => {
        resetAutoplay()
      }

      node.addEventListener('mouseenter', pause)
      node.addEventListener('touchstart', pause, { passive: true })
      node.addEventListener('mouseleave', resume)
      node.addEventListener('touchend', resume, { passive: true })

      return () => {
        node.removeEventListener('mouseenter', pause)
        node.removeEventListener('touchstart', pause)
        node.removeEventListener('mouseleave', resume)
        node.removeEventListener('touchend', resume)
        clearIntervalSafe()
        scrollTrigger?.kill()
      }
    }

    return () => {
      clearIntervalSafe()
      scrollTrigger?.kill()
    }
  }, [
    cardDistance,
    verticalDistance,
    delay,
    pauseOnHover,
    skewAmount,
    easing,
    autoStart,
    stackDown,
    scrollDriven,
    scrollTriggerRef,
    scrollTransitionDuration,
    scrollDistance,
    refs,
    config.durDrop,
    config.durMove,
    config.durReturn,
    config.ease,
    config.promoteOverlap,
    config.returnDelay,
  ])

  const rendered = childArr.map((child, i) => {
    if (!isValidElement(child)) return child

    const element = child as ReactElement<{
      style?: CSSProperties
      onClick?: (e: React.MouseEvent) => void
    }>

    return cloneElement(element, {
      key: i,
      ref: (node: HTMLDivElement | null) => {
        refs[i].current = node
      },
      style: { width, height, ...(element.props.style ?? {}) },
      onClick: (e: React.MouseEvent<HTMLDivElement>) => {
        element.props.onClick?.(e)
        onCardClick?.(i)
      },
    } as never)
  })

  return (
    <div
      ref={container}
      className={cn('card-swap-container', className)}
      style={{ width, height }}
    >
      {rendered}
    </div>
  )
})

export default CardSwap
export { CardSwap }
