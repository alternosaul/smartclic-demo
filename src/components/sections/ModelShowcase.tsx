import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import {
  ParallaxContent,
  ParallaxItem,
  ParallaxLayer,
  ParallaxSection,
} from '@/components/effects/ParallaxSection'
import ModelViewer from '@/components/ModelViewer'
import { useLanguage } from '@/i18n/LanguageProvider'

const MODEL_URL =
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb'

/**
 * Sección 3D debajo del hero — scroll de página no interfiere con el visor
 */
export function ModelShowcase() {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(320)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      const w = el.getBoundingClientRect().width
      setSize(Math.min(Math.max(w, 280), 420))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <ParallaxSection
      id="tecnologia"
      className="relative overflow-hidden border-y border-border bg-white py-16 sm:py-24"
    >
      <ParallaxLayer
        speed={0.4}
        className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"
      />
      <ParallaxLayer
        speed={0.65}
        className="left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]"
      />

      <ParallaxContent className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Texto */}
        <ParallaxItem depth={0.9}>
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[clamp(1.75rem,4vw,2.5rem)]">
              {t.tech.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t.tech.description}
            </p>
            <p className="mt-3 text-xs text-muted-foreground/80 sm:text-sm">
              {t.tech.hint}
            </p>
          </motion.div>
        </ParallaxItem>

        {/* Visor 3D — arrastre táctil para rotar; scroll de página fuera del canvas */}
        <ParallaxItem depth={1.35}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex justify-center lg:justify-end"
          >
            <div
              ref={containerRef}
              className="model-viewer-scroll-safe aspect-square w-full max-w-[420px] overscroll-y-contain"
            >
              <ModelViewer
                url={MODEL_URL}
                width={size}
                height={size}
                modelXOffset={0}
                modelYOffset={0}
                defaultRotationX={0}
                defaultRotationY={28}
                defaultZoom={2}
                minZoomDistance={0.2}
                maxZoomDistance={6}
                autoFrame
                framePadding={0.42}
                modelScale={3.2}
                enableMouseParallax
                enableHoverRotation
                enableManualZoom={false}
                isolatePageScroll
                environmentPreset="forest"
                fadeIn={false}
                autoRotate={false}
                autoRotateSpeed={0.35}
                showScreenshotButton
                screenshotLabel={t.tech.capture}
                className="mx-auto overflow-hidden rounded-2xl border border-white/10 bg-black shadow-xl"
              />
            </div>
          </motion.div>
        </ParallaxItem>
      </ParallaxContent>
    </ParallaxSection>
  )
}
