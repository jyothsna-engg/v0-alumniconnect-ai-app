export interface Profile {
  id: string
  name: string
  email: string
  role: "student" | "alumni" | "admin"
  bio?: string
  title?: string
  company?: string
  referrals_given: number
  created_at: string
}

export interface Mentor {
  id: string
  user_id?: string
  name: string
  initials: string
  title: string
  company: string
  match_score: number
  bio?: string
  created_at: string
}

export interface Job {
  id: string
  posted_by?: string
  title: string
  company: string
  location: string
  description?: string
  is_active: boolean
  created_at: string
}

export interface ConnectionRequest {
  id: string
  student_id: string
  mentor_id: string
  student_name: string
  status: "pending" | "accepted" | "rejected"
  created_at: string
}

export interface Message {
  id: string
  from_user_id: string
  to_mentor_id: string
  content: string
  is_read: boolean
  created_at: string
}

export interface SessionRequest {
  id: string
  student_id: string
  mentor_id: string
  status: "pending" | "accepted" | "rejected" | "completed"
  scheduled_at?: string
  created_at: string
}

export interface Referral {
  id: string
  user_id: string
  job_id: string
  status: "requested" | "in_progress" | "completed" | "rejected"
  created_at: string
}

export interface Connection {
  id: string
  student_id: string
  mentor_id: string
  created_at: string
}
