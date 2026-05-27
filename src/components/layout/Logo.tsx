import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
  /** Fondo extra solo si el logo no trae fondo propio */
  withBackground?: boolean
}

/**
 * Logo oficial Smartclic.mx (cerebro + wordmark)
 */
export function Logo({ className, withBackground = false }: LogoProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center',
        withBackground && 'rounded-xl bg-black px-2 py-1',
      )}
    >
      <img
        src="/logo-smartclic.png"
        alt="Smartclic.mx"
        width={140}
        height={72}
        className={cn('h-10 w-auto object-contain sm:h-11', className)}
      />
    </span>
  )
}
