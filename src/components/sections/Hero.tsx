import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { Button } from '@/components/ui/button'
import Floating, { FloatingElement } from '@/components/ui/parallax-floating'
import { TextRotate } from '@/components/ui/text-rotate'
import { useLanguage } from '@/i18n/LanguageProvider'
import { BrandBanners } from '@/components/sections/BrandBanners'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

/** PNG con fondo transparente en /public/hero-cards */
const heroCardImages = {
  macbook: '/hero-cards/macbook.png',
  boardingPass: '/hero-cards/boarding-pass.png',
  burger: '/hero-cards/burger.png',
  chessRook: '/hero-cards/chess-rook.png',
  iceCream: '/hero-cards/ice-cream.png',
  smartphone: '/hero-cards/smartphone.png',
  tablet: '/hero-cards/tablet.png',
  boseSpeaker: '/hero-cards/bose-speaker.png',
  airpods: '/hero-cards/airpods.png',
  foundation: '/hero-cards/foundation.png',
  sneaker: '/hero-cards/sneaker.png',
  drone: '/hero-cards/drone.png',
  camera: '/hero-cards/camera.png',
} as const

/** Configuración de cada sticker flotante */
type HeroSticker = {
  src: string
  title: string
  depth: number
  position: string
  size: string
  rotate: string
  shadow: string
  delay: number
}

