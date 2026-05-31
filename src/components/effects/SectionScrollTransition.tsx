import { ScrollFloat } from '@/components/reactbits/ScrollFloat'
import { cn } from '@/lib/utils'

type SectionScrollTransitionProps = {
  /** Texto grande que anima al cruzar el scroll entre secciones */
  label: string
  className?: string
}

/**
 * Puente visual entre secciones — ScrollFloat con scrub al hacer scroll
 */
export function SectionScrollTransition({ label, className }: SectionScrollTransitionProps) {
  return (
    <div
      className={cn(
        'relative z-20 flex min-h-[clamp(4.5rem,11vh,7rem)] items-center justify-center bg-white py-6 sm:min-h-[clamp(5rem,12vh,8rem)] sm:py-8',
        className,
      )}
      aria-hidden
    >
      <ScrollFloat
        containerClassName="w-full max-w-6xl px-3 text-center sm:px-8"
        textClassName="sonsie-one-regular max-w-full text-[clamp(1.125rem,4.25vw,2.5rem)] font-normal leading-none tracking-tight text-primary whitespace-nowrap sm:text-[clamp(1.5rem,6vw,3.5rem)] lg:text-[clamp(1.75rem,5vw,4.25rem)]"
        scrollStart="top bottom"
        scrollEnd="top 58%"
        holdRatio={0.12}
        animationDuration={0.45}
        ease="power2.out"
        stagger={0.008}
      >
        {label}
      </ScrollFloat>
    </div>
  )
}
