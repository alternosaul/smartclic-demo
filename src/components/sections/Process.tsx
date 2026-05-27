import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/i18n/LanguageProvider'

/**
 * Proceso de trabajo en 4 pasos
 */
export function Process() {
  const { t } = useLanguage()

  return (
    <section id="proceso" className="border-y border-border bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              {t.process.badge}
            </Badge>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground sm:text-4xl">
              {t.process.title}
            </h2>
            <p className="mt-4 text-muted-foreground">{t.process.description}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:max-w-2xl lg:grid-cols-2">
            {t.process.steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl border border-border bg-secondary p-6 shadow-sm"
              >
                <span className="font-[family-name:var(--font-display)] text-4xl font-bold text-primary/30">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
