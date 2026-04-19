"use client"

import { useState } from "react"
import { Profile, Message, Mentor } from "@/lib/types"
import { MessageSquare, Send } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Connection {
  id: string
  mentor_id: string
  mentors: Mentor | null
}

interface MessagesPageClientProps {
  profile: Profile | null
  connections: Connection[]
  messages: Message[]
}

export function MessagesPageClient({ profile, connections, messages }: MessagesPageClientProps) {
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null)
  const [messageContent, setMessageContent] = useState("")
  const [sending, setSending] = useState(false)
  const router = useRouter()

  const selectedMentor = connections.find(c => c.mentor_id === selectedMentorId)?.mentors
  const mentorMessages = messages.filter(m => m.to_mentor_id === selectedMentorId)

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedMentorId || !messageContent.trim() || !profile?.id) return

    setSending(true)
    const supabase = createClient()

    await supabase.from("messages").insert({
      from_user_id: profile.id,
      to_mentor_id: selectedMentorId,
      content: messageContent.trim(),
    })

    setMessageContent("")
    setSending(false)
    router.refresh()
  }

  return (
    <div className="h-full flex">
      {/* Connections List */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-card-foreground">Messages</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {connections.length} connection{connections.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {connections.length > 0 ? (
            connections.map((connection) => (
              <button
                key={connection.id}
                onClick={() => setSelectedMentorId(connection.mentor_id)}
                className={`w-full p-4 text-left hover:bg-secondary transition-colors border-b border-border ${
                  selectedMentorId === connection.mentor_id ? "bg-secondary" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      {connection.mentors?.initials || "??"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-card-foreground truncate">
                      {connection.mentors?.name || "Unknown Mentor"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {connection.mentors?.title} at {connection.mentors?.company}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No connections yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Connect with mentors to start messaging
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-background">
        {selectedMentor ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {selectedMentor.initials}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-card-foreground">{selectedMentor.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedMentor.title} at {selectedMentor.company}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mentorMessages.length > 0 ? (
                mentorMessages.map((message) => (
                  <div key={message.id} className="flex justify-end">
                    <div className="max-w-[70%] bg-primary text-primary-foreground rounded-lg px-4 py-2">
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No messages yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Send a message to start the conversation
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-card">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!messageContent.trim() || sending}
                  className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Select a conversation
              </h3>
              <p className="text-muted-foreground">
                Choose a connection to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
