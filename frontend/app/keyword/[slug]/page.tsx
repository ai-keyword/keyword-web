import { PromptCard } from "@/components/PromptCard";
import { Section } from "@/components/Section";
import { TextPromptCard } from "@/components/TextPromptCard";
import {
    getTrendingKeywords,
    getPromptsByType,
    normalizeKeyword,
} from "@/lib/api";
import { Header } from "@/components/Header";

type KeywordPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export const dynamic = "force-dynamic";

export default async function KeywordPage({ params }: KeywordPageProps) {
    const { slug } = await params;
    const keyword = normalizeKeyword(decodeURIComponent(slug));
    const [recommendedKeywords, imagePrompts, textPrompts] = await Promise.all([
        getTrendingKeywords(),
        getPromptsByType("image", keyword),
        getPromptsByType("text", keyword),
    ]);

    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 py-8 sm:px-8 lg:px-10">
                <Header />

                <div className="text-base font-semibold text-zinc-500">
                    {keyword} 검색 결과:{" "}
                    {imagePrompts.length + textPrompts.length}개
                </div>

                <Section
                    title="이미지 프롬프트 검색 결과"
                    emptyMessage={`#${keyword} 이미지 프롬프트가 아직 없습니다.`}
                >
                    {imagePrompts.map((prompt) => (
                        <PromptCard
                            key={prompt.id}
                            prompt={prompt}
                            displayKeyword={keyword}
                        />
                    ))}
                </Section>

                <Section
                    title="글씨 프롬프트 검색 결과"
                    emptyMessage={`#${keyword} 글씨 프롬프트가 아직 없습니다.`}
                >
                    {textPrompts.map((prompt) => (
                        <TextPromptCard
                            key={prompt.id}
                            prompt={prompt}
                            displayKeyword={keyword}
                        />
                    ))}
                </Section>
            </div>
        </main>
    );
}
