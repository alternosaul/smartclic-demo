import { useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { ArrowRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollTrigger } from '@/lib/gsap'
import { useLanguage } from '@/i18n/LanguageProvider'
import { cn } from '@/lib/utils'

const postLinks = [
  'https://smartclic.mx/inteligencia-artificial-y-marketing-digital-la-dupla-que-esta-revolucionando-los-negocios/',
  'https://smartclic.mx/como-preparar-tu-pagina-web-para-el-2025-y-maximizar-resultados-desde-el-dia-uno/',
  'https://smartclic.mx/las-7-consecuencias-de-no-tener-una-pagina-web-para-tu-negocio/',
  'https://smartclic.mx/blog/',
  'https://smartclic.mx/blog/',
]

const postImages = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
]

type BlogPost = {
  title: string
  excerpt: string
  date: string
}

/** Altura del navbar fijo (h-16) */
const NAVBAR_HEIGHT_PX = 64
/** Espacio entre tarjetas para que el sticky apile al hacer scroll */
const CARD_STACK_GAP_REM = 4

/** Tarjeta de entrada del blog */
function BlogPostCard({
  post,
  postIndex,
  readMoreLabel,
}: {
  post: BlogPost
  postIndex: number
  readMoreLabel: string
}) {
  const link = postLinks[postIndex] ?? postLinks[0]
  const image = postImages[postIndex] ?? postImages[0]

  return (
    <Card className="flex flex-col overflow-hidden border-border bg-white shadow-md md:flex-row md:items-stretch">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block shrink-0 overflow-hidden md:w-[min(36%,14rem)] lg:w-[min(32%,16rem)]"
      >
        <img
          src={image}
          alt=""
          className="aspect-[2/1] h-full w-full object-cover transition-transform duration-300 hover:scale-105 md:aspect-auto md:min-h-[9.5rem] md:max-h-[10.5rem]"
        />
      </a>
      <div className="flex flex-1 flex-col justify-center px-4 py-3 md:px-5 md:py-4">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          {post.date}
        </p>
        <h3 className="mt-1.5 line-clamp-2 text-base font-semibold leading-snug text-foreground md:text-lg">
          <a href={link} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            {post.title}
          </a>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          {readMoreLabel}
          <ArrowRight className="ml-1 h-4 w-4" />
        </a>
      </div>
    </Card>
  )
}

