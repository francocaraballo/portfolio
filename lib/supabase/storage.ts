import { createClient } from "@/lib/supabase/server"

/**
 * Sube un archivo al bucket 'portfolio-assets' de Supabase Storage.
 * Retorna la URL pública del archivo subido.
 */
export async function uploadToStorage(file: File, folder: string = "uploads"): Promise<string> {
  if (!file || file.size === 0) {
    throw new Error("El archivo está vacío o es inválido")
  }

  const supabase = await createClient()
  const bucketName = "portfolio-assets"

  // Generar nombre único
  const fileExt = file.name.split(".").pop() || "png"
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Intentar subir el archivo
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, buffer, {
      contentType: file.type || "image/png",
      upsert: true,
    })

  if (error) {
    // Si falla porque no existe el bucket, intentar crearlo y reintentar
    if (error.message.toLowerCase().includes("not found") || error.message.toLowerCase().includes("bucket")) {
      await supabase.storage.createBucket(bucketName, {
        public: true,
      })

      const retry = await supabase.storage
        .from(bucketName)
        .upload(fileName, buffer, {
          contentType: file.type || "image/png",
          upsert: true,
        })

      if (retry.error) {
        throw new Error(`Error al subir imagen: ${retry.error.message}`)
      }

      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(retry.data.path)
      return publicUrlData.publicUrl
    }

    throw new Error(`Error al subir imagen: ${error.message}`)
  }

  const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(data.path)
  return publicUrlData.publicUrl
}
