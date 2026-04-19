"use client"

import { useState } from "react"
import { Job } from "@/lib/types"
import { JobCard } from "@/components/dashboard/job-card"
import { Search, Briefcase, Plus } from "lucide-react"
import { AddJobModal } from "@/components/dashboard/add-job-modal"

interface JobsPageClientProps {
  jobs: Job[]
  userId: string
  userRole: string
}

export function JobsPageClient({ jobs, userId, userRole }: JobsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  const locations = Array.from(new Set(jobs.map((job) => job.location)))

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLocation = !locationFilter || job.location === locationFilter

    return matchesSearch && matchesLocation
  })

  const canPostJobs = userRole === "alumni" || userRole === "admin"

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Board</h1>
          <p className="text-muted-foreground mt-1">
            Discover opportunities and request referrals from alumni.
          </p>
        </div>
        {canPostJobs && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Post Job
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search jobs by title or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="px-4 py-2.5 bg-card border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        >
          <option value="">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              userId={userId}
              showReferralButton={userRole === "student"}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
          <p className="text-muted-foreground">
            {searchQuery || locationFilter
              ? "Try adjusting your search or filter criteria."
              : "No job opportunities are available at the moment."}
          </p>
        </div>
      )}

      {showAddModal && (
        <AddJobModal
          userId={userId}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}
