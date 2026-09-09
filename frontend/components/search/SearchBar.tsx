"use client";

import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useLoading } from "@/components/providers/LoadingProvider";

function extractKeywordFromPath(pathname: string): string {
    const match = pathname.match(/^\/keyword\/([^/]+)/);
    if (!match) return "";
    return decodeURIComponent(match[1]);
}

export function SearchBar() {
    const router = useRouter();
    const pathname = usePathname();
    const currentKeyword = extractKeywordFromPath(pathname);
    const { startLoading } = useLoading();

    const [keyword, setKeyword] = useState(currentKeyword);

    useEffect(() => {
        setKeyword(currentKeyword);
    }, [currentKeyword]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmed = keyword.trim().replace(/^#/, "");
        if (!trimmed) {
            if (pathname !== "/") {
                startLoading();
                window.setTimeout(() => router.push("/"), 260);
            }
            return;
        }

        const targetPath = `/keyword/${encodeURIComponent(trimmed)}`;
        if (pathname === targetPath) {
            return;
        }

        startLoading();
        window.setTimeout(() => router.push(targetPath), 260);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-2xl items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm"
        >
            <label className="sr-only" htmlFor="keyword-search">
                키워드 검색
            </label>
            <input
                id="keyword-search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="#키워드를 검색"
                className="h-8 flex-1 rounded-lg px-4 text-base font-semibold text-zinc-950 outline-none placeholder:text-zinc-400"
            />
            <button
                type="submit"
                className="cursor-pointer flex h-8 items-center justify-center rounded-lg bg-zinc-950 px-5 text-sm font-bold text-white transition hover:bg-zinc-800"
            >
                검색
            </button>
        </form>
    );
}
