"use client"

import type { PersonalInfo, Project, Experience, Certificate } from "@/types/portfolio"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ProfileManager } from "./profile-manager"
import { ProjectsManager } from "./projects-manager"
import { ExperiencesManager } from "./experiences-manager"
import { CertificatesManager } from "./certificates-manager"
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
    <div className="space-y-8">
      {/* Top Banner & Quick Metrics */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-1 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> FASE 3: Panel de Control Activo
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bienvenido, {personalInfo.name || "Administrador"}
            </h2>
            <p className="text-sm text-slate-400">
              Gestioná todos los contenidos del portfolio en tiempo real con Supabase Auth & Storage.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-md">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Proyectos Totales</p>
                <h3 className="text-2xl font-bold text-white mt-1">{projects.length}</h3>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <FolderKanban className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-md">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Experiencias</p>
                <h3 className="text-2xl font-bold text-white mt-1">{experiences.length}</h3>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-md">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Certificados</p>
                <h3 className="text-2xl font-bold text-white mt-1">{certificates.length}</h3>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Award className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-md">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Estado Perfil</p>
                <h3 className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Configurado
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <User className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="perfil" className="w-full space-y-6">
        <TabsList className="bg-slate-900/80 border border-slate-800 p-1 rounded-xl w-full grid grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger
            value="perfil"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <User className="w-4 h-4" /> Perfil
          </TabsTrigger>
          <TabsTrigger
            value="proyectos"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <FolderKanban className="w-4 h-4" /> Proyectos ({projects.length})
          </TabsTrigger>
          <TabsTrigger
            value="experiencia"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <Briefcase className="w-4 h-4" /> Experiencia ({experiences.length})
          </TabsTrigger>
          <TabsTrigger
            value="certificados"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <Award className="w-4 h-4" /> Certificados ({certificates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="focus-visible:outline-none">
          <ProfileManager initialData={personalInfo} />
        </TabsContent>

        <TabsContent value="proyectos" className="focus-visible:outline-none">
          <ProjectsManager initialData={projects} />
        </TabsContent>

        <TabsContent value="experiencia" className="focus-visible:outline-none">
          <ExperiencesManager initialData={experiences} />
        </TabsContent>

        <TabsContent value="certificados" className="focus-visible:outline-none">
          <CertificatesManager initialData={certificates} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
