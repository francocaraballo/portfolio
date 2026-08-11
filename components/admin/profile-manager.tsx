"use client"

import { useState, useTransition } from "react"
import type { PersonalInfo } from "@/types/portfolio"
import { updateProfileAction } from "@/lib/actions/profile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { User, Mail, Github, Linkedin, Upload, Loader2, Save, Sparkles } from "lucide-react"

interface ProfileManagerProps {
  initialData: PersonalInfo
}

export function ProfileManager({ initialData }: ProfileManagerProps) {
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    subtitle: initialData.subtitle || "",
    phrase: initialData.phrase || "",
    photo: initialData.photo || "",
    email: initialData.email || "",
    github: initialData.github || "",
    linkedin: initialData.linkedin || "",
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(initialData.photo || "")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const localUrl = URL.createObjectURL(file)
      setPreviewUrl(localUrl)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("subtitle", formData.subtitle)
      data.append("phrase", formData.phrase)
      data.append("email", formData.email)
      data.append("github", formData.github)
      data.append("linkedin", formData.linkedin)
      data.append("photoUrl", formData.photo)

      if (selectedFile) {
        data.append("photoFile", selectedFile)
      }

      const res = await updateProfileAction(data)

      if (res.success) {
        toast.success(res.message || "Perfil actualizado con éxito")
      } else {
        toast.error(res.error || "Error al actualizar el perfil")
      }
    })
  }

  return (
    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl shadow-xl text-slate-100">
      <CardHeader className="border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <User className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              Gestión de Perfil Personal
              <Sparkles className="w-4 h-4 text-amber-400" />
            </CardTitle>
            <CardDescription className="text-slate-400">
              Actualizá tu información personal, foto de perfil y enlaces de contacto
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar & Photo Upload Section */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border-2 border-primary/30 shadow-lg shadow-primary/10">
              <AvatarImage src={previewUrl} alt={formData.name} className="object-cover" />
              <AvatarFallback className="bg-primary/20 text-primary font-bold text-2xl">
                {formData.name ? formData.name.substring(0, 2).toUpperCase() : "PF"}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <h4 className="text-sm font-semibold text-white">Foto de Perfil</h4>
              <p className="text-xs text-slate-400">
                Formatos permitidos: PNG, JPG, WebP. Se guardará en Supabase Storage (bucket: portfolio-assets).
              </p>
              <div className="flex items-center gap-3 pt-1 justify-center sm:justify-start">
                <Label
                  htmlFor="photo-upload"
                  className="cursor-pointer inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg transition-colors border border-slate-700 font-medium"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Subir Nueva Imagen
                </Label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile && (
                  <span className="text-xs text-emerald-400 truncate max-w-[150px]">
                    {selectedFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Nombre Completo
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Franco Caraballo"
                className="bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-primary"
                required
              />
            </div>

            {/* Subtítulo / Rol */}
            <div className="space-y-2">
              <Label htmlFor="subtitle" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Título / Rol Principal
              </Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Ej: Fullstack Developer | React & Node.js Expert"
                className="bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-primary"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Correo Electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contacto@tuportfolio.com"
                  className="pl-9 bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* GitHub */}
            <div className="space-y-2">
              <Label htmlFor="github" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Enlace a GitHub
              </Label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="github"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder="https://github.com/tu-usuario"
                  className="pl-9 bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="linkedin" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Enlace a LinkedIn
              </Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/tu-perfil"
                  className="pl-9 bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Phrase / Bio */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phrase" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Frase Destacada / Bio / Sobre mí
              </Label>
              <Textarea
                id="phrase"
                rows={4}
                value={formData.phrase}
                onChange={(e) => setFormData({ ...formData, phrase: e.target.value })}
                placeholder="Escribí una frase inspiradora o breve resumen sobre tu pasión por el desarrollo..."
                className="bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-primary resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-lg shadow-primary/20"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
