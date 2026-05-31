import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Code2, Megaphone, Palette, TrendingUp } from 'lucide-react'
import { useLanguage } from '@/i18n/LanguageProvider'
import { cn } from '@/lib/utils'

/** Icono por servicio (mismo orden que solutions.items) */
const SERVICE_ICONS = [Code2, Palette, Megaphone, TrendingUp] as const

/**
 * Grid de servicios con resaltado animado — columna izquierda del portafolio en desktop
 */
export function PortfolioServicesGrid() {
  const { t } = useLanguage()
  const items = t.solutions.items
  const reducedMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)

  // Rota el servicio destacado si no hay preferencia de movimiento reducido
  useEffect(() => {
    if (reducedMotion) return
    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % items.length)
    }, 2600)
    return () => window.clearInterval(timer)
  }, [items.length, reducedMotion])

  return (
    <div className="w-full lg:max-w-xs">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {t.solutions.badge}
      </p>
      <ul className="mt-4 grid grid-cols-2 auto-rows-fr items-stretch gap-2.5 sm:gap-3 max-lg:mb-1 lg:mb-0 lg:auto-rows-auto lg:grid-cols-1 lg:gap-2.5">
        {items.map((item, i) => {
          const Icon = SERVICE_ICONS[i] ?? Code2
          const isActive = activeIndex === i

          return (
            <motion.li
              key={item.title}
              className="flex h-full min-h-0"
              initial={reducedMotion ? false : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(i)}
                onFocus={() => setActiveIndex(i)}
                className={cn(
                  'flex h-full w-full items-start gap-2.5 rounded-xl border p-3 text-left transition-all duration-500 sm:gap-3',
                  'max-lg:min-h-[9.5rem]',
                  isActive
                    ? 'border-primary/40 bg-primary/8 shadow-md shadow-primary/10'
                    : 'border-border bg-secondary/50 hover:border-primary/25',
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-500',
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-white text-primary',
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="flex min-h-0 min-w-0 flex-1 flex-col">
                  <span className="text-sm font-semibold leading-snug text-foreground">
                    {item.title}
                    {'titleLine2' in item && item.titleLine2 ? (
                      <span className="block text-xs font-medium text-muted-foreground">
                        {item.titleLine2}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 line-clamp-3 flex-1 text-xs leading-snug text-muted-foreground">
                    {item.description}
                  </span>
                </span>
              </button>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