/** Stickers desktop — laterales con parallax (md+) */
const floatingCardsDesktop: HeroSticker[] = [
  // Izquierda
  {
    src: heroCardImages.macbook,
    title: 'MacBook Pro',
    depth: 1.5,
    position: 'top-[8%] left-[2%] md:top-[10%] md:left-[4%]',
    size: 'h-20 w-28 sm:h-24 sm:w-32 md:h-28 md:w-40',
    rotate: '-rotate-8',
    shadow: 'drop-shadow-[0_18px_28px_rgba(0,0,0,0.22)]',
    delay: 0.4,
  },
  {
    src: heroCardImages.smartphone,
    title: 'Smartphone',
    depth: 1,
    position: 'top-[20%] left-[10%] md:top-[22%] md:left-[11%]',
    size: 'h-16 w-10 sm:h-20 sm:w-12 md:h-24 md:w-14',
    rotate: 'rotate-12',
    shadow: 'drop-shadow-[0_14px_22px_rgba(0,0,0,0.18)]',
    delay: 0.45,
  },
  {
    src: heroCardImages.boardingPass,
    title: 'Boarding pass',
    depth: 0.8,
    position: 'top-[32%] left-[4%] md:top-[34%] md:left-[6%]',
    size: 'h-12 w-28 sm:h-14 sm:w-32 md:h-16 md:w-40',
    rotate: 'rotate-5',
    shadow: 'drop-shadow-[0_10px_18px_rgba(0,0,0,0.14)]',
    delay: 0.5,
  },
  {
    src: heroCardImages.tablet,
    title: 'Tablet',
    depth: 1.3,
    position: 'top-[44%] left-[9%] md:top-[46%] md:left-[10%]',
    size: 'h-14 w-20 sm:h-16 sm:w-24 md:h-20 md:w-28',
    rotate: '-rotate-6',
    shadow: 'drop-shadow-[0_16px_24px_rgba(0,0,0,0.2)]',
    delay: 0.55,
  },
  {
    src: heroCardImages.burger,
    title: 'Hamburguesa gourmet',
    depth: 2,
    position: 'top-[56%] left-[3%] md:top-[58%] md:left-[5%]',
    size: 'h-16 w-20 sm:h-20 sm:w-24 md:h-24 md:w-28',
    rotate: '-rotate-[4deg]',
    shadow: 'drop-shadow-[0_20px_30px_rgba(0,0,0,0.24)]',
    delay: 0.6,
  },
  {
    src: heroCardImages.chessRook,
    title: 'Pieza de ajedrez',
    depth: 1.2,
    position: 'top-[66%] left-[11%] md:top-[68%] md:left-[12%]',
    size: 'h-16 w-14 sm:h-20 sm:w-16 md:h-24 md:w-20',
    rotate: 'rotate-10',
    shadow: 'drop-shadow-[0_12px_20px_rgba(0,0,0,0.16)]',
    delay: 0.68,
  },
  {
    src: heroCardImages.iceCream,
    title: 'Helado',
    depth: 2.5,
    position: 'top-[76%] left-[5%] md:top-[78%] md:left-[7%]',
    size: 'h-20 w-14 sm:h-24 sm:w-16 md:h-28 md:w-20',
    rotate: '-rotate-7',
    shadow: 'drop-shadow-[0_22px_32px_rgba(0,0,0,0.26)]',
    delay: 0.75,
  },
  // Derecha
  {
    src: heroCardImages.boseSpeaker,
    title: 'Bocina Bose',
    depth: 1.8,
    position: 'top-[7%] left-[78%] md:top-[9%] md:left-[80%]',
    size: 'h-20 w-16 sm:h-24 sm:w-20 md:h-28 md:w-24',
    rotate: 'rotate-9',
    shadow: 'drop-shadow-[0_18px_28px_rgba(0,0,0,0.22)]',
    delay: 0.42,
  },
  {
    src: heroCardImages.airpods,
    title: 'AirPods',
    depth: 1,
    position: 'top-[19%] left-[85%] md:top-[21%] md:left-[86%]',
    size: 'h-16 w-14 sm:h-20 sm:w-20 md:h-24 md:w-24',
    rotate: '-rotate-11',
    shadow: 'drop-shadow-[0_14px_22px_rgba(0,0,0,0.18)]',
    delay: 0.48,
  },
  {
    src: heroCardImages.camera,
    title: 'Cámara',
    depth: 1.4,
    position: 'top-[31%] left-[80%] md:top-[33%] md:left-[82%]',
    size: 'h-14 w-20 sm:h-16 sm:w-24 md:h-20 md:w-28',
    rotate: 'rotate-[7deg]',
    shadow: 'drop-shadow-[0_16px_24px_rgba(0,0,0,0.2)]',
    delay: 0.54,
  },
  {
    src: heroCardImages.foundation,
    title: 'Base de maquillaje',
    depth: 0.9,
    position: 'top-[43%] left-[86%] md:top-[45%] md:left-[87%]',
    size: 'h-20 w-10 sm:h-24 sm:w-12 md:h-28 md:w-14',
    rotate: 'rotate-[5deg]',
    shadow: 'drop-shadow-[0_12px_20px_rgba(0,0,0,0.15)]',
    delay: 0.6,
  },
  {
    src: heroCardImages.drone,
    title: 'Drone',
    depth: 1.6,
    position: 'top-[55%] left-[79%] md:top-[57%] md:left-[81%]',
    size: 'h-16 w-24 sm:h-20 sm:w-28 md:h-24 md:w-32',
    rotate: 'rotate-11',
    shadow: 'drop-shadow-[0_18px_28px_rgba(0,0,0,0.22)]',
    delay: 0.66,
  },
  {
    src: heroCardImages.sneaker,
    title: 'Tenis',
    depth: 2.2,
    position: 'top-[67%] left-[84%] md:top-[69%] md:left-[85%]',
    size: 'h-16 w-24 sm:h-20 sm:w-28 md:h-24 md:w-32',
    rotate: '-rotate-[3deg]',
    shadow: 'drop-shadow-[0_20px_30px_rgba(0,0,0,0.24)]',
    delay: 0.72,
  },
]

