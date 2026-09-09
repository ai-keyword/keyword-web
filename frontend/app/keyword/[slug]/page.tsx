import { Header } from "@/components/layout/Header";
import { PromptGallery } from "@/components/prompt/PromptGallery";
import { PageShell } from "@/components/ui/PageShell";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { getPromptsByType, normalizeKeyword } from "@/lib/api";

type KeywordPageProps = {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{ sort?: string; page?: string }>;
};

export const dynamic = "force-dynamic";

export default async function KeywordPage({
    params,
    searchParams,
}: KeywordPageProps) {
    const { slug } = await params;
    const { sort: requestedSort, page: requestedPage } = await searchParams;
    const sort = requestedSort === "recent" ? "recent" : "rank";
    const keyword = normalizeKeyword(decodeURIComponent(slug));
    const page = Math.max(1, Number(requestedPage ?? 1));
    const [imagePage, textPage, recentImagePage, recentTextPage] =
        await Promise.all([
            getPromptsByType("image", keyword, sort, page),
            getPromptsByType("text", keyword, sort, page),
            getPromptsByType("image", keyword, "recent", page),
            getPromptsByType("text", keyword, "recent", page),
        ]);

    return (
        <PageShell>
            <Header
                sort={sort}
                sortPath={`/keyword/${encodeURIComponent(keyword)}`}
            />

            <div className="text-base font-semibold text-zinc-500">
                {keyword} 검색 결과: {imagePage.total + textPage.total}개
            </div>

            <PromptGallery
                imageTitle="이미지 프롬프트 검색 결과"
                textTitle="글씨 프롬프트 검색 결과"
                imagePrompts={imagePage.prompts}
                textPrompts={textPage.prompts}
                recentImagePrompts={recentImagePage.prompts}
                recentTextPrompts={recentTextPage.prompts}
                sort={sort}
                displayKeyword={keyword}
                imageEmptyMessage={`#${keyword} 이미지 프롬프트가 아직 없습니다.`}
                textEmptyMessage={`#${keyword} 글씨 프롬프트가 아직 없습니다.`}
            />
            <PaginationControls
                page={page}
                totalPages={Math.max(imagePage.totalPages, textPage.totalPages)}
                sort={sort}
                keyword={keyword}
                type={undefined}
                basePath={`/keyword/${encodeURIComponent(keyword)}`}
            />
        </PageShell>
    );
}
