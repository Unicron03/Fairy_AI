// src/context/UserContext.tsx
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export type User = {
    id: string
    name: string
    email: string
    role: "ADMIN" | "USER"
}
type UserContextType = {
    user: User | null
    setUser: (user: User | null) => void
    logout: () => void
    isReady: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null)
    const navigate = useNavigate()
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setUserState(JSON.parse(storedUser))
        }
        setIsReady(true) // <-- Indique que la vérification est terminée
    }, [])


    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setUserState(JSON.parse(storedUser))
        }
    }, [])

    const setUser = (newUser: User | null) => {
        if (newUser) {
            localStorage.setItem("user", JSON.stringify(newUser))
        } else {
            localStorage.removeItem("user")
        }
        setUserState(newUser)
    }

    const logout = () => {
        navigate("/")
        setTimeout(() => setUser(null), 1) // Timeout pour éviter bug toast déco quand admin sur espace admin
    }

    return (
        <UserContext.Provider value={{ user, setUser, logout, isReady }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) throw new Error("useUser must be used within a UserProvider")
    return context
}
