"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { StatCard } from "@/components/dashboard/stat-card"
import { TrendingUp, Users, Briefcase, Award, Target, Clock } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts"

export function AnalyticsPageClient() {
  const [stats, setStats] = useState({
    placementRate: 0,
    avgResponseTime: 0,
    successfulReferrals: 0,
    activeConnections: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const [referralsRes, connectionsRes] = await Promise.all([
        supabase.from("referrals").select("id", { count: "exact" }).eq("status", "completed"),
        supabase.from("connections").select("id", { count: "exact" }),
      ])

      setStats({
        placementRate: 78,
        avgResponseTime: 2.4,
        successfulReferrals: referralsRes.count || 0,
        activeConnections: connectionsRes.count || 0,
      })
      setLoading(false)
    }

    fetchData()
  }, [])

  const monthlyPlacements = [
    { month: "Jan", placements: 45, referrals: 12 },
    { month: "Feb", placements: 52, referrals: 19 },
    { month: "Mar", placements: 48, referrals: 15 },
    { month: "Apr", placements: 70, referrals: 25 },
    { month: "May", placements: 61, referrals: 22 },
    { month: "Jun", placements: 85, referrals: 30 },
  ]

  const industryDistribution = [
    { industry: "Tech", count: 145 },
    { industry: "Finance", count: 89 },
    { industry: "Healthcare", count: 56 },
    { industry: "Consulting", count: 78 },
    { industry: "Education", count: 34 },
  ]

  const engagementData = [
    { week: "Week 1", students: 120, alumni: 45 },
    { week: "Week 2", students: 145, alumni: 52 },
    { week: "Week 3", students: 132, alumni: 48 },
    { week: "Week 4", students: 168, alumni: 61 },
  ]

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Detailed insights and metrics for the AlumniConnect platform.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Placement Rate"
          value={`${stats.placementRate}%`}
          icon={Target}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Avg Response Time"
          value={`${stats.avgResponseTime} days`}
          icon={Clock}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Successful Referrals"
          value={stats.successfulReferrals}
          icon={Award}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Active Connections"
          value={stats.activeConnections}
          icon={Users}
          trend={{ value: 22, isPositive: true }}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Placements Over Time */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Placements & Referrals</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyPlacements}>
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
                <Area
                  type="monotone"
                  dataKey="placements"
                  stackId="1"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="referrals"
                  stackId="2"
                  stroke="hsl(var(--accent))"
                  fill="hsl(var(--accent))"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry Distribution */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Industry Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="industry" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Engagement Trends */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Weekly Engagement</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="students"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
              <Line
                type="monotone"
                dataKey="alumni"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--accent))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
