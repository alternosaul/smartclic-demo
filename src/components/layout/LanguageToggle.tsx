import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/i18n/LanguageProvider'
import { cn } from '@/lib/utils'

type LanguageToggleProps = {
  className?: string
}

/**
 * Botón para alternar entre español e inglés
 */
export function LanguageToggle({ className }: LanguageToggleProps) {
  const { locale, toggleLocale, t } = useLanguage()

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggleLocale}
      aria-label={t.nav.langSwitch}
      className={cn(
        'h-9 gap-1.5 rounded-full border-border px-3 text-xs font-semibold tracking-wide',
        className,
      )}
    >
      <Languages className="h-3.5 w-3.5 text-primary" aria-hidden />
      <span className={locale === 'es' ? 'text-primary' : 'text-muted-foreground'}>
        ES
      </span>
      <span className="text-muted-foreground/50">|</span>
      <span className={locale === 'en' ? 'text-primary' : 'text-muted-foreground'}>
        EN
      </span>
    </Button>
  )
}
