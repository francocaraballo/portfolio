"use client"

import { useState, useTransition } from "react"
import type { Experience } from "@/types/portfolio"
import { createExperienceAction, updateExperienceAction, deleteExperienceAction } from "@/lib/actions/experiences"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
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
import { Briefcase, Plus, Edit2, Trash2, Calendar, Building2, Loader2 } from "lucide-react"

interface ExperiencesManagerProps {
  initialData: Experience[]
}

export function ExperiencesManager({ initialData }: ExperiencesManagerProps) {
  const [experiences, setExperiences] = useState<Experience[]>(initialData)
  const [isPending, startTransition] = useTransition()

  // Modal State
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)

  // Delete State
  const [deletingId, setDeletingId] = useState<string | number | null>(null)

  // Form State
  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [period, setPeriod] = useState("")
  const [description, setDescription] = useState("")

  const openCreateModal = () => {
    setEditingExperience(null)
    setTitle("")
    setCompany("")
    setPeriod("")
    setDescription("")
    setIsOpenModal(true)
  }

  const openEditModal = (exp: Experience) => {
    setEditingExperience(exp)
    setTitle(exp.title)
    setCompany(exp.company)
    setPeriod(exp.period)
    setDescription(exp.description)
    setIsOpenModal(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !company || !period || !description) {
      toast.error("Por favor completá todos los campos requeridos")
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("company", company)
      formData.append("period", period)
      formData.append("description", description)

      let res
      if (editingExperience && editingExperience.id) {
        res = await updateExperienceAction(editingExperience.id, formData)
      } else {
        res = await createExperienceAction(formData)
      }

      if (res.success) {
        toast.success(res.message || "Experiencia guardada correctamente")
        setIsOpenModal(false)
      } else {
        toast.error(res.error || "Error al guardar la experiencia")
      }
    })
  }

  const handleDeleteConfirm = () => {
    if (!deletingId) return

    startTransition(async () => {
      const res = await deleteExperienceAction(deletingId)
      if (res.success) {
        toast.success(res.message || "Experiencia eliminada")
        setExperiences((prev) => prev.filter((exp) => exp.id !== deletingId))
      } else {
        toast.error(res.error || "Error al eliminar la experiencia")
      }
      setDeletingId(null)
    })
  }

  return (
    <Card className="bg-card/40 border-border/40 backdrop-blur-xl shadow-xl text-foreground">
      <CardHeader className="border-b border-border/40 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="font-heading text-xl font-bold text-foreground">Gestión de Experiencia Laboral</CardTitle>
            <CardDescription className="text-muted-foreground text-sm font-light">
              Administrá tus puestos de trabajo y trayectoria profesional
            </CardDescription>
          </div>
        </div>

        <Button
          onClick={openCreateModal}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" /> Agregar Experiencia
        </Button>
      </CardHeader>

      <CardContent className="pt-6">
        {experiences.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/40 rounded-xl bg-background/40">
            <Briefcase className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium text-sm">No tenés experiencias registradas.</p>
            <p className="text-xs text-muted-foreground/70 mt-1 font-light">Hacé clic en "Agregar Experiencia" para crear la primera.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp, idx) => (
              <div
                key={exp.id || idx}
                className="p-5 rounded-xl bg-background/60 border border-border/40 hover:border-border/80 transition-all duration-300 flex flex-col sm:flex-row sm:items-start justify-between gap-4 group shadow-sm hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading font-bold text-foreground text-lg">{exp.title}</h3>
                    <span className="text-muted-foreground/40 text-xs">•</span>
                    <span className="text-primary font-medium text-sm flex items-center gap-1.5 font-sans">
                      <Building2 className="w-3.5 h-3.5" />
                      {exp.company}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-light">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
                    {exp.period}
                  </p>

                  <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line pt-1 font-light">
                    {exp.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(exp)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-card"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingId(exp.id || null)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Modal Dialog Create/Edit */}
      <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
        <DialogContent className="bg-card/95 border-border/40 backdrop-blur-2xl text-foreground max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold text-foreground">
              {editingExperience ? "Editar Experiencia" : "Agregar Experiencia"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs font-light">
              Ingresá los detalles del rol profesional o empleo.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="exp-title" className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">
                Cargo / Título *
              </Label>
              <Input
                id="exp-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Senior Frontend Engineer"
                className="bg-background/80 border-border/50 text-foreground font-sans"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exp-company" className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">
                  Empresa / Organización *
                </Label>
                <Input
                  id="exp-company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Ej: Tech Solutions Inc."
                  className="bg-background/80 border-border/50 text-foreground font-sans"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exp-period" className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">
                  Período *
                </Label>
                <Input
                  id="exp-period"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="Ej: Ene 2023 - Presente"
                  className="bg-background/80 border-border/50 text-foreground font-sans"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exp-desc" className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">
                Descripción de responsabilidades y logros *
              </Label>
              <Textarea
                id="exp-desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describí tus tareas, tecnologías utilizadas e impactos logrados..."
                className="bg-background/80 border-border/50 text-foreground font-sans resize-none"
                required
              />
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
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Guardar Experiencia"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog Delete */}
      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="bg-card/95 border-border/40 backdrop-blur-2xl text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-foreground">¿Eliminar esta experiencia?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-xs font-light">
              Esta experiencia laboral será eliminada permanentemente.
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
