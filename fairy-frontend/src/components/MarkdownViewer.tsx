import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from 'rehype-raw';
import "highlight.js/styles/github.css";

export default function MarkdownViewer({ filePath }: { filePath: string }) {
    const [content, setContent] = useState("");

    useEffect(() => {
        fetch(filePath)
            .then((res) => res.text())
            .then((text) => setContent(text))
            .catch((err) => console.error("Erreur lors du chargement du .md :", err));
    }, [filePath]);

    return (
        <div className="prose dark:prose-invert max-w-[inherit] max-h-[inherit] overflow-y-auto" style={{paddingInline: "0.6rem"}}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
