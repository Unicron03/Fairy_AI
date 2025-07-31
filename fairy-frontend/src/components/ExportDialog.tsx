import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type Props = {
	history: { question: string; answer: string; tokens: number; duration: number, fileUsed?: string | undefined }[];
	author?: string;
};

export default function ExportDialog({ history, author = "Utilisateur" }: Props) {
	const handleExport = () => {
		const now = new Date();
		const dateStr = now.toLocaleString("fr-FR");

		const content = [
			`Export du ${dateStr} par ${author}`,
			"",
			...history.map((item, i) => `Q${i + 1} ${item.fileUsed ? '(' + item.fileUsed + ') ' : ""}: ${item.question}\nR${i + 1} : ${item.answer}\n`)
		].join("\n");

		const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = `conversation_${now.toISOString().split("T")[0]}.txt`;
		a.click();

		URL.revokeObjectURL(url);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button title="Exporter la conversation">
					<Download className="hover:opacity-60" size={24}/>
				</button>
			</DialogTrigger>
			<DialogContent className="bg-[#f5f5f5] dark:bg-[#27272a] w-fit h-fit gap-7">
				<DialogHeader>
					<DialogTitle>Exporter la conversation</DialogTitle>
				</DialogHeader>
				<p>Voulez-vous exporter la conversation ?</p>
				<DialogFooter className="flex justify-end gap-4">
					<DialogClose asChild>
						<Button variant="secondary" className="hover:opacity-60 outline-black dark:outline-white text-black dark:text-white" style={{outlineWidth: "0.15rem", outlineOffset: "-1px"}}>Annuler</Button>                    
					</DialogClose>
					<Button onClick={handleExport} className="hover:opacity-60 bg-black dark:bg-white text-white dark:text-black" style={{outlineWidth: "0.15rem"}}>Exporter</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
