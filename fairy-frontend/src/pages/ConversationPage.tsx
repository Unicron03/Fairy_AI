import ThemeToggle from "@/components/ThemeToggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useConversation, Message } from "@/context/ConversationContext";
import HistoryCard from "@/components/HistoryCard";
import { useState, useEffect, JSX, useRef } from "react";
import { HistoricFilter } from "@/components/HistoricFilter";
import { HashLoader } from "react-spinners";
import { toast } from 'react-toastify';
import axios from "axios";
import DropdownMenuData from "@/components/DropdownMenuData";
import ExportDialog from "@/components/ExportDialog";
import InfoPanel from "@/components/InfoPanel";
import { CircleStop, SendHorizonal, ArrowDown } from "lucide-react";
import { useUser } from "@/context/UserContext";

function escapeRegExp(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightMatch(text: string, search: string): (string | JSX.Element)[] {
    if (!search) return [text];

    const escapedSearch = escapeRegExp(search);
    const regex = new RegExp(escapedSearch, "gi");

    const result: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    for (const match of text.matchAll(regex)) {
        const start = match.index!;
        const end = start + match[0].length;

        // Texte avant la correspondance
        if (start > lastIndex) {
            result.push(text.slice(lastIndex, start));
        }

        // Correspondance surlignée
        result.push(
            <strong key={start} className="font-bold">
                {text.slice(start, end)}
            </strong>
        );

        lastIndex = end;
    }

    // Texte après la dernière correspondance
    if (lastIndex < text.length) {
        result.push(text.slice(lastIndex));
    }

    return result;
}

export default function ConversationPage() {
    const MAX_HEIGHT_QUESTION_AREA = 300;
    const MARGIN_HISTORY_QUESTION_PANEL = 30;

    const { selectedConversationId, saveConversation, runningConvId, setRunningConvId } = useConversation()
    const [messages, setMessages] = useState<Message[]>([])
    const { user } = useUser();

    const fileInputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const divQuestionRef = useRef<HTMLDivElement>(null)

    const [search, setSearch] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [question, setQuestion] = useState<string>("")
    const [atBottom, setAtBottom] = useState(true)
    const [abortController, setAbortController] = useState<AbortController | null>(null)
    const historyRef = useRef<HTMLDivElement>(null)

    const [pendingQuestion, setPendingQuestion] = useState<string | null>(null)
    const bottomRef = useRef<HTMLDivElement | null>(null)
    const [inputHeight, setInputHeight] = useState(MARGIN_HISTORY_QUESTION_PANEL)
    const [useCsv, setUseCsv] = useState<boolean>(false)
    const [file, setFile] = useState<File | null>(null)
    const [csvTable, setCsvTable] = useState<string[][]>([])
    const [answer, setAnswer] = useState<string>("")
    const [arrowdownBottom, setArrowdownBottom] = useState(divQuestionRef.current?.offsetHeight)

    const [checked, setChecked] = useState<boolean>(false)

    // Filtre l'historique en fonction de la recherche
    const paginatedHistory = messages.filter((entry) =>
        entry.question.toLowerCase().includes(search.toLowerCase()) || entry.answer.toLowerCase().includes(search.toLowerCase())
    );

    const actionScroll = () => {
        const el = historyRef.current;
        if (!el) return;

        const nearBottom = el.scrollTop + el.clientHeight + 200 >= el.scrollHeight;
        setAtBottom(nearBottom);
    }
  
    useEffect(() => {
        if (!selectedConversationId) return
    
        const fetchMessages = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/conversations/${selectedConversationId}`)
                const data = await res.json()
                setMessages(data.messages)
                console.log(messages)
            } catch (err) {
                console.error("Erreur lors du chargement des messages :", err)
            }
        }
  
        fetchMessages()
    }, [selectedConversationId])

    // On scroll en bas de la page à chaque rafraichissement
    useEffect(() => {
        // Attend la fin du rendu pour s'assurer que bottomRef est bien visible
        const scroll = () => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        };
        
        // Scroll après un léger délai pour laisser React finir de rendre
        const timeout = setTimeout(scroll, 50); // 50ms fonctionne bien dans la plupart des cas
        
        return () => clearTimeout(timeout);
    }, [messages]);

    // Gère la soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!question && abortController) {
            setAbortController(null);
            return;
        } else if (!question) {
            toast.warn('Merci de poser une question', {
                progressClassName: "fancy-progress-bar", closeOnClick: true, autoClose: 3000, theme: localStorage.getItem("theme") || "light"
            });
            return;
        }
        const controller = new AbortController(); // Création d'un nouvel AbortController
        setAbortController(controller); // Sauvegarder le contrôleur pour pouvoir l'utiliser plus tard
        const signal = controller.signal;
    
        setLoading(true);
    
        if (useCsv) {
            if (!file) {
                toast("Vous avez activé l'utilisation du CSV, mais aucun fichier n'est attaché.", {
                    className: "bg-gray-100 dark:bg-[#27272a] text-black dark:text-white",
                    progressClassName: "fancy-progress-bar",
                });
                setLoading(false);
                return;
            }
        
            requestAnimationFrame(() => {
                scrollToBottom();
            });
            setPendingQuestion(question);
            setRunningConvId(selectedConversationId);
            setQuestion("");
        
            const reader = new FileReader();
        
            reader.onload = async (event) => {
                const text = event.target?.result as string;
                setCsvTable(parseCsvToTable(text));
        
                try {
                    const res = await axios.post("http://127.0.0.1:8000/ask", {
                        question,
                        csv_data: text,
                    }, { signal });
            
                    setAnswer(res.data.answer);
                    if (selectedConversationId) {
                        saveConversation(
                            selectedConversationId,
                            res.data.answer,
                            res.data.tokens_used,
                            res.data.duration,
                            question,
                            file && checked ? file.name : undefined
                        );
                    }
                    setPendingQuestion(null);
                    setRunningConvId(null)
                } catch (err) {
                    if (axios.isCancel(err)) {
                    } else {
                        alert("Erreur lors de la communication avec l'API.");
                    }
                } finally {
                    setLoading(false);
                }
            };
            reader.readAsText(file); // `file` est garanti non-null ici
        } else {
            requestAnimationFrame(() => {
                scrollToBottom();
            });
            setPendingQuestion(question);
            setRunningConvId(selectedConversationId);
            setQuestion("");
        
            try {
                const res = await axios.post("http://127.0.0.1:8000/ask", {
                    question,
                    csv_data: null,
                }, { signal });
        
                setAnswer(res.data.answer);
                if (selectedConversationId) {
                    saveConversation(
                        selectedConversationId,
                        res.data.answer,
                        res.data.tokens_used,
                        res.data.duration,
                        question,
                        file && checked ? file.name : undefined
                    );
                }
                setPendingQuestion(null);
                setRunningConvId(null)
            } catch (err) {
                if (axios.isCancel(err)) {
                } else {
                    alert("Erreur lors de la communication avec l'API.");
                }
            } finally {
                setLoading(false);
            }
        }
    };
    
    // Annule la soumission du formulaire
    const handleStop = () => {
        if (abortController) {
            abortController.abort();
            setLoading(false);
            setPendingQuestion(null);
            setRunningConvId(null)
        }
    };
    
    // Gère l'importation du fichier CSV
    const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0] || null;
        setFile(uploadedFile);
        if (uploadedFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                setCsvTable(parseCsvToTable(text));
            };
            reader.readAsText(uploadedFile);
        } else {
            setCsvTable([]);
            setUseCsv(false); // On désactive le levier d'utilisation du CSV si on enlève le CSV
        }
    };

    // Ajuste la hauteur de l'input de la question en fonction de son contenu
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = Math.min(textarea.scrollHeight, MAX_HEIGHT_QUESTION_AREA) + "px"; // max 200px
        }
    };
    
    // Callback dans la zone de saisie pour mettre à jour la hauteur
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
        // setInputHeight(Math.min(e.target.scrollHeight, MAX_HEIGHT_QUESTION_AREA) + (MARGIN_HISTORY_QUESTION_PANEL - 40));
        setArrowdownBottom(Math.min(e.target.scrollHeight, MAX_HEIGHT_QUESTION_AREA) + (MARGIN_HISTORY_QUESTION_PANEL + 60));
        
        requestAnimationFrame(() => {
            scrollToBottom();
        });
    };
    
    // Scroll vers le bas de la page
    const scrollToBottom = () => {
        // Attend la fin du rendu pour s'assurer que bottomRef est bien visible
        const scroll = () => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        };
    
        // Scroll après un léger délai pour laisser React finir de rendre
        const timeout = setTimeout(scroll, 50); // 50ms fonctionne bien dans la plupart des cas
    
        return () => clearTimeout(timeout);
    };

    // Tranforme un CSV en tableau
    const parseCsvToTable = (text: string): string[][] =>
        text.trim().split("\n").map((line) => line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((cell) => cell.replace(/^"|"$/g, "").trim())
    );

    return (
        <div className="h-screen flex flex-col">
            {/* Logo */}
            <header style={{padding: "15px"}} className="sticky flex justify-center top-0 left-0 right-0 mb-[45px] bg-white dark:bg-[#09090b] z-30">
                <div className="absolute w-[-webkit-fill-available] top-[15px] flex justify-center">
                    <img style={{height: "70px"}} src="../src/logo.png"></img>
                </div>

                <div className="w-full flex justify-between items-center">
                    <SidebarTrigger className="z-50 hover:opacity-60" />
                    <ThemeToggle />
                </div>
            </header>

            {/* Barre de filtre d'historique */}
            <HistoricFilter search={search} setSearch={setSearch}></HistoricFilter>

            {/* Historique des Q/R */}
            <div
                className="flex-1 overflow-y-auto px-4 space-y-[22px] flex flex-col" ref={historyRef} id="history" onScroll={() => actionScroll()}
                style={{gap: "10px", scrollbarColor: "#80808057 transparent", paddingBottom: inputHeight}}
            >
                {paginatedHistory.slice().map((entry, index) => (
                    <HistoryCard key={index} index={index} question={highlightMatch(entry.question, search)} answer={highlightMatch(entry.answer, search)} tokens={entry.tokens} duration={entry.duration} file={entry.fileUsed} />
                ))}

                {runningConvId === selectedConversationId && pendingQuestion && (
                    <HistoryCard question={pendingQuestion} answer={<HashLoader size={20} color="#4f46e5" />} />
                )}
                
                <div ref={bottomRef} style={{margin: "0"}}/>
            </div>

            {/* Input de question */}
            <div className="sticky bottom-0 left-0 right-0 z-40">
                <form
                    onSubmit={handleSubmit}
                    className="w-[60%] m-auto text-black dark:text-white p-4 shadow-[0px_4px_31px_29px_rgb(255,255,255)] dark:shadow-[0px_4px_31px_29px_rgb(9,9,11)]"
                >
                    <div
                        className="mx-auto flex items-center gap-2 bg-gray-100 dark:bg-[#27272a] border-[0.15rem] border-[#6b6b6b]"
                        ref={divQuestionRef}
                        style={{
                        maxWidth: "800px",
                        borderRadius: "30px",
                        padding: "0 15px",
                        scrollbarColor: "#80808057 transparent"
                        }}
                    >
                        <div className="flex gap-4 divAttachSend">
                            <InfoPanel />
                            <ExportDialog history={messages} author={user?.name} />
                        </div>
                        
                        <div style={{width: "-webkit-fill-available"}}>
                            <textarea
                                ref={textareaRef}
                                value={question}
                                onInput={handleInput}
                                onChange={(e) => {
                                    setQuestion(e.target.value);
                                    adjustTextareaHeight();
                                }}
                                onKeyDown={(e) => {
                                    if (!loading && (e.ctrlKey || e.metaKey) && e.key === "Enter") {
                                        handleSubmit(e as unknown as React.FormEvent); // Cast car handleSubmit attend un FormEvent
                                    }
                                }}
                                placeholder="Poser une question..."
                                className="flex-1 resize-none p-2 rounded border dark:bg-[#27272a] dark:text-white"
                                style={{
                                    border: "none",
                                    background: "none",
                                    outline: "none",
                                    maxHeight: `${MAX_HEIGHT_QUESTION_AREA}px`,
                                    overflowY: "auto",
                                    width: "inherit",
                                }}
                                rows={1}
                            />
                            <p
                                className="p-2"
                                style={{fontStyle: "italic", fontSize: "small", color: "darkgray"}}
                            >
                                {file && checked ? `Vous utiliser actuellement les données du fichier : ${file.name}` : "N'oubliez pas d'inclure votre fichier CSV et de l'attacher si besoin (bouton 'Données')"}
                            </p>
                        </div>
                        <input
                            type="file"
                            accept=".csv"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleCsvImport}
                        />
                        <div className="divAttachSend">
                            <DropdownMenuData file={file} setFile={setFile} checked={checked} setChecked={setChecked}></DropdownMenuData>

                            {loading ? (
                                <button
                                    type="button"
                                    onClick={handleStop}
                                    title="Arrêter la requête"
                                >
                                    <CircleStop size={24} className="hover:opacity-60" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    title="Envoyer la question"
                                >
                                    <SendHorizonal size={24} className="hover:opacity-60" />
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            {/* Bouton pour revenir en bas de l'histo */}
            <div
                className="mx-auto absolute bottom-[115px] w-[-webkit-fill-available] justify-center z-50"
                style={{ display: atBottom ? 'none' : 'flex', bottom: arrowdownBottom }}
            >
                <button className="cursor-pointer bg-gray-200 dark:bg-gray-800 p-2 rounded-full shadow-lg animate-bounce" onClick={scrollToBottom} title="Aller en bas">
                    <ArrowDown />
                </button>
            </div>
        </div>
    )
}
