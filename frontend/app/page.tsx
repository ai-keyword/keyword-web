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
        <header className="flex flex-col gap-6 border-b border-zinc-200 pb-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl font-black tracking-normal text-zinc-950 sm:text-7xl">
              #키워드
            </h1>
            <SearchBar />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {recommendedKeywords.map((keyword) => (
              <KeywordChip key={keyword} keyword={normalizeKeyword(keyword)} />
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
