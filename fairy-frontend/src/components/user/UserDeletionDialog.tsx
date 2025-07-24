import { useState } from "react";
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
import { Trash } from "lucide-react";
import { toast } from "react-toastify";
import { useUser, AdminUser } from "@/context/UserContext";

interface UserDeletionDialogProps {
    userToDelete: AdminUser;
}

export function UserDeletionDialog({ userToDelete }: UserDeletionDialogProps) {
    const { deleteUser, user: currentUser } = useUser();
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        if (currentUser?.id === userToDelete.id) {
            toast.error("Vous ne pouvez pas supprimer votre propre compte.", {
                progressClassName: "fancy-progress-bar", closeOnClick: true, autoClose: 5000, theme: localStorage.getItem("theme") || "light"
            });
            return;
        }

        try {
            await deleteUser(userToDelete.id);
            toast.success(`L'utilisateur ${userToDelete.name} a été supprimé.`, {
                progressClassName: "fancy-progress-bar", closeOnClick: true, autoClose: 5000, theme: localStorage.getItem("theme") || "light"
            });
            setOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Une erreur est survenue lors de la suppression.", {
                progressClassName: "fancy-progress-bar", closeOnClick: true, autoClose: 5000, theme: localStorage.getItem("theme") || "light"
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                    <Trash size={28} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[475px] h-fit bg-white dark:bg-black">
                <DialogHeader>
                    <DialogTitle>Suppression d'utilisateur</DialogTitle>
                    <DialogDescription>
                        <span className="text-[#a1a1a1]">Toutes les conversations et messages seront définitivement effacés. Cette action est irréversible.</span>
                        <br /><br />
                        Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{userToDelete.name}</strong> ({userToDelete.email}) ?
                    </DialogDescription>
                </DialogHeader>
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
                        type="button"
                        onClick={handleDelete}
                        className="hover:opacity-60 bg-red-600 text-white"
                    >
                        Supprimer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}