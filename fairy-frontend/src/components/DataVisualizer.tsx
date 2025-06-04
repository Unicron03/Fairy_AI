import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Database } from "lucide-react";
import { useEffect, useState } from "react";

function parseCSV(csv: string): { headers: string[], rows: string[][] } {
  const [headerLine, ...lines] = csv.trim().split("\n")
  const headers = headerLine.split(",").map(h => h.trim())

  const rows = lines.map(line =>
    line.split(",").map(cell => cell.trim())
  )

  return { headers, rows }
}

export default function DataVisualizer({ file }: { file: File | null }) {
  const [data, setData] = useState<string[][]>([])
  const [headers, setHeaders] = useState<string[]>([])

  useEffect(() => {
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const parsed = parseCSV(text)
      setHeaders(parsed.headers)
      setData(parsed.rows)
    }
    reader.readAsText(file)
  }, [file])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button title="Visualiser les données">
            <Database size={20} className="cursor-pointer hover:opacity-60" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#f5f5f5] dark:bg-[#27272a] max-w-6xl max-h-3xl" style={{scrollbarColor: "#80808057 transparent" }}>
        <DialogHeader>
          <DialogTitle>Données importées</DialogTitle>
          <DialogDescription>Fichier : {file?.name || "Aucun fichier"}</DialogDescription>
        </DialogHeader>
        <div className="overflow-auto max-h-[60vh]">
            <table className="w-full table-auto border-collapse">
                <thead className="bg-background dark:bg-[#27272a]">
                    <tr className="sticky top-0 z-10">
                        {headers.map((head, i) => (
                        <th
                            key={i}
                            className="px-4 py-2 text-left text-sm font-medium bg-inherit backdrop-blur-sm"
                        >
                            {head}
                        </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                {data.map((row, i) => (
                    <tr key={i} className="even:bg-muted/30">
                    {row.map((cell, j) => (
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
  )
}