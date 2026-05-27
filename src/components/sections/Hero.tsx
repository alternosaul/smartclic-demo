import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import Floating, { FloatingElement } from '@/components/ui/parallax-floating'
import { TextRotate } from '@/components/ui/text-rotate'
import { useLanguage } from '@/i18n/LanguageProvider'
import { BrandBanners } from '@/components/sections/BrandBanners'

/** Tarjetas flotantes — posiciones más cercanas entre sí en cada lateral */
const floatingCards = [
  // Cluster izquierdo
  {
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    title: 'Analytics',
    depth: 0.5,
    position: 'top-[10%] left-[3%] md:top-[14%] md:left-[6%]',
    size: 'h-9 w-12 sm:h-11 sm:w-16 md:h-14 md:w-20',
    rotate: '-rotate-6',
    delay: 0.4,
  },
  {
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
    title: 'Desarrollo web',
    depth: 1,
    position: 'top-[18%] left-[10%] md:top-[20%] md:left-[12%]',
    size: 'h-14 w-20 sm:h-16 sm:w-24 md:h-20 md:w-32',
    rotate: '-rotate-12',
    delay: 0.5,
  },
  {
    url: 'https://images.unsplash.com/photo-1517694712202-8dd79b786b4d?w=600&q=80',
    title: 'Laptop código',
    depth: 1.5,
    position: 'top-[28%] left-[4%] md:top-[30%] md:left-[8%]',
    size: 'h-11 w-16 sm:h-14 sm:w-20 md:h-16 md:w-24',
    rotate: 'rotate-3',
    delay: 0.55,
  },
  {
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    title: 'Código',
    depth: 2,
    position: 'top-[38%] left-[12%] md:top-[40%] md:left-[14%]',
    size: 'h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24',
    rotate: '-rotate-[4deg]',
    delay: 0.6,
  },
  {
    url: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80',
    title: 'UI Design',
    depth: 0.8,
    position: 'top-[50%] left-[5%] md:top-[52%] md:left-[9%]',
    size: 'h-10 w-14 sm:h-12 sm:w-16 md:h-14 md:w-20',
    rotate: 'rotate-8',
    delay: 0.65,
  },
  {
    url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80',
    title: 'Equipo',
    depth: 1.2,
    position: 'top-[62%] left-[11%] md:top-[64%] md:left-[13%]',
    size: 'h-14 w-20 sm:h-16 sm:w-24 md:h-20 md:w-28',
    rotate: '-rotate-10',
    delay: 0.7,
  },
  {
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80',
    title: 'Workspace',
    depth: 3,
    position: 'top-[72%] left-[6%] md:top-[74%] md:left-[10%]',
    size: 'h-16 w-20 sm:h-20 sm:w-24 md:h-24 md:w-28',
    rotate: 'rotate-6',
    delay: 0.75,
  },
  // Cluster derecho
  {
    url: 'https://images.unsplash.com/photo-1551650974-3fb9569e6850?w=600&q=80',
    title: 'Móvil',
    depth: 2,
    position: 'top-[8%] left-[78%] md:top-[12%] md:left-[80%]',
    size: 'h-14 w-16 sm:h-16 sm:w-20 md:h-20 md:w-28',
    rotate: 'rotate-6',
    delay: 0.45,
  },
  {
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
    title: 'Colaboración',
    depth: 1,
    position: 'top-[17%] left-[85%] md:top-[19%] md:left-[86%]',
    size: 'h-12 w-16 sm:h-14 sm:w-20 md:h-16 md:w-24',
    rotate: '-rotate-8',
    delay: 0.5,
  },
  {
    url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80',
    title: 'Diseño web',
    depth: 1.5,
    position: 'top-[27%] left-[80%] md:top-[29%] md:left-[82%]',
    size: 'h-16 w-20 sm:h-20 sm:w-24 md:h-20 md:w-32',
    rotate: 'rotate-12',
    delay: 0.55,
  },
  {
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    title: 'Dev',
    depth: 0.6,
    position: 'top-[37%] left-[87%] md:top-[39%] md:left-[88%]',
    size: 'h-10 w-14 sm:h-12 sm:w-16 md:h-14 md:w-20',
    rotate: '-rotate-5',
    delay: 0.6,
  },
  {
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
    title: 'Marketing',
    depth: 2.5,
    position: 'top-[48%] left-[82%] md:top-[50%] md:left-[84%]',
    size: 'h-14 w-20 sm:h-16 sm:w-24 md:h-20 md:w-28',
    rotate: 'rotate-[14deg]',
    delay: 0.65,
  },
  {
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    title: 'Métricas',
    depth: 1.8,
    position: 'top-[58%] left-[86%] md:top-[60%] md:left-[87%]',
    size: 'h-14 w-16 sm:h-16 sm:w-20 md:h-16 md:w-24',
    rotate: '-rotate-12',
    delay: 0.7,
  },
  {
    url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80',
    title: 'Proyecto',
    depth: 1,
    position: 'top-[68%] left-[79%] md:top-[70%] md:left-[81%]',
    size: 'h-16 w-20 sm:h-20 sm:w-24 md:h-24 md:w-32',
    rotate: 'rotate-[19deg]',
    delay: 0.75,
  },
  {
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
    title: 'Producto digital',
    depth: 3,
    position: 'top-[76%] left-[84%] md:top-[78%] md:left-[85%]',
    size: 'h-12 w-16 sm:h-14 sm:w-20 md:h-16 md:w-24',
    rotate: '-rotate-6',
    delay: 0.8,
  },
]

const cardImgClass =
  'cursor-pointer rounded-lg object-cover shadow-xl transition-transform duration-200 hover:scale-105'

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

      {/* Tarjetas solo en pantallas medianas+ para no tapar el título en móvil */}
      <Floating sensitivity={-0.5} className="z-0 hidden h-full md:block">
        {floatingCards.map((card, i) => (
          <FloatingElement
            key={`${card.title}-${i}`}
            depth={card.depth}
            className={`absolute ${card.position}`}
          >
            <motion.img
              src={card.url}
              alt={card.title}
              className={`${card.size} ${card.rotate} ${cardImgClass}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: card.delay }}
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
