"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function loginAction(formData: FormData) {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        // 응답을 먼저 text로 확인
        const responseText = await response.text();

        console.log("Backend status:", response.status);
        console.log("Backend response:", responseText);

        if (!response.ok) {
            let errorMessage = "로그인에 실패했습니다.";

            try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.detail || errorMessage;
            } catch {
                errorMessage = responseText || errorMessage;
            }

            throw new Error(errorMessage);
        }

        const data = JSON.parse(responseText);

        console.log("Login success:", data);

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
    } catch (error: any) {
        console.error("Login error:", error.message);
        throw error;
    }

    redirect("/");
}
