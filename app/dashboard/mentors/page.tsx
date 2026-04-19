import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MentorsPageClient } from "./mentors-client"

export default async function MentorsPage() {
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

  const { data: mentors } = await supabase
    .from("mentors")
    .select("*")
    .order("match_score", { ascending: false })

  return (
    <MentorsPageClient
      mentors={mentors || []}
      userId={user.id}
      userName={profile?.name || ""}
    />
  )
}
