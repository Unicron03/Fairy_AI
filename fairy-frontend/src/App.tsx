import React from "react";
import AskForm from "./components/AskForm";

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
