import { Button } from "@/components/ui/button"
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
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify';

// Définir le type du formulaire étendu
type FormValues = {
  problem: string;
  helpingFile: File | null;
};

export default function SoftwareError() {
  const form = useForm<FormValues>({
    defaultValues: {
      problem: "",
      helpingFile: null,
    },
  });

  // Fonction de soumission du formulaire
  function onSubmit(values: FormValues) {
    if (!values.problem || !values.problem.trim() || values.problem.length < 15) {
      toast.warn("Merci de décrire le problème, ou de le détailler davantage.", {
        progressClassName: "fancy-progress-bar",
        closeOnClick: true,
        autoClose: 3000,
        theme: localStorage.getItem("theme") || "light",
      });
      return;
    }

    toast.success("Le problème a bien été envoyé. Nous vous remercions de votre implication.", {
      progressClassName: "fancy-progress-bar",
      closeOnClick: true,
      autoClose: 3000,
      theme: localStorage.getItem("theme") || "light",
    });
  }

  return (
    <div className="space-y-6">
      {/* Formulaire Shadcn UI */}
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation(); // ← stoppe l'événement vers le form parent
            form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="problem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description du problème</FormLabel>
                <FormControl>
                  <Input placeholder="Exemple : Le bouton d'envoi ne fonctionne pas quand..." {...field} />
                </FormControl>
                <FormDescription style={{ fontSize: "small", color: "darkgray" }}>
                  Veuillez décrire, s'il-vous-plaît, le problème de façon clair, ainsi que les étapes pour recréer le problème
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="helpingFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fichier joint (facultatif)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf,.log,.txt"
                    onChange={(e) => {
                      field.onChange(e.target.files?.[0] ?? null);
                    }}
                  />
                </FormControl>
                <FormDescription style={{ fontSize: "small", color: "darkgray" }}>
                  Vous pouvez ajouter une capture d’écran ou un fichier d’erreur (log, PDF…)
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