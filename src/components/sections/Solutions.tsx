import { motion } from 'motion/react'
import { EmojiRain } from '@/components/effects/EmojiRain'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/i18n/LanguageProvider'

/** Imágenes por pilar: web, branding, marketing, crecimiento */
const solutionImages = [
  {
    src: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
    altEs: 'Pantalla con diseño de sitio web moderno',
    altEn: 'Screen showing modern website design',
  },
  {
    src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    altEs: 'Identidad visual y piezas de branding',
    altEn: 'Visual identity and branding materials',
  },
  {
    src: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80',
    altEs: 'Campañas y contenido en redes sociales',
    altEn: 'Social media campaigns and content',
  },
  {
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    altEs: 'Métricas y estrategia de crecimiento digital',
    altEn: 'Metrics and digital growth strategy',
  },
] as const

/**
 * Pilares de la agencia — sitios web, branding, marketing y crecimiento
 */
export function Solutions() {
  const { locale, t } = useLanguage()

  return (
    <section id="soluciones" className="relative z-0 overflow-hidden bg-white py-20 sm:py-28">
      {/* Fondo: lluvia de likes, corazones, risa y patos */}
      <EmojiRain />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/80"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="sonsie-one-regular text-[clamp(1.75rem,4vw,2.75rem)] leading-tight text-foreground">
            {t.solutions.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.solutions.description}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.solutions.items.map((item, i) => {
            const image = solutionImages[i]
            const imageAlt = locale === 'es' ? image.altEs : image.altEn

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="group h-full gap-0 overflow-hidden border-border bg-card p-0 shadow-sm transition-shadow hover:shadow-md">
                  {/* Imagen descriptiva del servicio */}
                  <div className="relative aspect-[5/4] overflow-hidden bg-muted">
                    <img
                      src={image.src}
                      alt={imageAlt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
                      aria-hidden
                    />
                  </div>

                  <CardHeader className="gap-3 px-5 py-6 sm:px-6 sm:py-7">
                    <CardTitle className="sonsie-one-regular text-xl leading-snug font-normal text-foreground sm:text-2xl">
                      <span className="block">{item.title}</span>
                      {'titleLine2' in item && item.titleLine2 ? (
                        <span className="mt-0.5 block">{item.titleLine2}</span>
                      ) : null}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed sm:text-base">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
