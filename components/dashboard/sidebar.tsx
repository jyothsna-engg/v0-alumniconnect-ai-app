"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  Briefcase,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  UserPlus,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface DashboardSidebarProps {
  user: User
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const studentLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/mentors", label: "Find Mentors", icon: Users },
    { href: "/dashboard/jobs", label: "Job Board", icon: Briefcase },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  ]

  const alumniLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/mentorship", label: "Mentorship", icon: UserPlus },
    { href: "/dashboard/jobs", label: "Job Board", icon: Briefcase },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  ]

  const adminLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/users", label: "Users", icon: Users },
    { href: "/dashboard/jobs", label: "Job Board", icon: Briefcase },
  ]

  const links = user.role === "admin" ? adminLinks : user.role === "alumni" ? alumniLinks : studentLinks

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 border-r border-sidebar-border`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">AlumniConnect</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-9 h-9 bg-sidebar-primary rounded-lg flex items-center justify-center mx-auto">
            <GraduationCap className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-md hover:bg-sidebar-accent transition-colors ${collapsed ? "mx-auto mt-2" : ""}`}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{link.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-sidebar-border">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>

        {!collapsed && (
          <div className="mt-3 px-3 py-2 bg-sidebar-accent rounded-lg">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-sidebar-primary/20 text-sidebar-primary text-xs rounded-full capitalize">
              {user.role}
            </span>
          </div>
        )}
      </div>
    </aside>
  )
}
