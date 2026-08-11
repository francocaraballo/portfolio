import {
  getPersonalInfo,
  getProjects,
  getCertificates,
  getExperiences,
  getNavLinks,
} from "@/lib/dal/portfolio"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ProjectsSection } from "@/components/projects-section"
import { ExperienceSection } from "@/components/experience-section"
import { CertificatesSection } from "@/components/certificates-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export const revalidate = 0
export const dynamic = "force-dynamic"

export default async function Home() {
  const [personalInfo, projects, certificates, experiences, navLinks] =
    await Promise.all([
      getPersonalInfo(),
      getProjects(),
      getCertificates(),
      getExperiences(),
      getNavLinks(),
    ])

  return (
    <>
      <Navbar navLinks={navLinks} personalInfo={personalInfo} />
      <main>
        <HeroSection personalInfo={personalInfo} />
        <ProjectsSection projects={projects} />
        <ExperienceSection experiences={experiences} />
        <CertificatesSection certificates={certificates} />
        <ContactSection />
      </main>
      <Footer navLinks={navLinks} personalInfo={personalInfo} />
    </>
  )
}


