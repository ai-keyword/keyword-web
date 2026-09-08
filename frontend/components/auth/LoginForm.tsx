"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useActionState, useTransition } from "react";
import toast from "react-hot-toast";
import { FormField } from "@/components/ui/FormField";

export type ActionResult = {
    success: boolean;
    error?: string;
};

type LoginFormProps = {
    loginAction: (
        prevState: ActionResult | null,
        formData: FormData,
    ) => Promise<ActionResult>;
};

export function LoginForm({ loginAction }: LoginFormProps) {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(loginAction, null);

    useEffect(() => {
        if (!state) return;

        if (state.success) {
            toast.success("로그인되었습니다.");
            router.push("/");
            router.refresh();
        } else if (state.error) {
            toast.error(state.error);
        }
    }, [state, router]);

    return (
        <>
            <form action={formAction} className="space-y-5">
                <FormField
                    id="email"
                    name="email"
                    label="이메일"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    required
                />
                <FormField
                    id="password"
                    name="password"
                    label="비밀번호"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    required
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full cursor-pointer rounded-xl bg-zinc-950 py-3.5 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:opacity-50"
                >
                    {isPending ? "로그인 중..." : "로그인"}
                </button>
            </form>

            <div className="mt-6 text-center text-sm font-semibold text-zinc-500">
                계정이 없으신가요?{" "}
                <Link
                    href="/signup"
                    className="font-bold text-zinc-950 hover:underline"
                >
                    회원가입
                </Link>
            </div>
        </>
    );
}
