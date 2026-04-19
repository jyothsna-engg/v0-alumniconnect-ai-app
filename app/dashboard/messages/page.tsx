import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MessagesPageClient } from "./messages-client"

export default async function MessagesPage() {
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

  // Get connections for the user
  const { data: connections } = await supabase
    .from("connections")
    .select(`
      id,
      mentor_id,
      mentors (
        id,
        name,
        initials,
        title,
        company
      )
    `)
    .eq("student_id", user.id)

  // Get messages
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("from_user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <MessagesPageClient
      profile={profile}
      connections={connections || []}
      messages={messages || []}
    />
  )
}
