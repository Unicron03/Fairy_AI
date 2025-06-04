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
import { useRef, useState } from "react"
import React from "react"
import { toast } from 'react-toastify';
import DataVisualizer from "./DataVisualizer"

type DropdownMenuDataProps = {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;

  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PopupDatas({ file, setFile, checked, setChecked }: DropdownMenuDataProps) {
  const [position, setPosition] = React.useState("locative");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localFile, setLocalFile] = useState<File | null>(file);

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
  
    const fakeContent = `Contenu fictif de ${value}.csv`;
    const blob = new Blob([fakeContent], { type: "text/csv" });
    const fakeFile = new File([blob], `${value}.csv`, { type: "text/csv" });
  
    setLocalFile(fakeFile);
    setFile(fakeFile);
  
    console.log(`Fichier pré-défini sélectionné : /csv/${value}.csv`);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="hover:opacity-60 outline-[#3a3a3a] dark:outline-white" style={{outlineWidth: "0.15rem"}}>Données</Button>
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
            <DropdownMenuCheckboxItem checked={checked} onClick={() => file ? setChecked(!checked) : toast.warn("Vous devez déjà importer ou sélectionner un fichier avant de pouvoir l'attacher", {
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
                <DropdownMenuRadioItem value="gestion-locative">Gestion locative</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="gestion-patrimoine">Gestion Patrimoine</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="bons-commande">Bons de commande</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="suivi-budgetaire">Suivi budgétaire</DropdownMenuRadioItem>
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
    </>
  )
}