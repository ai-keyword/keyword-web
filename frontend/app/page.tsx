import { Header } from "@/components/layout/Header";
import { PromptGallery } from "@/components/prompt/PromptGallery";
import { PageShell } from "@/components/ui/PageShell";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { getPromptsByType } from "@/lib/api";

export const dynamic = "force-dynamic";

type HomeProps = {
    searchParams: Promise<{ sort?: string; page?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
    const { sort: requestedSort, page: requestedPage } = await searchParams;
    const sort = requestedSort === "recent" ? "recent" : "rank";
    const page = Math.max(1, Number(requestedPage ?? 1));
    const [imagePage, textPage, recentImagePage, recentTextPage] =
        await Promise.all([
            getPromptsByType("image", undefined, sort, page),
            getPromptsByType("text", undefined, sort, page),
            getPromptsByType("image", undefined, "recent", page),
            getPromptsByType("text", undefined, "recent", page),
        ]);

    return (
        <PageShell>
            <Header sort={sort} sortPath="/" />
            <PromptGallery
                imageTitle="#요즘 뜨는 이미지 프롬프트"
                textTitle="#요즘 뜨는 글씨 프롬프트"
                imagePrompts={imagePage.prompts}
                textPrompts={textPage.prompts}
                recentImagePrompts={recentImagePage.prompts}
                recentTextPrompts={recentTextPage.prompts}
                sort={sort}
            />
            <PaginationControls
                page={page}
                totalPages={Math.max(imagePage.totalPages, textPage.totalPages)}
                sort={sort}
                basePath="/"
            />
        </PageShell>
    );
}
