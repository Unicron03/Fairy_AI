import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Database, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

function parseCSV(csv: string): { headers: string[]; rows: string[][] } {
    const [headerLine, ...lines] = csv.trim().split("\n");
    const headers = headerLine.split(",").map((h) => h.trim());

    const rows = lines.map((line) =>
        line.split(",").map((cell) => cell.trim())
    );

    return { headers, rows };
}

export default function DataVisualizer({ file }: { file: File | null }) {
    const [data, setData] = useState<string[][]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<{
        column: number;
        direction: "asc" | "desc";
    } | null>(null);

    useEffect(() => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const parsed = parseCSV(text);
            setHeaders(parsed.headers);
            setData(parsed.rows);
        };
        reader.readAsText(file);
    }, [file]);

    function getSortedData(): string[][] {
        if (!sortConfig) return data;

        const { column, direction } = sortConfig;

        const sorted = [...data].sort((a, b) => {
            const aVal = a[column];
            const bVal = b[column];

            const aNum = parseFloat(aVal);
            const bNum = parseFloat(bVal);

            const isNumeric = !isNaN(aNum) && !isNaN(bNum);

            if (isNumeric) {
                return direction === "asc" ? aNum - bNum : bNum - aNum;
            } else {
                return direction === "asc"
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
        });

        return sorted;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button title="Visualiser les données">
                    <Database size={20} className="cursor-pointer hover:opacity-60" />
                </button>
            </DialogTrigger>
            <DialogContent
                className="bg-[#f5f5f5] dark:bg-[#27272a] max-w-6xl max-h-3xl"
                style={{ scrollbarColor: "#80808057 transparent" }}
            >
                <DialogHeader>
                    <DialogTitle>Données importées</DialogTitle>
                    <DialogDescription>
                        Fichier : {file?.name || "Aucun fichier"}
                    </DialogDescription>
                </DialogHeader>
                <div className="overflow-auto max-h-[60vh]">
                    <table className="w-full table-auto border-collapse">
                        <thead className="bg-background dark:bg-[#27272a]">
                        <tr className="sticky top-0 z-10">
                            {headers.map((head, i) => {
                                const isSorted = sortConfig?.column === i;
                                const arrow = isSorted && (sortConfig.direction === "asc" ? <ChevronUp size={20} /> : <ChevronDown size={20} />);
                                return (
                                    <th
                                        key={i}
                                        className="px-4 py-2 text-left text-sm font-medium bg-inherit backdrop-blur-sm cursor-pointer select-none"
                                        onClick={() => {
                                            setSortConfig(prev =>
                                            prev?.column === i
                                                ? { column: i, direction: prev.direction === "asc" ? "desc" : "asc" }
                                                : { column: i, direction: "asc" }
                                            );
                                        }}
                                    >
                                        <span className="inline-flex items-center gap-1">
                                            {head}
                                            {isSorted && <span>{arrow}</span>}
                                        </span>
                                    </th>
                                );
                            })}
                        </tr>
                        </thead>
                        <tbody>
                            {getSortedData().map((row: string[], i: number) => (
                                <tr key={i} className="even:bg-muted/30">
                                {row.map((cell: string, j: number) => (
                                    <td key={j} className="px-4 py-2 text-sm">
                                    {cell}
                                    </td>
                                ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DialogContent>
        </Dialog>
    );
}
