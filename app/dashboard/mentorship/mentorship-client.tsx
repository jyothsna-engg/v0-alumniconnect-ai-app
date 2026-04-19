"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Profile, Mentor } from "@/lib/types"
import { Users, UserPlus, Edit, Check } from "lucide-react"

interface Mentee {
  id: string
  student_id: string
  profiles: {
    name: string
    email: string
  } | null
}

interface MentorshipPageClientProps {
  profile: Profile | null
  mentor: Mentor | null
  mentees: Mentee[]
}

export function MentorshipPageClient({ profile, mentor, mentees }: MentorshipPageClientProps) {
  const [isEditing, setIsEditing] = useState(!mentor)
  const [title, setTitle] = useState(mentor?.title || profile?.title || "")
  const [company, setCompany] = useState(mentor?.company || profile?.company || "")
  const [bio, setBio] = useState(mentor?.bio || profile?.bio || "")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSaveMentorProfile() {
    if (!profile) return
    setLoading(true)

    const supabase = createClient()
    const initials = profile.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()

    if (mentor) {
      // Update existing mentor profile
      await supabase
        .from("mentors")
        .update({
          title,
          company,
          bio,
        })
        .eq("id", mentor.id)
    } else {
      // Create new mentor profile
      await supabase.from("mentors").insert({
        user_id: profile.id,
        name: profile.name,
        initials,
        title,
        company,
        bio,
        match_score: 85,
      })
    }

    setLoading(false)
    setIsEditing(false)
    router.refresh()
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Mentorship</h1>
        <p className="text-muted-foreground mt-1">
          Manage your mentor profile and connect with students.
        </p>
      </div>

      {/* Mentor Profile Card */}
      <div className="bg-card rounded-xl border border-border p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-card-foreground">Mentor Profile</h2>
          {mentor && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g., Google"
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Tell students about yourself, your experience, and how you can help them..."
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              />
            </div>
            <div className="flex gap-3">
              {mentor && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 border border-input rounded-lg text-foreground font-medium hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSaveMentorProfile}
                disabled={loading || !title || !company}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                {loading ? "Saving..." : mentor ? "Save Changes" : "Create Profile"}
              </button>
            </div>
          </div>
        ) : mentor ? (
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-semibold text-primary">{mentor.initials}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">{mentor.name}</h3>
              <p className="text-muted-foreground">{mentor.title} at {mentor.company}</p>
              {mentor.bio && (
                <p className="text-sm text-muted-foreground mt-2">{mentor.bio}</p>
              )}
              <div className="flex items-center gap-1 mt-3 px-2 py-1 bg-accent/10 rounded-full w-fit">
                <span className="text-xs font-medium text-accent">{mentor.match_score}% Match Score</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Mentees */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Your Mentees ({mentees.length})
        </h2>
        {mentees.length > 0 ? (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {mentees.map((mentee) => (
                <div key={mentee.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {mentee.profiles?.name.split(" ").map(n => n[0]).join("").slice(0, 2) || "??"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{mentee.profiles?.name || "Unknown"}</p>
                      <p className="text-sm text-muted-foreground">{mentee.profiles?.email}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full">
                    Connected
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No mentees connected yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              {mentor
                ? "Students will connect with you once they find your profile."
                : "Create your mentor profile above to start receiving connection requests."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
