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
import { Eye, EyeOff } from "lucide-react" // Icônes d’œil

export function ConnectionPanel() {
    const formRef = useRef<HTMLFormElement>(null)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(formRef.current!)
        const id = formData.get("id")
        const password = formData.get("password")

        try {
            const response = await fetch("http://localhost:3001/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, password }),
            })

            if (!response.ok) {
                console.error("Échec de la connexion.")
                return
            }

            const user = await response.json()

            if (user.role === "admin") {
                console.log("Connexion réussie en tant qu'admin")
                console.log("Identifiant :", id)
                console.log("Mot de passe :", password)
            } else {
                console.warn("Utilisateur connecté, mais n'est pas admin.")
            }

        } catch (error) {
            console.error("Erreur lors de la connexion :", error)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="hover:opacity-60 bg-black dark:bg-white text-white dark:text-black">
                    Se connecter
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[475px] h-fit bg-white dark:bg-black">
                <form ref={formRef} onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Connexion</DialogTitle>
                        <DialogDescription className="text-[#a1a1a1]">
                            Votre code d'identification vous a normalement été communiqué. Si ce n'est pas le cas, merci de vous adresser à la DSI.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-5 my-4">
                        <div className="grid gap-3">
                            <Label htmlFor="id-1">Identifiant</Label>
                            <Input id="id-1" name="id" />
                        </div>

                        <div className="grid gap-3 relative">
                            <Label htmlFor="mdp-2">Mot de passe</Label>
                            <Input
                                id="mdp-2"
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
                        Se connecter
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
