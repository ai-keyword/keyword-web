import Link from "next/link";
import { loginAction } from "./actions";

export const dynamic = "force-dynamic";

export default function LoginPage() {
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
                                로그인
                            </h1>
                            <p className="mt-2 text-sm font-semibold text-zinc-500">
                                <span className="font-bold">#키워드</span>에
                                오신 것을 환영합니다.
                            </p>
                        </div>

                        <form action={loginAction} className="space-y-5">
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-bold text-zinc-950"
                                >
                                    이메일
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="이메일을 입력하세요"
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

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-zinc-950 py-3.5 text-sm font-bold text-white transition hover:bg-zinc-800 cursor-pointer"
                            >
                                로그인
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm font-semibold text-zinc-500">
                            계정이 없으신가요?{" "}
                            <a
                                href="/signup"
                                className="text-zinc-950 font-bold hover:underline"
                            >
                                회원가입
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
