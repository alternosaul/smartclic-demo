import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/i18n/LanguageProvider'
import { NAVBAR_CONTROL_BUTTON_CLASS } from '@/components/layout/navbar-control-styles'
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
        'group h-9 gap-1.5 rounded-full px-3 text-xs font-semibold tracking-wide',
        NAVBAR_CONTROL_BUTTON_CLASS,
        className,
      )}
    >
      <Languages
        className="h-3.5 w-3.5 text-primary transition-colors group-hover:text-primary"
        aria-hidden
      />
      <span
        className={cn(
          locale === 'es' ? 'text-primary' : 'text-muted-foreground group-hover:text-primary/75',
        )}
      >
        ES
      </span>
      <span className="text-muted-foreground/50 group-hover:text-primary/40">|</span>
      <span
        className={cn(
          locale === 'en' ? 'text-primary' : 'text-muted-foreground group-hover:text-primary/75',
        )}
      >
        EN
      </span>
    </Button>
  )
}
