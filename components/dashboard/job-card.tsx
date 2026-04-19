"use client"

import { useState } from "react"
import { Job } from "@/lib/types"
import { MapPin, Clock, Send } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface JobCardProps {
  job: Job
  userId: string
  showReferralButton?: boolean
  onRequestReferral?: () => void
}

export function JobCard({ job, userId, showReferralButton = true, onRequestReferral }: JobCardProps) {
  const [loading, setLoading] = useState(false)
  const [requested, setRequested] = useState(false)

  async function handleRequestReferral() {
    setLoading(true)
    const supabase = createClient()
    
    const { error } = await supabase.from("referrals").insert({
      user_id: userId,
      job_id: job.id,
      status: "requested",
    })

    if (!error) {
      setRequested(true)
      onRequestReferral?.()
    }
    setLoading(false)
  }

  const createdDate = new Date(job.created_at)
  const daysAgo = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
  const timeAgo = daysAgo === 0 ? "Today" : daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground">{job.title}</h3>
          <p className="text-sm text-primary font-medium mt-1">{job.company}</p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {timeAgo}
            </span>
          </div>
          {job.description && (
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{job.description}</p>
          )}
        </div>
      </div>
      {showReferralButton && (
        <div className="mt-4 pt-4 border-t border-border">
          <button
            onClick={handleRequestReferral}
            disabled={loading || requested}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {requested ? "Referral Requested" : loading ? "Requesting..." : "Request Referral"}
          </button>
        </div>
      )}
    </div>
  )
}
