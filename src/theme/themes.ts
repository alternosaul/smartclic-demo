/** Identificadores de los 6 temas disponibles */
export type ThemeId = 'cyan' | 'ocean' | 'violet' | 'rose' | 'emerald' | 'amber'

/** Variables de color que se aplican al documento */
export type ThemeColorVars = {
  primary: string
  primaryForeground: string
  accent: string
  accentForeground: string
  ring: string
  mutedTint: string
  heroTint: string
  shineMid: string
  glow: string
}

export type SiteTheme = {
  id: ThemeId
  /** Color visible en el botón de la paleta */
  swatch: string
  vars: ThemeColorVars
}

/** Catálogo de temas — tokens coherentes por paleta */
export const SITE_THEMES: SiteTheme[] = [
  {
    id: 'cyan',
    swatch: 'oklch(0.55 0.18 195)',
    vars: {
      primary: 'oklch(0.55 0.18 195)',
      primaryForeground: 'oklch(1 0 0)',
      accent: 'oklch(0.55 0.2 320)',
      accentForeground: 'oklch(1 0 0)',
      ring: 'oklch(0.55 0.18 195)',
      mutedTint: 'oklch(0.55 0.18 195 / 0.08)',
      heroTint: 'oklch(0.98 0.02 195)',
      shineMid: 'oklch(0.55 0.18 195)',
      glow: 'oklch(0.55 0.18 195 / 0.06)',
    },
  },
  {
    id: 'ocean',
    swatch: 'oklch(0.5 0.14 245)',
    vars: {
      primary: 'oklch(0.5 0.14 245)',
      primaryForeground: 'oklch(1 0 0)',
      accent: 'oklch(0.58 0.12 210)',
      accentForeground: 'oklch(1 0 0)',
      ring: 'oklch(0.5 0.14 245)',
      mutedTint: 'oklch(0.5 0.14 245 / 0.08)',
      heroTint: 'oklch(0.97 0.03 245)',
      shineMid: 'oklch(0.5 0.14 245)',
      glow: 'oklch(0.5 0.14 245 / 0.06)',
    },
  },
  {
    id: 'violet',
    swatch: 'oklch(0.52 0.2 295)',
    vars: {
      primary: 'oklch(0.52 0.2 295)',
      primaryForeground: 'oklch(1 0 0)',
      accent: 'oklch(0.62 0.16 330)',
      accentForeground: 'oklch(1 0 0)',
      ring: 'oklch(0.52 0.2 295)',
      mutedTint: 'oklch(0.52 0.2 295 / 0.08)',
      heroTint: 'oklch(0.97 0.04 295)',
      shineMid: 'oklch(0.52 0.2 295)',
      glow: 'oklch(0.52 0.2 295 / 0.06)',
    },
  },
  {
    id: 'rose',
    swatch: 'oklch(0.58 0.18 15)',
    vars: {
      primary: 'oklch(0.58 0.18 15)',
      primaryForeground: 'oklch(1 0 0)',
      accent: 'oklch(0.65 0.14 350)',
      accentForeground: 'oklch(1 0 0)',
      ring: 'oklch(0.58 0.18 15)',
      mutedTint: 'oklch(0.58 0.18 15 / 0.08)',
      heroTint: 'oklch(0.98 0.03 15)',
      shineMid: 'oklch(0.58 0.18 15)',
      glow: 'oklch(0.58 0.18 15 / 0.06)',
    },
  },
  {
    id: 'emerald',
    swatch: 'oklch(0.52 0.15 155)',
    vars: {
      primary: 'oklch(0.52 0.15 155)',
      primaryForeground: 'oklch(1 0 0)',
      accent: 'oklch(0.58 0.12 175)',
      accentForeground: 'oklch(1 0 0)',
      ring: 'oklch(0.52 0.15 155)',
      mutedTint: 'oklch(0.52 0.15 155 / 0.08)',
      heroTint: 'oklch(0.97 0.03 155)',
      shineMid: 'oklch(0.52 0.15 155)',
      glow: 'oklch(0.52 0.15 155 / 0.06)',
    },
  },
  {
    id: 'amber',
    swatch: 'oklch(0.68 0.14 75)',
    vars: {
      primary: 'oklch(0.68 0.14 75)',
      primaryForeground: 'oklch(0.2 0.02 75)',
      accent: 'oklch(0.62 0.16 45)',
      accentForeground: 'oklch(1 0 0)',
      ring: 'oklch(0.68 0.14 75)',
      mutedTint: 'oklch(0.68 0.14 75 / 0.1)',
      heroTint: 'oklch(0.98 0.04 75)',
      shineMid: 'oklch(0.68 0.14 75)',
      glow: 'oklch(0.68 0.14 75 / 0.08)',
    },
  },
]

export const DEFAULT_THEME_ID: ThemeId = 'cyan'
const STORAGE_KEY = 'smartclic-theme'

const themeMap = new Map(SITE_THEMES.map((theme) => [theme.id, theme]))

/** Devuelve un tema por id o el tema por defecto */
export function getSiteTheme(id: ThemeId): SiteTheme {
  return themeMap.get(id) ?? themeMap.get(DEFAULT_THEME_ID)!
}

function readStoredThemeId(): ThemeId {
  if (typeof window === 'undefined') return DEFAULT_THEME_ID
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null
  return SITE_THEMES.some((t) => t.id === stored) ? stored! : DEFAULT_THEME_ID
}

/** Aplica variables CSS al elemento raíz (Tailwind lee --sc-* vía @theme) */
export function applySiteTheme(theme: SiteTheme) {
  const root = document.documentElement
  const { vars } = theme

  root.dataset.theme = theme.id
  root.style.setProperty('--sc-primary', vars.primary)
  root.style.setProperty('--sc-primary-foreground', vars.primaryForeground)
  root.style.setProperty('--sc-accent', vars.accent)
  root.style.setProperty('--sc-accent-foreground', vars.accentForeground)
  root.style.setProperty('--sc-ring', vars.ring)
  root.style.setProperty('--sc-muted-tint', vars.mutedTint)
  root.style.setProperty('--sc-hero-tint', vars.heroTint)
  root.style.setProperty('--sc-shine-mid', vars.shineMid)
  root.style.setProperty('--sc-glow', vars.glow)

  // Alias para estilos que usan var(--color-primary) directamente
  root.style.setProperty('--color-primary', vars.primary)
  root.style.setProperty('--color-primary-foreground', vars.primaryForeground)
  root.style.setProperty('--color-accent', vars.accent)
  root.style.setProperty('--color-accent-foreground', vars.accentForeground)
  root.style.setProperty('--color-ring', vars.ring)
}

/** Hidrata el tema guardado antes del primer render (evita flash) */
export function initStoredSiteTheme() {
  if (typeof document === 'undefined') return
  applySiteTheme(getSiteTheme(readStoredThemeId()))
}
