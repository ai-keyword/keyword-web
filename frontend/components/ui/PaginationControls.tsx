import Link from "next/link";
import type { PromptType } from "@/types";

type PaginationControlsProps = {
    page: number;
    totalPages: number;
    sort?: "rank" | "recent";
    keyword?: string;
    type?: PromptType;
    basePath: string;
};

export function PaginationControls({
    page,
    totalPages,
    sort,
    keyword,
    type,
    basePath,
}: PaginationControlsProps) {
    if (totalPages <= 1) {
        return null;
    }

    const pageNumbers = Array.from(
        { length: totalPages },
        (_, index) => index + 1,
    );

    return (
        <nav className="flex flex-wrap items-center justify-center gap-2 py-6">
            <Link
                href={buildHref(
                    basePath,
                    Math.max(page - 1, 1),
                    sort,
                    keyword,
                    type,
                )}
                className={`rounded-full border px-4 py-2 text-sm font-bold ${
                    page <= 1
                        ? "pointer-events-none border-zinc-100 text-zinc-400"
                        : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                }`}
                aria-disabled={page <= 1}
            >
                이전
            </Link>

            {pageNumbers.map((targetPage) => (
                <Link
                    key={targetPage}
                    href={buildHref(basePath, targetPage, sort, keyword, type)}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                        targetPage === page
                            ? "bg-zinc-950 text-white"
                            : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                    }`}
                >
                    {targetPage}
                </Link>
            ))}

            <Link
                href={buildHref(
                    basePath,
                    Math.min(page + 1, totalPages),
                    sort,
                    keyword,
                    type,
                )}
                className={`rounded-full border px-4 py-2 text-sm font-bold ${
                    page >= totalPages
                        ? "pointer-events-none border-zinc-100 text-zinc-400"
                        : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                }`}
                aria-disabled={page >= totalPages}
            >
                다음
            </Link>
        </nav>
    );
}

function buildHref(
    basePath: string,
    targetPage: number,
    sort?: "rank" | "recent",
    keyword?: string,
    type?: PromptType,
) {
    const params = new URLSearchParams();

    if (sort) {
        params.set("sort", sort);
    }
    if (keyword) {
        params.set("keyword", keyword);
    }
    if (type) {
        params.set("type", type);
    }
    if (targetPage > 1) {
        params.set("page", String(targetPage));
    }

    const suffix = params.toString();
    return `${basePath}${suffix ? `?${suffix}` : ""}`;
}
