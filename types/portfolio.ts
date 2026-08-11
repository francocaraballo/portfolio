export interface PersonalInfo {
  name: string
  subtitle: string
  phrase: string
  photo: string
  email: string
  github: string
  linkedin: string
}

export interface Project {
  id?: string | number
  title: string
  description: string
  technologies: string[]
  preview?: string
  link?: string
  github?: string
}

export interface Experience {
  id?: string | number
  title: string
  company: string
  period: string
  description: string
}

export interface Certificate {
  id?: string | number
  title: string
  issuer: string
  date: string
  credentialId?: string
  link?: string
}

export interface NavLink {
  label: string
  href: string
}
