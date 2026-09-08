"use server";

import { API_BASE_URL } from "@/lib/config";
import { getErrorMessage, parseApiError } from "@/lib/errors";
import type { SignupRequest, VerifyCodeRequest } from "@/types";

export async function signupAction(formData: FormData) {
    const payload: SignupRequest = {
        name: formData.get("name")?.toString() ?? "",
        username: formData.get("username")?.toString() ?? "",
        password: formData.get("password")?.toString() ?? "",
        email: formData.get("email")?.toString() ?? "",
    };
    const verificationCode = formData.get("verificationCode")?.toString();

    try {
        if (verificationCode && payload.email) {
            const verifyPayload: VerifyCodeRequest = {
                email: payload.email,
                code: verificationCode,
            };
            const verifyRes = await fetch(`${API_BASE_URL}/api/verify-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(verifyPayload),
            });

            if (!verifyRes.ok) {
                const errorData: unknown = await verifyRes
                    .json()
                    .catch(() => null);
                throw new Error(
                    parseApiError(errorData, "인증번호가 올바르지 않습니다."),
                );
            }
        }

        const response = await fetch(`${API_BASE_URL}/api/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData: unknown = await response.json().catch(() => null);
            throw new Error(
                parseApiError(errorData, "회원가입에 실패했습니다."),
            );
        }
    } catch (error: unknown) {
        // if (isNextRedirectError(error)) {
        // throw error;
        // }
        console.error("Signup error:", getErrorMessage(error, "회원가입 실패"));
        throw error;
    }

    // redirect("/login");
}
