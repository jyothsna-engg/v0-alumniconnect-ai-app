"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Profile, Mentor, Job } from "@/lib/types"
import { StatCard } from "./stat-card"
import { MentorCard } from "./mentor-card"
import { JobCard } from "./job-card"
import { Users, Briefcase, MessageSquare, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

interface StudentDashboardProps {
  profile: Profile | null
}

export function StudentDashboard({ profile }: StudentDashboardProps) {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [stats, setStats] = useState({
    connections: 0,
    pendingRequests: 0,
    messages: 0,
    upcomingSessions: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Fetch mentors
      const { data: mentorsData } = await supabase
        .from("mentors")
        .select("*")
        .order("match_score", { ascending: false })
        .limit(3)

      // Fetch jobs
      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(3)

      // Fetch stats
      const [connectionsRes, requestsRes, messagesRes, sessionsRes] = await Promise.all([
        supabase.from("connections").select("id", { count: "exact" }).eq("student_id", profile?.id),
        supabase.from("connection_requests").select("id", { count: "exact" }).eq("student_id", profile?.id).eq("status", "pending"),
        supabase.from("messages").select("id", { count: "exact" }).eq("from_user_id", profile?.id),
        supabase.from("session_requests").select("id", { count: "exact" }).eq("student_id", profile?.id).eq("status", "accepted"),
      ])

      setMentors(mentorsData || [])
      setJobs(jobsData || [])
      setStats({
        connections: connectionsRes.count || 0,
        pendingRequests: requestsRes.count || 0,
        messages: messagesRes.count || 0,
        upcomingSessions: sessionsRes.count || 0,
      })
      setLoading(false)
    }

    if (profile?.id) {
      fetchData()
    }
  }, [profile?.id])

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
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {profile?.name?.split(" ")[0] || "Student"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {"Here's what's happening with your alumni network today."}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Mentor Connections"
          value={stats.connections}
          icon={Users}
          description="Active mentorships"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={Calendar}
          description="Awaiting response"
        />
        <StatCard
          title="Messages Sent"
          value={stats.messages}
          icon={MessageSquare}
          description="Total conversations"
        />
        <StatCard
          title="Upcoming Sessions"
          value={stats.upcomingSessions}
          icon={Calendar}
          description="Scheduled meetings"
        />
      </div>

      {/* Recommended Mentors */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recommended Mentors</h2>
          <Link
            href="/dashboard/mentors"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {mentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                userId={profile?.id || ""}
                userName={profile?.name || ""}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No mentors available yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Check back later for mentor recommendations.</p>
          </div>
        )}
      </div>

      {/* Latest Job Opportunities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Latest Job Opportunities</h2>
          <Link
            href="/dashboard/jobs"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                userId={profile?.id || ""}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No job opportunities available yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Check back later for new openings.</p>
          </div>
        )}
      </div>
    </div>
  )
}
