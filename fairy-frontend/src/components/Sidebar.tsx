import { SquarePen, Inbox, User2, ChevronUp, MoreHorizontal } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useUser } from "@/context/UserContext"
import { useConversation } from "@/context/ConversationContext"
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function GetDateFormatted(isoDate: string) {
  const date = new Date(isoDate)

  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  const formatted = `${hours}h${minutes} ${day}/${month}/${year}`

  return formatted
}

export function AppSidebar() {
  const { user, logout } = useUser()
  const { conversations, setConversations, setSelectedConversationId, createConversation, deleteConversation, renameConversation } = useConversation()

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3001/api/conversations?userId=${user.id}`)
        .then(res => res.json())
        .then(setConversations)
    }
  }, [user])

  return (
    <Sidebar variant="floating" className="w-[var(--sidebar-width)] h-screen">
      <SidebarContent className="h-full overflow-y-auto rounded-lg" style={{scrollbarColor: "#80808057 transparent"}}>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => createConversation()}>
                <SquarePen />
                <span>Nouvelle conversation</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarGroupLabel style={{marginBlock: "1rem"}}>Historique des conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.map((conv) => (
                <SidebarMenuItem key={conv.id}>
                  <SidebarMenuButton asChild>
                    <Link to={`/conversation/${conv.id}`} onClick={() => setSelectedConversationId(conv.id)}>
                      <Inbox />
                      <span>{GetDateFormatted(conv.createdAt)}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction>
                        <MoreHorizontal />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <DropdownMenuItem onClick={() => renameConversation(conv.id, "test rename")} >
                        <span>Renommer</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteConversation(conv.id)}>
                        <span>Supprimer</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
              
      <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="outline-none">
                    <User2 /> {user?.name}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  {user?.role === "ADMIN" && 
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <span>Espace administrateur</span>
                    </DropdownMenuItem>
                  }
                  <DropdownMenuItem onClick={logout}>
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  );
}