"use client";

import type { Prompt } from "@/types";
import { RankBadge } from "@/components/ui/RankBadge";
import { PromptAuthorRow } from "@/components/prompt/PromptAuthorRow";
import { PromptDetailModal } from "@/components/prompt/PromptDetailModal";
import { usePromptInteraction } from "@/components/prompt/usePromptInteraction";

type TextPromptCardProps = {
    prompt: Prompt;
    displayKeyword?: string;
    hideRank?: boolean;
};

export function TextPromptCard({
    prompt,
    displayKeyword = prompt.keyword,
    hideRank = false,
}: TextPromptCardProps) {
    const {
        isOpen,
        copied,
        views,
        isLiked,
        likeCount,
        likePending,
        filledContent,
        handleOpen,
        copyPrompt,
        toggleLike,
        close,
    } = usePromptInteraction(prompt, displayKeyword);

    const isHide = Boolean(prompt.isHide);
    const maskedText = isHide ? "검열된 프롬프트입니다" : filledContent;
    const maskedDescription = isHide
        ? "검열된 프롬프트입니다"
        : prompt.description;

    return (
        <>
            <div
                role="button"
                tabIndex={0}
                onClick={handleOpen}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleOpen();
                    }
                }}
                className="flex min-h-72 w-[78vw] max-w-72 shrink-0 snap-start cursor-pointer flex-col justify-between rounded-lg border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md sm:w-full sm:max-w-none"
            >
                <div className="space-y-5">
                    <div className="flex items-center justify-between gap-3">
                        {!hideRank && !isHide ? (
                            <RankBadge rank={prompt.rank} />
                        ) : null}
                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">
                            {isHide
                                ? "검열된 프롬프트입니다"
                                : `#${prompt.keyword}`}
                        </span>
                    </div>
                    <p
                        className={`line-clamp-4 text-lg font-black leading-8 ${isHide ? "blur-sm" : "text-zinc-950"}`}
                    >
                        {maskedText}
                    </p>
                    {maskedDescription ? (
                        <p className="line-clamp-3 text-sm font-semibold leading-6 text-zinc-500">
                            {maskedDescription}
                        </p>
                    ) : null}
                </div>
                <div className="mt-6">
                    <PromptAuthorRow
                        author={prompt.author}
                        views={views}
                        aiModel={prompt.aiModel}
                        content={prompt.content}
                        compact
                    />
                </div>
            </div>

            {isOpen ? (
                <PromptDetailModal
                    prompt={prompt}
                    views={views}
                    isLiked={isLiked}
                    likeCount={likeCount}
                    likePending={likePending}
                    copied={copied}
                    onClose={close}
                    onCopy={copyPrompt}
                    onToggleLike={toggleLike}
                >
                    <div className="space-y-3">
                        <p className="rounded-lg bg-zinc-950 p-4 font-mono text-sm font-semibold leading-7 text-white">
                            {maskedText}
                        </p>
                        {maskedDescription ? (
                            <p className="rounded-lg bg-zinc-50 p-4 text-sm font-semibold leading-7 text-zinc-600">
                                {maskedDescription}
                            </p>
                        ) : null}
                    </div>
                </PromptDetailModal>
            ) : null}
        </>
    );
}
