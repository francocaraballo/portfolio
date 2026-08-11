"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { uploadToStorage } from "@/lib/supabase/storage"

export async function createProjectAction(formData: FormData) {
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
    const description = formData.get("description") as string
    const technologiesRaw = (formData.get("technologies") as string) || ""
    const link = (formData.get("link") as string) || ""
    const github = (formData.get("github") as string) || ""
    let previewUrl = (formData.get("previewUrl") as string) || ""

    const previewFile = formData.get("previewFile") as File | null
    if (previewFile && previewFile.size > 0) {
      previewUrl = await uploadToStorage(previewFile, "projects")
    }

    // Parse technologies (comma separated string -> string array)
    const technologies = technologiesRaw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    const { error } = await supabase.from("projects").insert([
      {
        title,
        description,
        technologies,
        link: link || null,
        github: github || null,
        preview: previewUrl || null,
      },
    ])

    if (error) {
      console.error("Error insertando proyecto:", error)
      return { success: false, error: `Error en la base de datos: ${error.message}` }
    }

    revalidatePath("/")
    revalidatePath("/admin")

    return { success: true, message: "Proyecto creado con éxito" }
  } catch (err: any) {
    console.error("Error en createProjectAction:", err)
    return { success: false, error: err.message || "Error al crear el proyecto" }
  }
}

export async function updateProjectAction(id: string | number, formData: FormData) {
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
    const description = formData.get("description") as string
    const technologiesRaw = (formData.get("technologies") as string) || ""
    const link = (formData.get("link") as string) || ""
    const github = (formData.get("github") as string) || ""
    let previewUrl = (formData.get("previewUrl") as string) || ""

    const previewFile = formData.get("previewFile") as File | null
    if (previewFile && previewFile.size > 0) {
      previewUrl = await uploadToStorage(previewFile, "projects")
    }

    const technologies = technologiesRaw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    const { error } = await supabase
      .from("projects")
      .update({
        title,
        description,
        technologies,
        link: link || null,
        github: github || null,
        preview: previewUrl || null,
      })
      .eq("id", id)

    if (error) {
      console.error("Error actualizando proyecto:", error)
      return { success: false, error: `Error en la base de datos: ${error.message}` }
    }

    revalidatePath("/")
    revalidatePath("/admin")

    return { success: true, message: "Proyecto actualizado con éxito" }
  } catch (err: any) {
    console.error("Error en updateProjectAction:", err)
    return { success: false, error: err.message || "Error al actualizar el proyecto" }
  }
}

export async function deleteProjectAction(id: string | number) {
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

    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      console.error("Error eliminando proyecto:", error)
      return { success: false, error: `Error en la base de datos: ${error.message}` }
    }

    revalidatePath("/")
    revalidatePath("/admin")

    return { success: true, message: "Proyecto eliminado con éxito" }
  } catch (err: any) {
    console.error("Error en deleteProjectAction:", err)
    return { success: false, error: err.message || "Error al eliminar el proyecto" }
  }
}
