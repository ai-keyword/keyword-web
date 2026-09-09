"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import {
    getErrorMessage,
    isNextRedirectError,
    parseApiError,
} from "@/lib/errors";
import { fileToDataUrl, isHide } from "@/lib/moderation";

export async function createPromptAction(formData: FormData) {
    const type = formData.get("type")?.toString() ?? "";
    const keyword = formData.get("keyword")?.toString() ?? "";
    const content = formData.get("content")?.toString() ?? "";
    const description = formData.get("description")?.toString() ?? "";
    const thumbnail = formData.get("thumbnail") as File | null;

    try {
        // 1. 검열 먼저 — 백엔드에 요청 보내기 전에 텍스트+이미지를 검사한다.
        const hasThumbnail = thumbnail && thumbnail.size > 0;
        const imageDataUrl = hasThumbnail
            ? await fileToDataUrl(thumbnail)
            : undefined;

        const hidden = await isHide({
            text: `${content} ${description}`.trim(),
            imageDataUrl,
        });

        if (hidden) {
            throw new Error(
                "부적절한 콘텐츠가 감지되어 등록할 수 없습니다. 내용을 확인 후 다시 시도해주세요.",
            );
        }

        // 2. 검열을 통과한 경우에만 실제로 백엔드에 등록 요청을 보낸다.
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            throw new Error("UNAUTHORIZED");
        }

        const backendFormData = new FormData();
        backendFormData.set("type", type);
        backendFormData.set("keyword", keyword);
        backendFormData.set("content", content);
        if (description) backendFormData.set("description", description);
        if (hasThumbnail) backendFormData.set("thumbnail", thumbnail);

        const response = await fetch(`${API_BASE_URL}/api/prompts`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: backendFormData,
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("UNAUTHORIZED");
            }
            const errorData: unknown = await response.json().catch(() => null);
            throw new Error(
                parseApiError(
                    errorData,
                    "등록에 실패했어요. 다시 시도해주세요.",
                ),
            );
        }
    } catch (error: unknown) {
        if (isNextRedirectError(error)) {
            throw error;
        }
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            throw new Error("로그인이 필요합니다.");
        }
        throw new Error(
            getErrorMessage(error, "등록에 실패했어요. 다시 시도해주세요."),
        );
    }

    redirect("/");
}
