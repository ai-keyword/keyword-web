import Link from "next/link";
import { signupAction } from "./actions";
import { EmailVerifyInput } from "@/components/EmailVerifyInput";

export const dynamic = "force-dynamic";

export default function SignupPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 py-8 sm:px-8 lg:px-10 flex-1">
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-950"
                    >
                        ← 홈으로
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-center pb-12">
                    <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-black text-zinc-950">
                                회원가입
                            </h1>
                            <p className="mt-2 text-sm font-semibold text-zinc-500">
                                <span className="font-bold">PromptHub</span>의
                                새로운 계정을 만드세요.
                            </p>
                        </div>

                        <form action={signupAction} className="space-y-5">
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
                                    required
                                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-950"
                                />
                            </div>

                            {/* 클라이언트 컴포넌트: 이메일 전송 및 인증번호 검증 */}
                            <EmailVerifyInput />

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-zinc-950 py-3.5 text-sm font-bold text-white transition hover:bg-zinc-800 cursor-pointer"
                            >
                                회원가입
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm font-semibold text-zinc-500">
                            이미 계정이 있으신가요?{" "}
                            <Link
                                href="/login"
                                className="text-zinc-950 font-bold hover:underline"
                            >
                                로그인
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
