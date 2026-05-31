import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  applySiteTheme,
  DEFAULT_THEME_ID,
  getSiteTheme,
  SITE_THEMES,
  type SiteTheme,
  type ThemeId,
} from '@/theme/themes'

const STORAGE_KEY = 'smartclic-theme'

type ThemeContextValue = {
  themeId: ThemeId
  theme: SiteTheme
  themes: SiteTheme[]
  setThemeId: (id: ThemeId) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredThemeId(): ThemeId {
  if (typeof window === 'undefined') return DEFAULT_THEME_ID
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null
  return SITE_THEMES.some((t) => t.id === stored) ? stored! : DEFAULT_THEME_ID
}

/** Proveedor de tema — persiste la paleta elegida en localStorage */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(readStoredThemeId)

  const theme = useMemo(() => getSiteTheme(themeId), [themeId])

  useLayoutEffect(() => {
    applySiteTheme(theme)
  }, [theme])

  const setThemeId = useCallback((id: ThemeId) => {
    const next = getSiteTheme(id)
    setThemeIdState(id)
    localStorage.setItem(STORAGE_KEY, id)
    applySiteTheme(next)
  }, [])

  const value = useMemo(
    () => ({
      themeId,
      theme,
      themes: SITE_THEMES,
      setThemeId,
    }),
    [themeId, theme, setThemeId],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider')
  return ctx
}
