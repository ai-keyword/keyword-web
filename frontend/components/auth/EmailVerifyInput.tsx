"use client";

import { useState } from "react";
import { sendVerificationCode, verifyEmailCode } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { FormField } from "@/components/ui/FormField";

type EmailVerifyInputProps = {
    email: string;
    setEmail: (email: string) => void;
    isVerified: boolean;
    setIsVerified: (isVerified: boolean) => void;
};

export function EmailVerifyInput({
    email,
    setEmail,
    isVerified,
    setIsVerified,
}: EmailVerifyInputProps) {
    const [code, setCode] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    async function handleSendCode() {
        if (!email) {
            setErrorMessage("이메일을 입력해 주세요.");
            return;
        }

        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await sendVerificationCode({ email });
            setIsSent(true);
            setSuccessMessage("인증번호가 이메일로 발송되었습니다.");
        } catch (err: unknown) {
            setErrorMessage(
                getErrorMessage(err, "서버 통신 중 오류가 발생했습니다."),
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleVerifyCode() {
        if (!code) {
            setErrorMessage("인증번호를 입력해 주세요.");
            return;
        }

        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await verifyEmailCode({ email, code });
            setIsVerified(true);
            setSuccessMessage("이메일 인증이 완료되었습니다.");
        } catch (err: unknown) {
            setErrorMessage(getErrorMessage(err, "인증에 실패했습니다."));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <div className="flex-1">
                    <FormField
                        id="email"
                        name="email"
                        label="이메일"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isVerified || loading}
                        placeholder="이메일을 입력하세요"
                        required
                    />
                </div>
                <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={isVerified || loading}
                    className="mt-7 shrink-0 cursor-pointer rounded-xl bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-900 transition hover:bg-zinc-200 disabled:opacity-50"
                >
                    {isSent ? "재전송" : "인증 요청"}
                </button>
            </div>

            {isSent && !isVerified && (
                <div className="flex gap-2">
                    <div className="flex-1">
                        <FormField
                            id="code"
                            name="verificationCode"
                            label="인증번호"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            disabled={loading}
                            placeholder="6자리 번호 입력"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleVerifyCode}
                        disabled={loading}
                        className="mt-7 shrink-0 cursor-pointer rounded-xl bg-zinc-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:opacity-50"
                    >
                        확인
                    </button>
                </div>
            )}

            {errorMessage && (
                <p className="text-xs font-bold text-red-500">{errorMessage}</p>
            )}

            {successMessage && (
                <p className="text-xs font-bold text-green-600">
                    {successMessage}
                </p>
            )}
        </div>
    );
}
