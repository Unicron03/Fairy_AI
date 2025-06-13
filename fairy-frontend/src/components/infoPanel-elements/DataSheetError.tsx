import React from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "../ui/input"
import { FileType, preImportedFiles } from "@/App"
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify';
import { ChevronsUpDown } from "lucide-react"

type openProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

// Définir le type du formulaire étendu
type FormValues = {
  problem: string;
  selectedFile: FileType | null;
};

export default function DataSheetError({ open, setOpen }: openProps) {
  const [selectedStatus, setSelectedStatus] = React.useState<FileType | null>(null)

  const form = useForm<FormValues>({
    defaultValues: {
      problem: "",
      selectedFile: null,
    },
  });

  // Synchroniser selectedStatus avec le formulaire
  React.useEffect(() => {
    form.setValue("selectedFile", selectedStatus);
  }, [selectedStatus, form]);

  // Fonction de soumission du formulaire
  function onSubmit(values: FormValues) {
    // Gérer la soumission (API, affichage, etc.)
    if (!values.selectedFile) {
        toast.warn("Merci de sélectionner une feuille de données.", {
            progressClassName: "fancy-progress-bar", closeOnClick: true, autoClose: 3000, theme: localStorage.getItem("theme") || "light"
        });
    } else if (!values.problem || !values.problem.trim() || values.problem.length < 15) {
        toast.warn("Merci de décrire le problème, ou de le détailler d'avantage.", {
            progressClassName: "fancy-progress-bar", closeOnClick: true, autoClose: 3000, theme: localStorage.getItem("theme") || "light"
        });
    } else {
        toast.success("Le problème à bien était envoyé. Nous vons remercions de votre implication.", {
            progressClassName: "fancy-progress-bar", closeOnClick: true, autoClose: 3000, theme: localStorage.getItem("theme") || "light"
        });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <p className="text-muted-foreground text-sm">Choisissez la feuille de données</p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-fit justify-start bg-transparent hover:bg-gray-200 dark:hover:bg-[#3a3a3a]">
              {selectedStatus ? <><ChevronsUpDown size={24}/>{selectedStatus.label}</> : <>• Feuille de données</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="right" align="start">
            <Command>
              <CommandInput placeholder="Chercher la feuille..." className="outline-none" />
              <CommandList>
                <CommandEmpty>Aucune feuille de ce nom trouvée.</CommandEmpty>
                <CommandGroup>
                  {preImportedFiles.map((status) => (
                    <CommandItem
                      key={status.value}
                      value={status.value}
                      onSelect={(value) => {
                        setSelectedStatus(
                          preImportedFiles.find((priority) => priority.value === value) || null
                        )
                        setOpen(false)
                      }}
                    >
                      {status.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Formulaire Shadcn UI */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="problem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description du problème</FormLabel>
                <FormControl>
                  <Input placeholder="Exemple : La colonne n'existe plus..." {...field} />
                </FormControl>
                <FormDescription style={{ fontSize: "small", color: "darkgray" }}>
                  Veuillez décrire, s'il-vous-plaît, le problème de façon clair
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="hover:opacity-60 bg-black dark:bg-white text-white dark:text-black" style={{outlineWidth: "0.15rem"}}>Envoyer</Button>
        </form>
      </Form>
    </div>
  )
}
