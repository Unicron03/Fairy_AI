import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuCheckboxItem,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Paperclip } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import React from "react"
import { toast } from 'react-toastify';
import DataVisualizer from "./DataVisualizer"
import { FileType, loadPreImportedFiles } from "@/App"

type DropdownMenuDataProps = {
	file: File | null;
	setFile: React.Dispatch<React.SetStateAction<File | null>>;

	checked: boolean;
	setChecked: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DropdownMenuData({ file, setFile, checked, setChecked }: DropdownMenuDataProps) {
	const [position, setPosition] = React.useState("locative");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [localFile, setLocalFile] = useState<File | null>(file);
	const [preImportedFiles, setPreImportedFiles] = useState<FileType[]>([]);

	useEffect(() => {
		loadPreImportedFiles().then(setPreImportedFiles);
	}, []);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];

		if (selectedFile) {
		setLocalFile(selectedFile);
		setFile(selectedFile);
		setPosition("");

		// Réinitialise la valeur de l’input pour permettre une réimportation du même fichier plus tard
		e.target.value = "";
		}
	};

	const handlePredefinedCsvSelect = (value: string) => {
		setPosition(value);

		const selected = preImportedFiles.find((f) => f.value === value);
		if (!selected) {
			toast.error("Fichier introuvable.");
			return;
		}

		setLocalFile(selected.file);
		setFile(selected.file);
	};

	return (
		<div className="">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button title="Panneau des données" className="hover:opacity-60 outline-[#3a3a3a] dark:outline-white" style={{outlineWidth: "0.15rem"}}>Données</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-64">
					<DropdownMenuLabel>
						<div className="flex items-center justify-between">
							<span>Mes données</span>
							{file ? 
								<DataVisualizer file={file} />
							: null}
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
								<Paperclip className="mr-2 h-4 w-4" />
								{!localFile ? "Veuillez importer un fichier CSV si nécessaire" : `Fichier importé : ${localFile.name}`}
							</DropdownMenuItem>
							<DropdownMenuCheckboxItem checked={checked} onClick={
								() => file ? setChecked(!checked) : toast.warn("Vous devez déjà importer ou sélectionner un fichier avant de pouvoir l'attacher", {
									progressClassName: "fancy-progress-bar", closeOnClick: true, autoClose: 5000, theme: localStorage.getItem("theme") || "light"
								})}>
								Attacher à ma question
							</DropdownMenuCheckboxItem>
						</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>Sélectionner</DropdownMenuSubTrigger>
							<DropdownMenuSubContent>
								<DropdownMenuRadioGroup
									value={position}
									onValueChange={handlePredefinedCsvSelect}
								>
									{preImportedFiles.map((status) => (
										<DropdownMenuRadioItem
											key={status.value}
											value={status.value}
										>
											{status.label}
										</DropdownMenuRadioItem>
									))}
								</DropdownMenuRadioGroup>
							</DropdownMenuSubContent>
						</DropdownMenuSub>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Input file caché mais fonctionnel */}
			<input
				ref={fileInputRef}
				type="file"
				accept=".csv"
				className="hidden"
				onChange={handleFileChange}
			/>
		</div>
  	)
}