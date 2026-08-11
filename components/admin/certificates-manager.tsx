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
    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl shadow-xl text-slate-100">
      <CardHeader className="border-b border-slate-800/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-white">Gestión de Certificados</CardTitle>
            <CardDescription className="text-slate-400">
              Administrá tus certificaciones, cursos y credenciales verificables
            </CardDescription>
          </div>
        </div>

        <Button
          onClick={openCreateModal}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4 mr-2" /> Agregar Certificado
        </Button>
      </CardHeader>

      <CardContent className="pt-6">
        {certificates.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-950/30">
            <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No tenés certificados registrados.</p>
            <p className="text-xs text-slate-500 mt-1">Hacé clic en "Agregar Certificado" para publicar la primera credencial.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert, idx) => (
              <div
                key={cert.id || idx}
                className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-white text-base leading-snug">{cert.title}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(cert)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingId(cert.id || null)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-950/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-primary flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Emisor: {cert.issuer}
                  </p>

                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Fecha: {cert.date}
                  </p>

                  {cert.credentialId && (
                    <p className="text-xs text-slate-500 font-mono">
                      ID: <span className="text-slate-300">{cert.credentialId}</span>
                    </p>
                  )}
                </div>

                {cert.link && (
                  <div className="pt-2 border-t border-slate-800/60">
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5"
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
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              {editingCert ? "Editar Certificado" : "Agregar Certificado"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Completá los datos de la certificación o credencial.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="cert-title" className="text-xs font-semibold text-slate-300">
                Título del Certificado *
              </Label>
              <Input
                id="cert-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: AWS Certified Solutions Architect"
                className="bg-slate-950 border-slate-800 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cert-issuer" className="text-xs font-semibold text-slate-300">
                  Emisor / Institución *
                </Label>
                <Input
                  id="cert-issuer"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="Ej: Amazon Web Services"
                  className="bg-slate-950 border-slate-800 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cert-date" className="text-xs font-semibold text-slate-300">
                  Fecha de Emisión *
                </Label>
                <Input
                  id="cert-date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Ej: Noviembre 2024"
                  className="bg-slate-950 border-slate-800 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cert-cred" className="text-xs font-semibold text-slate-300">
                ID de Credencial (Opcional)
              </Label>
              <Input
                id="cert-cred"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="Ej: AWS-894120593"
                className="bg-slate-950 border-slate-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cert-link" className="text-xs font-semibold text-slate-300">
                Enlace a la Credencial (Opcional)
              </Label>
              <Input
                id="cert-link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://credly.com/your-badge"
                className="bg-slate-950 border-slate-800 text-white"
              />
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
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Guardar Certificado"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog Delete */}
      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">¿Eliminar este certificado?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Esta credencial será eliminada permanentemente del portfolio.
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
