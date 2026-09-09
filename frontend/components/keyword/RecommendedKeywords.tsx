import { KeywordChip } from "@/components/keyword/KeywordChip";
import { normalizeKeyword } from "@/lib/api";

type RecommendedKeywordsProps = {
    keywords: string[];
};

export function RecommendedKeywords({ keywords }: RecommendedKeywordsProps) {
    if (keywords.length === 0) {
        return null;
    }

    return (
        <div className="flex min-w-0 flex-wrap items-center gap-2 pb-2 text-sm font-semibold text-zinc-500">
            <span className="whitespace-nowrap">추천 ·</span>
            {keywords.map((keyword) => (
                <KeywordChip
                    key={keyword}
                    keyword={normalizeKeyword(keyword)}
                />
            ))}
        </div>
    );
}
