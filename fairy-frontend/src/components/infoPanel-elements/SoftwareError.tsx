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
import { toast } from 'react-toastify'
import { useUser } from "@/context/UserContext" // pour récupérer user.email

// Définir le type du formulaire étendu
type FormValues = {
	problem: string;
	helpingFile: File | null;
};

export default function SoftwareError() {
	const { user } = useUser();
	
	const form = useForm<FormValues>({
		defaultValues: {
			problem: "",
			helpingFile: null,
		},
	});
	
	// Fonction de soumission du formulaire
	async function onSubmit(values: FormValues) {
		if (!values.problem || !values.problem.trim() || values.problem.length < 15) {
			toast.warn("Merci de décrire le problème, ou de le détailler davantage.", {
				progressClassName: "fancy-progress-bar",
				closeOnClick: true,
				autoClose: 3000,
				theme: localStorage.getItem("theme") || "light",
			});
			return;
		}
		
		const formData = new FormData();
		formData.append("problem", values.problem);
		formData.append("userEmail", user?.email || "no-email-found");
		formData.append("userName", user?.name || "no-username-found");
		formData.append("userId", user?.id || "no-id-found");
		if (values.helpingFile) {
			formData.append("helpingFile", values.helpingFile);
		}

		try {
			const response = await fetch("http://localhost:3001/api/email/report-error", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) throw new Error();

			toast.success("Le problème a bien été envoyé. Nous vous remercions de votre implication.", {
				progressClassName: "fancy-progress-bar",
				closeOnClick: true,
				autoClose: 3000,
				theme: localStorage.getItem("theme") || "light",
			});

			form.reset(); // reset le formulaire si succès
		} catch (err) {
			toast.error("Une erreur est survenue lors de l’envoi du mail. Veuillez réessayer plus tard.", {
				progressClassName: "fancy-progress-bar",
				closeOnClick: true,
				autoClose: 3000,
				theme: localStorage.getItem("theme") || "light",
			});
			console.error("Erreur lors de l'envoi :", err);
		}
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
										className="cursor-pointer"
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