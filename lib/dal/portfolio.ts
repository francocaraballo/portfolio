import { cache } from "react"
import type { PersonalInfo, Project, Certificate, Experience, NavLink } from "@/types/portfolio"
import { personalInfo, projects, certificates, experiences, navLinks } from "@/lib/portfolio-data"
import { createClient } from "@/lib/supabase/server"

/**
 * Data Access Layer (DAL) para Portfolio
 * Consultas prioritarias a Supabase con fallback a portfolio-data.ts únicamente cuando la tabla está vacía o si ocurre un error.
 */

export const getPersonalInfo = cache(async (): Promise<PersonalInfo> => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("profiles").select("*").limit(1).maybeSingle()

    if (error || !data) {
      return personalInfo
    }

    return {
      name: data.name ?? personalInfo.name,
      subtitle: data.subtitle ?? personalInfo.subtitle,
      phrase: data.phrase ?? personalInfo.phrase,
      photo: data.photo || personalInfo.photo,
      email: data.email ?? personalInfo.email,
      github: data.github ?? personalInfo.github,
      linkedin: data.linkedin ?? personalInfo.linkedin,
    }
  } catch (err) {
    console.error("Error al consultar Supabase (profiles), usando fallback local:", err)
    return personalInfo
  }
})

export const getProjects = cache(async (): Promise<Project[]> => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: true })

    if (error || !data || data.length === 0) {
      return projects
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title ?? "",
      description: item.description ?? "",
      technologies: Array.isArray(item.technologies)
        ? item.technologies
        : typeof item.technologies === "string"
        ? (() => {
            try {
              const parsed = JSON.parse(item.technologies)
              return Array.isArray(parsed) ? parsed : [item.technologies]
            } catch {
              return item.technologies.split(",").map((t: string) => t.trim()).filter(Boolean)
            }
          })()
        : [],
      preview: item.preview || undefined,
      link: item.link || undefined,
      github: item.github || undefined,
    }))
  } catch (err) {
    console.error("Error al consultar Supabase (projects), usando fallback local:", err)
    return projects
  }
})

export const getCertificates = cache(async (): Promise<Certificate[]> => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("id", { ascending: true })

    if (error || !data || data.length === 0) {
      return certificates
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title ?? "",
      issuer: item.issuer ?? "",
      date: item.date ?? "",
      credentialId: item.credential_id ?? item.credentialId ?? undefined,
      link: item.link || undefined,
    }))
  } catch (err) {
    console.error("Error al consultar Supabase (certificates), usando fallback local:", err)
    return certificates
  }
})

export const getExperiences = cache(async (): Promise<Experience[]> => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("id", { ascending: true })

    if (error || !data || data.length === 0) {
      return experiences
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title ?? "",
      company: item.company ?? "",
      period: item.period ?? "",
      description: item.description ?? "",
    }))
  } catch (err) {
    console.error("Error al consultar Supabase (experiences), usando fallback local:", err)
    return experiences
  }
})

export const getNavLinks = cache(async (): Promise<NavLink[]> => {
  return Promise.resolve(navLinks)
})

