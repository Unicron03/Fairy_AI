import React, { useState, useEffect, useRef, JSX } from "react";
import axios from "axios";
import { SendHorizonal, CircleStop, ArrowDown } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import HistoryCard from "../components/HistoryCard";
import { HashLoader } from "react-spinners";
import { toast } from 'react-toastify';
import DropdownMenuData from "../components/DropdownMenuData";
import { HistoricFilter } from "../components/HistoricFilter";
import InfoPanel from "../components/InfoPanel";
import ExportDialog from "../components/ExportDialog";
import { SidebarTrigger } from "../components/ui/sidebar";
import { useConversation } from "@/context/ConversationContext";

type Message = {
  id: string
  question: string
  answer: string
  tokens: number
  duration: number
}

function highlightMatch(text: string, search: string): string | (string | JSX.Element)[] {
  if (!search) return text;

  const regex = new RegExp(`(${search})`, 'gi');
  return text.split(regex).map((part, index) =>
    part.toLowerCase() === search.toLowerCase() ? (
      <strong key={index} className="font-bold">{part}</strong>
    ) : (
      part
    )
  );
}

function AskForm() {
  // const { user, logout } = useUser();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const divQuestionRef = useRef<HTMLDivElement>(null);
  const { selectedConversationId } = useConversation();
  
  const MAX_HEIGHT_QUESTION_AREA = 300;
  const MARGIN_HISTORY_QUESTION_PANEL = 30;

  const [file, setFile] = useState<File | null>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [csvTable, setCsvTable] = useState<string[][]>([]);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [history, setHistory] = useState<{ question: string, answer: string, tokens: number, duration: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasLoadedHistory, setHasLoadedHistory] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [useCsv, setUseCsv] = useState<boolean>(false);
  const [inputHeight, setInputHeight] = useState(MARGIN_HISTORY_QUESTION_PANEL);
  const [arrowdownBottom, setArrowdownBottom] = useState(divQuestionRef.current?.offsetHeight);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (!selectedConversationId) return

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/conversations/${selectedConversationId}`)
        const data = await res.json()
        setMessages(data.messages)
      } catch (err) {
        console.error("Erreur lors du chargement des messages :", err)
      }
    }

    fetchMessages()
  }, [selectedConversationId])

  // Récupère l'historique du cache
  useEffect(() => {
    const savedHistory = localStorage.getItem("qa_history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) setHistory(parsed);
      } catch (e) {
        console.error("JSON parsing failed for qa_history", e);
      }
    }
    setHasLoadedHistory(true);
  }, []);

  // Sauvegarde l'historique dans le cache
  useEffect(() => {
    if (hasLoadedHistory) {
      localStorage.setItem("qa_history", JSON.stringify(history));
    }
  }, [history, hasLoadedHistory]);

  // On scroll en bas de la page à chaque rafraichissement
  useEffect(() => {
    // Attend la fin du rendu pour s'assurer que bottomRef est bien visible
    const scroll = () => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    // Scroll après un léger délai pour laisser React finir de rendre
    const timeout = setTimeout(scroll, 50); // 50ms fonctionne bien dans la plupart des cas
  
    return () => clearTimeout(timeout);
  }, [history]);

  // Tranforme un CSV en tableau
  const parseCsvToTable = (text: string): string[][] =>
    text.trim().split("\n").map((line) =>
      line
        .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map((cell) => cell.replace(/^"|"$/g, "").trim())
    );

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
          setHistory((prev) => [...prev, { question, answer: res.data.answer, tokens: res.data.tokens_used, duration: res.data.duration }]);
          setPendingQuestion(null);
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
      setQuestion("");

      try {
        const res = await axios.post("http://127.0.0.1:8000/ask", {
          question,
          csv_data: null,
        }, { signal });

        setAnswer(res.data.answer);
        setHistory((prev) => [...prev, { question, answer: res.data.answer, tokens: res.data.tokens_used, duration: res.data.duration }]);
        setPendingQuestion(null);
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

  // Filtre l'historique en fonction de la recherche
  const paginatedHistory = history.filter((entry) =>
    entry.question.toLowerCase().includes(search.toLowerCase()) || entry.answer.toLowerCase().includes(search.toLowerCase())
  );

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

  const actionScroll = () => {
    const el = historyRef.current;
    if (!el) return;

    const nearBottom = el.scrollTop + el.clientHeight + 200 >= el.scrollHeight;
    setAtBottom(nearBottom);
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Logo */}
      <header style={{padding: "15px"}} className="sticky top-0 left-0 right-0 mb-[45px] bg-white dark:bg-[#09090b] z-30">        
        <div className="absolute w-[-webkit-fill-available] top-[15px] flex justify-center">
          <img style={{height: "70px"}} src="src/logo.png"></img>
        </div>

        <div className="flex justify-between items-center">
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
        {messages.map((msg, index) => (
          <HistoryCard
            key={msg.id}
            index={index}
            question={msg.question}
            answer={msg.answer}
            tokens={msg.tokens}
            duration={msg.duration}
          />
        ))}
      </div>
    </div>
  );
}

export default AskForm;