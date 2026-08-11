"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function createCertificateAction(formData: FormData) {
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
    const issuer = formData.get("issuer") as string
    const date = formData.get("date") as string
    const credentialId = (formData.get("credentialId") as string) || ""
    const link = (formData.get("link") as string) || ""

    const { error } = await supabase.from("certificates").insert([
      {
        title,
        issuer,
        date,
        credential_id: credentialId || null,
        link: link || null,
      },
    ])

    if (error) {
      console.error("Error insertando certificado:", error)
      return { success: false, error: `Error en la base de datos: ${error.message}` }
    }

    revalidatePath("/")
    revalidatePath("/admin")

    return { success: true, message: "Certificado agregado con éxito" }
  } catch (err: any) {
    console.error("Error en createCertificateAction:", err)
    return { success: false, error: err.message || "Error al agregar el certificado" }
  }
}

export async function updateCertificateAction(id: string | number, formData: FormData) {
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
    const issuer = formData.get("issuer") as string
    const date = formData.get("date") as string
    const credentialId = (formData.get("credentialId") as string) || ""
    const link = (formData.get("link") as string) || ""

    const { error } = await supabase
      .from("certificates")
      .update({
        title,
        issuer,
        date,
        credential_id: credentialId || null,
        link: link || null,
      })
      .eq("id", id)

    if (error) {
      console.error("Error actualizando certificado:", error)
      return { success: false, error: `Error en la base de datos: ${error.message}` }
    }

    revalidatePath("/")
    revalidatePath("/admin")

    return { success: true, message: "Certificado actualizado con éxito" }
  } catch (err: any) {
    console.error("Error en updateCertificateAction:", err)
    return { success: false, error: err.message || "Error al actualizar el certificado" }
  }
}

export async function deleteCertificateAction(id: string | number) {
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

    const { error } = await supabase.from("certificates").delete().eq("id", id)

    if (error) {
      console.error("Error eliminando certificado:", error)
      return { success: false, error: `Error en la base de datos: ${error.message}` }
    }

    revalidatePath("/")
    revalidatePath("/admin")

    return { success: true, message: "Certificado eliminado con éxito" }
  } catch (err: any) {
    console.error("Error en deleteCertificateAction:", err)
    return { success: false, error: err.message || "Error al eliminar el certificado" }
  }
}