/** Stickers móvil — fila superior junto al título */
const floatingCardsMobileTop: HeroSticker[] = [
  {
    src: heroCardImages.macbook,
    title: 'MacBook Pro',
    depth: 1.2,
    position: '',
    size: 'h-16 w-24',
    rotate: '-rotate-8',
    shadow: 'drop-shadow-[0_12px_20px_rgba(0,0,0,0.2)]',
    delay: 0.4,
  },
  {
    src: heroCardImages.smartphone,
    title: 'Smartphone',
    depth: 0.9,
    position: '',
    size: 'h-14 w-11',
    rotate: 'rotate-12',
    shadow: 'drop-shadow-[0_10px_18px_rgba(0,0,0,0.18)]',
    delay: 0.45,
  },
  {
    src: heroCardImages.airpods,
    title: 'AirPods',
    depth: 0.8,
    position: '',
    size: 'h-14 w-14',
    rotate: '-rotate-10',
    shadow: 'drop-shadow-[0_10px_18px_rgba(0,0,0,0.18)]',
    delay: 0.5,
  },
  {
    src: heroCardImages.boseSpeaker,
    title: 'Bocina Bose',
    depth: 1.1,
    position: '',
    size: 'h-16 w-14',
    rotate: 'rotate-9',
    shadow: 'drop-shadow-[0_12px_20px_rgba(0,0,0,0.2)]',
    delay: 0.55,
  },
]

/** Stickers móvil — fila inferior junto a los CTAs */
const floatingCardsMobileBottom: HeroSticker[] = [
  {
    src: heroCardImages.burger,
    title: 'Hamburguesa gourmet',
    depth: 1.3,
    position: '',
    size: 'h-16 w-20',
    rotate: '-rotate-[4deg]',
    shadow: 'drop-shadow-[0_12px_20px_rgba(0,0,0,0.2)]',
    delay: 0.6,
  },
  {
    src: heroCardImages.drone,
    title: 'Drone',
    depth: 1.2,
    position: '',
    size: 'h-14 w-24',
    rotate: 'rotate-11',
    shadow: 'drop-shadow-[0_12px_20px_rgba(0,0,0,0.2)]',
    delay: 0.65,
  },
  {
    src: heroCardImages.sneaker,
    title: 'Tenis',
    depth: 1.4,
    position: '',
    size: 'h-14 w-24',
    rotate: '-rotate-[3deg]',
    shadow: 'drop-shadow-[0_12px_20px_rgba(0,0,0,0.2)]',
    delay: 0.7,
  },
  {
    src: heroCardImages.iceCream,
    title: 'Helado',
    depth: 1.5,
    position: '',
    size: 'h-16 w-14',
    rotate: '-rotate-7',
    shadow: 'drop-shadow-[0_14px_22px_rgba(0,0,0,0.22)]',
    delay: 0.75,
  },
]

/** Retraso del flotado idle por sticker */
const mobileFloatDelays = [0, 0.6, 1.2, 1.8]

/** Estilo sticker: solo imagen + sombra suave (respeta alpha del PNG) */
const stickerClass =
  'pointer-events-none max-h-full max-w-full select-none object-contain'

