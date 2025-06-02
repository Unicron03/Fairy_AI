import { Eraser } from "lucide-react";

type SearchingProps = {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export function HistoricFilter({search, setSearch}: SearchingProps) {    
    return (
        // Barre de filtre d'historique
        <div className="fixed top-[80px] left-0 right-0 z-40">
            <div
                className="mx-auto"
                style={{
                    maxWidth: "500px",
                    padding: "0 15px",
                }}
            >
                <div
                    className="bg-white dark:bg-[#09090b]"
                    style={{
                    display: "flex",
                    borderRadius: "30%",
                    boxShadow: "3px 3px 19px 1px rgba(0, 0, 0, 0.44)",
                    }}
                >
                    <input
                        type="text"
                        placeholder="Rechercher une question..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ borderRadius: "8px 0 0 8px" }}
                        className="w-full p-2 outline-none bg-gray-100 dark:bg-[#27272a] text-black dark:text-white"
                    />
                    <button
                        type="button"
                        onClick={() => setSearch("")}
                        style={{ borderRadius: "0 8px 8px 0" }}
                        className="p-2 bg-gray-100 dark:bg-[#27272a]"
                        title="Supprimer le filtre"
                    >
                        <Eraser className="hover:opacity-60" />
                    </button>
                </div>
            </div>
        </div>
    );
}