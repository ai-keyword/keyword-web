"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function createPromptAction(formData: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    try {
        const res = await fetch(`${BACKEND_URL}/api/prompts`, {
            method: "POST",
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: formData,
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || "서버 오류가 발생했어요.");
        }
    } catch (err: any) {
        throw new Error(err.message || "등록에 실패했어요. 다시 시도해주세요.");
    }

    redirect("/");
}
