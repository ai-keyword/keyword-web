import { KeywordChip } from "@/components/KeywordChip";
import { PromptCard } from "@/components/PromptCard";
import { SearchBar } from "@/components/SearchBar";
import { Section } from "@/components/Section";
import { TextPromptCard } from "@/components/TextPromptCard";
import {
    getTrendingKeywords,
    getPromptsByType,
    normalizeKeyword,
} from "@/lib/api";
import logo from "@/public/logo.svg";

export const dynamic = "force-dynamic";

export default async function Home() {
    const [recommendedKeywords, imagePrompts, textPrompts] = await Promise.all([
        getTrendingKeywords(),
        getPromptsByType("image"),
        getPromptsByType("text"),
    ]);

    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 py-8 sm:px-8 lg:px-10">
                <header className="w-full flex flex-col items-center gap-6 border-b border-zinc-200 pb-8">
                    <div className="w-120 flex flex-col gap-4">
                        <img
                            src={logo.src}
                            alt="PromptHub"
                            className="h-12 w-auto"
                        />
                        <SearchBar />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 font-semibold text-zinc-500  text-sm">
                        추천 ·
                        {recommendedKeywords.map((keyword) => (
                            <KeywordChip
                                key={keyword}
                                keyword={normalizeKeyword(keyword)}
                            />
                        ))}
                    </div>
                </header>

                <Section title="요즘 뜨는 이미지 프롬프트">
                    {imagePrompts.map((prompt) => (
                        <PromptCard key={prompt.id} prompt={prompt} />
                    ))}
                </Section>

                <Section title="요즘 뜨는 글씨 프롬프트">
                    {textPrompts.map((prompt) => (
                        <TextPromptCard key={prompt.id} prompt={prompt} />
                    ))}
                </Section>
            </div>
        </main>
    );
}
