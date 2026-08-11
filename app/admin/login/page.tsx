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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 relative overflow-hidden">
      {/* Glow shapes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to site link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors bg-slate-900/60 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al sitio principal
        </Link>
      </div>

      <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl shadow-primary/5 text-slate-100">
        <CardHeader className="space-y-3 text-center pb-6 border-b border-slate-800/80">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Panel de Administración
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm mt-1">
              Ingresá tus credenciales para administrar el Portfolio
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4 pt-6">
            {errorState && (
              <Alert
                variant="destructive"
                className="bg-red-950/40 border-red-900/60 text-red-200 backdrop-blur-sm shadow-md"
              >
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <AlertTitle className="font-semibold text-red-200 text-sm">
                    {errorState.title}
                  </AlertTitle>
                  <AlertDescription className="text-red-300/90 text-xs mt-1 leading-relaxed">
                    {errorState.description}
                    {errorState.code && (
                      <span className="block mt-1.5 font-mono text-[11px] text-red-400/80 bg-red-950/60 px-2 py-0.5 rounded border border-red-900/40 w-fit">
                        Código Supabase: {errorState.code} {errorState.status ? `(Status HTTP ${errorState.status})` : ""}
                      </span>
                    )}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                Correo Electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@tuportfolio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-primary focus-visible:border-primary"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-primary focus-visible:border-primary"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-4 pb-6 flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25 transition-all group"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Iniciando sesión...
                </>
              ) : (
                <>
                  Ingresar al Dashboard
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

