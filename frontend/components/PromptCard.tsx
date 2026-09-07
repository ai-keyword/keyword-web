"use client";

import { useState } from "react";
import { fillKeyword } from "@/lib/api";
import type { Prompt } from "@/lib/types";
import { RankBadge } from "@/components/RankBadge";

type PromptCardProps = {
  prompt: Prompt;
  displayKeyword?: string;
};

export function PromptCard({ prompt, displayKeyword = prompt.keyword }: PromptCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const filledContent = fillKeyword(prompt.content, displayKeyword);
  const thumbnailBackground = prompt.thumbnailUrl
    ? `linear-gradient(135deg, rgba(250,250,250,0.15), rgba(231,240,255,0.42)), url(${prompt.thumbnailUrl})`
    : "linear-gradient(135deg, #fafafa 0%, #e7f0ff 48%, #f1f5f9 100%)";

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
        className="group flex w-[78vw] max-w-72 shrink-0 snap-start flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md sm:w-full sm:max-w-none"
      >
        <div
          className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-zinc-100 bg-cover bg-center px-6 text-center transition duration-300 group-hover:scale-[1.02]"
          style={{ backgroundImage: thumbnailBackground }}
          aria-label={`${prompt.keyword} 이미지 프롬프트 썸네일`}
        >
          <span className="rounded-md bg-white/80 px-3 py-2 text-3xl font-black text-zinc-900 shadow-sm backdrop-blur">
            #{prompt.keyword}
          </span>
          <div className="absolute left-3 top-3">
            <RankBadge rank={prompt.rank} />
          </div>
        </div>
        <div className="flex min-h-40 flex-1 flex-col justify-between gap-5 p-4">
          <p className="line-clamp-3 text-base font-extrabold leading-7 text-zinc-950">
            {filledContent}
          </p>
          <div className="flex items-center justify-between gap-3 text-sm font-semibold text-zinc-500">
            <span>{prompt.author}</span>
            <span>#{prompt.keyword}</span>
          </div>
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
            className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <RankBadge rank={prompt.rank} />
                <h3 id={`${prompt.id}-title`} className="mt-4 text-2xl font-black text-zinc-950">
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
            <p className="rounded-lg bg-zinc-50 p-4 text-base font-bold leading-8 text-zinc-950">
              {filledContent}
            </p>
            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-zinc-500">작성자 {prompt.author}</span>
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
