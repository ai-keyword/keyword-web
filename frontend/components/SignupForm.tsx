"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EmailVerifyInput } from "@/components/EmailVerifyInput";

interface SignupFormProps {
    signupAction: (formData: FormData) => Promise<void>;
}

export default function SignupForm({ signupAction }: SignupFormProps) {
    const router = useRouter();
    const [email, setEmail] = useState(""); // 💡 여기서 이메일 상태 관리
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (password !== passwordConfirm) {
            toast.error("비밀번호가 일치하지 않습니다!");
            return;
        }

        setLoading(true);
        const formData = new FormData(event.currentTarget);

        // 💡 만약 FormData에 email이 안 담긴다면 강제로 추가해 줍니다!
        formData.set("email", email);

        try {
            await signupAction(formData);
            toast.success("회원가입이 완료되었습니다!");
            setTimeout(() => {
                router.push("/login");
            }, 1000);
        } catch (error: any) {
            toast.error(error.message || "회원가입 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label
                    htmlFor="name"
                    className="text-sm font-bold text-zinc-950"
                >
                    이름
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="이름을 입력하세요"
                    required
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-950"
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="username"
                    className="text-sm font-bold text-zinc-950"
                >
                    아이디
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="아이디를 입력하세요"
                    required
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-950"
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="password"
                    className="text-sm font-bold text-zinc-950"
                >
                    비밀번호
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-950"
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="passwordConfirm"
                    className="text-sm font-bold text-zinc-950"
                >
                    비밀번호 확인
                </label>
                <input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-950"
                />
            </div>

            <EmailVerifyInput email={email} setEmail={setEmail} />

            <input type="hidden" name="email" value={email} />

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-zinc-950 py-3.5 text-sm font-bold text-white transition hover:bg-zinc-800 cursor-pointer disabled:opacity-50"
            >
                {loading ? "처리 중..." : "회원가입"}
            </button>

            <div className="mt-6 text-center text-sm font-semibold text-zinc-500">
                이미 계정이 있으신가요?{" "}
                <Link
                    href="/login"
                    className="text-zinc-950 font-bold hover:underline"
                >
                    로그인
                </Link>
            </div>
        </form>
    );
}
