"use client"

import { useState, useTransition } from "react"
import { seedDatabaseAction, type SeedResult } from "@/lib/actions/seed"
import { Button } from "@/components/ui/button"
import { Database, RefreshCw, Sparkles, CheckCircle2, AlertCircle } from "lucide-react"

export function SeedDataButton() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<SeedResult | null>(null)

  const handleSeed = () => {
    setResult(null)
    startTransition(async () => {
      const res = await seedDatabaseAction()
      setResult(res)
    })
  }

  return (
    <div className="p-5 rounded-2xl bg-card/40 border border-border/40 backdrop-blur-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 mt-0.5">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
              Importar Datos Iniciales (Seed)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider font-semibold">
                Estáticos
              </span>
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Poblá o sincronizá la base de datos de Supabase con los datos del archivo local <code className="text-primary font-mono text-[11px]">portfolio-data.ts</code>.
            </p>
          </div>
        </div>

        <Button
          onClick={handleSeed}
          disabled={isPending}
          variant="outline"
          className="shrink-0 bg-primary/10 border-primary/30 hover:bg-primary hover:text-primary-foreground text-primary transition-all duration-300 font-medium text-xs gap-2"
        >
          {isPending ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Sincronizando DB...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Sembrar / Importar datos
            </>
          )}
        </Button>
      </div>

      {/* Action feedback */}
      {result && (
        <div
          className={`p-4 rounded-xl text-xs flex flex-col gap-2 transition-all animate-fade-in ${
            result.success
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-destructive/10 border border-destructive/30 text-destructive-foreground"
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            {result.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
            )}
            <span>{result.message || result.error}</span>
          </div>

          {result.success && result.stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-500/20 text-[11px]">
              <div>
                <span className="text-muted-foreground">Perfil: </span>
                <strong className="text-foreground">{result.stats.profilesSeeded} actualizados</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Proyectos: </span>
                <strong className="text-foreground">+{result.stats.projectsSeeded} insertados</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Experiencias: </span>
                <strong className="text-foreground">+{result.stats.experiencesSeeded} insertadas</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Certificados: </span>
                <strong className="text-foreground">+{result.stats.certificatesSeeded} insertados</strong>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
