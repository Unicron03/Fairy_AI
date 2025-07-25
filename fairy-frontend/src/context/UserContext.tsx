// src/context/UserContext.tsx
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export type User = {
    id: string
    name: string
    email: string
    role: "ADMIN" | "USER"
    createdAt: Date
}

export type AdminUser = {
    id: string
    name: string
    email: string
    role: "ADMIN" | "USER"
    createdAt?: string
    conversationsCount?: number
    messagesCount?: number
    tokensCount?: number
}

type UserContextType = {
    user: User | null
    setUser: (user: User | null) => void
    logout: () => void
    createUser: (email: string, name: string, password: string, role: "ADMIN" | "USER") => Promise<void>
    isReady: boolean
    updateUser: (userId: string, data: { name?: string; email?: string; password?: string; role?: "ADMIN" | "USER" }) => Promise<void>
    deleteUser: (userId: string) => Promise<void>
    adminUsers: AdminUser[]
    fetchAllUsers: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null)
    const navigate = useNavigate()
    const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
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

    const createUser = async (email: string, name: string, password: string, role: "ADMIN" | "USER"): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:3001/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, name: name, password: password, role: role })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Une erreur est survenue." }));
                throw new Error(errorData.details?.message || errorData.error || "Erreur lors de la création de l'utilisateur.");
            }
            // Rafraîchir la liste des utilisateurs après la création
            await fetchAllUsers()
        } catch (err) {
            console.error("Erreur lors de la création de l'utilisateur :", err)
            throw err; // Propage l'erreur pour que le composant puisse la gérer
        }
    }

    const updateUser = async (userId: string, data: { name?: string; email?: string; password?: string; role?: "ADMIN" | "USER" }): Promise<void> => {
        const updateData = { ...data };
        if (updateData.password === '') {
            delete updateData.password;
        }

        try {
            console.log(updateData.role)
            const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Une erreur est survenue." }));
                throw new Error(errorData.error || "Erreur lors de la modification de l'utilisateur.");
            }
            await fetchAllUsers();
        } catch (err) {
            console.error("Erreur lors de la modification de l'utilisateur :", err);
            throw err;
        }
    };

    const deleteUser = async (userId: string): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Une erreur est survenue." }));
                throw new Error(errorData.error || "Erreur lors de la suppression de l'utilisateur.");
            }
            // Rafraîchir la liste des utilisateurs après la suppression
            await fetchAllUsers();
        } catch (err) {
            console.error("Erreur lors de la suppression de l'utilisateur :", err);
            throw err; // Propage l'erreur pour que le composant puisse la gérer
        }
    };

    const fetchUserStats = async (userId: string) => {
        try {
            const res = await fetch(`http://localhost:3001/api/stats/${userId}`)
            if (!res.ok) throw new Error("Stats non trouvées")
            return await res.json()
        } catch (err) {
            console.error(`Erreur stats pour user ${userId}`, err)
            return { conversationsCount: 0, messagesCount: 0, tokensCount: 0 }
        }
    }

    const fetchAllUsers = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/users")
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: "Une erreur de communication avec le serveur." }));
                throw new Error(errorData.error || "Erreur lors de la récupération des utilisateurs.");
            }
            const users: AdminUser[] = await res.json()

            const usersWithStats = await Promise.all(
                users.map(async user => {
                    const stats = await fetchUserStats(user.id)
                    return { ...user, ...stats }
                })
            )
            setAdminUsers(usersWithStats)
        } catch (error: any) {
            console.error("Erreur de récupération des utilisateurs", error)
            // Optionnel : vous pourriez afficher un toast d'erreur ici
        }
    }

    return (
        <UserContext.Provider value={{ user, setUser, logout, createUser, isReady, adminUsers, fetchAllUsers, deleteUser, updateUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) throw new Error("useUser must be used within a UserProvider")
    return context
}
