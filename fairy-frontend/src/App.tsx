import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import AskForm from "./pages/AskForm"
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
    <div className="flex h-full w-full">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ask" element={
            <>
              <div className="flex z-50" style={{ width: sidebarWidth }}>
                <AppSidebar />
              </div>

              <div className="flex-1 flex flex-col">
                <main>
                  <AskForm />
                </main>
              </div>
            </>
          } />
        </Routes>
      </Router>
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