"use server";

import { redirect } from "next/navigation";

const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function signupAction(formData: FormData) {
    const name = formData.get("name")?.toString();
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();
    const email = formData.get("email")?.toString();
    const verificationCode = formData.get("verificationCode")?.toString();

    try {
        console.log("확인용 데이터:", { name, username, email, password });
        if (verificationCode && email) {
            const verifyRes = await fetch(`${BACKEND_URL}/api/verify-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, code: verificationCode }),
            });

            if (!verifyRes.ok) {
                const errorData = await verifyRes.json();
                throw new Error(
                    errorData.detail || "인증번호가 올바르지 않습니다.",
                );
            }
        }

        const response = await fetch(`${BACKEND_URL}/api/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, username, email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "회원가입에 실패했습니다.");
        }

        const data = await response.json();
        console.log("Signup success:", data);
    } catch (error: any) {
        console.error("Signup error:", error.message);
        throw error;
    }

    // 회원가입 완료 후 로그인 페이지로 이동
    redirect("/login");
}
