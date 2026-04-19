"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Profile } from "@/lib/types"
import { StatCard } from "./stat-card"
import { Users, GraduationCap, Briefcase, TrendingUp, UserCheck, UserPlus } from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

interface AdminDashboardProps {
  profile: Profile | null
}

export function AdminDashboard({ profile }: AdminDashboardProps) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAlumni: 0,
    totalMentors: 0,
    activeJobs: 0,
    totalConnections: 0,
    pendingRequests: 0,
  })
  const [recentUsers, setRecentUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Fetch all stats in parallel
      const [
        studentsRes,
        alumniRes,
        mentorsRes,
        jobsRes,
        connectionsRes,
        requestsRes,
        recentUsersRes,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact" }).eq("role", "student"),
        supabase.from("profiles").select("id", { count: "exact" }).eq("role", "alumni"),
        supabase.from("mentors").select("id", { count: "exact" }),
        supabase.from("jobs").select("id", { count: "exact" }).eq("is_active", true),
        supabase.from("connections").select("id", { count: "exact" }),
        supabase.from("connection_requests").select("id", { count: "exact" }).eq("status", "pending"),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(5),
      ])

      setStats({
        totalStudents: studentsRes.count || 0,
        totalAlumni: alumniRes.count || 0,
        totalMentors: mentorsRes.count || 0,
        activeJobs: jobsRes.count || 0,
        totalConnections: connectionsRes.count || 0,
        pendingRequests: requestsRes.count || 0,
      })
      setRecentUsers(recentUsersRes.data || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  const placementData = [
    { month: "Jan", placements: 12 },
    { month: "Feb", placements: 19 },
    { month: "Mar", placements: 15 },
    { month: "Apr", placements: 25 },
    { month: "May", placements: 22 },
    { month: "Jun", placements: 30 },
  ]

  const userDistribution = [
    { name: "Students", value: stats.totalStudents, color: "hsl(var(--chart-1))" },
    { name: "Alumni", value: stats.totalAlumni, color: "hsl(var(--chart-2))" },
  ]

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of the AlumniConnect platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard
          title="Students"
          value={stats.totalStudents}
          icon={GraduationCap}
        />
        <StatCard
          title="Alumni"
          value={stats.totalAlumni}
          icon={Users}
        />
        <StatCard
          title="Mentors"
          value={stats.totalMentors}
          icon={UserCheck}
        />
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon={Briefcase}
        />
        <StatCard
          title="Connections"
          value={stats.totalConnections}
          icon={TrendingUp}
        />
        <StatCard
          title="Pending"
          value={stats.pendingRequests}
          icon={UserPlus}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Placement Trends */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Placement Trends</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={placementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="placements" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">User Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Users</h2>
          <Link href="/dashboard/users" className="text-sm text-primary hover:underline">
            View all users
          </Link>
        </div>
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <span className="font-medium text-card-foreground">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                      user.role === "admin"
                        ? "bg-destructive/10 text-destructive"
                        : user.role === "alumni"
                        ? "bg-accent/20 text-accent"
                        : "bg-primary/10 text-primary"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
