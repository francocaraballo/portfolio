"use client"

import { useState, useEffect, useCallback } from "react"
import { navLinks, personalInfo } from "@/lib/portfolio-data"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [activeSection, setActiveSection] = useState("#inicio")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20)

    const sections = navLinks.map((link) => link.href.replace("#", ""))
    const scrollPosition = window.scrollY + 120

    for (let i = sections.length - 1; i >= 0; i--) {
      const element = document.getElementById(sections[i])
      if (element && element.offsetTop <= scrollPosition) {
        setActiveSection(`#${sections[i]}`)
        break
      }
    }
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const handleClick = (href: string) => {
    setIsMobileOpen(false)
    setActiveSection(href)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/60 backdrop-blur-2xl border-b border-border/30"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-5">
        <a
          href="#inicio"
          onClick={() => handleClick("#inicio")}
          className="font-heading text-lg font-bold text-foreground tracking-tight hover:text-primary transition-colors duration-300"
        >
          {personalInfo.name.split(" ")[0]}
          <span className="text-primary">.</span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => handleClick(link.href)}
                className={`relative text-[13px] font-medium uppercase tracking-[0.12em] transition-colors duration-300 ${
                  activeSection === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-500 ease-out ${
                    activeSection === link.href ? "w-full" : "w-0"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground p-2 -mr-2"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label={isMobileOpen ? "Cerrar menu" : "Abrir menu"}
        >
          {isMobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-out ${
          isMobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col px-6 pb-6 pt-2 bg-background/95 backdrop-blur-2xl border-b border-border/30">
          {navLinks.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => handleClick(link.href)}
                className={`block py-3 text-sm font-light tracking-wide transition-colors duration-300 ${
                  activeSection === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
