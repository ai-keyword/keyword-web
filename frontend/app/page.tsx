import { Header } from "@/components/Header";
import { PromptCard } from "@/components/PromptCard";
import { Section } from "@/components/Section";
import { TextPromptCard } from "@/components/TextPromptCard";
import { getTrendingKeywords, getPromptsByType } from "@/lib/api";
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
                <Header />

                <Section title="#요즘 뜨는 이미지 프롬프트">
                    {imagePrompts.map((prompt) => (
                        <PromptCard key={prompt.id} prompt={prompt} />
                    ))}
                </Section>

                <Section title="#요즘 뜨는 글씨 프롬프트">
                    {textPrompts.map((prompt) => (
                        <TextPromptCard key={prompt.id} prompt={prompt} />
                    ))}
                </Section>
            </div>
        </main>
    );
}
