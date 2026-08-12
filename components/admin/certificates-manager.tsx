"use client"

import { useState, useTransition } from "react"
import type { Certificate } from "@/types/portfolio"
import { createCertificateAction, updateCertificateAction, deleteCertificateAction } from "@/lib/actions/certificates"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Award, Plus, Edit2, Trash2, Calendar, ExternalLink, ShieldCheck, Loader2 } from "lucide-react"

interface CertificatesManagerProps {
  initialData: Certificate[]
}

export function CertificatesManager({ initialData }: CertificatesManagerProps) {
  const [certificates, setCertificates] = useState<Certificate[]>(initialData)
  const [isPending, startTransition] = useTransition()

  // Modal State
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [editingCert, setEditingCert] = useState<Certificate | null>(null)

  // Delete State
  const [deletingId, setDeletingId] = useState<string | number | null>(null)

  // Form State
  const [title, setTitle] = useState("")
  const [issuer, setIssuer] = useState("")
  const [date, setDate] = useState("")
  const [credentialId, setCredentialId] = useState("")
  const [link, setLink] = useState("")

  const openCreateModal = () => {
    setEditingCert(null)
    setTitle("")
    setIssuer("")
    setDate("")
    setCredentialId("")
    setLink("")
    setIsOpenModal(true)
  }

  const openEditModal = (cert: Certificate) => {
    setEditingCert(cert)
    setTitle(cert.title)
    setIssuer(cert.issuer)
    setDate(cert.date)
    setCredentialId(cert.credentialId || "")
    setLink(cert.link || "")
    setIsOpenModal(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !issuer || !date) {
      toast.error("El título, emisor y fecha son requeridos")
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("issuer", issuer)
      formData.append("date", date)
      formData.append("credentialId", credentialId)
      formData.append("link", link)

      let res
      if (editingCert && editingCert.id) {
        res = await updateCertificateAction(editingCert.id, formData)
      } else {
        res = await createCertificateAction(formData)
      }

      if (res.success) {
        toast.success(res.message || "Certificado guardado con éxito")
        setIsOpenModal(false)
      } else {
        toast.error(res.error || "Error al guardar el certificado")
      }
    })
  }

  const handleDeleteConfirm = () => {
    if (!deletingId) return

    startTransition(async () => {
      const res = await deleteCertificateAction(deletingId)
      if (res.success) {
        toast.success(res.message || "Certificado eliminado")
        setCertificates((prev) => prev.filter((c) => c.id !== deletingId))
      } else {
        toast.error(res.error || "Error al eliminar el certificado")
      }
      setDeletingId(null)
    })
  }

  return (
    <Card className="bg-card/40 border-border/40 backdrop-blur-xl shadow-xl text-foreground">
      <CardHeader className="border-b border-border/40 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="font-heading text-xl font-bold text-foreground">Gestión de Certificados</CardTitle>
            <CardDescription className="text-muted-foreground text-sm font-light">
              Administrá tus certificaciones, cursos y credenciales verificables
            </CardDescription>
          </div>
        </div>

        <Button
          onClick={openCreateModal}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" /> Agregar Certificado
        </Button>
      </CardHeader>

      <CardContent className="pt-6">
        {certificates.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/40 rounded-xl bg-background/40">
            <Award className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium text-sm">No tenés certificados registrados.</p>
            <p className="text-xs text-muted-foreground/70 mt-1 font-light">Hacé clic en "Agregar Certificado" para publicar la primera credencial.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert, idx) => (
              <div
                key={cert.id || idx}
                className="p-5 rounded-xl bg-background/60 border border-border/40 hover:border-border/80 transition-all duration-300 flex flex-col justify-between space-y-4 group shadow-sm hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-bold text-foreground text-base leading-snug">{cert.title}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(cert)}
                        className="h-10 w-10 p-0 text-muted-foreground hover:text-foreground hover:bg-card"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingId(cert.id || null)}
                        className="h-10 w-10 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-primary flex items-center gap-1.5 font-sans">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Emisor: {cert.issuer}
                  </p>

                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-light">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
                    Fecha: {cert.date}
                  </p>

                  {cert.credentialId && (
                    <p className="text-xs text-muted-foreground font-mono">
                      ID: <span className="text-foreground">{cert.credentialId}</span>
                    </p>
                  )}
                </div>

                {cert.link && (
                  <div className="pt-2 border-t border-border/40">
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-primary hover:underline flex items-center gap-1.5"
                    >
                      Ver credencial verificable <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Modal Dialog Create/Edit */}
      <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
        <DialogContent className="bg-card/95 border-border/40 backdrop-blur-2xl text-foreground w-[95vw] sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold text-foreground">
              {editingCert ? "Editar Certificado" : "Agregar Certificado"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs font-light">
              Completá los datos de la certificación o credencial.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="cert-title" className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">
                Título del Certificado *
              </Label>
              <Input
                id="cert-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: AWS Certified Solutions Architect"
                className="bg-background/80 border-border/50 text-foreground font-sans"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cert-issuer" className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">
                  Emisor / Institución *
                </Label>
                <Input
                  id="cert-issuer"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="Ej: Amazon Web Services"
                  className="bg-background/80 border-border/50 text-foreground font-sans"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cert-date" className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">
                  Fecha de Emisión *
                </Label>
                <Input
                  id="cert-date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Ej: Noviembre 2024"
                  className="bg-background/80 border-border/50 text-foreground font-sans"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cert-cred" className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">
                ID de Credencial (Opcional)
              </Label>
              <Input
                id="cert-cred"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="Ej: AWS-894120593"
                className="bg-background/80 border-border/50 text-foreground font-sans"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cert-link" className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">
                Enlace a la Credencial (Opcional)
              </Label>
              <Input
                id="cert-link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://credly.com/your-badge"
                className="bg-background/80 border-border/50 text-foreground font-sans"
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
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Guardar Certificado"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog Delete */}
      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="bg-card/95 border-border/40 backdrop-blur-2xl text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-foreground">¿Eliminar este certificado?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-xs font-light">
              Esta credencial será eliminada permanentemente del portfolio.
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
