import { Logo } from '@/components/layout/Logo'
import { useLanguage } from '@/i18n/LanguageProvider'

/**
 * Pie de página con enlaces
 */
export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <a href="#" className="flex items-center">
            <Logo />
          </a>
          <p className="text-center text-sm text-muted-foreground">{t.footer.tagline}</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary">
              {t.footer.privacy}
            </a>
            <a href="#blog" className="hover:text-primary">
              {t.footer.blog}
            </a>
            <a
              href="https://smartclic.mx/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              {t.footer.currentSite}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
