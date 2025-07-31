import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import AskForm from "./pages/AskForm"
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar"
import { UserProvider } from "@/context/UserContext" // import du provider
import AdminPanel from "./pages/AdminPanel"
import { ToastContainer } from "react-toastify"
import { RequireAdmin, NotFoundRedirect } from "./components/RouteEffects"
import ConversationPage from "./pages/ConversationPage"
import { ConversationProvider } from "./context/ConversationContext"

export type FileType = {
	value: string
	label: string
	file: File
}

const fileDefinitions = [
	{ value: "example-file", label: "Exemple fichier pays", path: "country_full.csv" },
];

export async function loadPreImportedFiles(): Promise<FileType[]> {
	const files: FileType[] = [];
	
	for (const def of fileDefinitions) {
		try {
			const response = await fetch(`/datas/${def.path}`);
			const blob = await response.blob();
			
			const file = new File([blob], def.path, { type: blob.type });
			
			files.push({
				value: def.value,
				label: def.label,
				file,
			});
		} catch (error) {
			console.error(`Erreur lors du chargement de ${def.path}:`, error);
		}
	}
	
	return files;
}

function Layout() {
	const { state } = useSidebar()
	const sidebarWidth = state === "collapsed" ? "0rem" : "15.5rem"
	
	return (
		<div className="flex h-full w-full">
			<Routes>
				<Route path="/" element={<Home />} />
				
				<Route path="/ask" element={
					<>
						<div className="flex z-50" style={{ width: sidebarWidth }}>
							<AppSidebar />
						</div>
						<div className="flex-1 flex flex-col">
							<main><AskForm /></main>
						</div>
					</>
				} />
				
				<Route path="/conversation/:id" element={
					<>
						<div className="flex z-50" style={{ width: sidebarWidth }}>
							<AppSidebar />
						</div>
						<div className="flex-1 flex flex-col">
							<main><ConversationPage /></main>
						</div>
					</>
				} />
				
				<Route path="/admin" element={
					<RequireAdmin>
						<div className="flex z-50" style={{ width: sidebarWidth }}>
							<AppSidebar />
						</div>
						<div className="flex-1 flex flex-col">
							<main><AdminPanel /></main>
						</div>
					</RequireAdmin>
				} />
				
				<Route path="*" element={<NotFoundRedirect />} />
			</Routes>
			
			<ToastContainer stacked />
		</div>
	)
}

export default function App() {
	return (
		<SidebarProvider defaultOpen={localStorage.getItem("sidebar-state") === "open"}>
			<Router>
				<UserProvider>
				<ConversationProvider>
					<Layout />
				</ConversationProvider>
				</UserProvider>
			</Router>
		</SidebarProvider>
	)
}