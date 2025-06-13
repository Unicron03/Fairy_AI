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
import { Info } from "lucide-react"
import DataSheetError from "./infoPanel-elements/DataSheetError";
import SoftwareError from "./infoPanel-elements/SoftwareError";

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
                className="bg-[#f5f5f5] dark:bg-[#27272a] w-fit h-fit"
                style={{ scrollbarColor: "#80808057 transparent" }}
            >
                <DialogHeader>
                    <DialogTitle>Infos & Signalements</DialogTitle>
                    <DialogDescription>
                        <p>Ici vous pouvez accéder à la documentation du logiciel <strong>ET</strong> effectuer des signalements sur des éléments possiblement faux</p>
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Voir la documentation</AccordionTrigger>
                                <AccordionContent>
                                    Une super documentation
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Signaler un problème dans une feuille de données</AccordionTrigger>
                                <AccordionContent>
                                    <DataSheetError open={open} setOpen={setOpen} />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>Signaler un problème dans le logiciel</AccordionTrigger>
                                <AccordionContent>
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