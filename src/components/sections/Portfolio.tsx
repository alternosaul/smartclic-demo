import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/i18n/LanguageProvider'

const projectStyles = [
  { gradient: 'from-cyan-500/20 to-blue-600/20', accent: '#22d3ee' },
  { gradient: 'from-violet-500/20 to-purple-600/20', accent: '#a78bfa' },
  { gradient: 'from-emerald-500/20 to-teal-600/20', accent: '#34d399' },
  { gradient: 'from-rose-500/20 to-pink-600/20', accent: '#fb7185' },
]

/**
 * Galería de trabajos destacados (mockups visuales)
 */
export function Portfolio() {
  const { t } = useLanguage()

  return (
    <section id="trabajos" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              {t.portfolio.badge}
            </Badge>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground sm:text-4xl">
              {t.portfolio.title}
            </h2>
          </div>
          <Button variant="outline" className="rounded-full border-border">
            {t.portfolio.cta}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {t.portfolio.projects.map((project, i) => {
            const style = projectStyles[i]
            return (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div
                  className={`relative aspect-[16/10] bg-gradient-to-br ${style.gradient} p-6`}
                >
                  <div className="absolute inset-4 rounded-lg border border-border bg-white shadow-md transition-transform duration-500 group-hover:scale-[1.02]">
                    <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
                      <span className="h-2 w-2 rounded-full bg-red-400/80" />
                      <span className="h-2 w-2 rounded-full bg-yellow-400/80" />
                      <span className="h-2 w-2 rounded-full bg-green-400/80" />
                    </div>
                    <div className="space-y-2 p-4">
                      <div
                        className="h-3 w-3/4 rounded"
                        style={{ backgroundColor: `${style.accent}40` }}
                      />
                      <div className="h-2 w-1/2 rounded bg-muted" />
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {[1, 2, 3].map((n) => (
                          <div
                            key={n}
                            className="aspect-square rounded-md"
                            style={{
                              backgroundColor:
                                n === 1 ? `${style.accent}30` : 'oklch(0.96 0 0)',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-primary">{project.category}</p>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">
                    {project.title}
                  </h3>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
