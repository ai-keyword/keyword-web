"use server";

import { API_BASE_URL } from "@/lib/config";
import { parseApiError } from "@/lib/errors";
import { mapPrompt } from "@/lib/api";
import type { CurrentUser, PromptApi } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
    const cookieStore = await cookies();

    cookieStore.delete("token");
    cookieStore.delete("username");
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("ACCESS");
}

export async function profileAction(): Promise<CurrentUser> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    try {
        const res = await fetch(`${API_BASE_URL}/getme`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

        if (res.status === 401) {
            redirect("/login");
        }

        if (!res.ok) {
            const errorData: unknown = await res.json().catch(() => ({}));
            throw new Error(
                parseApiError(errorData, "서버 오류가 발생했어요."),
            );
        }

        const data = (await res.json()) as Omit<
            CurrentUser,
            "written_prompts" | "liked_prompts"
        > & {
            written_prompts: PromptApi[];
            liked_prompts: PromptApi[];
        };

        return {
            ...data,
            written_prompts: data.written_prompts.map(mapPrompt),
            liked_prompts: data.liked_prompts.map(mapPrompt),
        };
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw err;
        }
        throw new Error(parseApiError(err, "서버 오류가 발생했어요."));
    }
}
