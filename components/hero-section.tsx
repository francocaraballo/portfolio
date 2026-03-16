import Image from "next/image"
import { personalInfo } from "@/lib/portfolio-data"
import { Github, Linkedin, Mail, ArrowDown } from "lucide-react"

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden"
    >
      {/* Ambient gradient — very subtle warm glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/[0.02] rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/4" />

      <div className="relative mx-auto max-w-5xl w-full flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
        {/* Text */}
        <div className="flex-1 text-center lg:text-left">
          <p className="text-primary text-xs font-medium tracking-[0.25em] uppercase mb-6 animate-fade-up">
            Hola, soy
          </p>
          <h1
            className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-[0.95] tracking-tight animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            {personalInfo.name}
          </h1>
          <h2
            className="mt-4 text-xl md:text-2xl font-heading font-medium text-primary/80 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            {personalInfo.subtitle}
          </h2>
          <p
            className="mt-6 text-muted-foreground text-base md:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 font-light animate-fade-up"
            style={{ animationDelay: "300ms" }}
          >
            {personalInfo.phrase}
          </p>

          {/* Social links */}
          <div
            className="mt-10 flex items-center gap-3 justify-center lg:justify-start animate-fade-up"
            style={{ animationDelay: "400ms" }}
          >
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-11 h-11 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-300"
              aria-label="GitHub"
            >
              <Github size={18} strokeWidth={1.5} />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-11 h-11 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} strokeWidth={1.5} />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="group flex items-center justify-center w-11 h-11 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-300"
              aria-label="Email"
            >
              <Mail size={18} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Photo */}
        <div
          className="relative flex-shrink-0 animate-fade-up"
          style={{ animationDelay: "200ms" }}
        >
          <div className="relative w-52 h-52 md:w-64 md:h-64 lg:w-72 lg:h-72">
            {/* Soft glow ring */}
            <div className="absolute -inset-3 rounded-full bg-primary/[0.06] blur-2xl" />
            <div className="relative w-full h-full rounded-full overflow-hidden border border-border/50 shadow-2xl shadow-background/50">
              <Image
                src={personalInfo.photo}
                alt={`Foto de ${personalInfo.name}`}
                fill
                className="object-cover grayscale-[20%] contrast-[1.05]"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#proyectos"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-300"
        aria-label="Ir a proyectos"
      >
        <ArrowDown size={16} strokeWidth={1.5} className="animate-bounce" />
      </a>
    </section>
  )
}
