"use client";

import { resolveImageUrl } from "@/lib/api";
import type { Prompt } from "@/types";
import { RankBadge } from "@/components/ui/RankBadge";
import { PromptAuthorRow } from "@/components/prompt/PromptAuthorRow";
import { PromptDetailModal } from "@/components/prompt/PromptDetailModal";
import { usePromptInteraction } from "@/components/prompt/usePromptInteraction";
import { useEffect } from "react";

type PromptCardProps = {
    prompt: Prompt;
    displayKeyword?: string;
    hideRank?: boolean;
};

const thumbnailOverlay =
    "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.08) 45%, rgba(0,0,0,0.18) 100%)";

export function PromptCard({
    prompt,
    displayKeyword = prompt.keyword,
    hideRank = false,
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

    const isHide = Boolean(prompt.isHide);
    const imageUrl = resolveImageUrl(prompt.thumbnailUrl);
    const thumbnailBackground = imageUrl
        ? `${thumbnailOverlay}, url(${imageUrl})`
        : thumbnailOverlay;
    const maskedPromptText = isHide ? "검열된 프롬프트입니다" : filledContent;

    useEffect(() => {
        console.log(isHide);
    }, []);
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
                    aria-label={`${prompt.keyword} 이미지 프롬프트 썸네일`}
                >
                    {/* 배경 이미지 및 블러 처리 영역 */}
                    <div
                        className={`absolute inset-0 bg-contain bg-center bg-no-repeat transition duration-300 ${
                            isHide ? "blur-2xl scale-110" : ""
                        }`}
                        style={{ backgroundImage: thumbnailBackground }}
                    />

                    {/* isHide일 때 위에 표시될 문구 및 가우시안/백드롭 블러 오버레이 */}
                    {isHide ? (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 p-2 text-center backdrop-blur-sm">
                            <span className="rounded-md bg-black/75 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-xs">
                                검열된 프롬프트입니다
                            </span>
                        </div>
                    ) : null}

                    {!hideRank ? (
                        <div className="absolute left-3 top-3 z-20">
                            <RankBadge rank={prompt.rank} />
                        </div>
                    ) : null}
                </div>
                <div className="flex min-h-40 flex-1 flex-col justify-between gap-5 p-4">
                    <p className="line-clamp-3 text-base font-extrabold leading-7 text-zinc-950">
                        {maskedPromptText}
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
                        {maskedPromptText}
                    </p>
                </PromptDetailModal>
            ) : null}
        </>
    );
}
