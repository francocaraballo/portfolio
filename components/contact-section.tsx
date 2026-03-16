"use client"

import { useState } from "react"
import { SectionHeader } from "./projects-section"
import { Send, ArrowUpRight } from "lucide-react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSent(true)
    setTimeout(() => setIsSent(false), 3000)
    setFormData({ name: "", email: "", message: "" })
  }

  return (
    <section id="contacto" className="px-6 py-28 md:py-36">
      <div className="mx-auto max-w-2xl">
        <SectionHeader number="03" title="Contacto" />

        <p className="mt-8 text-muted-foreground leading-relaxed font-light">
          ¿Tienes un proyecto en mente o simplemente quieres saludar? No dudes
          en escribirme. Estoy siempre abierto a nuevas oportunidades y
          conversaciones.
        </p>

        <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-name"
                className="text-xs font-medium text-muted-foreground uppercase tracking-[0.15em]"
              >
                Nombre
              </label>
              <input
                type="text"
                id="contact-name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="rounded-lg border border-border/50 bg-card/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors duration-300 font-light"
                placeholder="Tu nombre"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-email"
                className="text-xs font-medium text-muted-foreground uppercase tracking-[0.15em]"
              >
                Email
              </label>
              <input
                type="email"
                id="contact-email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="rounded-lg border border-border/50 bg-card/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors duration-300 font-light"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-message"
              className="text-xs font-medium text-muted-foreground uppercase tracking-[0.15em]"
            >
              Mensaje
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="rounded-lg border border-border/50 bg-card/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors duration-300 resize-none font-light"
              placeholder="Cuéntame sobre tu proyecto o idea..."
            />
          </div>

          <button
            type="submit"
            className="self-start inline-flex items-center gap-2.5 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-foreground/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
          >
            {isSent ? "¡Mensaje enviado!" : "Enviar mensaje"}
            <Send size={14} strokeWidth={1.5} />
          </button>
        </form>
      </div>
    </section>
  )
}
