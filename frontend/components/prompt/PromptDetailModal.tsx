import type { ReactNode } from "react";
import type { Prompt } from "@/types";
import { RankBadge } from "@/components/ui/RankBadge";
import { CloseIconButton } from "@/components/ui/IconButton";
import { PromptAuthorRow } from "@/components/prompt/PromptAuthorRow";
import { CopyPromptButton } from "@/components/prompt/CopyPromptButton";
import { PromptLikeButton } from "./PromptLikeButton";

type PromptDetailModalProps = {
    prompt: Prompt;
    views: number;
    isLiked: boolean;
    likeCount: number;
    likePending: boolean;
    copied: boolean;
    onClose: () => void;
    onCopy: () => void;
    onToggleLike: () => void;
    children: ReactNode;
};

export function PromptDetailModal({
    prompt,
    views,
    isLiked,
    likeCount,
    likePending,
    copied,
    onClose,
    onCopy,
    onToggleLike,
    children,
}: PromptDetailModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${prompt.id}-title`}
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <RankBadge rank={prompt.rank} />
                        <h3
                            id={`${prompt.id}-title`}
                            className="mt-4 text-2xl font-black text-zinc-950"
                        >
                            #{prompt.keyword}
                        </h3>
                    </div>
                    <CloseIconButton label="닫기" onClick={onClose} />
                </div>
                {children}
                <div className="mt-5 flex items-center justify-between">
                    <PromptAuthorRow author={prompt.author} views={views} />
                    <div className="flex items-center gap-3">
                        <PromptLikeButton
                            isLiked={isLiked}
                            likeCount={likeCount}
                            pending={likePending}
                            onToggle={onToggleLike} 
                        />
                        <CopyPromptButton copied={copied} onCopy={onCopy} />
                    </div>
                </div>
            </div>
        </div>
    );
}
