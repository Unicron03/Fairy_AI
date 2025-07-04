import AskForm from "./components/AskForm";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar"

export type FileType = {
  value: string
  label: string
}

export const preImportedFiles: FileType[] = [
  {
    value: "gestion-locative",
    label: "Gestion locative",
  },
  {
    value: "gestion-patrimoine",
    label: "Gestion patrimoine",
  },
  {
    value: "bons-commande",
    label: "Bons de commande",
  },
  {
    value: "suivi-budgetaire",
    label: "Suivi budgétaire",
  }
]


function Layout() {
  const { state } = useSidebar();
  const sidebarWidth = state === "collapsed" ? "0rem" : "15.5rem";

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar avec largeur dynamique */}
      <div className="flex z-50" style={{ width: sidebarWidth }}>
        <AppSidebar />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
            <main>
              <AskForm />
            </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SidebarProvider defaultOpen={localStorage.getItem("sidebar-state") === "open"}>
      <Layout />
    </SidebarProvider>
  );
}