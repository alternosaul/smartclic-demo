import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LanguageToggle } from '@/components/layout/LanguageToggle'
import { ThemePalette } from '@/components/layout/ThemePalette'
import { Logo } from '@/components/layout/Logo'
import { useLanguage } from '@/i18n/LanguageProvider'
import { cn } from '@/lib/utils'

const bounceSpring = { type: 'spring' as const, stiffness: 520, damping: 14, mass: 0.8 }
const popSpring = { type: 'spring' as const, stiffness: 680, damping: 11, mass: 0.65 }

/**
 * Barra de navegación fija — siempre visible sobre el hero y el resto del sitio
 */
export function Navbar() {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const links = [
    { href: '#soluciones', label: t.nav.solutions },
    { href: '#presencia', label: t.nav.presence },
    { href: '#trabajos', label: t.nav.works },
    { href: '#blog', label: t.nav.blog },
    { href: '#contacto', label: t.nav.contact },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const closeMenu = () => setOpen(false)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[200] w-full pt-[env(safe-area-inset-top,0px)]',
        'transition-[background-color,box-shadow,border-color] duration-300',
        scrolled || open
          ? 'border-b border-border bg-white/95 shadow-sm backdrop-blur-xl'
          : 'border-b border-border/60 bg-white/90 shadow-sm backdrop-blur-md',
      )}
    >
      <nav
        className="mx-auto flex h-16 min-w-0 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6 lg:px-8"
        aria-label="Principal"
      >
        <a
          href="#"
          className="flex min-w-0 shrink-0 items-center"
          onClick={closeMenu}
        >
          <Logo />
        </a>

        {/* Enlaces — solo escritorio grande (lg+) */}
        <ul className="hidden min-w-0 flex-1 items-center justify-center gap-5 lg:flex xl:gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Escritorio lg+: idioma + CTA */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-3">
          <ThemePalette />
          <LanguageToggle />
          <Button asChild size="sm" className="rounded-full px-6">
            <a href="#contacto">{t.nav.cta}</a>
          </Button>
        </div>

        {/* Móvil y tablet (< lg): idioma + hamburguesa destacado */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:hidden">
          <ThemePalette />
          <LanguageToggle className="h-9 px-3 text-xs sm:h-10 sm:px-3.5 sm:text-xs" />
          <motion.button
            type="button"
            className={cn(
              'relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 shadow-md transition-colors sm:h-12 sm:w-12',
              open
                ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : 'border-primary/50 bg-primary/10 text-primary shadow-primary/15 ring-2 ring-primary/25',
            )}
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            whileTap={{ scale: 0.9 }}
            animate={
              open
                ? { scale: [1, 1.08, 1] }
                : { scale: [1, 1.04, 1], boxShadow: ['0 4px 14px rgba(0,0,0,0.08)', '0 6px 20px rgba(0,0,0,0.12)', '0 4px 14px rgba(0,0,0,0.08)'] }
            }
            transition={
              open
                ? { duration: 0.35, ease: [0.34, 1.4, 0.64, 1] }
                : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            {!open && (
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-white" aria-hidden />
            )}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'close' : 'open'}
                className="flex items-center justify-center"
                initial={{ scale: 0.5, rotate: open ? -90 : 90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.5, rotate: open ? 90 : -90, opacity: 0 }}
                transition={popSpring}
              >
                {open ? (
                  <X size={22} strokeWidth={2.5} />
                ) : (
                  <Menu size={22} strokeWidth={2.5} />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={bounceSpring}
            className="overflow-hidden border-t border-border bg-white lg:hidden"
          >
            <motion.ul
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
                closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
              }}
              className="flex flex-col gap-3 px-4 py-5 sm:gap-4 sm:p-6"
            >
              {links.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{
                    closed: { opacity: 0, y: -10, scale: 0.96 },
                    open: { opacity: 1, y: 0, scale: 1, transition: popSpring },
                  }}
                >
                  <a
                    href={link.href}
                    className="block py-1 text-base font-medium text-foreground sm:text-lg"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                variants={{
                  closed: { opacity: 0, y: -10, scale: 0.96 },
                  open: { opacity: 1, y: 0, scale: 1, transition: popSpring },
                }}
              >
                <Button asChild className="mt-1 w-full rounded-full sm:mt-2">
                  <a href="#contacto" onClick={closeMenu}>
                    {t.nav.cta}
                  </a>
                </Button>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
