"use client";

import type { Prompt } from "@/types";
import { RankBadge } from "@/components/ui/RankBadge";
import { PromptAuthorRow } from "@/components/prompt/PromptAuthorRow";
import { PromptDetailModal } from "@/components/prompt/PromptDetailModal";
import { usePromptInteraction } from "@/components/prompt/usePromptInteraction";

type TextPromptCardProps = {
    prompt: Prompt;
    displayKeyword?: string;
};

export function TextPromptCard({
    prompt,
    displayKeyword = prompt.keyword,
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

    return (
        <>
            <button
                type="button"
                onClick={handleOpen}
                className="flex min-h-72 w-[78vw] max-w-72 shrink-0 snap-start cursor-pointer flex-col justify-between rounded-lg border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md sm:w-full sm:max-w-none"
            >
                <div className="space-y-5">
                    <div className="flex items-center justify-between gap-3">
                        <RankBadge rank={prompt.rank} />
                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">
                            #{prompt.keyword}
                        </span>
                    </div>
                    <p className="line-clamp-4 text-lg font-black leading-8 text-zinc-950">
                        {filledContent}
                    </p>
                    {prompt.description ? (
                        <p className="line-clamp-3 text-sm font-semibold leading-6 text-zinc-500">
                            {prompt.description}
                        </p>
                    ) : null}
                </div>
                <div className="mt-6">
                    <PromptAuthorRow
                        author={prompt.author}
                        views={views}
                        compact
                    />
                </div>
            </button>

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
                            {filledContent}
                        </p>
                        {prompt.description ? (
                            <p className="rounded-lg bg-zinc-50 p-4 text-sm font-semibold leading-7 text-zinc-600">
                                {prompt.description}
                            </p>
                        ) : null}
                    </div>
                </PromptDetailModal>
            ) : null}
        </>
    );
}
