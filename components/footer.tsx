import { navLinks, personalInfo } from "@/lib/portfolio-data"
import { Github, Linkedin, Mail } from "lucide-react"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/30">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Brand */}
          <div className="text-center md:text-left">
            <p className="font-heading text-lg font-bold text-foreground tracking-tight">
              {personalInfo.name.split(" ")[0]}
              <span className="text-primary">.</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70 font-light">
              {personalInfo.subtitle}
            </p>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300 uppercase tracking-[0.12em]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div className="flex items-center gap-3">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground/60 hover:text-foreground transition-colors duration-300"
            >
              <Github size={16} strokeWidth={1.5} />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted-foreground/60 hover:text-foreground transition-colors duration-300"
            >
              <Linkedin size={16} strokeWidth={1.5} />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              aria-label="Email"
              className="text-muted-foreground/60 hover:text-foreground transition-colors duration-300"
            >
              <Mail size={16} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/20 text-center">
          <p className="text-[11px] text-muted-foreground/40 font-light tracking-wide">
            {`\u00A9 ${year} ${personalInfo.name}`}
          </p>
        </div>
      </div>
    </footer>
  )
}
