"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Profile, ConnectionRequest, Job } from "@/lib/types"
import { StatCard } from "./stat-card"
import { Users, Briefcase, UserPlus, CheckCircle, XCircle, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

interface AlumniDashboardProps {
  profile: Profile | null
}

export function AlumniDashboard({ profile }: AlumniDashboardProps) {
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>([])
  const [myJobs, setMyJobs] = useState<Job[]>([])
  const [stats, setStats] = useState({
    totalMentees: 0,
    pendingRequests: 0,
    jobsPosted: 0,
    referralsGiven: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Get mentor profile for this alumni
      const { data: mentorData } = await supabase
        .from("mentors")
        .select("id")
        .eq("user_id", profile?.id)
        .single()

      if (mentorData) {
        // Fetch pending connection requests
        const { data: requestsData } = await supabase
          .from("connection_requests")
          .select("*")
          .eq("mentor_id", mentorData.id)
          .eq("status", "pending")

        // Fetch stats
        const [connectionsRes, requestsRes] = await Promise.all([
          supabase.from("connections").select("id", { count: "exact" }).eq("mentor_id", mentorData.id),
          supabase.from("connection_requests").select("id", { count: "exact" }).eq("mentor_id", mentorData.id).eq("status", "pending"),
        ])

        setPendingRequests(requestsData || [])
        setStats(prev => ({
          ...prev,
          totalMentees: connectionsRes.count || 0,
          pendingRequests: requestsRes.count || 0,
        }))
      }

      // Fetch jobs posted by this alumni
      const { data: jobsData, count: jobsCount } = await supabase
        .from("jobs")
        .select("*", { count: "exact" })
        .eq("posted_by", profile?.id)
        .order("created_at", { ascending: false })
        .limit(5)

      setMyJobs(jobsData || [])
      setStats(prev => ({
        ...prev,
        jobsPosted: jobsCount || 0,
        referralsGiven: profile?.referrals_given || 0,
      }))
      setLoading(false)
    }

    if (profile?.id) {
      fetchData()
    }
  }, [profile?.id, profile?.referrals_given])

  async function handleAcceptRequest(requestId: string, mentorId: string, studentId: string) {
    const supabase = createClient()

    // Update request status
    await supabase
      .from("connection_requests")
      .update({ status: "accepted" })
      .eq("id", requestId)

    // Create connection
    await supabase.from("connections").insert({
      student_id: studentId,
      mentor_id: mentorId,
    })

    setPendingRequests(prev => prev.filter(r => r.id !== requestId))
    setStats(prev => ({
      ...prev,
      pendingRequests: prev.pendingRequests - 1,
      totalMentees: prev.totalMentees + 1,
    }))
  }

  async function handleRejectRequest(requestId: string) {
    const supabase = createClient()

    await supabase
      .from("connection_requests")
      .update({ status: "rejected" })
      .eq("id", requestId)

    setPendingRequests(prev => prev.filter(r => r.id !== requestId))
    setStats(prev => ({
      ...prev,
      pendingRequests: prev.pendingRequests - 1,
    }))
  }

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
          Welcome back, {profile?.name?.split(" ")[0] || "Alumni"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your mentorship and help students grow.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Mentees"
          value={stats.totalMentees}
          icon={Users}
          description="Active connections"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={UserPlus}
          description="Awaiting response"
        />
        <StatCard
          title="Jobs Posted"
          value={stats.jobsPosted}
          icon={Briefcase}
          description="Active listings"
        />
        <StatCard
          title="Referrals Given"
          value={stats.referralsGiven}
          icon={CheckCircle}
          description="Students helped"
        />
      </div>

      {/* Pending Connection Requests */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Pending Connection Requests</h2>
        {pendingRequests.length > 0 ? (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {pendingRequests.map((request) => (
                <div key={request.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {request.student_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{request.student_name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id, request.mentor_id, request.student_id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-accent/20 text-accent rounded-lg text-sm font-medium hover:bg-accent/30 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-sm font-medium hover:bg-destructive/20 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No pending connection requests.</p>
          </div>
        )}
      </div>

      {/* My Posted Jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">My Posted Jobs</h2>
          <button
            onClick={() => router.push("/dashboard/jobs")}
            className="text-sm text-primary hover:underline"
          >
            View all jobs
          </button>
        </div>
        {myJobs.length > 0 ? (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {myJobs.map((job) => (
                <div key={job.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-card-foreground">{job.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.company} - {job.location}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    job.is_active
                      ? "bg-accent/20 text-accent"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {job.is_active ? "Active" : "Closed"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">{"You haven't posted any jobs yet."}</p>
            <button
              onClick={() => router.push("/dashboard/jobs")}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Post a Job
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
