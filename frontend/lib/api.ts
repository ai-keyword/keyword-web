import { API_BASE_URL } from "@/lib/config";
import { parseApiError } from "@/lib/errors";
import type {
    EmailRequest,
    KeywordItem,
    KeywordListResponse,
    MessageResponse,
    Prompt,
    PromptApi,
    PromptAuthor,
    PromptListResponse,
    PromptPage,
    PromptQuery,
    PromptType,
    VerifyCodeRequest,
} from "@/types";

export function resolveImageUrl(path: string | null | undefined) {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
}

export function fillKeyword(content: string, keyword: string) {
    return content.replaceAll("#키워드", keyword);
}

export function normalizeKeyword(keyword: string) {
    return keyword.trim().replace(/^#/, "");
}

function parseAuthor(author: PromptAuthor | string): PromptAuthor {
    if (typeof author === "string") {
        return { id: 0, username: author };
    }
    return author;
}

export function mapPrompt(prompt: PromptApi): Prompt {
    const type: PromptType = prompt.type === "text" ? "text" : "image";

    return {
        id: prompt.id,
        type,
        keyword: prompt.keyword,
        aiModel: prompt.ai_model ?? undefined,
        rank: prompt.rank,
        content: prompt.content,
        description: prompt.description ?? undefined,
        thumbnailUrl: prompt.thumbnail_url ?? undefined, // API(snake) -> UI(camel)
        author: parseAuthor(prompt.author),
        views: prompt.views ?? 0,
        likeCount: prompt.like_count ?? 0, // API(snake) -> UI(camel)
        createdAt: prompt.created_at, // UI 컨벤션에 맞춰 매핑
        isLiked: prompt.is_liked ?? false,
        isHide: prompt.is_hide ?? false,
    };
}

function mapKeyword(item: string | KeywordItem): string {
    return typeof item === "string" ? item : item.keyword;
}

export async function incrementPromptView(id: number): Promise<void> {
    try {
        await fetch(`${API_BASE_URL}/api/prompts/${id}/view`, {
            method: "POST",
        });
    } catch (error) {
        console.error("Failed to increment views", error);
    }
}

export async function getTrendingKeywords(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/api/keywords/trending`, {
        next: { revalidate: 30 },
    });

    if (!response.ok) {
        throw new Error("추천 키워드를 불러오지 못했습니다.");
    }

    const data = (await response.json()) as KeywordListResponse;
    return data.keywords.map(mapKeyword);
}

export async function getPrompts(
    query: PromptQuery = {},
    options?: { cookieHeader?: string },
): Promise<PromptPage> {
    const searchParams = new URLSearchParams();

    if (query.keyword) {
        searchParams.set("keyword", normalizeKeyword(query.keyword));
    }
    if (query.type) {
        searchParams.set("type", query.type);
    }
    if (query.sort) {
        searchParams.set("sort", query.sort);
    }
    if (query.page) {
        searchParams.set("page", String(query.page));
    }
    if (query.pageSize) {
        searchParams.set("page_size", String(query.pageSize));
    }

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/api/prompts${queryString ? `?${queryString}` : ""}`;

    let token: string | undefined;
    const cookieHeader = options?.cookieHeader;
    if (cookieHeader?.startsWith("token=")) {
        token = cookieHeader.slice("token=".length);
    }

    if (!cookieHeader && typeof window === "undefined") {
        try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            token = cookieStore.get("token")?.value;
        } catch {
            // 서버 환경이 아니거나 쿠키 접근 불가 시 통과
        }
    }

    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await fetch(url, {
        headers,
        ...(token
            ? { cache: "no-store" as const }
            : { next: { revalidate: 30 } }),
    });

    if (!response.ok) {
        throw new Error("프롬프트를 불러오지 못했습니다.");
    }

    const data = (await response.json()) as PromptListResponse;
    return {
        prompts: data.prompts.map(mapPrompt),
        page: data.page,
        pageSize: data.page_size,
        total: data.total,
        totalPages: data.total_pages,
    };
}

export async function getPromptsByType(
    type: PromptType,
    keyword?: string,
    sort: PromptQuery["sort"] = "rank",
    page = 1,
    pageSize = 12,
): Promise<PromptPage> {
    return getPrompts({ keyword, type, sort, page, pageSize });
}

export async function sendVerificationCode(
    payload: EmailRequest,
): Promise<MessageResponse> {
    const response = await fetch(`${API_BASE_URL}/api/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(parseApiError(data, "인증번호 발송에 실패했습니다."));
    }

    return data as MessageResponse;
}

export async function verifyEmailCode(
    payload: VerifyCodeRequest,
): Promise<MessageResponse> {
    const response = await fetch(`${API_BASE_URL}/api/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(parseApiError(data, "인증번호가 일치하지 않습니다."));
    }

    return data as MessageResponse;
}
