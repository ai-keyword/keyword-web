"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/config";
import { getErrorMessage, parseApiError } from "@/lib/errors";
import type { LoginRequest, LoginResponse } from "@/types";

export async function loginAction(_prevState: unknown, formData: FormData) {
    const payload: LoginRequest = {
        email: formData.get("email")?.toString() ?? "",
        password: formData.get("password")?.toString() ?? "",
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const responseText = await response.text();

        if (!response.ok) {
            let errorBody: unknown = responseText;
            try {
                errorBody = JSON.parse(responseText);
            } catch {
                errorBody = responseText;
            }
            return {
                success: false,
                error: parseApiError(errorBody, "로그인에 실패했습니다."),
            };
        }

        const data = JSON.parse(responseText) as LoginResponse;
        const cookieStore = await cookies();

        cookieStore.set({
            name: "token",
            value: data.token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        if (data.username) {
            cookieStore.set({
                name: "username",
                value: data.username,
                httpOnly: false,
                path: "/",
                maxAge: 60 * 60 * 24,
            });
        }

        return { success: true };
    } catch (error: unknown) {
        const errorMessage = getErrorMessage(
            error,
            "로그인 중 오류가 발생했습니다.",
        );
        console.error("Login error:", errorMessage);
        return { success: false, error: errorMessage };
    }
}
