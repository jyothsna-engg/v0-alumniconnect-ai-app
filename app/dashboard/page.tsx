import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StudentDashboard } from "@/components/dashboard/student-dashboard"
import { AlumniDashboard } from "@/components/dashboard/alumni-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const role = profile?.role || "student"

  if (role === "admin") {
    return <AdminDashboard profile={profile} />
  }

  if (role === "alumni") {
    return <AlumniDashboard profile={profile} />
  }

  return <StudentDashboard profile={profile} />
}
