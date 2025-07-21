import { SquarePen, Calendar, Inbox, Search, Settings, User2, ChevronUp } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useUser } from "@/context/UserContext"
import { Conversation, useConversation } from "@/context/ConversationContext"
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function AppSidebar() {
  const { user, logout } = useUser();
  const { setSelectedConversationId } = useConversation();
  const [conversations, setConversations] = useState<Conversation[]>([])
  
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3001/api/conversations?userId=${user.id}`)
        .then(res => res.json())
        .then(setConversations)
    }
  }, [user])

  const handleNewConversation = async () => {
    const res = await fetch("http://localhost:3001/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.id })
    })

    const newConv = await res.json()
    setConversations(prev => [newConv, ...prev])
  }

  return (
    <Sidebar variant="floating" className="w-[var(--sidebar-width)] h-screen">
      <SidebarContent className="h-full overflow-y-auto rounded-lg" style={{scrollbarColor: "#80808057 transparent"}}>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleNewConversation}>
                <SquarePen />
                <span>Nouvelle conversation</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarGroupLabel className="mt-4">Historique des conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.map((conv) => (
                <SidebarMenuItem key={conv.id}>
                  <SidebarMenuButton asChild>
                    <Link to={`/conversation/${conv.id}`} onClick={() => setSelectedConversationId(conv.id)}>
                      <Inbox />
                      <span>{conv.createdAt}</span>
                    </Link>
                  </SidebarMenuButton>
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