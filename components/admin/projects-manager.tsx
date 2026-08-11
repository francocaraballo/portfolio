"use client"

import { useState, useTransition } from "react"
import type { Project } from "@/types/portfolio"
import { createProjectAction, updateProjectAction, deleteProjectAction } from "@/lib/actions/projects"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { FolderKanban, Plus, Search, Edit2, Trash2, ExternalLink, Github, Upload, Loader2, Image as ImageIcon } from "lucide-react"

interface ProjectsManagerProps {
  initialData: Project[]
}

export function ProjectsManager({ initialData }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<Project[]>(initialData)
  const [searchQuery, setSearchQuery] = useState("")
  const [isPending, startTransition] = useTransition()

  // Modal State
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  
  // Delete State
  const [deletingId, setDeletingId] = useState<string | number | null>(null)

  // Form State
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [technologies, setTechnologies] = useState("")
  const [link, setLink] = useState("")
  const [github, setGithub] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreviewLocal, setFilePreviewLocal] = useState<string>("")

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase()
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.technologies.some((t) => t.toLowerCase().includes(q))
    )
  })

  const openCreateModal = () => {
    setEditingProject(null)
    setTitle("")
    setDescription("")
    setTechnologies("")
    setLink("")
    setGithub("")
    setPreviewUrl("")
    setSelectedFile(null)
    setFilePreviewLocal("")
    setIsOpenModal(true)
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project)
    setTitle(project.title)
    setDescription(project.description)
    setTechnologies(project.technologies.join(", "))
    setLink(project.link || "")
    setGithub(project.github || "")
    setPreviewUrl(project.preview || "")
    setSelectedFile(null)
    setFilePreviewLocal(project.preview || "")
    setIsOpenModal(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setFilePreviewLocal(URL.createObjectURL(file))
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description) {
      toast.error("El título y la descripción son obligatorios")
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("technologies", technologies)
      formData.append("link", link)
      formData.append("github", github)
      formData.append("previewUrl", previewUrl)

      if (selectedFile) {
        formData.append("previewFile", selectedFile)
      }

      let res
      if (editingProject && editingProject.id) {
        res = await updateProjectAction(editingProject.id, formData)
      } else {
        res = await createProjectAction(formData)
      }

      if (res.success) {
        toast.success(res.message || "Operación realizada con éxito")
        setIsOpenModal(false)
      } else {
        toast.error(res.error || "Ocurrió un error al guardar el proyecto")
      }
    })
  }

  const handleDeleteConfirm = () => {
    if (!deletingId) return

    startTransition(async () => {
      const res = await deleteProjectAction(deletingId)
      if (res.success) {
        toast.success(res.message || "Proyecto eliminado")
        setProjects((prev) => prev.filter((p) => p.id !== deletingId))
      } else {
        toast.error(res.error || "Error al eliminar el proyecto")
      }
      setDeletingId(null)
    })
  }

  return (
    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl shadow-xl text-slate-100">
      <CardHeader className="border-b border-slate-800/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-white">Gestión de Proyectos</CardTitle>
            <CardDescription className="text-slate-400">
              Agregá, editá o eliminá proyectos de tu portfolio
            </CardDescription>
          </div>
        </div>

        <Button
          onClick={openCreateModal}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4 mr-2" /> Nuevo Proyecto
        </Button>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Buscar proyectos por nombre o tecnologías..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-primary"
          />
        </div>

        {/* Projects List / Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-950/30">
            <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No se encontraron proyectos.</p>
            <p className="text-xs text-slate-500 mt-1">Intentá cambiar tu búsqueda o agregá uno nuevo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id || idx}
                className="bg-slate-950/60 border border-slate-800/80 rounded-xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image Preview */}
                  <div className="h-40 w-full bg-slate-900 relative overflow-hidden flex items-center justify-center border-b border-slate-800">
                    {project.preview ? (
                      <img
                        src={project.preview}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-600">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span className="text-xs">Sin imagen</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-white text-base line-clamp-1">{project.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.technologies.slice(0, 4).map((tech, tIdx) => (
                        <Badge
                          key={tIdx}
                          variant="secondary"
                          className="bg-slate-800/80 text-slate-300 text-[10px] border border-slate-700/50"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 4 && (
                        <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-800">
                          +{project.technologies.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-3 border-t border-slate-800/60 bg-slate-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-primary transition-colors p-1"
                        title="Ver demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-primary transition-colors p-1"
                        title="Ver código GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(project)}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingId(project.id || null)}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-950/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Modal Dialog for Create/Edit Project */}
      <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              {editingProject ? "Editar Proyecto" : "Crear Nuevo Proyecto"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Completá los campos requeridos para publicar el proyecto en el portfolio.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="proj-title" className="text-xs font-semibold text-slate-300">
                Título del Proyecto *
              </Label>
              <Input
                id="proj-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: E-commerce SaaS"
                className="bg-slate-950 border-slate-800 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proj-desc" className="text-xs font-semibold text-slate-300">
                Descripción *
              </Label>
              <Textarea
                id="proj-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explicación clara del proyecto, problemas que resuelve y arquitectura..."
                className="bg-slate-950 border-slate-800 text-white resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proj-tech" className="text-xs font-semibold text-slate-300">
                Tecnologías (separadas por coma)
              </Label>
              <Input
                id="proj-tech"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                placeholder="Ej: React, Next.js, Tailwind CSS, Supabase"
                className="bg-slate-950 border-slate-800 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proj-link" className="text-xs font-semibold text-slate-300">
                  Enlace Demo / Deploy
                </Label>
                <Input
                  id="proj-link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://midemo.com"
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="proj-github" className="text-xs font-semibold text-slate-300">
                  Enlace Repositorio GitHub
                </Label>
                <Input
                  id="proj-github"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/usuario/repo"
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>
            </div>

            {/* Image Preview & Upload */}
            <div className="space-y-2 pt-2">
              <Label className="text-xs font-semibold text-slate-300">Imagen de Portada (Preview)</Label>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="w-20 h-14 bg-slate-900 rounded border border-slate-800 overflow-hidden flex items-center justify-center">
                  {filePreviewLocal ? (
                    <img src={filePreviewLocal} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-600" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <Label
                    htmlFor="proj-file"
                    className="cursor-pointer inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" /> Subir Imagen
                  </Label>
                  <input
                    id="proj-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {selectedFile && (
                    <p className="text-[11px] text-emerald-400 truncate max-w-[200px]">
                      {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpenModal(false)}
                className="border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...
                  </>
                ) : (
                  "Guardar Proyecto"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog for Confirming Delete */}
      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">¿Estás seguro de eliminar este proyecto?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Esta acción no se puede deshacer. El proyecto será eliminado permanentemente de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
