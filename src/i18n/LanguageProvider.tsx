import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { translations, type Locale, type TranslationKeys } from '@/i18n/translations'

const STORAGE_KEY = 'smartclic-locale'

type LanguageContextValue = {
  locale: Locale
  t: TranslationKeys
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'es'
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'en' ? 'en' : 'es'
}

/** Proveedor de idioma ES / EN con persistencia en localStorage */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'es' ? 'en' : 'es')
  }, [locale, setLocale])

  const t = translations[locale]

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = t.meta.title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', t.meta.description)
  }, [locale, t.meta])

  const value = useMemo(
    () => ({ locale, t, setLocale, toggleLocale }),
    [locale, t, setLocale, toggleLocale],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

/** Hook para acceder a traducciones y cambiar idioma */
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage debe usarse dentro de LanguageProvider')
  }
  return ctx
}
