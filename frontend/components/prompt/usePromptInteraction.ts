"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { fillKeyword, incrementPromptView } from "@/lib/api";
import type { Prompt } from "@/types";

export function usePromptInteraction(
    prompt: Prompt,
    displayKeyword = prompt.keyword,
) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [views, setViews] = useState(prompt.views);
    const filledContent = fillKeyword(prompt.content, displayKeyword);

    async function handleOpen() {
        setIsOpen(true);
        try {
            await incrementPromptView(prompt.id);
            setViews((prev) => prev + 1);
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    }

    async function copyPrompt() {
        await navigator.clipboard.writeText(filledContent);
        setCopied(true);
        toast.success("프롬프트가 복사되었습니다!");
        window.setTimeout(() => setCopied(false), 1400);
    }

    function close() {
        setIsOpen(false);
    }

    return {
        isOpen,
        copied,
        views,
        filledContent,
        handleOpen,
        copyPrompt,
        close,
    };
}
