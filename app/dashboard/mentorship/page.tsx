import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MentorshipPageClient } from "./mentorship-client"

export default async function MentorshipPage() {
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

  if (profile?.role !== "alumni") {
    redirect("/dashboard")
  }

  // Check if alumni has a mentor profile
  const { data: mentor } = await supabase
    .from("mentors")
    .select("*")
    .eq("user_id", user.id)
    .single()

  // Get mentees (connected students)
  let mentees: { id: string; student_id: string; profiles: { name: string; email: string } | null }[] = []
  if (mentor) {
    const { data: connections } = await supabase
      .from("connections")
      .select(`
        id,
        student_id,
        profiles!connections_student_id_fkey (
          name,
          email
        )
      `)
      .eq("mentor_id", mentor.id)

    mentees = connections || []
  }

  return (
    <MentorshipPageClient
      profile={profile}
      mentor={mentor}
      mentees={mentees}
    />
  )
}
