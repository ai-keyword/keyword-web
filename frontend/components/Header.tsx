import { SearchBar } from "@/components/SearchBar";
import { KeywordChip } from "@/components/KeywordChip";
import logo from "@/public/logo.svg";
import profile from "@/public/profile.svg";
import { cookies } from "next/headers";
import { getTrendingKeywords, normalizeKeyword } from "@/lib/api";

interface HeaderProps {
    recommend?: boolean; // 추천 검색어 영역 노출 여부 (기본값: true)
}

export async function Header({ recommend = true }: HeaderProps) {
    // 쿠키에서 인증 토큰 가져오기
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // recommend가 true일 때만 추천 검색어 데이터 불러오기
    let recommendedKeywords: string[] = [];
    if (recommend) {
        try {
            recommendedKeywords = await getTrendingKeywords();
        } catch (error) {
            console.error("Failed to fetch trending keywords:", error);
        }
    }

    return (
        <header className="w-full flex flex-col gap-6 border-b border-zinc-200 pb-8">
            <div className="w-full flex items-center justify-between">
                <div className="min-w-140 flex items-center gap-4">
                    <a href="/">
                        <img
                            src={logo.src}
                            alt="PromptHub"
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
                                className="rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 flex items-center gap-1"
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

            {/* recommend가 true이고 키워드가 존재할 때만 렌더링 */}
            {recommend && recommendedKeywords.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 font-semibold text-zinc-500 text-sm">
                    추천 ·
                    {recommendedKeywords.map((keyword) => (
                        <KeywordChip
                            key={keyword}
                            keyword={normalizeKeyword(keyword)}
                        />
                    ))}
                </div>
            )}
        </header>
    );
}
