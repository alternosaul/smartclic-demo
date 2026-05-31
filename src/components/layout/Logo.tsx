import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
}

/**
 * Wordmark del sitio — texto SmartClic en lugar de imagen
 */
export function Logo({ className }: LogoProps) {
  return (
    <span
      className={cn(
        'font-[family-name:var(--font-display)] text-xl font-bold leading-none tracking-tight text-foreground sm:text-xl',
        className,
      )}
    >
      Smart<span className="text-primary">Clic</span>
    </span>
  )
}
