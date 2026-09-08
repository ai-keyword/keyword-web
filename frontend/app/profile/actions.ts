"use server";

import { API_BASE_URL } from "@/lib/config";
import { parseApiError } from "@/lib/errors";
import { CurrentUser } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

        const data: CurrentUser = await res.json();
        return data;
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw err;
        }
        throw new Error(parseApiError(err, "서버 오류가 발생했어요."));
    }
}
