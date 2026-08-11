"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { Lock, Mail, ArrowRight, ShieldCheck, Loader2, ArrowLeft, AlertCircle } from "lucide-react"

interface AuthErrorState {
  title: string
  description: string
  code?: string
  status?: number
  type: "config" | "credentials" | "unconfirmed" | "server" | "unknown"
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorState, setErrorState] = useState<AuthErrorState | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setErrorState({
        title: "Advertencia de Configuración (401)",
        description:
          "Las variables de entorno de Supabase en .env contienen valores de prueba ('your-anon-key'). El inicio de sesión retornará error 401 hasta configurar la clave anon real.",
        code: "invalid_api_key",
        status: 401,
        type: "config",
      })
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorState(null)

    if (!email || !password) {
      toast.error("Por favor completá todos los campos")
      return
    }

    if (!isSupabaseConfigured()) {
      const configError: AuthErrorState = {
        title: "Error 401: Supabase No Configurado",
        description:
          "No se puede autenticar porque NEXT_PUBLIC_SUPABASE_ANON_KEY en .env tiene el valor por defecto ('your-anon-key'). Configurá tus credenciales reales en .env.",
        code: "invalid_api_key",
        status: 401,
        type: "config",
      }
      setErrorState(configError)
      toast.error(configError.title, { description: configError.description })
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        const message = error.message || ""
        const code = (error as any).code || (error as any).name || ""
        const status = error.status || 401

        let title = "Error de Autenticación"
        let description = message || "Ocurrió un error inesperado al intentar iniciar sesión."
        let errorType: AuthErrorState["type"] = "unknown"

        const msgLower = message.toLowerCase()
        const codeLower = String(code).toLowerCase()

        if (
          msgLower.includes("invalid login credentials") ||
          codeLower.includes("invalid_credentials") ||
          msgLower.includes("invalid email or password")
        ) {
          title = "Credenciales Inválidas (Error 401)"
          description = "El correo electrónico o la contraseña ingresados son incorrectos. Verificá los datos e intentalo nuevamente."
          errorType = "credentials"
        } else if (
          msgLower.includes("email not confirmed") ||
          codeLower.includes("email_not_confirmed")
        ) {
          title = "Email No Confirmado (Error 401)"
          description = "Tu casilla de correo aún no fue confirmada. Revisá tu email o confirmá el usuario manualmente desde el Supabase Dashboard (Auth -> Users)."
          errorType = "unconfirmed"
        } else if (
          msgLower.includes("apikey") ||
          msgLower.includes("api key") ||
          msgLower.includes("jwt") ||
          status === 401
        ) {
          title = "Error de Autorización Supabase (HTTP 401)"
          description = `Supabase rechazó la petición (401 Unauthorized): ${message || "Clave API pública inválida o token expirado"}. Revisá NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.`
          errorType = "config"
        } else {
          title = `Error de Inicio de Sesión (${status})`
          description = message
          errorType = "server"
        }

        setErrorState({
          title,
          description,
          code: String(code),
          status,
          type: errorType,
        })
        toast.error(title, { description })
        setIsLoading(false)
        return
      }

      toast.success("¡Bienvenido al Panel Admin!")
      router.push("/admin")
      router.refresh()
    } catch (err: any) {
      const unhandledError: AuthErrorState = {
        title: "Error inesperado al iniciar sesión",
        description: err?.message || "Ocurrió una falla en la conexión.",
        type: "unknown",
      }
      setErrorState(unhandledError)
      toast.error(unhandledError.title)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden font-sans">
      {/* Ambient background glow — aligned with hero section */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/4" />

      {/* Back to site link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all duration-300 bg-card/40 backdrop-blur-2xl border border-border/40 px-4 py-2 rounded-full hover:border-border/80 hover:bg-card/70"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al sitio principal
        </Link>
      </div>

      <Card className="w-full max-w-md bg-card/60 backdrop-blur-2xl border-border/40 shadow-2xl shadow-background/80 text-foreground animate-fade-up">
        <CardHeader className="space-y-3 text-center pb-6 border-b border-border/40">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="font-heading text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              Panel de Administración
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm font-light mt-1.5">
              Ingresá tus credenciales para administrar el Portfolio
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4 pt-6">
            {errorState && (
              <Alert
                variant="destructive"
                className="bg-destructive/10 border-destructive/30 text-destructive-foreground backdrop-blur-sm shadow-md"
              >
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                <div>
                  <AlertTitle className="font-semibold text-sm">
                    {errorState.title}
                  </AlertTitle>
                  <AlertDescription className="text-muted-foreground text-xs mt-1 leading-relaxed">
                    {errorState.description}
                    {errorState.code && (
                      <span className="block mt-1.5 font-mono text-[11px] text-destructive/90 bg-destructive/20 px-2 py-0.5 rounded border border-destructive/30 w-fit">
                        Código Supabase: {errorState.code} {errorState.status ? `(Status HTTP ${errorState.status})` : ""}
                      </span>
                    )}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.15em]">
                Correo Electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@tuportfolio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background/80 border-border/50 text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-primary/40 focus-visible:border-primary/60 font-sans transition-all duration-300"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.15em]">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-background/80 border-border/50 text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-primary/40 focus-visible:border-primary/60 font-sans transition-all duration-300"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-4 pb-6 flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all duration-300 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Iniciando sesión...
                </>
              ) : (
                <>
                  Ingresar al Dashboard
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

