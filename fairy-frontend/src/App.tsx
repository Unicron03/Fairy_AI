import AskForm from "./components/AskForm";

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

function App() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#09090b] dark:text-white transition-colors duration-300">
      {/* Contenu principal */}
      <main className="p-8">
        <AskForm />
      </main>
    </div>
  );
}

export default App;