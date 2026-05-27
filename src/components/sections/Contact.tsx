import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { Loader2, Mail, MapPin, Phone, Send } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/i18n/LanguageProvider'

type FormState = {
  nombre: string
  email: string
  telefono: string
  empresa: string
  mensaje: string
}

const initialForm: FormState = {
  nombre: '',
  email: '',
  telefono: '',
  empresa: '',
  mensaje: '',
}

/**
 * Sección de contacto con formulario funcional (mailto + validación cliente)
 */
export function Contact() {
  const { t } = useLanguage()
  const [form, setForm] = useState<FormState>(initialForm)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const actualizar = (campo: keyof FormState, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEnviando(true)

    const f = t.contact.form
    const asunto = encodeURIComponent(
      `${f.mailSubject} — ${form.nombre}${form.empresa ? ` (${form.empresa})` : ''}`,
    )
    const cuerpo = encodeURIComponent(
      [
        `${f.mailName}: ${form.nombre}`,
        `Email: ${form.email}`,
        form.telefono ? `${f.mailPhone}: ${form.telefono}` : '',
        form.empresa ? `${f.mailCompany}: ${form.empresa}` : '',
        '',
        `${f.mailMessage}:`,
        form.mensaje,
      ]
        .filter(Boolean)
        .join('\n'),
    )

    window.location.href = `mailto:hola@smartclic.mx?subject=${asunto}&body=${cuerpo}`

    await new Promise((r) => setTimeout(r, 600))
    setEnviando(false)
    setEnviado(true)
    setForm(initialForm)
  }

  return (
    <section id="contacto" className="relative border-t border-border bg-white py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-72 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              {t.contact.badge}
            </Badge>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t.contact.title}
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">{t.contact.description}</p>

            <ul className="mt-8 space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" />
                </span>
                <a href="mailto:hola@smartclic.mx" className="hover:text-primary">
                  hola@smartclic.mx
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-4 w-4" />
                </span>
                +52 (55) 0000 0000
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-4 w-4" />
                </span>
                {t.contact.location}
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
            >
              {enviado && (
                <p
                  role="status"
                  className="mb-6 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground"
                >
                  {t.contact.success}{' '}
                  <a href="mailto:hola@smartclic.mx" className="font-medium text-primary">
                    hola@smartclic.mx
                  </a>
                  .
                </p>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="nombre">{t.contact.form.name}</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    required
                    placeholder={t.contact.form.namePlaceholder}
                    value={form.nombre}
                    onChange={(e) => actualizar('nombre', e.target.value)}
                  />
                </div>

                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="email">{t.contact.form.email}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder={t.contact.form.emailPlaceholder}
                    value={form.email}
                    onChange={(e) => actualizar('email', e.target.value)}
                  />
                </div>

                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="telefono">{t.contact.form.phone}</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    placeholder={t.contact.form.phonePlaceholder}
                    value={form.telefono}
                    onChange={(e) => actualizar('telefono', e.target.value)}
                  />
                </div>

                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="empresa">{t.contact.form.company}</Label>
                  <Input
                    id="empresa"
                    name="empresa"
                    placeholder={t.contact.form.companyPlaceholder}
                    value={form.empresa}
                    onChange={(e) => actualizar('empresa', e.target.value)}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="mensaje">{t.contact.form.message}</Label>
                  <Textarea
                    id="mensaje"
                    name="mensaje"
                    required
                    rows={5}
                    placeholder={t.contact.form.messagePlaceholder}
                    value={form.mensaje}
                    onChange={(e) => actualizar('mensaje', e.target.value)}
                    className="min-h-[120px] resize-y"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={enviando}
                className="mt-6 w-full rounded-full sm:w-auto"
              >
                {enviando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.contact.form.sending}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t.contact.form.submit}
                  </>
                )}
              </Button>

              <p className="mt-4 text-xs text-muted-foreground">
                {t.contact.form.mailtoNote}
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
