"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { uploadToStorage } from "@/lib/supabase/storage"

export async function updateProfileAction(formData: FormData) {
  try {
    const supabase = await createClient()

    // 1. Auth check (server-auth-actions rule)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "No autorizado. Iniciá sesión para continuar." }
    }

    const name = formData.get("name") as string
    const subtitle = formData.get("subtitle") as string
    const phrase = formData.get("phrase") as string
    const email = formData.get("email") as string
    const github = formData.get("github") as string
    const linkedin = formData.get("linkedin") as string
    let photoUrl = (formData.get("photoUrl") as string) || ""

    const photoFile = formData.get("photoFile") as File | null
    if (photoFile && photoFile.size > 0) {
      photoUrl = await uploadToStorage(photoFile, "profile")
    }

    // Consultar si existe un registro en profiles
    const { data: existingProfiles } = await supabase.from("profiles").select("id").limit(1)

    const profileData = {
      name,
      subtitle,
      phrase,
      email,
      github,
      linkedin,
      photo: photoUrl,
      updated_at: new Date().toISOString(),
    }

    let error
    if (existingProfiles && existingProfiles.length > 0) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", existingProfiles[0].id)
      error = updateError
    } else {
      const { error: insertError } = await supabase.from("profiles").insert([profileData])
      error = insertError
    }

    if (error) {
      console.error("Error actualizando perfil en DB:", error)
      return { success: false, error: `Error en la base de datos: ${error.message}` }
    }

    revalidatePath("/")
    revalidatePath("/admin")

    return { success: true, message: "Perfil actualizado con éxito" }
  } catch (err: any) {
    console.error("Error en updateProfileAction:", err)
    return { success: false, error: err.message || "Error al actualizar el perfil" }
  }
}
