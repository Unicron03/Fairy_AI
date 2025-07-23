import { Button } from "@/components/ui/button";
import ThemeToggle from "../components/ThemeToggle";
import { SidebarTrigger } from "../components/ui/sidebar";
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";
import { useConversation } from "@/context/ConversationContext";
import { useNavigate } from "react-router-dom"

function AskForm() {
  const { user } = useUser()
  const { conversations, setSelectedConversationId, createConversation } = useConversation()
  const navigate = useNavigate()

  useEffect(() => {
    if (conversations.length > 0) {
      const firstConversationId = conversations[0].id

      setSelectedConversationId(firstConversationId)
      navigate(`/conversation/${firstConversationId}`)
    } else {
      console.log("AUCUNE CONVERSATION EXISTANTE")
    }
  }, [conversations])

  return (
    <div className="h-screen flex flex-col">
      {/* Logo */}
      <header style={{padding: "15px"}} className="sticky top-0 left-0 right-0 mb-[45px] bg-white dark:bg-[#09090b] z-30">        
        <div className="absolute w-[-webkit-fill-available] top-[15px] flex justify-center">
          <img style={{height: "70px"}} src="src/logo.png"></img>
        </div>

        <div className="flex justify-between items-center">
          <SidebarTrigger className="z-50 hover:opacity-60" />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-5">
          <p className="">
            Bonjour {user?.name}, lancer votre première conversation !
          </p>

          <Button
            onClick={createConversation}
            className="hover:opacity-60 bg-black dark:bg-white text-white dark:text-black"
          >
            Nouvelle conversation
          </Button>
      </main>
    </div>
  );
}

export default AskForm;