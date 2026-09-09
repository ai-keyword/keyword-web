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
    image?: string | null;
};

export function PromptDetailModal({
    prompt,
    views,
    isLiked,
    image,
    likeCount,
    likePending,
    copied,
    onClose,
    onCopy,
    onToggleLike,
    children,
}: PromptDetailModalProps) {
    const isHide = Boolean(prompt.isHide);
    const hiddenPromptLabel = "검열된 프롬프트입니다";
    const keywordTitle = isHide ? hiddenPromptLabel : `#${prompt.keyword}`;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${prompt.id}-title`}
            onClick={onClose}
        >
            <div
                className="w-[min(32rem,calc(100vw-2.5rem))] max-h-[80vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="">
                        {!isHide ? <RankBadge rank={prompt.rank} /> : null}
                        <h3
                            id={`${prompt.id}-title`}
                            className="mt-4 text-2xl font-black text-zinc-950"
                        >
                            {keywordTitle}
                        </h3>
                    </div>
                    <CloseIconButton label="닫기" onClick={onClose} />
                </div>
                {children}
                <div className="relative">
                    <img
                        src={image ?? undefined}
                        className={`mt-4 w-full rounded-sm ${isHide ? "blur-2xl" : ""}`}
                    />
                    {isHide ? (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-sm bg-black/30 backdrop-blur-sm">
                            <span className="rounded-md bg-black/75 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                                {hiddenPromptLabel}
                            </span>
                        </div>
                    ) : null}
                    <div className="mt-5 flex items-center justify-between">
                        <PromptAuthorRow
                            author={prompt.author}
                            views={views}
                            aiModel={prompt.aiModel}
                            content={prompt.content}
                        />
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
        </div>
    );
}
