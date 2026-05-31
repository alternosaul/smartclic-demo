import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/i18n/LanguageProvider'
import { useTheme } from '@/theme/ThemeProvider'
import type { ThemeId } from '@/theme/themes'
import { NAVBAR_CONTROL_BUTTON_CLASS } from '@/components/layout/navbar-control-styles'
import { cn } from '@/lib/utils'

type ThemePaletteProps = {
  className?: string
}

/**
 * Selector de tema — colores ocultos hasta abrir el dropdown
 */
export function ThemePalette({ className }: ThemePaletteProps) {
  const { t } = useLanguage()
  const { themeId, theme, themes, setThemeId } = useTheme()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const labelFor = (id: ThemeId) => t.nav.themes[id]

  // Cierra al hacer clic fuera o con Escape
  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const pickTheme = (id: ThemeId) => {
    setThemeId(id)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label={t.nav.themePalette}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'group h-9 gap-1.5 rounded-full px-2.5 sm:px-3',
          NAVBAR_CONTROL_BUTTON_CLASS,
          open && 'border-primary/40 bg-primary/10 text-primary',
        )}
      >
        <Palette className="h-3.5 w-3.5 text-primary" aria-hidden />
        <span
          className="h-4 w-4 shrink-0 rounded-full border-2 border-white shadow-sm"
          style={{ background: theme.swatch }}
          aria-hidden
        />
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-muted-foreground transition-[transform,color] group-hover:text-primary',
            open && 'rotate-180 text-primary',
          )}
          aria-hidden
        />
      </Button>

      {open && (
        <div
          id={listId}
          role="listbox"
          aria-label={t.nav.themePalette}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[250] min-w-[10.5rem] rounded-xl border border-border bg-white p-2 shadow-lg"
        >
          <ul className="grid grid-cols-3 gap-2 p-0.5">
            {themes.map((item) => {
              const active = themeId === item.id
              return (
                <li key={item.id} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    aria-label={labelFor(item.id)}
                    onClick={() => pickTheme(item.id)}
                    className={cn(
                      'flex h-9 w-full items-center justify-center rounded-lg transition-colors hover:bg-primary/10',
                      active && 'bg-muted/80',
                    )}
                  >
                    <span
                      className={cn(
                        'h-7 w-7 rounded-full border-2 border-white shadow-sm',
                        active && 'ring-2 ring-primary ring-offset-1',
                      )}
                      style={{ background: item.swatch }}
                    />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
