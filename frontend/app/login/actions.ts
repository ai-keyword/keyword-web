"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function loginAction(formData: FormData) {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    try {
        const response = await fetch(`${BACKEND_URL}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.detail || "이메일 또는 비밀번호가 올바르지 않습니다.",
            );
        }

        const data = await response.json();
        console.log("Login success:", data);

        const cookieStore = await cookies();

        cookieStore.set({
            name: "token",
            value: data.token || "logged-in-session",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        if (data.username) {
            cookieStore.set({
                name: "username",
                value: data.username,
                httpOnly: false,
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });
        }
    } catch (error: any) {
        console.error("Login error:", error.message);
        throw error;
    }

    redirect("/");
}
