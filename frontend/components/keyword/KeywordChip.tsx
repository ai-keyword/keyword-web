"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLoading } from "@/components/providers/LoadingProvider";

type KeywordChipProps = {
    keyword: string;
    active?: boolean;
};

export function KeywordChip({ keyword, active = false }: KeywordChipProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { startLoading } = useLoading();
    const target = `/keyword/${encodeURIComponent(keyword)}`;

    function handleClick() {
        if (pathname === target) {
            return;
        }

        startLoading();
        window.setTimeout(() => {
            router.push(target);
        }, 260);
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className={[
                "cursor-pointer inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-sm font-semibold transition whitespace-nowrap",
                active
                    ? "border-foreground bg-foreground text-background"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400",
            ].join(" ")}
        >
            #{keyword}
        </button>
    );
}
