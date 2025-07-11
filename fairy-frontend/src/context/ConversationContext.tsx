// src/context/ConversationContext.tsx
import { createContext, useContext, useState } from "react"

export type Conversation = {
  id: string
  question: string
  answer: string
  tokens: number
  duration: number
  createdAt: string
}

type ConversationContextType = {
  selectedConversationId: string | null
  setSelectedConversationId: (id: string | null) => void
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

export const ConversationProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  return (
    <ConversationContext.Provider value={{ selectedConversationId, setSelectedConversationId }}>
      {children}
    </ConversationContext.Provider>
  )
}

export const useConversation = () => {
  const context = useContext(ConversationContext)
  if (!context) throw new Error("useConversation must be used within a ConversationProvider")
  return context
}
