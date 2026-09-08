"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/config";
import {
    getErrorMessage,
    isNextRedirectError,
    parseApiError,
} from "@/lib/errors";

export async function createPromptAction(formData: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    try {
        const res = await fetch(`${API_BASE_URL}/api/prompts`, {
            method: "POST",
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: formData,
        });
        const responseText = await res.text();

        console.log(res.status, res.statusText);
        if (!res.ok) {
            console.error("FastAPI Error Response:", responseText);
            let errorData: unknown = responseText;
            try {
                errorData = JSON.parse(responseText);
            } catch {
                // 파싱 실패 시 텍스트 그대로 유지
            }
            throw new Error(
                parseApiError(errorData, "서버 오류가 발생했어요."),
            );
        }
    } catch (err: unknown) {
        if (isNextRedirectError(err)) throw err;
        console.error("Create Prompt Catch Error:", err);
        throw new Error(
            getErrorMessage(err, "등록에 실패했어요. 다시 시도해주세요."),
        );
    }
}
