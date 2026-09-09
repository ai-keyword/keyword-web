import { Header } from "@/components/layout/Header";
import { PromptGallery } from "@/components/prompt/PromptGallery";
import { PageShell } from "@/components/ui/PageShell";
import { getPromptsByType } from "@/lib/api";

export const dynamic = "force-dynamic";

type HomeProps = {
    searchParams: Promise<{ sort?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
    const { sort: requestedSort } = await searchParams;
    const sort = requestedSort === "recent" ? "recent" : "rank";
    const [imagePrompts, textPrompts, recentImagePrompts, recentTextPrompts] =
        await Promise.all([
            getPromptsByType("image"),
            getPromptsByType("text"),
            getPromptsByType("image", undefined, "recent"),
            getPromptsByType("text", undefined, "recent"),
        ]);

    return (
        <PageShell>
            <Header sort={sort} sortPath="/" />
            <PromptGallery
                imageTitle="#요즘 뜨는 이미지 프롬프트"
                textTitle="#요즘 뜨는 글씨 프롬프트"
                imagePrompts={imagePrompts}
                textPrompts={textPrompts}
                recentImagePrompts={recentImagePrompts}
                recentTextPrompts={recentTextPrompts}
                sort={sort}
            />
        </PageShell>
    );
}
