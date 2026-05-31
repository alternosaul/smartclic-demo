import { useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SiteParallaxBackdrop } from '@/components/effects/ParallaxSection'
import { Hero } from '@/components/sections/Hero'
import { Solutions } from '@/components/sections/Solutions'
import { PresenceMap } from '@/components/sections/PresenceMap'
import { Portfolio } from '@/components/sections/Portfolio'
import { Blog } from '@/components/sections/Blog'
import { Contact } from '@/components/sections/Contact'
import { useLanguage } from '@/i18n/LanguageProvider'
import { useParallaxMotionEnabled } from '@/hooks/use-parallax-motion-enabled'
import { debouncedScrollTriggerRefresh } from '@/lib/gsap'

/** Landing principal de smartclic.mx */
function App() {
  const { locale } = useLanguage()
  const parallaxEnabled = useParallaxMotionEnabled()

  // Recalcula triggers tras cargar assets o cambiar idioma (debounced en resize)
  useEffect(() => {
    debouncedScrollTriggerRefresh(0)
    const onLoad = () => debouncedScrollTriggerRefresh(0)
    const onResize = () => debouncedScrollTriggerRefresh()
    window.addEventListener('load', onLoad)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('load', onLoad)
      window.removeEventListener('resize', onResize)
    }
  }, [locale])

  return (
    <>
      <Navbar />
      {parallaxEnabled ? <SiteParallaxBackdrop /> : null}
      <main className="relative z-0 w-full max-w-full bg-white">
        <Hero />
        <Solutions />
        <PresenceMap />
        <Portfolio />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
