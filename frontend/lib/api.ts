import type { Prompt, PromptType } from "@/lib/types";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
    "http://localhost:8000";

type PromptQuery = {
    keyword?: string;
    type?: PromptType;
    sort?: "rank" | "recent";
};

export async function incrementPromptView(id: string): Promise<void> {
    try {
        await fetch(`http://127.0.0.1:8000/prompts/${id}/view`, {
            method: "POST",
        });
    } catch (error) {
        console.error("Failed to increment views", error);
    }
}

export async function getTrendingKeywords() {
    const response = await fetch(`${API_BASE_URL}/api/keywords/trending`, {
        next: { revalidate: 30 },
    });

    if (!response.ok) {
        throw new Error("추천 키워드를 불러오지 못했습니다.");
    }

    const data = (await response.json()) as { keywords: string[] };
    return data.keywords;
}

export async function getPrompts(query: PromptQuery = {}) {
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

    const queryString = searchParams.toString();
    const response = await fetch(
        `${API_BASE_URL}/api/prompts${queryString ? `?${queryString}` : ""}`,
        { next: { revalidate: 30 } },
    );

    if (!response.ok) {
        throw new Error("프롬프트를 불러오지 못했습니다.");
    }

    const data = (await response.json()) as { prompts: Prompt[] };
    return data.prompts;
}

export async function getPromptsByType(type: PromptType, keyword?: string) {
    return getPrompts({ keyword, type, sort: "rank" });
}

export function fillKeyword(content: string, keyword: string) {
    return content.replaceAll("#키워드", keyword);
}

export function normalizeKeyword(keyword: string) {
    return keyword.trim().replace(/^#/, "");
}
