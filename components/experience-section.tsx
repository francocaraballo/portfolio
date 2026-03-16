import { experiences } from "@/lib/portfolio-data"
import { SectionHeader } from "./projects-section"
import { Briefcase } from "lucide-react"

export function ExperienceSection() {
  return (
    <section id="experiencia" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader number="02" title="Experiencia" />

        <div className="mt-12 relative">
          {/* Timeline line */}
          <div className="absolute left-5 md:left-8 top-0 bottom-0 w-px bg-border" />

          <div className="flex flex-col gap-10">
            {experiences.map((exp, index) => (
              <div key={index} className="relative flex gap-6 md:gap-10">
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-10 h-10 md:w-16 md:h-16 rounded-full bg-card border-2 border-primary/40">
                  <Briefcase
                    size={18}
                    className="text-primary hidden md:block"
                  />
                  <Briefcase
                    size={14}
                    className="text-primary md:hidden"
                  />
                </div>

                {/* Content card */}
                <div className="flex-1 pb-2">
                  <div className="rounded-xl border border-border bg-card p-5 md:p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        {exp.title}
                      </h3>
                      <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded-full w-fit whitespace-nowrap">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-primary/80 mb-3">
                      {exp.company}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
