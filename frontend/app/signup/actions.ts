"use server";

import { redirect } from "next/navigation";

// 백엔드 API 주소 (환경변수가 없다면 로컬 기본값 사용)
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
            throw new Error(errorData.detail || "로그인에 실패했습니다.");
        }

        const data = await response.json();
        console.log("Login success:", data);
    } catch (error: any) {
        console.error("Login error:", error.message);
        throw error;
    }

    // 로그인 성공 시 메인 페이지로 이동
    redirect("/");
}

export async function signupAction(formData: FormData) {
    const name = formData.get("name")?.toString();
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();
    const email = formData.get("email")?.toString();
    const verificationCode = formData.get("verificationCode")?.toString();

    try {
        // 1. 이메일 인증번호 검증 API 호출
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

        // 2. 회원가입 API 호출
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
