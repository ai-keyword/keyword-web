"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type SearchBarProps = {
    defaultKeyword?: string;
};

export function SearchBar({ defaultKeyword = "" }: SearchBarProps) {
    const router = useRouter();
    const [keyword, setKeyword] = useState(defaultKeyword);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmedKeyword = keyword.trim().replace(/^#/, "");

        if (!trimmedKeyword) {
            router.push("/");
            return;
        }

        router.push(`/keyword/${encodeURIComponent(trimmedKeyword)}`);
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
                className="min-h-12 flex-1 rounded-lg px-4 text-base font-semibold text-zinc-950 outline-none placeholder:text-zinc-400"
            />
            <button
                type="submit"
                className="cursor-pointer flex justify-center items-center h-12 rounded-lg bg-zinc-950 px-5 text-sm font-bold text-white transition hover:bg-zinc-800"
            >
                검색
            </button>
        </form>
    );
}
