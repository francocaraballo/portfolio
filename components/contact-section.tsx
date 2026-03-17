"use client"

import { useState, useRef } from "react"
import { SectionHeader } from "./projects-section"
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import emailjs from "@emailjs/browser"

type FormStatus = "idle" | "sending" | "success" | "error"

export function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [status, setStatus] = useState<FormStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    setErrorMessage("")

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )

      setStatus("success")
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => setStatus("idle"), 4000)
    } catch (error) {
      console.error("EmailJS error:", error)
      setStatus("error")
      setErrorMessage("Hubo un error al enviar el mensaje. Intentá de nuevo.")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  const isDisabled = status === "sending" || status === "success"

  return (
    <section id="contacto" className="px-6 py-28 md:py-36">
      <div className="mx-auto max-w-2xl">
        <SectionHeader number="03" title="Contacto" />

        <p className="mt-8 text-muted-foreground leading-relaxed font-light">
          ¿Tienes un proyecto en mente y queres hacerlo realidad? Escribime!
        </p>

        <form ref={formRef} onSubmit={handleSubmit} className="mt-12 flex flex-col gap-6">
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
                name="from_name"
                required
                disabled={isDisabled}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="rounded-lg border border-border/50 bg-card/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors duration-300 font-light disabled:opacity-50 disabled:cursor-not-allowed"
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
                name="from_email"
                required
                disabled={isDisabled}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="rounded-lg border border-border/50 bg-card/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors duration-300 font-light disabled:opacity-50 disabled:cursor-not-allowed"
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
              name="message"
              required
              rows={5}
              disabled={isDisabled}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="rounded-lg border border-border/50 bg-card/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors duration-300 resize-none font-light disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Cuéntame sobre tu proyecto o idea..."
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isDisabled}
              className="self-start inline-flex items-center gap-2.5 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-foreground/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "sending" && (
                <>
                  Enviando...
                  <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
                </>
              )}
              {status === "success" && (
                <>
                  ¡Mensaje enviado!
                  <CheckCircle2 size={14} strokeWidth={1.5} />
                </>
              )}
              {(status === "idle" || status === "error") && (
                <>
                  Enviar mensaje
                  <Send size={14} strokeWidth={1.5} />
                </>
              )}
            </button>

            {status === "error" && (
              <p className="flex items-center gap-2 text-sm text-red-500 font-light">
                <AlertCircle size={14} strokeWidth={1.5} />
                {errorMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
