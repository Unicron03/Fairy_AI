import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Info } from "lucide-react"
import DataSheetError from "./infoPanel-elements/DataSheetError";
import SoftwareError from "./infoPanel-elements/SoftwareError";
import MarkdownViewer from "./MarkdownViewer";

export default function InfoPanel() {
    const [open, setOpen] = React.useState(false)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button title="Infos & Signalements" onClick={() => setOpen(false)}>
                    <Info className="hover:opacity-60" size={24}/>
                </button>
            </DialogTrigger>
            <DialogContent
                className="bg-[#f5f5f5] dark:bg-[#27272a] w-fit max-h-[80vh] h-auto"
                style={{ scrollbarColor: "#80808057 transparent" }}
            >
                <DialogHeader>
                    <DialogTitle>Infos & Signalements</DialogTitle>
                    <DialogDescription>
                        <p className="text-[#a1a1a1]">Ici vous pouvez accéder à la documentation du logiciel <strong>ET</strong> effectuer des signalements sur des éléments possiblement faux</p>
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Voir la documentation</AccordionTrigger>
                                <AccordionContent className="max-h-[50vh] overflow-y-auto">
                                    <div className="flex flex-col gap-4">
                                        <MarkdownViewer filePath="/documentations/app.md" />
                                        <p>Contributeurs au projet FAIry :</p>
                                        <div className="*:data-[slot=avatar]:ring-background flex -space-x-3 *:data-[slot=avatar]:ring-3 *:data-[slot=avatar]:grayscale">
                                            <Avatar onClick={() => window.open("https://github.com/unicron03")} className="cursor-pointer" title="Evdp">
                                                <AvatarImage src="https://github.com/unicron03.png" alt="@unicron" />
                                                <AvatarFallback>Evdp</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Signaler un problème dans une feuille de données</AccordionTrigger>
                                <AccordionContent className="max-h-[35vh] overflow-y-auto">
                                    <DataSheetError open={open} setOpen={setOpen} />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>Signaler un problème dans le logiciel</AccordionTrigger>
                                <AccordionContent className="max-h-[32vh] overflow-y-auto">
                                    <SoftwareError />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}