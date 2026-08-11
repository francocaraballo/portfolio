import { getPersonalInfo, getProjects, getExperiences, getCertificates } from "@/lib/dal/portfolio"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata = {
  title: "Admin Panel | Portfolio",
  description: "Panel de administración y gestión del portfolio profesional.",
}

export default async function AdminPage() {
  // Fetch all data in parallel to avoid waterfalls (async-parallel rule)
  const [personalInfo, projects, experiences, certificates] = await Promise.all([
    getPersonalInfo(),
    getProjects(),
    getExperiences(),
    getCertificates(),
  ])

  return (
    <AdminDashboard
      personalInfo={personalInfo}
      projects={projects}
      experiences={experiences}
      certificates={certificates}
    />
  )
}
