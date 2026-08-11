"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function createExperienceAction(formData: FormData) {
  try {
    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "No autorizado. Iniciá sesión." }
    }

    const title = formData.get("title") as string
    const company = formData.get("company") as string
    const period = formData.get("period") as string
    const description = formData.get("description") as string

    const { error } = await supabase.from("experiences").insert([
      {
        title,
        company,
        period,
        description,
      },
    ])

    if (error) {
      console.error("Error insertando experiencia:", error)
      return { success: false, error: `Error en la base de datos: ${error.message}` }
    }

    revalidatePath("/")
    revalidatePath("/admin")

    return { success: true, message: "Experiencia agregada con éxito" }
  } catch (err: any) {
    console.error("Error en createExperienceAction:", err)
    return { success: false, error: err.message || "Error al agregar la experiencia" }
  }
}

export async function updateExperienceAction(id: string | number, formData: FormData) {
  try {
    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "No autorizado. Iniciá sesión." }
    }

    const title = formData.get("title") as string
    const company = formData.get("company") as string
    const period = formData.get("period") as string
    const description = formData.get("description") as string

    const { error } = await supabase
      .from("experiences")
      .update({
        title,
        company,
        period,
        description,
      })
      .eq("id", id)

    if (error) {
      console.error("Error actualizando experiencia:", error)
      return { success: false, error: `Error en la base de datos: ${error.message}` }
    }

    revalidatePath("/")
    revalidatePath("/admin")

    return { success: true, message: "Experiencia actualizada con éxito" }
  } catch (err: any) {
    console.error("Error en updateExperienceAction:", err)
    return { success: false, error: err.message || "Error al actualizar la experiencia" }
  }
}

export async function deleteExperienceAction(id: string | number) {
  try {
    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "No autorizado. Iniciá sesión." }
    }

    const { error } = await supabase.from("experiences").delete().eq("id", id)

    if (error) {
      console.error("Error eliminando experiencia:", error)
      return { success: false, error: `Error en la base de datos: ${error.message}` }
    }

    revalidatePath("/")
    revalidatePath("/admin")

    return { success: true, message: "Experiencia eliminada con éxito" }
  } catch (err: any) {
    console.error("Error en deleteExperienceAction:", err)
    return { success: false, error: err.message || "Error al eliminar la experiencia" }
  }
}
