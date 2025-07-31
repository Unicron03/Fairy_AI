import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "react-toastify"
import { useUser } from "@/context/UserContext"

export function UserCreationPanel() {
    const { createUser } = useUser()
    const formRef = useRef<HTMLFormElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [open, setOpen] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(formRef.current!)
        const email = formData.get("email")
        const name = formData.get("name")
        const password = formData.get("password")

        if (!email || !name || !password) {
            toast.error("Veuillez remplir tous les champs.", {
                progressClassName: "fancy-progress-bar", closeOnClick: true, autoClose: 3000, theme: localStorage.getItem("theme") || "light"
            });
            return
        }
        try {
            await createUser(email as string, name as string, password as string, "USER");
            toast.success(`L'utilisateur ${name} a été créé avec succès.`, {
                progressClassName: "fancy-progress-bar", closeOnClick: true, autoClose: 5000, theme: localStorage.getItem("theme") || "light"
            });
            formRef.current?.reset();
            setShowPassword(false);
            setOpen(false); // Ferme la modale
        } catch (error: any) {
            toast.error(error.message || "Une erreur est survenue lors de la création.", {
                progressClassName: "fancy-progress-bar", closeOnClick: true, autoClose: 5000, theme: localStorage.getItem("theme") || "light"
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="hover:opacity-60 bg-black dark:bg-white text-white dark:text-black w-fit">Créer un nouvel utilisateur</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[475px] h-fit bg-white dark:bg-black overflow-y-auto" style={{ scrollbarColor: "#80808057 transparent" }}>
                <form ref={formRef} onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Création d'utilisateur</DialogTitle>
                        <DialogDescription className="text-[#a1a1a1]">
                            Le compte sera actif dès sa création. Merci de communiquez les identifiants à la personne sujette.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-5 my-4">
                         <div className="grid gap-3">
                            <Label htmlFor="name-input">Email</Label>
                            <Input id="email-input" name="email" />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="name-input">Identifiant</Label>
                            <Input id="name-input" name="name" />
                        </div>

                        <div className="grid gap-3 relative">
                            <Label htmlFor="password-input">Mot de passe</Label>
                            <Input
                                id="password-input"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-[33px] text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                            </button>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                className="hover:opacity-60 outline-black dark:outline-white text-black dark:text-white"
                                style={{ outlineWidth: "0.15rem", outlineOffset: "-1px" }}
                            >
                                Annuler
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            className="hover:opacity-60 bg-black dark:bg-white text-white dark:text-black"
                        >
                            Créer
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
