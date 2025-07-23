import React, { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserContext"
import { useNavigate } from "react-router-dom"

export type Conversation = {
  id: string
  question: string
  createdAt: string
}

type ConversationContextType = {
  conversations: Conversation[]
  selectedConversationId: string | null
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
  setSelectedConversationId: (id: string | null) => void
  createConversation: () => Promise<Conversation | null>
  deleteConversation: (id: string) => Promise<void>
  saveConversation: (id: string, answer: string, tokens: number, duration: number, question: string) => Promise<void>
  renameConversation: (id: string, newTitle: string) => Promise<void>
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser()
    const navigate = useNavigate()

    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedConversationId, _setSelectedConversationId] = useState<string | null>(() => {
        return localStorage.getItem("selectedConversationId");
    });

    // Fonction personnalisée pour garder en sync avec localStorage
    const setSelectedConversationId = (id: string | null) => {
        if (id) {
            localStorage.setItem("selectedConversationId", id);
        } else {
            localStorage.removeItem("selectedConversationId");
        }
        _setSelectedConversationId(id);
    };

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3001/api/conversations?userId=${user.id}`)
        .then(res => res.json())
        .then(setConversations)
    }
  }, [user])

  const createConversation = async (): Promise<Conversation | null> => {
    if (!user?.id) return null

    try {
        const res = await fetch("http://localhost:3001/api/conversations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id })
        })

        if (!res.ok) throw new Error("Échec de la création de la conversation")

        const newConv: Conversation = await res.json()

        setConversations(prev => [newConv, ...prev])
        setSelectedConversationId(newConv.id)
        navigate(`/conversation/${newConv.id}`)

        return newConv
    } catch (err) {
      console.error("Erreur lors de la création de la conversation :", err)
      return null
    }
  }

    const deleteConversation = async (id: string) => {
        try {
            await fetch(`http://localhost:3001/api/conversations/${id}`, {
                method: "DELETE",
            })
            setConversations(prev => prev.filter(conv => conv.id !== id))
            if (selectedConversationId === id) {
                setSelectedConversationId(null)
            }
            navigate("/ask")
        } catch (err) {
            console.error("Erreur lors de la suppression :", err)
        }
    }

    const saveConversation = async (id: string, answer: string, tokens: number, duration: number, question: string) => {
        try {
            await fetch(`http://localhost:3001/api/conversations/${id}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id, question: question, answer: answer, tokens: tokens, duration: duration })
            })
        } catch (err) {
            console.error("Erreur lors de la sauvegarde de la conversation :", err)
        }
    }

    const renameConversation = async (id: string, newTitle: string) => {
        try {
            await fetch(`http://localhost:3001/api/conversations/${id}/rename`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newName: { newTitle } }),
            });
        } catch (err) {
            console.error("Erreur lors du renommage de la conversation :", err)
        }
    }

  return (
    <ConversationContext.Provider value={{
      conversations,
      selectedConversationId,
      setConversations,
      setSelectedConversationId,
      createConversation,
      deleteConversation,
      saveConversation,
      renameConversation,
    }}>
      {children}
    </ConversationContext.Provider>
  )
}

export const useConversation = () => {
  const context = useContext(ConversationContext)
  if (!context) throw new Error("useConversation must be used within a ConversationProvider")
  return context
}
