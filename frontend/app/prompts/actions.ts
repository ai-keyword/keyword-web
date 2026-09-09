"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/config";
import { parseApiError } from "@/lib/errors";

type TogglePromptLikeResult = {
    is_liked?: boolean;
    like_count?: number;
    error?: string;
};

export async function togglePromptLikeAction(
    promptId: number,
): Promise<TogglePromptLikeResult> {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return { error: "로그인 후 좋아요를 누를 수 있습니다." };
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/prompts/${promptId}/like`,
            {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            },
        );
        const data: unknown = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                error: parseApiError(data, "좋아요 처리에 실패했습니다."),
            };
        }

        return data as TogglePromptLikeResult;
    } catch (error: unknown) {
        return { error: parseApiError(error, "좋아요 처리에 실패했습니다.") };
    }
}