/** Sticker móvil con animación idle (sin position absolute) */
function MobileIdleSticker({
  card,
  floatDelay = 0,
}: {
  card: HeroSticker
  floatDelay?: number
}) {
  const reducedMotion = useReducedMotion()

  return (
    <div className="flex justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: card.delay, ease: 'easeOut' }}
      >
        <motion.div
          animate={
            reducedMotion
              ? undefined
              : { y: [0, -8, 0], rotate: [0, 2, 0, -2, 0] }
          }
          transition={{
            duration: 5 + floatDelay,
            repeat: reducedMotion ? 0 : Infinity,
            ease: 'easeInOut',
            delay: floatDelay,
          }}
        >
          <img
            src={card.src}
            alt={card.title}
            draggable={false}
            className={`${card.size} ${card.rotate} ${stickerClass} ${card.shadow}`}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

/** Fila de stickers en el flujo del documento (móvil) */
function HeroMobileStickerRow({
  cards,
  floatDelayOffset = 0,
  align = 'end',
}: {
  cards: HeroSticker[]
  floatDelayOffset?: number
  align?: 'end' | 'start'
}) {
  return (
    <div
      className={cn(
        'pointer-events-none grid grid-cols-4 gap-0 px-0 md:hidden',
        align === 'end' ? 'items-end' : 'items-start',
      )}
      aria-hidden
    >
      {cards.map((card, i) => (
        <MobileIdleSticker
          key={card.title}
          card={card}
          floatDelay={mobileFloatDelays[i] + floatDelayOffset}
        />
      ))}
    </div>
  )
}

/** Renderiza stickers desktop con parallax de cursor + scroll */
function HeroStickerLayer({
  cards,
  className,
  scrollYProgress,
}: {
  cards: HeroSticker[]
  className?: string
  scrollYProgress: MotionValue<number>
}) {
  const desktopStickerClass =
    'pointer-events-auto max-h-full max-w-full cursor-pointer select-none object-contain transition-transform duration-300 ease-out hover:scale-110'

  // Parallax muy leve por profundidad — la capa sticky mantiene la posición en pantalla
  const layerY = useTransform(scrollYProgress, [0, 1], [0, 18])

  return (
    <motion.div style={{ y: layerY }} className={className}>
      <Floating sensitivity={-0.5} className="h-full">
        {cards.map((card, i) => (
          <FloatingElement
            key={`${card.title}-${i}`}
            depth={card.depth}
            className={`absolute ${card.position}`}
          >
            <motion.img
              src={card.src}
              alt={card.title}
              draggable={false}
              className={`${card.size} ${card.rotate} ${desktopStickerClass} ${card.shadow}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: card.delay, duration: 0.35 }}
            />
          </FloatingElement>
        ))}
      </Floating>
    </motion.div>
  )
}

/**
 * Hero principal — TextRotate + imágenes parallax flotantes agrupadas
 */
export function Hero() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  // En móvil desactivamos parallax ligado al scroll (bloquea el gesto en iOS/Android)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const scrollMotionEnabled = !isMobile

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const heroBgY = useTransform(scrollYProgress, [0, 1], scrollMotionEnabled ? [0, 120] : [0, 0])
  const heroGridY = useTransform(scrollYProgress, [0, 1], scrollMotionEnabled ? [0, 60] : [0, 0])
  const heroContentY = useTransform(scrollYProgress, [0, 1], scrollMotionEnabled ? [0, -180] : [0, 0])
  const heroContentOpacity = useTransform(
    scrollYProgress,
    [0, 0.75, 1],
    scrollMotionEnabled ? [1, 1, 0.72] : [1, 1, 1],
  )
  const heroContentScale = useTransform(scrollYProgress, [0, 1], scrollMotionEnabled ? [1, 0.94] : [1, 1])
  const heroBrandY = useTransform(scrollYProgress, [0, 1], scrollMotionEnabled ? [0, -64] : [0, 0])
  const heroBlobLeftY = useTransform(scrollYProgress, [0, 1], scrollMotionEnabled ? [0, 90] : [0, 0])
  const heroBlobRightY = useTransform(scrollYProgress, [0, 1], scrollMotionEnabled ? [0, -70] : [0, 0])

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative flex w-full flex-col overflow-x-clip bg-white touch-pan-y',
        'pt-[calc(4rem+env(safe-area-inset-top,0px))]',
        'max-md:pb-0',
        'md:min-h-[calc(100svh-env(safe-area-inset-top,0px))]',
      )}
    >
      <motion.div style={{ y: heroBgY }} className="hero-gradient absolute inset-0" aria-hidden />
      <motion.div style={{ y: heroGridY }} className="bg-grid absolute inset-0" aria-hidden />
      <motion.div
        style={{ y: heroBlobLeftY }}
        className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]"
        aria-hidden
      />
      <motion.div
        style={{ y: heroBlobRightY }}
        className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-accent/10 blur-[120px]"
        aria-hidden
      />

      {/* Stickers desktop — sticky dentro del hero para no subir fuera de vista al scroll */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden overflow-visible md:block">
        <div className="sticky top-[calc(4rem+env(safe-area-inset-top,0px))] h-[calc(100svh-4rem-env(safe-area-inset-top,0px))] w-full">
          <HeroStickerLayer
            cards={floatingCardsDesktop}
            scrollYProgress={scrollYProgress}
            className="h-full w-full"
          />
        </div>
      </div>

      {/* Móvil: bloque centrado en el viewport (debajo del navbar). Desktop: layout anterior */}
      <div
        className={cn(
          'relative z-10 mx-auto flex w-full max-w-lg shrink-0 flex-col items-center px-4 text-center sm:max-w-xl lg:max-w-2xl',
          'max-md:min-h-[calc(100svh-4rem-env(safe-area-inset-top,0px))] max-md:justify-center max-md:py-4',
          'md:flex-1 md:justify-center md:pb-8 md:pt-0',
        )}
      >
        <div
          className={cn(
            'relative flex w-full flex-col justify-center gap-2 px-1',
            'md:block md:min-h-[calc(100svh-4rem-env(safe-area-inset-top,0px))] md:gap-0 md:py-16',
          )}
        >
          <HeroMobileStickerRow cards={floatingCardsMobileTop} align="end" />

          <motion.div
            style={
              scrollMotionEnabled
                ? { y: heroContentY, opacity: heroContentOpacity, scale: heroContentScale }
                : undefined
            }
            className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center py-2 text-center md:py-0"
          >
            <motion.h1
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut', delay: 0.3 }}
              className="sonsie-one-regular w-full text-foreground"
            >
              <span className="block text-[clamp(1.75rem,5vw,3.25rem)] leading-[1.1] tracking-normal">
                {t.hero.titlePrefix}
              </span>
              <span className="mt-2 flex min-h-[1.2em] w-full justify-center overflow-hidden text-[clamp(1.5rem,4.5vw,3.25rem)] leading-[1.1] tracking-normal text-primary">
                <TextRotate
                  key={t.hero.rotate.join('-')}
                  texts={[...t.hero.rotate]}
                  splitBy="words"
                  mainClassName="sonsie-one-regular w-full max-w-full"
                  splitLevelClassName="inline-flex shrink-0 whitespace-nowrap"
                  elementLevelClassName="sonsie-one-regular inline-block whitespace-nowrap"
                  staggerDuration={0.04}
                  staggerFrom="last"
                  rotationInterval={2800}
                  transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                />
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-4 w-full max-w-lg text-balance text-center text-[clamp(0.75rem,2.2vw,1rem)] leading-relaxed text-muted-foreground sm:mt-5"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut', delay: 0.5 }}
            >
              {t.hero.subtitle}{' '}
              <strong className="whitespace-nowrap text-foreground">smartclic.mx</strong>
            </motion.p>

            <motion.div
              className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut', delay: 0.7 }}
            >
              <Button
                asChild
                size="default"
                className="h-10 rounded-full px-5 text-sm shadow-xl sm:h-11 sm:px-6 sm:text-base"
              >
                <a href="#contacto">
                  {t.hero.ctaPrimary}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="default"
                className="h-10 rounded-full border-border bg-muted/50 px-5 text-sm hover:bg-muted sm:h-11 sm:px-6 sm:text-base"
              >
                <a href="#trabajos">{t.hero.ctaSecondary}</a>
              </Button>
            </motion.div>
          </motion.div>

          <HeroMobileStickerRow
            cards={floatingCardsMobileBottom}
            align="start"
            floatDelayOffset={0.3}
          />
        </div>
      </div>

      {/* Banners debajo del copy en móvil (z bajo) para no tapar título ni CTAs */}
      <motion.div
        style={scrollMotionEnabled ? { y: heroBrandY } : undefined}
        className="relative z-[1] w-full shrink-0 max-md:mt-0 md:z-20"
      >
        <BrandBanners variant="hero" />
      </motion.div>
    </section>
  )
}
