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
import { ScrollTrigger } from '@/lib/gsap'

/** Landing principal de smartclic.mx */
function App() {
  const { locale } = useLanguage()

  // Recalcula triggers tras cargar assets o cambiar idioma
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    refresh()
    window.addEventListener('load', refresh)
    window.addEventListener('resize', refresh)
    return () => {
      window.removeEventListener('load', refresh)
      window.removeEventListener('resize', refresh)
    }
  }, [locale])

  return (
    <>
      <Navbar />
      <SiteParallaxBackdrop />
      <main className="relative z-0 bg-white">
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
