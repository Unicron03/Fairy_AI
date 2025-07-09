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
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null)
    const navigate = useNavigate()

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
        setUser(null)
        navigate("/")
    }

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) throw new Error("useUser must be used within a UserProvider")
    return context
}
