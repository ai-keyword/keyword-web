import Link from "next/link";
import { signupAction } from "./actions";
import SignupForm from "@/components/SignupForm";

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
                        <SignupForm signupAction={signupAction} />
                    </div>
                </div>
            </div>
        </main>
    );
}
