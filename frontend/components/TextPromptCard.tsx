"use client";

import { useState } from "react";
import { fillKeyword } from "@/lib/api";
import type { Prompt } from "@/lib/types";
import { RankBadge } from "@/components/RankBadge";

type TextPromptCardProps = {
    prompt: Prompt;
    displayKeyword?: string;
};

export function TextPromptCard({
    prompt,
    displayKeyword = prompt.keyword,
}: TextPromptCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const filledContent = fillKeyword(prompt.content, displayKeyword);

    async function copyPrompt() {
        await navigator.clipboard.writeText(filledContent);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="cursor-pointer flex min-h-72 w-[78vw] max-w-72 shrink-0 snap-start flex-col justify-between rounded-lg border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md sm:w-full sm:max-w-none"
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
                <div className="mt-6 flex items-center justify-between gap-3 text-sm font-semibold text-zinc-500">
                    <span>{prompt.author}</span>
                    <span>글씨 프롬프트</span>
                </div>
            </button>

            {isOpen ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={`${prompt.id}-title`}
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl"
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
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="h-10 w-10 rounded-md border border-zinc-200 text-xl font-bold text-zinc-500 hover:bg-zinc-50"
                                aria-label="닫기"
                            >
                                ×
                            </button>
                        </div>
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
                        <div className="mt-5 flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-zinc-500">
                                작성자 {prompt.author}
                            </span>
                            <button
                                type="button"
                                onClick={copyPrompt}
                                className="h-11 rounded-lg bg-zinc-950 px-5 text-sm font-bold text-white hover:bg-zinc-800"
                            >
                                {copied ? "복사됨" : "복사"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
