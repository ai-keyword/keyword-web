import logo from "@/public/logo.svg";
import profile from "@/public/profile.svg";
import { cookies } from "next/headers";
import { getTrendingKeywords } from "@/lib/api";
import { SearchBar } from "@/components/search/SearchBar";
import { RecommendedKeywords } from "@/components/keyword/RecommendedKeywords";
import { SamePageGuardLink } from "@/components/ui/SamePageGuardLink";

type HeaderProps = {
    recommend?: boolean;
    sort?: "rank" | "recent";
    sortPath?: string;
};

export async function Header({
    recommend = true,
    sort = "rank",
    sortPath,
}: HeaderProps) {
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
            <div className="flex w-full flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                    <SamePageGuardLink href="/" className="shrink-0">
                        <img
                            src={logo.src}
                            alt="KeywordLogo"
                            className="h-10 w-auto"
                        />
                    </SamePageGuardLink>
                    <div className="min-w-0 flex-1">
                        <SearchBar />
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 text-sm font-medium">
                    {token ? (
                        <>
                            <SamePageGuardLink
                                href="/prompts/create"
                                className="flex items-center gap-1 rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800"
                            >
                                <span>+</span> 만들기
                            </SamePageGuardLink>
                            <SamePageGuardLink href="/profile">
                                <img
                                    src={profile.src}
                                    alt="Profile"
                                    className="h-10 w-10 cursor-pointer rounded-full object-cover"
                                />
                            </SamePageGuardLink>
                        </>
                    ) : (
                        <>
                            <SamePageGuardLink
                                href="/login"
                                className="text-zinc-600 hover:text-zinc-900"
                            >
                                로그인
                            </SamePageGuardLink>
                            <SamePageGuardLink
                                href="/signup"
                                className="rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800"
                            >
                                회원가입
                            </SamePageGuardLink>
                        </>
                    )}
                </div>
            </div>

            <div className="flex w-full flex-wrap items-center justify-between gap-3">
                {recommend ? (
                    <div className="min-w-0 flex-1">
                        <RecommendedKeywords keywords={recommendedKeywords} />
                    </div>
                ) : null}
                {sortPath ? (
                    <nav
                        className="flex shrink-0 flex-wrap gap-2"
                        aria-label="프롬프트 정렬"
                    >
                        <a
                            href={`${sortPath}?sort=rank`}
                            aria-current={sort === "rank" ? "page" : undefined}
                            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                                sort === "rank"
                                    ? "bg-zinc-950 text-white"
                                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                            }`}
                        >
                            추천순
                        </a>
                        <a
                            href={`${sortPath}?sort=recent`}
                            aria-current={
                                sort === "recent" ? "page" : undefined
                            }
                            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                                sort === "recent"
                                    ? "bg-zinc-950 text-white"
                                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                            }`}
                        >
                            최신순
                        </a>
                    </nav>
                ) : null}
            </div>
        </header>
    );
}
