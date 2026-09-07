"use server";

import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    // 로그인 API 호출 또는 인증 로직 처리

    redirect("/");
}
