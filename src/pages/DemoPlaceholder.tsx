import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

/** Página placeholder para demos de proyectos del portafolio */
export function DemoPlaceholder() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white px-6">
      <p className="text-center font-[family-name:var(--font-display)] text-2xl font-bold text-foreground sm:text-3xl">
        AQUI IRIA UNA DEMO
      </p>
      <Button asChild variant="outline" className="rounded-full">
        <Link to="/#trabajos">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al portafolio
        </Link>
      </Button>
    </div>
  )
}
