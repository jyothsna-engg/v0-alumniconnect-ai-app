import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar 
        user={{
          id: user.id,
          name: profile?.name || user.email?.split("@")[0] || "User",
          email: user.email || "",
          role: profile?.role || "student",
        }} 
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
