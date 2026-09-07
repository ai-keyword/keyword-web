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
                <header className="w-full flex flex-col gap-6 border-b border-zinc-200 pb-8">
                    {/* 상단 행: [로고 + 검색바] (좌측) / [로그인, 회원가입] (우측 끝) */}
                    <div className="w-full flex items-center justify-between">
                        {/* 로고와 검색바를 나란히 배치 */}
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="w-fit text-sm font-bold text-zinc-500 hover:text-zinc-950 flex-shrink-0"
                            >
                                <img
                                    src={logo.src}
                                    alt="PromptHub"
                                    className="h-10 w-auto"
                                />
                            </Link>
                            <SearchBar defaultKeyword={keyword} />
                        </div>

                        {/* 우측 끝에 위치한 로그인/회원가입 */}
                        <div className="flex items-center gap-3 text-sm font-medium">
                            <a
                                href="/login"
                                className="text-zinc-600 hover:text-zinc-900"
                            >
                                로그인
                            </a>
                            <a
                                href="/signup"
                                className="rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800"
                            >
                                회원가입
                            </a>
                        </div>
                    </div>

                    {/* 추천 키워드 영역 */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {recommendedKeywords.map((recommendedKeyword) => (
                            <KeywordChip
                                key={recommendedKeyword}
                                keyword={recommendedKeyword}
                                active={recommendedKeyword === keyword}
                            />
                        ))}
                    </div>
                </header>

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
