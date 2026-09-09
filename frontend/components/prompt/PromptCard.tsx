"use client";

import { resolveImageUrl } from "@/lib/api";
import type { Prompt } from "@/types";
import { RankBadge } from "@/components/ui/RankBadge";
import { PromptAuthorRow } from "@/components/prompt/PromptAuthorRow";
import { PromptDetailModal } from "@/components/prompt/PromptDetailModal";
import { usePromptInteraction } from "@/components/prompt/usePromptInteraction";

type PromptCardProps = {
    prompt: Prompt;
    displayKeyword?: string;
};

const thumbnailOverlay =
    "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.08) 45%, rgba(0,0,0,0.18) 100%)";

export function PromptCard({
    prompt,
    displayKeyword = prompt.keyword,
}: PromptCardProps) {
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

    const imageUrl = resolveImageUrl(prompt.thumbnailUrl);
    const thumbnailBackground = imageUrl
        ? `${thumbnailOverlay}, url(${imageUrl})`
        : thumbnailOverlay;

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
                className="group flex w-[78vw] max-w-72 shrink-0 snap-start cursor-pointer flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md sm:w-full sm:max-w-none"
            >
                <div
                    className="relative flex aspect-4/3 items-center justify-center overflow-hidden bg-zinc-100 bg-contain bg-center bg-no-repeat px-6 text-center transition duration-300 group-hover:scale-[1.02]"
                    style={{ backgroundImage: thumbnailBackground }}
                    aria-label={`${prompt.keyword} 이미지 프롬프트 썸네일`}
                >
                    <div className="absolute left-3 top-3">
                        <RankBadge rank={prompt.rank} />
                    </div>
                </div>
                <div className="flex min-h-40 flex-1 flex-col justify-between gap-5 p-4">
                    <p className="line-clamp-3 text-base font-extrabold leading-7 text-zinc-950">
                        {filledContent}
                    </p>
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
                    image={imageUrl}
                    onCopy={copyPrompt}
                    onToggleLike={toggleLike}
                >
                    <p className="rounded-lg bg-zinc-50 p-4 text-base font-bold leading-8 text-zinc-950">
                        {filledContent}
                    </p>
                </PromptDetailModal>
            ) : null}
        </>
    );
}
