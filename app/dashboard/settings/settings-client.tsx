"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Profile } from "@/lib/types"
import { User, Building, FileText, Save } from "lucide-react"

interface SettingsPageClientProps {
  profile: Profile | null
}

export function SettingsPageClient({ profile }: SettingsPageClientProps) {
  const [name, setName] = useState(profile?.name || "")
  const [title, setTitle] = useState(profile?.title || "")
  const [company, setCompany] = useState(profile?.company || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  async function handleSave() {
    if (!profile) return
    setLoading(true)
    setSaved(false)

    const supabase = createClient()
    await supabase
      .from("profiles")
      .update({
        name,
        title,
        company,
        bio,
      })
      .eq("id", profile.id)

    setLoading(false)
    setSaved(true)
    router.refresh()

    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile and account preferences.
        </p>
      </div>

      {/* Profile Settings */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-6">Profile Information</h2>

        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-primary">
                {name.split(" ").map(n => n[0]).join("").slice(0, 2) || "?"}
              </span>
            </div>
            <div>
              <p className="font-medium text-card-foreground">{name || "Your Name"}</p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full capitalize">
                {profile?.role || "student"}
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Job Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Software Engineer"
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Company
                </label>
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
                placeholder="Tell others about yourself..."
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
            {saved && (
              <span className="text-sm text-accent">Changes saved successfully!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
