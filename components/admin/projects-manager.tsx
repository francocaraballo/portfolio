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
    <Card className="bg-card/40 border-border/40 backdrop-blur-xl shadow-xl text-foreground">
      <CardHeader className="border-b border-border/40 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="font-heading text-xl font-bold text-foreground">Gestión de Proyectos</CardTitle>
            <CardDescription className="text-muted-foreground text-sm font-light">
              Agregá, editá o eliminá proyectos de tu portfolio
            </CardDescription>
          </div>
        </div>

        <Button
          onClick={openCreateModal}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" /> Nuevo Proyecto
        </Button>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <Input
            placeholder="Buscar proyectos por nombre o tecnologías..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/80 border-border/50 text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-primary/40 focus-visible:border-primary/60 font-sans"
          />
        </div>

        {/* Projects List / Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/40 rounded-xl bg-background/40">
            <FolderKanban className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium text-sm">No se encontraron proyectos.</p>
            <p className="text-xs text-muted-foreground/70 mt-1 font-light">Intentá cambiar tu búsqueda o agregá uno nuevo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id || idx}
                className="bg-background/60 border border-border/40 rounded-xl overflow-hidden hover:border-border/80 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-lg hover:shadow-primary/5"
              >
                <div>
                  {/* Image Preview */}
                  <div className="h-40 w-full bg-card/60 relative overflow-hidden flex items-center justify-center border-b border-border/40">
                    {project.preview ? (
                      <img
                        src={project.preview}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground/50">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span className="text-xs font-light">Sin imagen</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="font-heading font-bold text-foreground text-base line-clamp-1">{project.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-light">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.technologies.slice(0, 4).map((tech, tIdx) => (
                        <Badge
                          key={tIdx}
                          variant="secondary"
                          className="bg-secondary/60 text-secondary-foreground text-[10px] border border-border/30 font-mono"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 4 && (
                        <Badge variant="outline" className="text-[10px] text-muted-foreground border-border/40 font-mono">
                          +{project.technologies.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-3 border-t border-border/40 bg-card/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors p-1"
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
                        className="text-muted-foreground hover:text-primary transition-colors p-1"
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
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-card"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingId(project.id || null)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
        <DialogContent className="bg-card/95 border-border/40 backdrop-blur-2xl text-foreground max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold text-foreground">
              {editingProject ? "Editar Proyecto" : "Crear Nuevo Proyecto"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs font-light">
              Completá los campos requeridos para publicar el proyecto en el portfolio.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="proj-title" className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">
                Título del Proyecto *
              </Label>
              <Input
                id="proj-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: E-commerce SaaS"
                className="bg-background/80 border-border/50 text-foreground font-sans"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proj-desc" className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">
                Descripción *
              </Label>
              <Textarea
                id="proj-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explicación clara del proyecto, problemas que resuelve y arquitectura..."
                className="bg-background/80 border-border/50 text-foreground font-sans resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proj-tech" className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">
                Tecnologías (separadas por coma)
              </Label>
              <Input
                id="proj-tech"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                placeholder="Ej: React, Next.js, Tailwind CSS, Supabase"
                className="bg-background/80 border-border/50 text-foreground font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proj-link" className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">
                  Enlace Demo / Deploy
                </Label>
                <Input
                  id="proj-link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://midemo.com"
                  className="bg-background/80 border-border/50 text-foreground font-sans"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="proj-github" className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">
                  Enlace Repositorio GitHub
                </Label>
                <Input
                  id="proj-github"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/usuario/repo"
                  className="bg-background/80 border-border/50 text-foreground font-sans"
                />
              </div>
            </div>

            {/* Image Preview & Upload */}
            <div className="space-y-2 pt-2">
              <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">Imagen de Portada (Preview)</Label>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-background/80 border border-border/50">
                <div className="w-20 h-14 bg-card rounded border border-border/40 overflow-hidden flex items-center justify-center">
                  {filePreviewLocal ? (
                    <img src={filePreviewLocal} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <Label
                    htmlFor="proj-file"
                    className="cursor-pointer inline-flex items-center gap-2 bg-card hover:bg-secondary text-foreground text-xs px-3 py-1.5 rounded transition-colors border border-border/40 font-medium"
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

            <DialogFooter className="pt-4 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpenModal(false)}
                className="border-border/40 bg-background text-muted-foreground hover:bg-card hover:text-foreground text-xs uppercase tracking-wider font-medium"
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
        <AlertDialogContent className="bg-card/95 border-border/40 backdrop-blur-2xl text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-foreground">¿Estás seguro de eliminar este proyecto?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-xs font-light">
              Esta acción no se puede deshacer. El proyecto será eliminado permanentemente de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border/40 bg-background text-muted-foreground hover:bg-card hover:text-foreground text-xs uppercase tracking-wider font-medium">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
