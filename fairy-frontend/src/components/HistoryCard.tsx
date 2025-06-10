// src/components/HistoryCard.tsx
import React, { JSX, ReactNode, useState } from "react";
import { Copy, Check } from "lucide-react";

// (string | JSX.Element)[] for filter response in bold with <strong>
type HistoryCardProps = {
  question: string | (string | JSX.Element)[];
  answer: string | (string | JSX.Element)[] | React.ReactElement;
  tokens?: number;
  duration?: number;
};

function formatDuration(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.round(duration % 60);
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    if (minutes > 0) {
        return `${minutes}min${paddedSeconds}s`;
    } else {
        return `${seconds}s`;
    }
}

/**
 * Transforme n'importe quel ReactNode en string brute
 */
function flattenText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  if (React.isValidElement(node)) return flattenText((node.props as { children?: ReactNode }).children);
  
  return "";
}

const HistoryCard: React.FC<HistoryCardProps> = ({ question, answer, tokens, duration }) => {
    const [copiedAnswer, setCopiedAnswer] = useState(false);
    const [copiedQuestion, setCopiedQuestion] = useState(false);

    const copyText = (text: string, isQuestion: boolean) => {
        navigator.clipboard.writeText(text).then(() => {
            if (isQuestion) {
                setCopiedQuestion(true);
                setTimeout(() => setCopiedQuestion(false), 2000);
            } else {
                setCopiedAnswer(true);
                setTimeout(() => setCopiedAnswer(false), 2000);
            }
        });
    };

    return (
        <div
            className="my-0 text-black dark:text-white"
            style={{display: "flex", flexDirection: "column", maxWidth: "850px", alignSelf: "center", width: "-webkit-fill-available"}}
        >
            <div
                className="relative group max-w-[500px] w-fit self-end mb-[20px] p-4 bg-gray-100 dark:bg-[#27272a] rounded-[calc(4px+0.75rem)]"
            >
                <span className="whitespace-pre-wrap" style={{paddingBlock: "28px"}}>{question}</span>

                <button
                    onClick={() => copyText(flattenText(question), true)}
                    className="absolute -bottom-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Copier la question"
                    >
                    {copiedQuestion ? <Check /> : <Copy className="hover:opacity-60" />}
                </button>
            </div>

            <div
                className="relative group w-fit max-w-[700px] mb-[20px]"
                style={{ position: "relative" }}
            >
                <span className="whitespace-pre-wrap" style={{paddingBlock: "12px"}}>{answer}</span>
                <br />
                {(duration !== undefined && tokens !== undefined) && (
                    <span style={{ fontSize: "small", color: "darkgray" }}>
                        {formatDuration(duration)} | {tokens} tokens
                    </span>
                )}

                {!React.isValidElement(answer) && (
                    <button
                        onClick={() => copyText(flattenText(answer), false)}
                        className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        title="Copier la réponse"
                    >
                        {copiedAnswer ? <Check /> : <Copy className="hover:opacity-60" />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default HistoryCard;