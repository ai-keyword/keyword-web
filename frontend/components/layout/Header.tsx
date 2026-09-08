import logo from "@/public/logo.svg";
import profile from "@/public/profile.svg";
import { cookies } from "next/headers";
import { getTrendingKeywords } from "@/lib/api";
import { SearchBar } from "@/components/search/SearchBar";
import { RecommendedKeywords } from "@/components/keyword/RecommendedKeywords";

type HeaderProps = {
    recommend?: boolean;
};

export async function Header({ recommend = true }: HeaderProps) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    let recommendedKeywords: string[] = [];
    if (recommend) {
        try {
            recommendedKeywords = await getTrendingKeywords();
        } catch (error) {
            console.error("Failed to fetch trending keywords:", error);
        }
    }

    return (
        <header className="flex w-full flex-col gap-6 border-b border-zinc-200 pb-8">
            <div className="flex w-full items-center justify-between">
                <div className="min-w-140 flex items-center gap-4">
                    <a href="/">
                        <img
                            src={logo.src}
                            alt="KeywordLogo"
                            className="h-10 w-auto"
                        />
                    </a>
                    <SearchBar />
                </div>

                <div className="flex items-center gap-3 text-sm font-medium">
                    {token ? (
                        <>
                            <a
                                href="/prompts/create"
                                className="flex items-center gap-1 rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800"
                            >
                                <span>+</span> 만들기
                            </a>
                            <a href="/profile">
                                <img
                                    src={profile.src}
                                    alt="Profile"
                                    className="h-10 w-10 cursor-pointer rounded-full object-cover"
                                />
                            </a>
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>

            {recommend ? (
                <RecommendedKeywords keywords={recommendedKeywords} />
            ) : null}
        </header>
    );
}
