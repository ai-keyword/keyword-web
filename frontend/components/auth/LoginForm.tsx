import Link from "next/link";
import { FormField } from "@/components/ui/FormField";

type LoginFormProps = {
    loginAction: (formData: FormData) => Promise<void>;
};

export function LoginForm({ loginAction }: LoginFormProps) {
    return (
        <>
            <form action={loginAction} className="space-y-5">
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
                    className="w-full cursor-pointer rounded-xl bg-zinc-950 py-3.5 text-sm font-bold text-white transition hover:bg-zinc-800"
                >
                    로그인
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
