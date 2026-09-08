import { Header } from "@/components/layout/Header";
import { PromptGallery } from "@/components/prompt/PromptGallery";
import { PageShell } from "@/components/ui/PageShell";
import { getPromptsByType, normalizeKeyword } from "@/lib/api";

type KeywordPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export const dynamic = "force-dynamic";

export default async function KeywordPage({ params }: KeywordPageProps) {
    const { slug } = await params;
    const keyword = normalizeKeyword(decodeURIComponent(slug));
    const [imagePrompts, textPrompts] = await Promise.all([
        getPromptsByType("image", keyword),
        getPromptsByType("text", keyword),
    ]);

    return (
        <PageShell>
            <Header />

            <div className="text-base font-semibold text-zinc-500">
                {keyword} 검색 결과:{" "}
                {imagePrompts.length + textPrompts.length}개
            </div>

            <PromptGallery
                imageTitle="이미지 프롬프트 검색 결과"
                textTitle="글씨 프롬프트 검색 결과"
                imagePrompts={imagePrompts}
                textPrompts={textPrompts}
                displayKeyword={keyword}
                imageEmptyMessage={`#${keyword} 이미지 프롬프트가 아직 없습니다.`}
                textEmptyMessage={`#${keyword} 글씨 프롬프트가 아직 없습니다.`}
            />
        </PageShell>
    );
}
