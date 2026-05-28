import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import Floating, { FloatingElement } from '@/components/ui/parallax-floating'
import { TextRotate } from '@/components/ui/text-rotate'
import { useLanguage } from '@/i18n/LanguageProvider'
import { BrandBanners } from '@/components/sections/BrandBanners'

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

/** Stickers flotantes — sin contenedor; sombra según profundidad parallax */
const floatingCards = [
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

/** Estilo sticker: solo imagen + sombra suave (respeta alpha del PNG) */
const stickerClass =
  'pointer-events-auto max-h-full max-w-full cursor-pointer select-none object-contain transition-transform duration-300 ease-out hover:scale-110'

/**
 * Hero principal — TextRotate + imágenes parallax flotantes agrupadas
 */
export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative flex min-h-svh w-full flex-col overflow-x-hidden bg-white pt-[calc(3.5rem+env(safe-area-inset-top,0px))] sm:pt-[calc(4rem+env(safe-area-inset-top,0px))]">
      <div className="hero-gradient absolute inset-0" />
      <div className="bg-grid absolute inset-0" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />

      {/* Stickers PNG (fondo transparente) — md+ para no tapar el título en móvil */}
      <Floating sensitivity={-0.5} className="z-0 hidden h-full md:block">
        {floatingCards.map((card, i) => (
          <FloatingElement
            key={`${card.title}-${i}`}
            depth={card.depth}
            className={`absolute ${card.position}`}
          >
            <motion.img
              src={card.src}
              alt={card.title}
              draggable={false}
              className={`${card.size} ${card.rotate} ${stickerClass} ${card.shadow}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: card.delay, duration: 0.35 }}
            />
          </FloatingElement>
        ))}
      </Floating>

      <div className="pointer-events-auto relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 pb-6 text-center sm:max-w-xl sm:pb-8 lg:max-w-2xl">
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
          className="mt-4 max-w-md text-[clamp(0.75rem,2.2vw,1rem)] leading-relaxed text-muted-foreground sm:mt-5 sm:max-w-lg"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut', delay: 0.5 }}
        >
          {t.hero.subtitle}{' '}
          <strong className="text-foreground">smartclic.mx</strong>
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
      </div>

      {/* Banners de marcas inclinados en lugar del icono de scroll */}
      <BrandBanners variant="hero" />
    </section>
  )
}
