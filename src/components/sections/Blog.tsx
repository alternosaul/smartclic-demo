import { motion } from 'motion/react'
import { ArrowRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useLanguage } from '@/i18n/LanguageProvider'

const postLinks = [
  'https://smartclic.mx/inteligencia-artificial-y-marketing-digital-la-dupla-que-esta-revolucionando-los-negocios/',
  'https://smartclic.mx/como-preparar-tu-pagina-web-para-el-2025-y-maximizar-resultados-desde-el-dia-uno/',
  'https://smartclic.mx/las-7-consecuencias-de-no-tener-una-pagina-web-para-tu-negocio/',
]

const postImages = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
]

/**
 * Sección blog con entradas destacadas
 */
export function Blog() {
  const { t } = useLanguage()

  return (
    <section id="blog" className="border-t border-border bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <h2 className="sonsie-one-regular text-[clamp(2.25rem,5vw,3.5rem)] leading-tight text-foreground">
              {t.blog.badge}
            </h2>
            <p className="mt-3 text-lg font-semibold leading-snug text-foreground sm:text-xl">
              {t.blog.title}
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t.blog.description}
            </p>
          </div>
          <Button variant="outline" className="rounded-full border-border" asChild>
            <a
              href="https://smartclic.mx/blog/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.blog.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {t.blog.posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="flex h-full flex-col overflow-hidden border-border shadow-sm transition-shadow hover:shadow-md">
                <a
                  href={postLinks[i]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden"
                >
                  <img
                    src={postImages[i]}
                    alt=""
                    className="aspect-[16/10] w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </a>
                <CardHeader>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {post.date}
                  </p>
                  <CardTitle className="line-clamp-2 text-lg leading-snug text-foreground">
                    <a
                      href={postLinks[i]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      {post.title}
                    </a>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto pt-0">
                  <a
                    href={postLinks[i]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    {t.blog.readMore}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </CardFooter>
              </Card>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
