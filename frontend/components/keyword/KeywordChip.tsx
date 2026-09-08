import Link from "next/link";

type KeywordChipProps = {
    keyword: string;
    active?: boolean;
};

export function KeywordChip({ keyword, active = false }: KeywordChipProps) {
    return (
        <Link
            href={`/keyword/${encodeURIComponent(keyword)}`}
            className={[
                "inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-sm font-semibold transition",
                active
                    ? "border-foreground bg-foreground text-background"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400",
            ].join(" ")}
        >
            #{keyword}
        </Link>
    );
}
