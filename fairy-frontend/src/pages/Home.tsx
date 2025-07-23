import InfoPanel from "@/components/InfoPanel"
import ThemeToggle from "@/components/ThemeToggle"
import { ConnectionPanel } from "@/components/ConnectionPanel"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
        {/* Header collé en haut */}
        <header className="sticky top-0 z-30 flex gap-4 justify-end p-[15px] pb-0 bg-white dark:bg-[#09090b]">
            <ThemeToggle />
            <InfoPanel />
        </header>

        {/* Contenu principal centré */}
        <main className="flex-1 flex flex-col items-center justify-center gap-5">
            <img style={{ height: "90px" }} src="src/logo.png" alt="Logo" />
            <p className="p-2 italic text-sm text-gray-500 dark:text-gray-400">
                Le logiciel IA spécialement conçu pour Evoléa
            </p>
            
            <ConnectionPanel/>
        </main>

        {/* Footer collé en bas */}
        <footer className="p-4 text-center text-sm italic text-gray-500 dark:text-gray-400">
            Fairy peut commettre des erreurs. Il est recommandé de vérifier les informations importantes.
        </footer>
    </div>
  )
}