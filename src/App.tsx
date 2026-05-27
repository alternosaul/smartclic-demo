import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { ModelShowcase } from '@/components/sections/ModelShowcase'
import { Solutions } from '@/components/sections/Solutions'
import { Process } from '@/components/sections/Process'
import { Portfolio } from '@/components/sections/Portfolio'
import { Blog } from '@/components/sections/Blog'
import { Contact } from '@/components/sections/Contact'

/** Landing principal de smartclic.mx */
function App() {
  return (
    <>
      <Navbar />
      <main className="relative z-0 bg-white">
        <Hero />
        <Solutions />
        <ModelShowcase />
        <Process />
        <Portfolio />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
