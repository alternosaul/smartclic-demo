import { FeaturesBento } from '@/components/blocks/features-8'
import {
  BentoBrandGlow,
  SectionBrandBackground,
} from '@/components/ui/background-components'
import { useLanguage } from '@/i18n/LanguageProvider'

/**
 * Sección Soluciones — bento grid de servicios con ancla #soluciones
 */
export function Solutions() {
  const { t } = useLanguage()

  return (
    <section
      id="soluciones"
      className="relative z-10 overflow-hidden bg-white pt-10 pb-12 sm:pt-14 sm:pb-16"
    >
      {/* Cuadrícula suave en toda la sección */}
      <SectionBrandBackground />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado centrado reutilizando claves i18n existentes */}
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-balance font-[family-name:var(--font-display)] text-[clamp(2rem,5.5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-foreground">
            {t.solutions.title}
          </h2>
        </div>

        {/* Bento: glow pequeño centrado solo detrás de las tarjetas */}
        <div className="relative mt-10 sm:mt-12">
          <BentoBrandGlow />
          <div className="relative z-10">
            <FeaturesBento />
          </div>
        </div>
      </div>
    </section>
  )
}
