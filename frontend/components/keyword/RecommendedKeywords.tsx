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
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-sm font-semibold text-zinc-500">
            추천 ·
            {keywords.map((keyword) => (
                <KeywordChip
                    key={keyword}
                    keyword={normalizeKeyword(keyword)}
                />
            ))}
        </div>
    );
}
