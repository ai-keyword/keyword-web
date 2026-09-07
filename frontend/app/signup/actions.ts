"use server";

import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    // TODO: 백엔드 로그인 API 호출 또는 인증 로직 처리
    console.log("Login submitted:", { email, password });

    // 로그인 성공 시 메인 페이지로 이동
    redirect("/");
}

export async function signupAction(formData: FormData) {
    const name = formData.get("name");
    const username = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");
    const verificationCode = formData.get("verificationCode");

    // TODO: 백엔드 회원가입 API 호출 또는 회원가입 처리
    console.log("Signup submitted:", {
        name,
        username,
        password,
        email,
        verificationCode,
    });

    // 회원가입 완료 후 로그인 페이지로 이동
    redirect("/login");
}