/** Cabecera de la sección blog (contenido) */
function BlogHeaderContent({ showScrollHint = false }: { showScrollHint?: boolean }) {
  const { t } = useLanguage()

  return (
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
      <div className="flex flex-col items-stretch gap-3 sm:items-end">
        {showScrollHint ? (
          <p className="max-w-xs text-sm text-muted-foreground sm:text-right">{t.blog.scrollHint}</p>
        ) : null}
        <Button variant="outline" className="rounded-full border-border" asChild>
          <a href="https://smartclic.mx/blog/" target="_blank" rel="noopener noreferrer">
            {t.blog.cta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}

/**
 * Cabecera sticky + tarjetas apiladas en flujo (sin pin-spacer de GSAP)
 */
function BlogStickyStack({
  posts,
  readMoreLabel,
}: {
  posts: BlogPost[]
  readMoreLabel: string
}) {
  const { locale, t } = useLanguage()
  const stageRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [cardStickyTopPx, setCardStickyTopPx] = useState(NAVBAR_HEIGHT_PX + 220)
  const [useStackLayout, setUseStackLayout] = useState(false)

  useLayoutEffect(() => {
    ScrollTrigger.getById('blog-scroll-pin')?.kill()
    ScrollTrigger.getById('blog-header-pin')?.kill()

    const stage = stageRef.current
    const header = headerRef.current
    if (!stage || !header) return

    const media = window.matchMedia('(min-width: 768px)')
    const measureLayout = () => {
      setCardStickyTopPx(NAVBAR_HEIGHT_PX + header.offsetHeight + 12)
    }

    let progressTrigger: ScrollTrigger | undefined

    const setup = () => {
      progressTrigger?.kill()
      measureLayout()
      setUseStackLayout(media.matches)

      if (!media.matches) {
        setActiveIndex(0)
        ScrollTrigger.refresh()
        return
      }

      progressTrigger = ScrollTrigger.create({
        id: 'blog-scroll-progress',
        trigger: stage,
        start: `top ${NAVBAR_HEIGHT_PX}`,
        end: 'bottom bottom',
        onUpdate: (self) => {
          setActiveIndex(
            Math.min(posts.length - 1, Math.floor(self.progress * posts.length)),
          )
        },
      })

      ScrollTrigger.refresh()
    }

    const onModeChange = () => setup()
    media.addEventListener('change', onModeChange)
    setup()
    window.addEventListener('resize', setup)

    return () => {
      media.removeEventListener('change', onModeChange)
      window.removeEventListener('resize', setup)
      progressTrigger?.kill()
      ScrollTrigger.getById('blog-scroll-pin')?.kill()
      ScrollTrigger.getById('blog-header-pin')?.kill()
    }
  }, [locale, posts.length, t.blog.badge, t.blog.title, t.blog.description])

  return (
    <div ref={stageRef} className="blog-sticky-stage relative mx-auto w-full max-w-4xl">
      <header
        ref={headerRef}
        className="sticky top-16 z-50 border-b border-border bg-white pb-4 shadow-sm"
      >
        <BlogHeaderContent showScrollHint={useStackLayout} />

        {useStackLayout ? (
          <div
            className="mt-5 flex gap-1.5"
            role="tablist"
            aria-label={t.blog.scrollHint}
          >
            {posts.map((post, index) => (
              <span
                key={post.title}
                role="tab"
                aria-selected={index === activeIndex}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors duration-500',
                  index === activeIndex ? 'bg-primary' : 'bg-border',
                )}
              />
            ))}
          </div>
        ) : null}
      </header>

      {/* Tarjetas en flujo: altura real, sin hueco artificial */}
      <div className="relative mt-6 pb-8 sm:mt-8">
        {useStackLayout ? (
          posts.map((post, index) => (
            <div
              key={post.title}
              className="sticky last:mb-0"
              style={{
                top: cardStickyTopPx + index * 10,
                zIndex: index + 1,
                marginBottom: index < posts.length - 1 ? `${CARD_STACK_GAP_REM}rem` : 0,
              }}
            >
              <BlogPostCard post={post} postIndex={index} readMoreLabel={readMoreLabel} />
            </div>
          ))
        ) : (
          <div className="space-y-5">
            {posts.map((post, index) => (
              <BlogPostCard
                key={post.title}
                post={post}
                postIndex={index}
                readMoreLabel={readMoreLabel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Sección blog — cabecera sticky + apilado en desktop; lista en móvil
 */
export function Blog() {
  const { t } = useLanguage()
  const reducedMotion = useReducedMotion()
  const posts = [...t.blog.posts]

  return (
    <section
      id="blog"
      className="relative overflow-visible border-t border-border bg-white pt-10 pb-20 sm:pt-12 sm:pb-28"
    >
      <div
        className="pointer-events-none absolute -left-16 top-1/3 h-72 w-72 rounded-full bg-primary/6 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-accent/6 blur-[110px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {reducedMotion ? (
          <div className="flex flex-col">
            <div className="blog-scroll-header relative z-30">
              <BlogHeaderContent />
            </div>
            <div className="relative mx-auto mt-6 w-full max-w-4xl space-y-5 sm:mt-8">
              {posts.map((post, index) => (
                <BlogPostCard
                  key={post.title}
                  post={post}
                  postIndex={index}
                  readMoreLabel={t.blog.readMore}
                />
              ))}
            </div>
          </div>
        ) : (
          <BlogStickyStack posts={posts} readMoreLabel={t.blog.readMore} />
        )}
      </div>
    </section>
  )
}
