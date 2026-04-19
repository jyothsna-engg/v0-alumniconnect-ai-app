"use client"

import { useState } from "react"
import { Profile } from "@/lib/types"
import { Search, Users, Filter } from "lucide-react"

interface UsersPageClientProps {
  users: Profile[]
}

export function UsersPageClient({ users }: UsersPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | "student" | "alumni" | "admin">("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const studentCount = users.filter(u => u.role === "student").length
  const alumniCount = users.filter(u => u.role === "alumni").length
  const adminCount = users.filter(u => u.role === "admin").length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all users on the platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setRoleFilter("all")}
          className={`p-4 rounded-xl border transition-colors ${
            roleFilter === "all"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card border-border hover:border-primary/50"
          }`}
        >
          <p className={`text-2xl font-bold ${roleFilter === "all" ? "" : "text-card-foreground"}`}>
            {users.length}
          </p>
          <p className={`text-sm ${roleFilter === "all" ? "opacity-80" : "text-muted-foreground"}`}>
            Total Users
          </p>
        </button>
        <button
          onClick={() => setRoleFilter("student")}
          className={`p-4 rounded-xl border transition-colors ${
            roleFilter === "student"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card border-border hover:border-primary/50"
          }`}
        >
          <p className={`text-2xl font-bold ${roleFilter === "student" ? "" : "text-card-foreground"}`}>
            {studentCount}
          </p>
          <p className={`text-sm ${roleFilter === "student" ? "opacity-80" : "text-muted-foreground"}`}>
            Students
          </p>
        </button>
        <button
          onClick={() => setRoleFilter("alumni")}
          className={`p-4 rounded-xl border transition-colors ${
            roleFilter === "alumni"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card border-border hover:border-primary/50"
          }`}
        >
          <p className={`text-2xl font-bold ${roleFilter === "alumni" ? "" : "text-card-foreground"}`}>
            {alumniCount}
          </p>
          <p className={`text-sm ${roleFilter === "alumni" ? "opacity-80" : "text-muted-foreground"}`}>
            Alumni
          </p>
        </button>
        <button
          onClick={() => setRoleFilter("admin")}
          className={`p-4 rounded-xl border transition-colors ${
            roleFilter === "admin"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card border-border hover:border-primary/50"
          }`}
        >
          <p className={`text-2xl font-bold ${roleFilter === "admin" ? "" : "text-card-foreground"}`}>
            {adminCount}
          </p>
          <p className={`text-sm ${roleFilter === "admin" ? "opacity-80" : "text-muted-foreground"}`}>
            Admins
          </p>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length > 0 ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Company</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
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
                    {user.company || "-"}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  )
}
