import { useEffect } from "react";
import ThemeToggle from "../components/ThemeToggle";
import { SidebarTrigger } from "../components/ui/sidebar";
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table";
import { UserCreationPanel } from "@/components/user/UserCreationPanel";
import { useUser, AdminUser } from "@/context/UserContext";
import { UserDeletionDialog } from "@/components/user/UserDeletionDialog";

export const columns: ColumnDef<AdminUser>[] = [
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const user = row.original
            return <UserDeletionDialog userToDelete={user} />
        },
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "name",
        header: "Nom d'utilisateur",
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
    const { adminUsers, fetchAllUsers } = useUser()

    useEffect(() => {
        // Le `fetchAllUsers` est appelé ici pour charger les données initiales.
        // Il sera aussi appelé depuis `createUser` pour rafraîchir.
        fetchAllUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <DataTable columns={columns} data={adminUsers} />
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

            <div className="flex-1 px-8 py-4 flex flex-col gap-3">
                <h2 className="text-xl font-semibold mb-4">Utilisateurs</h2>
                <UserCreationPanel />
                <AdminUserTable />
            </div>
        </div>
    )
}