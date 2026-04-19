import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { JobsPageClient } from "./jobs-client"

export default async function JobsPage() {
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

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (
    <JobsPageClient
      jobs={jobs || []}
      userId={user.id}
      userRole={profile?.role || "student"}
    />
  )
}
