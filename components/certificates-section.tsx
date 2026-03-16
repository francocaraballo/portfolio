import { certificates } from "@/lib/portfolio-data"
import { SectionHeader } from "./projects-section"
import { Award, ExternalLink } from "lucide-react"

export function CertificatesSection() {
  return (
    <section id="certificados" className="px-6 py-28 md:py-36">
      <div className="mx-auto max-w-5xl">
        <SectionHeader number="02" title="Certificados" />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, index) => (
            <div
              key={index}
              className="group relative rounded-xl border border-border/40 bg-card/50 p-6 transition-all duration-400 hover:border-border hover:bg-card"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/[0.08] text-primary/70">
                  <Award size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                    {cert.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground font-light">
                    {cert.issuer}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/30">
                  <span className="text-xs text-muted-foreground/70 font-light">
                    {cert.date}
                  </span>
                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      Ver
                      <ExternalLink size={11} strokeWidth={1.5} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
