"use client"

import type { PersonalInfo, Project, Experience, Certificate } from "@/types/portfolio"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ProfileManager } from "./profile-manager"
import { ProjectsManager } from "./projects-manager"
import { ExperiencesManager } from "./experiences-manager"
import { CertificatesManager } from "./certificates-manager"
import { SeedDataButton } from "./seed-button"
import { User, FolderKanban, Briefcase, Award, Sparkles, CheckCircle2 } from "lucide-react"

interface AdminDashboardProps {
  personalInfo: PersonalInfo
  projects: Project[]
  experiences: Experience[]
  certificates: Certificate[]
}

export function AdminDashboard({
  personalInfo,
  projects,
  experiences,
  certificates,
}: AdminDashboardProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner & Quick Metrics */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-card/60 border border-border/40 backdrop-blur-2xl shadow-xl relative overflow-hidden animate-fade-up">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/[0.05] rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-medium tracking-[0.2em] uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Panel de Control Activo
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Bienvenido, {personalInfo.name || "Administrador"}
            </h2>
            <p className="text-sm text-muted-foreground font-light max-w-2xl leading-relaxed">
              Gestioná todos los contenidos de tu portfolio profesional en tiempo real con Supabase Auth & Storage.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/40 border-border/40 backdrop-blur-xl hover:border-border/70 hover:bg-card/60 transition-all duration-300 group">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Proyectos Totales</p>
                <h3 className="font-heading text-3xl font-extrabold text-foreground mt-1 group-hover:text-primary transition-colors">{projects.length}</h3>
              </div>
              <div className="p-3.5 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                <FolderKanban className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/40 border-border/40 backdrop-blur-xl hover:border-border/70 hover:bg-card/60 transition-all duration-300 group">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Experiencias</p>
                <h3 className="font-heading text-3xl font-extrabold text-foreground mt-1 group-hover:text-primary transition-colors">{experiences.length}</h3>
              </div>
              <div className="p-3.5 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/40 border-border/40 backdrop-blur-xl hover:border-border/70 hover:bg-card/60 transition-all duration-300 group">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Certificados</p>
                <h3 className="font-heading text-3xl font-extrabold text-foreground mt-1 group-hover:text-primary transition-colors">{certificates.length}</h3>
              </div>
              <div className="p-3.5 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/40 border-border/40 backdrop-blur-xl hover:border-border/70 hover:bg-card/60 transition-all duration-300 group">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Estado Perfil</p>
                <h3 className="text-xs font-semibold text-emerald-400 mt-2 flex items-center gap-1.5 uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4" /> Configurado
                </h3>
              </div>
              <div className="p-3.5 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                <User className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Importar / Sembrar Datos Estáticos */}
        <SeedDataButton />
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="perfil" className="w-full space-y-6">
        <TabsList className="bg-card/40 border border-border/40 p-1.5 rounded-xl w-full grid grid-cols-2 md:grid-cols-4 h-auto backdrop-blur-md">
          <TabsTrigger
            value="perfil"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-heading text-xs font-bold uppercase tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md shadow-primary/10 data-[state=inactive]:text-muted-foreground hover:data-[state=inactive]:text-foreground"
          >
            <User className="w-4 h-4" /> Perfil
          </TabsTrigger>
          <TabsTrigger
            value="proyectos"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-heading text-xs font-bold uppercase tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md shadow-primary/10 data-[state=inactive]:text-muted-foreground hover:data-[state=inactive]:text-foreground"
          >
            <FolderKanban className="w-4 h-4" /> Proyectos ({projects.length})
          </TabsTrigger>
          <TabsTrigger
            value="experiencia"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-heading text-xs font-bold uppercase tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md shadow-primary/10 data-[state=inactive]:text-muted-foreground hover:data-[state=inactive]:text-foreground"
          >
            <Briefcase className="w-4 h-4" /> Experiencia ({experiences.length})
          </TabsTrigger>
          <TabsTrigger
            value="certificados"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-heading text-xs font-bold uppercase tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md shadow-primary/10 data-[state=inactive]:text-muted-foreground hover:data-[state=inactive]:text-foreground"
          >
            <Award className="w-4 h-4" /> Certificados ({certificates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="focus-visible:outline-none animate-fade-in">
          <ProfileManager initialData={personalInfo} />
        </TabsContent>

        <TabsContent value="proyectos" className="focus-visible:outline-none animate-fade-in">
          <ProjectsManager initialData={projects} />
        </TabsContent>

        <TabsContent value="experiencia" className="focus-visible:outline-none animate-fade-in">
          <ExperiencesManager initialData={experiences} />
        </TabsContent>

        <TabsContent value="certificados" className="focus-visible:outline-none animate-fade-in">
          <CertificatesManager initialData={certificates} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
