"use client"

import { useState } from "react"
import { Mentor } from "@/lib/types"
import { MessageSquare, UserPlus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface MentorCardProps {
  mentor: Mentor
  userId: string
  userName: string
  onConnect?: () => void
}

export function MentorCard({ mentor, userId, userName, onConnect }: MentorCardProps) {
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)

  async function handleConnect() {
    setLoading(true)
    const supabase = createClient()
    
    const { error } = await supabase.from("connection_requests").insert({
      student_id: userId,
      mentor_id: mentor.id,
      student_name: userName,
      status: "pending",
    })

    if (!error) {
      setConnected(true)
      onConnect?.()
    }
    setLoading(false)
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-semibold text-primary">{mentor.initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-card-foreground truncate">{mentor.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{mentor.title}</p>
              <p className="text-sm text-muted-foreground">{mentor.company}</p>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 rounded-full flex-shrink-0">
              <span className="text-xs font-medium text-accent">{mentor.match_score}% Match</span>
            </div>
          </div>
          {mentor.bio && (
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{mentor.bio}</p>
          )}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleConnect}
              disabled={loading || connected}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-4 h-4" />
              {connected ? "Request Sent" : loading ? "Connecting..." : "Connect"}
            </button>
            <button className="px-3 py-2 border border-border rounded-lg text-card-foreground hover:bg-secondary transition-colors">
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
