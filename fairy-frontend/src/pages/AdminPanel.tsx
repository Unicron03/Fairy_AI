import { useState, useEffect } from "react";
import ThemeToggle from "../components/ThemeToggle";
import { SidebarTrigger } from "../components/ui/sidebar";
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table";

export type User = {
    id: string
    name: string
    email: string
    password: string
    conversationsCount?: number
    messagesCount?: number
    tokensCount?: number
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "name",
        header: "Nom d'utilisateur",
    },
    {
        accessorKey: "password",
        header: "Mot de passe",
        cell: ({ row }) => {
            const value = row.getValue("password") as string
            return <span className="text-xs text-gray-500">••••••••••</span> // sécurité basique
        }
    },
    {
        accessorKey: "nbConvAMsg",
        header: "Conversations | Messages | Tokens",
        cell: ({ row }) => {
            const conv = row.original.conversationsCount ?? 0
            const msg = row.original.messagesCount ?? 0
            const tokens = row.original.tokensCount ?? 0

            return (
            <span className="text-sm text-gray-700 dark:text-gray-300">
                {conv} | {msg} | {tokens}
            </span>
            )
        }
    }
]

function AdminUserTable() {
    const [data, setData] = useState<User[]>([])

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

    useEffect(() => {
        const fetchUsersWithStats = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/users")
                const users: User[] = await res.json()

                // Attendre toutes les stats en parallèle
                const usersWithStats = await Promise.all(
                    users.map(async user => {
                        const stats = await fetchUserStats(user.id)
                        return { ...user, ...stats }
                    })
                )

                setData(usersWithStats)
            } catch (error) {
                console.error("Erreur de récupération des utilisateurs", error)
            }
        }

        fetchUsersWithStats()
    }, [])

    return <DataTable columns={columns} data={data} />
}

export default function AdminPanel() {
    return (
        <div className="h-screen flex flex-col">
            {/* Logo */}
            <header style={{padding: "15px"}} className="sticky flex justify-center top-0 left-0 right-0 mb-[45px] bg-white dark:bg-[#09090b] z-30">
                <div className="absolute w-[-webkit-fill-available] top-[15px] flex justify-center">
                    <img style={{height: "70px", filter: "grayscale(60%)"}} src="src/logo.png"></img>
                </div>

                <div className="w-full flex justify-between items-center">
                    <SidebarTrigger className="z-50 hover:opacity-60" />
                    <ThemeToggle />
                </div>
            </header>

            <div className="flex-1 px-8 py-4">
                <h2 className="text-xl font-semibold mb-4">Utilisateurs</h2>
                <AdminUserTable />
            </div>
        </div>
    )
}