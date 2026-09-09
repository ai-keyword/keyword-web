"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EmailVerifyInput } from "@/components/auth/EmailVerifyInput";
import { FormField } from "@/components/ui/FormField";
import { getErrorMessage } from "@/lib/errors";
import { Turnstile } from "@marsidev/react-turnstile";
import dynamic from "next/dynamic";

type SignupFormProps = {
    signupAction: (formData: FormData) => Promise<void>;
};

export function SignupForm({ signupAction }: SignupFormProps) {
    const router = useRouter();
    const [captchaToken, setCaptchaToken] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const isPasswordEntered = password.length > 0 && passwordConfirm.length > 0;
    const isPasswordMatch = password === passwordConfirm;

    // 모든 필드가 채워지고, 비밀번호 확인까지 일치해야 true
    const isFormValid =
        name.trim().length > 0 &&
        username.trim().length > 0 &&
        email.trim().length > 0 &&
        password.length > 0 &&
        passwordConfirm.length > 0 &&
        isPasswordMatch &&
        email.includes("@") &&
        isVerified;

    const Turnstile = dynamic(
        () => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile),
        { ssr: false },
    );

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!isPasswordMatch) {
            toast.error("비밀번호가 일치하지 않습니다!");
            return;
        }

        setLoading(true);
        const formData = new FormData(event.currentTarget);
        formData.set("email", email);

        try {
            await signupAction(formData);
            toast.success("회원가입이 완료되었습니다!");
            setTimeout(() => {
                router.push("/login");
            }, 1000);
        } catch (error: unknown) {
            toast.error(
                getErrorMessage(error, "회원가입 중 오류가 발생했습니다."),
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <FormField
                id="name"
                name="name"
                label="이름"
                type="text"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <FormField
                id="username"
                name="username"
                label="아이디"
                type="text"
                placeholder="아이디를 입력하세요"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />

            {/* 비밀번호 입력란 */}
            <div className="relative">
                <FormField
                    id="password"
                    name="password"
                    label="비밀번호"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9.5 text-zinc-400 hover:text-zinc-600"
                    aria-label={
                        showPassword ? "비밀번호 숨기기" : "비밀번호 보이기"
                    }
                >
                    {showPassword ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                            <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                            <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    )}
                </button>
            </div>

            {/* 비밀번호 확인 입력란 */}
            <div className="space-y-1">
                <div className="relative">
                    <FormField
                        id="passwordConfirm"
                        name="passwordConfirm"
                        label="비밀번호 확인"
                        type={showPasswordConfirm ? "text" : "password"}
                        placeholder="비밀번호를 다시 입력하세요"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() =>
                            setShowPasswordConfirm(!showPasswordConfirm)
                        }
                        className="absolute right-3 top-9.5 text-zinc-400 hover:text-zinc-600"
                        aria-label={
                            showPasswordConfirm
                                ? "비밀번호 숨기기"
                                : "비밀번호 보이기"
                        }
                    >
                        {showPasswordConfirm ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                <line x1="2" x2="22" y1="2" y2="22" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* 실시간 비밀번호 일치 상태 메시지 */}
                {isPasswordEntered && (
                    <p
                        className={`text-xs font-medium ${
                            isPasswordMatch
                                ? "text-emerald-600"
                                : "text-red-500"
                        }`}
                    >
                        {isPasswordMatch
                            ? "비밀번호가 일치합니다."
                            : "비밀번호가 일치하지 않습니다."}
                    </p>
                )}
            </div>

            <EmailVerifyInput
                email={email}
                setEmail={setEmail}
                isVerified={isVerified}
                setIsVerified={setIsVerified}
            />
            <input type="hidden" name="email" value={email} />
            <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={(token) => {
                    setCaptchaToken(token);
                }}
                onExpire={() => {
                    setCaptchaToken("");
                }}
                onError={() => {
                    setCaptchaToken("");
                }}
            />

            <input type="hidden" name="captcha_token" value={captchaToken} />

            <button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full cursor-pointer rounded-xl bg-zinc-950 py-3.5 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading ? "처리 중..." : "회원가입"}
            </button>

            <div className="mt-6 text-center text-sm font-semibold text-zinc-500">
                이미 계정이 있으신가요?{" "}
                <Link
                    href="/login"
                    className="font-bold text-zinc-950 hover:underline"
                >
                    로그인
                </Link>
            </div>
        </form>
    );
}
