"use client"

import { useState } from "react"
import { Mentor } from "@/lib/types"
import { MentorCard } from "@/components/dashboard/mentor-card"
import { Search, Users } from "lucide-react"

interface MentorsPageClientProps {
  mentors: Mentor[]
  userId: string
  userName: string
}

export function MentorsPageClient({ mentors, userId, userName }: MentorsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "high-match">("all")

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filter === "all" || mentor.match_score >= 80

    return matchesSearch && matchesFilter
  })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Find Mentors</h1>
        <p className="text-muted-foreground mt-1">
          Connect with alumni mentors who can guide your career journey.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, title, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-input text-foreground hover:bg-secondary"
            }`}
          >
            All Mentors
          </button>
          <button
            onClick={() => setFilter("high-match")}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              filter === "high-match"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-input text-foreground hover:bg-secondary"
            }`}
          >
            High Match (80%+)
          </button>
        </div>
      </div>

      {/* Mentors Grid */}
      {filteredMentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              userId={userId}
              userName={userName}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No mentors found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search or filter criteria."
              : "No mentors are available at the moment."}
          </p>
        </div>
      )}
    </div>
  )
}
