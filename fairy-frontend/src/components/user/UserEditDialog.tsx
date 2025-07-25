import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Edit } from "lucide-react";
import { toast } from "react-toastify";
import { useUser, AdminUser } from "@/context/UserContext";

interface UserEditDialogProps {
    userToEdit: AdminUser;
}

export function UserEditDialog({ userToEdit }: UserEditDialogProps) {
    const { updateUser } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);

    const [name, setName] = useState(userToEdit.name);
    const [email, setEmail] = useState(userToEdit.email);
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"ADMIN" | "USER">(userToEdit.role)

    useEffect(() => {
        if (open) {
            setName(userToEdit.name);
            setEmail(userToEdit.email);
            setPassword("");
            setShowPassword(false);
            setRole(userToEdit.role)
        }
    }, [open, userToEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const dataToUpdate: { name?: string; email?: string; password?: string; role?: "ADMIN" | "USER" } = {};

        if (name !== userToEdit.name) dataToUpdate.name = name;
        if (email !== userToEdit.email) dataToUpdate.email = email;
        if (password) dataToUpdate.password = password;
        if (role !== userToEdit.role) dataToUpdate.role = role;

        if (Object.keys(dataToUpdate).length === 0) {
            toast.info("Aucune modification n'a été effectuée.", {
                progressClassName: "fancy-progress-bar", closeOnClick: true, autoClose: 5000, theme: localStorage.getItem("theme") || "light"
            });
            setOpen(false);
            return;
        }

        try {
            await updateUser(userToEdit.id, dataToUpdate);
            toast.success(`L'utilisateur ${name} a été modifié avec succès.`, {
                progressClassName: "fancy-progress-bar", closeOnClick: true, autoClose: 5000, theme: localStorage.getItem("theme") || "light"
            });
            setOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Une erreur est survenue lors de la modification.", {
                progressClassName: "fancy-progress-bar", closeOnClick: true, autoClose: 5000, theme: localStorage.getItem("theme") || "light"
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[475px] h-fit bg-white dark:bg-black">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Modifier l'utilisateur</DialogTitle>
                        <DialogDescription className="text-[#a1a1a1]">
                            Modifiez les informations de <strong>{userToEdit.name}</strong>. Laissez le mot de passe vide pour ne pas le changer.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-5 my-4">
                        <div className="grid gap-3">
                            <Label htmlFor="email-edit">Email</Label>
                            <Input id="email-edit" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="name-edit">Identifiant</Label>
                            <Input id="name-edit" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="role-edit">Rôle</Label>
                            <select
                                id="role-edit"
                                name="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value as "ADMIN" | "USER")}
                                className="border dark:border-white rounded px-3 py-2 bg-white dark:bg-black text-sm"
                            >
                                <option value="USER">Utilisateur</option>
                                <option value="ADMIN">Administrateur</option>
                            </select>
                        </div>

                        <div className="grid gap-3 relative">
                            <Label htmlFor="password-edit">Nouveau mot de passe (optionnel)</Label>
                            <Input
                                id="password-edit"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                                variant="secondary"
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
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
