"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { fillKeyword, incrementPromptView } from "@/lib/api";
import type { Prompt } from "@/types";
import { togglePromptLikeAction } from "@/app/prompts/actions";

export function usePromptInteraction(
    prompt: Prompt,
    displayKeyword = prompt.keyword,
) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [views, setViews] = useState(prompt.views);
    const [isLiked, setIsLiked] = useState(prompt.isLiked);
    const [likeCount, setLikeCount] = useState(prompt.likeCount);
    const [likePending, setLikePending] = useState(false);
    const likeCooldownRef = useRef(false);
    const filledContent = fillKeyword(prompt.content, displayKeyword);

    async function handleOpen() {
        setIsOpen(true);

        const viewStorageKey = `prompt-viewed:${prompt.id}`;
        if (window.localStorage.getItem(viewStorageKey)) return;

        window.localStorage.setItem(viewStorageKey, "1");
        try {
            await incrementPromptView(prompt.id);
            setViews((prev) => prev + 1);
            router.refresh();
        } catch (error) {
            window.localStorage.removeItem(viewStorageKey);
            console.error(error);
        }
    }

    async function copyPrompt() {
        await navigator.clipboard.writeText(filledContent);
        setCopied(true);
        toast.success("프롬프트가 복사되었습니다!");
        window.setTimeout(() => setCopied(false), 1400);
    }

    async function toggleLike() {
        if (likePending || likeCooldownRef.current) return;

        const previousIsLiked = isLiked;
        const previousLikeCount = likeCount;
        const nextIsLiked = !isLiked;
        setIsLiked(nextIsLiked);
        setLikeCount((count) => count + (nextIsLiked ? 1 : -1));
        setLikePending(true);

        const result = await togglePromptLikeAction(prompt.id);
        setLikePending(false);
        likeCooldownRef.current = true;
        window.setTimeout(() => {
            likeCooldownRef.current = false;
        }, 500);

        if (
            result.error ||
            result.is_liked === undefined ||
            result.like_count === undefined
        ) {
            setIsLiked(previousIsLiked);
            setLikeCount(previousLikeCount);
            toast.error(result.error ?? "좋아요 처리에 실패했습니다.");
            return;
        }

        setIsLiked(result.is_liked);
        setLikeCount(result.like_count);
    }

    function close() {
        setIsOpen(false);
    }

    return {
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
    };
}
