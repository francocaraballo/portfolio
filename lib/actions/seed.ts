"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { personalInfo, projects, experiences, certificates } from "@/lib/portfolio-data"

export interface SeedResult {
  success: boolean
  message?: string
  error?: string
  stats?: {
    profilesSeeded: number
    projectsSeeded: number
    experiencesSeeded: number
    certificatesSeeded: number
  }
}

/**
 * Server Action para sembrar (seed) la base de datos de Supabase con los datos estáticos del proyecto.
 * Evita duplicados verificando los registros existentes antes de insertar.
 */
export async function seedDatabaseAction(): Promise<SeedResult> {
  try {
    const supabase = await createClient()

    // 1. Verificación de Autenticación (server-auth-actions)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: "No autorizado. Debés iniciar sesión en el panel admin para sembrar la base de datos.",
      }
    }

    let profilesSeeded = 0
    let projectsSeeded = 0
    let experiencesSeeded = 0
    let certificatesSeeded = 0

    // 2. Sembrado de Perfil (profiles)
    const { data: existingProfiles, error: fetchProfileErr } = await supabase
      .from("profiles")
      .select("id")
      .limit(1)

    if (fetchProfileErr) {
      console.error("Error al consultar perfil en Supabase:", fetchProfileErr)
    }

    const profilePayload = {
      name: personalInfo.name,
      subtitle: personalInfo.subtitle,
      phrase: personalInfo.phrase,
      photo: personalInfo.photo,
      email: personalInfo.email,
      github: personalInfo.github,
      linkedin: personalInfo.linkedin,
      updated_at: new Date().toISOString(),
    }

    if (!existingProfiles || existingProfiles.length === 0) {
      const { error: insertProfileErr } = await supabase
        .from("profiles")
        .insert([profilePayload])

      if (insertProfileErr) {
        throw new Error(`Error al insertar perfil: ${insertProfileErr.message}`)
      }
      profilesSeeded++
    } else {
      const { error: updateProfileErr } = await supabase
        .from("profiles")
        .update(profilePayload)
        .eq("id", existingProfiles[0].id)

      if (updateProfileErr) {
        throw new Error(`Error al actualizar perfil: ${updateProfileErr.message}`)
      }
      profilesSeeded++
    }

    // 3. Sembrado de Proyectos (projects)
    const { data: existingDbProjects, error: fetchProjectsErr } = await supabase
      .from("projects")
      .select("title")

    if (fetchProjectsErr) {
      console.error("Error al consultar proyectos en Supabase:", fetchProjectsErr)
    }

    const existingProjectTitles = new Set(
      (existingDbProjects || []).map((p) => p.title?.toLowerCase().trim())
    )

    for (const proj of projects) {
      if (!existingProjectTitles.has(proj.title.toLowerCase().trim())) {
        const { error: insertProjErr } = await supabase.from("projects").insert([
          {
            title: proj.title,
            description: proj.description,
            technologies: proj.technologies,
            preview: proj.preview || null,
            link: proj.link || null,
            github: proj.github || null,
          },
        ])

        if (insertProjErr) {
          console.error(`Error al insertar proyecto '${proj.title}':`, insertProjErr)
        } else {
          projectsSeeded++
        }
      }
    }

    // 4. Sembrado de Experiencias (experiences)
    const { data: existingDbExperiences, error: fetchExpErr } = await supabase
      .from("experiences")
      .select("title, company")

    if (fetchExpErr) {
      console.error("Error al consultar experiencias en Supabase:", fetchExpErr)
    }

    const existingExpKeys = new Set(
      (existingDbExperiences || []).map(
        (e) => `${e.title?.toLowerCase().trim()}_${e.company?.toLowerCase().trim()}`
      )
    )

    for (const exp of experiences) {
      const key = `${exp.title.toLowerCase().trim()}_${exp.company.toLowerCase().trim()}`
      if (!existingExpKeys.has(key)) {
        const { error: insertExpErr } = await supabase.from("experiences").insert([
          {
            title: exp.title,
            company: exp.company,
            period: exp.period,
            description: exp.description,
          },
        ])

        if (insertExpErr) {
          console.error(`Error al insertar experiencia '${exp.title}':`, insertExpErr)
        } else {
          experiencesSeeded++
        }
      }
    }

    // 5. Sembrado de Certificados (certificates)
    const { data: existingDbCertificates, error: fetchCertErr } = await supabase
      .from("certificates")
      .select("title, credential_id")

    if (fetchCertErr) {
      console.error("Error al consultar certificados en Supabase:", fetchCertErr)
    }

    const existingCertKeys = new Set(
      (existingDbCertificates || []).map(
        (c) => `${c.title?.toLowerCase().trim()}_${(c.credential_id || "").toLowerCase().trim()}`
      )
    )

    for (const cert of certificates) {
      const key = `${cert.title.toLowerCase().trim()}_${(cert.credentialId || "").toLowerCase().trim()}`
      if (!existingCertKeys.has(key)) {
        const { error: insertCertErr } = await supabase.from("certificates").insert([
          {
            title: cert.title,
            issuer: cert.issuer,
            date: cert.date,
            credential_id: cert.credentialId || null,
            link: cert.link || null,
          },
        ])

        if (insertCertErr) {
          console.error(`Error al insertar certificado '${cert.title}':`, insertCertErr)
        } else {
          certificatesSeeded++
        }
      }
    }

    // 6. Revalidar rutas para refrescar inmediatamente
    revalidatePath("/")
    revalidatePath("/admin")

    return {
      success: true,
      message: "¡Sembrado de base de datos completado exitosamente!",
      stats: {
        profilesSeeded,
        projectsSeeded,
        experiencesSeeded,
        certificatesSeeded,
      },
    }
  } catch (err: any) {
    console.error("Error en seedDatabaseAction:", err)
    return {
      success: false,
      error: err.message || "Error al procesar el sembrado de la base de datos.",
    }
  }
}
