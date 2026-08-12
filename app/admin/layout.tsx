"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { ExternalLink, LogOut, Shield } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  // Si estamos en la página de login, renderizar sin header ni layout admin
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      toast.success("Sesión cerrada correctamente")
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      toast.error("Error al cerrar sesión")
    }
  }

  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col font-sans relative overflow-x-hidden">
      {/* Ambient background glow — matching main landing page */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[140px] pointer-events-none -z-10 translate-x-1/3 -translate-y-1/4" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-primary/[0.02] rounded-full blur-[120px] pointer-events-none -z-10 -translate-x-1/3 translate-y-1/4" />

      {/* Header Admin */}
      <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/60 backdrop-blur-2xl px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-lg leading-none text-foreground tracking-tight">
              Admin Panel<span className="text-primary">.</span>
            </h1>
            <p className="text-[11px] text-muted-foreground mt-0.5 font-light tracking-wide uppercase">Gestión integral del portfolio</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-border/40 bg-card/40 hover:bg-card text-muted-foreground hover:text-foreground text-xs uppercase tracking-wider font-medium transition-all duration-300"
          >
            <Link href="/" target="_blank" className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Sitio Principal</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-1 ring-primary/30 hover:ring-primary/60 transition-all p-0">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/15 text-primary font-heading font-bold text-xs">AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-2xl border-border/40 text-foreground" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold font-heading text-foreground">Administrador</p>
                  <p className="text-xs text-muted-foreground truncate">Sesión activa</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/40" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer flex items-center gap-2 text-xs font-medium"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        {children}
      </main>
    </div>
  )
}
