import Link from "next/link";
import { KeywordChip } from "@/components/KeywordChip";
import { PromptCard } from "@/components/PromptCard";
import { SearchBar } from "@/components/SearchBar";
import { Section } from "@/components/Section";
import logo from "@/public/logo.svg";
import { TextPromptCard } from "@/components/TextPromptCard";
import {
    getTrendingKeywords,
    getPromptsByType,
    normalizeKeyword,
} from "@/lib/api";

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
                <header className="w-full flex flex-col items-center gap-6 border-b border-zinc-200 pb-8">
                    <div className="w-120 flex items-center  flex-col gap-4">
                        <Link
                            href="/"
                            className="w-fit text-sm font-bold text-zinc-500 hover:text-zinc-950"
                        >
                            <img
                                src={logo.src}
                                alt="PromptHub"
                                className="h-6 w-auto"
                            />
                        </Link>
                        <div className="w-full flex flex-col items-center gap-4">
                            <h1 className="text-5xl font-black tracking-normal text-zinc-950 sm:text-7xl">
                                #{keyword}
                            </h1>
                            <SearchBar defaultKeyword={keyword} />
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {recommendedKeywords.map((recommendedKeyword) => (
                            <KeywordChip
                                key={recommendedKeyword}
                                keyword={recommendedKeyword}
                                active={recommendedKeyword === keyword}
                            />
                        ))}
                    </div>
                </header>

                <Section
                    title="요즘 뜨는 이미지 프롬프트"
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
                    title="요즘 뜨는 글씨 프롬프트"
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
