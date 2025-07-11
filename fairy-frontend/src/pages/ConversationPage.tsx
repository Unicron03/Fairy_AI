import ThemeToggle from "@/components/ThemeToggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useParams } from "react-router-dom"

export default function ConversationPage() {
  const { id } = useParams()

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
                <h2 className="text-xl font-bold">Conversation ID : {id}</h2>
            </div>
        </div>
  )
}
