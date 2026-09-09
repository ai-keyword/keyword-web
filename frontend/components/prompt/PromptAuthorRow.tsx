import view from "@/public/views.svg";
import type { PromptAuthor } from "@/types";
import { buildAiChatUrl } from "@/lib/aiChatUrls";

type PromptAuthorRowProps = {
    author: PromptAuthor;
    views: number;
    aiModel?: string;
    compact?: boolean;
    content?: string;
};

export function PromptAuthorRow({
    author,
    views,
    aiModel,
    content,
    compact = false,
}: PromptAuthorRowProps) {
    const aiLabel = aiModel ? ` · AI: ${aiModel}` : "";
    const aiUrl = buildAiChatUrl(aiModel, content);

    const aiNode = aiModel ? (
        <a
            href={aiUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer underline decoration-zinc-400 underline-offset-2 transition hover:text-zinc-950 hover:decoration-zinc-950"
            onClick={(event) => {
                if (!content) return;

                if (typeof navigator !== "undefined" && navigator.clipboard) {
                    event.preventDefault();
                    void navigator.clipboard.writeText(content);
                    if (typeof window !== "undefined") {
                        window.open(
                            aiUrl ?? "#",
                            "_blank",
                            "noopener,noreferrer",
                        );
                    }
                }
            }}
        >
            {aiLabel}
        </a>
    ) : null;

    if (compact) {
        return (
            <div className="flex items-center justify-between gap-3 text-sm font-semibold text-zinc-500">
                <span>
                    작성자: {author.username}
                    {aiNode}
                </span>
                <span className="flex items-center gap-1">
                    <img
                        src={view.src}
                        className="w-4 h-4 text-zinc-500"
                        alt="조회수"
                    />{" "}
                    {views}
                </span>
            </div>
        );
    }

    return (
        <span className="text-sm font-semibold text-zinc-500 flex items-center gap-1">
            작성자: {author.username}
            {aiNode} (
            <img src={view.src} className="w-4 h-4" alt="조회수" /> {views})
        </span>
    );
}
