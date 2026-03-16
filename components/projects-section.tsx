"use client"

import { useState } from "react"
import Image from "next/image"
import { projects } from "@/lib/portfolio-data"
import { ExternalLink, Github, Eye, X } from "lucide-react"

function PreviewModal({
  src,
  alt,
  onClose,
}: {
  src: string
  alt: string
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl animate-modal-backdrop" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 flex items-center justify-center w-10 h-10 rounded-full border border-border/50 bg-card/80 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-300 backdrop-blur-md"
        aria-label="Cerrar preview"
      >
        <X size={18} strokeWidth={1.5} />
      </button>

      {/* Image container */}
      <div
        className="relative w-full max-w-5xl aspect-[16/9] rounded-xl overflow-hidden border border-border/30 shadow-2xl animate-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 1100px"
          priority
        />
      </div>
    </div>
  )
}

export function ProjectsSection() {
  const [previewOpen, setPreviewOpen] = useState<number | null>(null)

  return (
    <>
      <section id="proyectos" className="px-6 py-28 md:py-36">
        <div className="mx-auto max-w-5xl">
          <SectionHeader number="01" title="Proyectos" />

          <div className="mt-16 flex flex-col gap-20">
            {projects.map((project, index) => (
              <article
                key={index}
                className="group"
              >
                {/* Content */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-primary/60 text-xs font-medium tracking-[0.2em] uppercase">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="w-8 h-px bg-border" />
                    </div>
                    <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground leading-snug">
                      {project.title}
                    </h3>
                    <p className="mt-3 text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl font-light">
                      {project.description}
                    </p>

                    {/* Tech tags */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground border border-border/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 md:pt-8">
                    {project.preview && (
                      <button
                        onClick={() => setPreviewOpen(index)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-sm text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 cursor-pointer"
                        aria-label={`Preview de ${project.title}`}
                      >
                        <Eye size={15} strokeWidth={1.5} />
                        Preview
                      </button>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-300"
                        aria-label={`Codigo fuente de ${project.title}`}
                      >
                        <Github size={15} strokeWidth={1.5} />
                        Código
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all duration-300"
                        aria-label={`Ver proyecto ${project.title}`}
                      >
                        <ExternalLink size={15} strokeWidth={1.5} />
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Empty state */}
          {projects.length === 0 && (
            <p className="mt-16 text-center text-muted-foreground text-sm font-light">
              Próximamente...
            </p>
          )}
        </div>
      </section>

      {/* Preview modal */}
      {previewOpen !== null && projects[previewOpen]?.preview && (
        <PreviewModal
          src={projects[previewOpen].preview!}
          alt={`Vista previa de ${projects[previewOpen].title}`}
          onClose={() => setPreviewOpen(null)}
        />
      )}
    </>
  )
}

export function SectionHeader({
  number,
  title,
}: {
  number: string
  title: string
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-primary/60 text-xs font-medium tracking-[0.2em]">
        {number}.
      </span>
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground tracking-tight">
        {title}
      </h2>
      <div className="hidden sm:block flex-1 h-px bg-border/50 max-w-xs" />
    </div>
  )
}
