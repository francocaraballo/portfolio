// ============================================================
// PORTFOLIO DATA - Edita este archivo para personalizar tu portfolio
// ============================================================

export const personalInfo = {
  name: "Franco Caraballo",
  subtitle: "Programador Full Stack",
  phrase: "Transformando ideas en experiencias digitales, una linea de codigo a la vez.",
  photo: "/images/profile.jpg",
  email: "franconcaraballo@gmail.com",
  github: "https://github.com/francocaraballo",
  linkedin: "https://linkedin.com/in/francocaraballo",
}

// ============================================================
// PROYECTOS - Agrega o edita proyectos facilmente aqui
// ============================================================
export interface Project {
  title: string
  description: string
  technologies: string[]
  preview?: string
  link?: string
  github?: string
}

export const projects: Project[] = [
  {
    title: "Landing page personal trainer",
    description:
      "Pagina web para un personal trainer con el objetivo de mostrar sus servicios y atraer nuevos clientes.",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    preview: "/images/preview-trainer.png",
    link: "https://personaltrainerleo.netlify.app",
    github: "https://github.com/francocaraballo/leo-personal-trainer",
  },
]

// ============================================================
// EXPERIENCIA LABORAL - Agrega o edita experiencia aqui
// ============================================================
export interface Experience {
  title: string
  company: string
  period: string
  description: string
}

export const experiences: Experience[] = [
  
]

// ============================================================
// CERTIFICADOS - Agrega o edita certificados aqui
// ============================================================
export interface Certificate {
  title: string
  issuer: string
  date: string
  credentialId?: string
  link?: string
}

export const certificates: Certificate[] = [
  {
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2024",
    credentialId: "AWS-SAA-2024",
    link: "https://aws.amazon.com/certification",
  },
  {
    title: "Desarrollador web Full Stack",
    issuer: "Coderhouse",
    date: "2024",
    credentialId: "68422197080369d064f4c6b9",
    link: "https://pub.coderhouse.com/legacy-certificates/68422197080369d064f4c6b9",
  }
]

// ============================================================
// NAVEGACION
// ============================================================
export const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Certificados", href: "#certificados" },
  { label: "Contacto", href: "#contacto" },
]
