"use client";

import { useState } from "react";

export function EmailVerifyInput() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    // 로딩 및 에러 상태 관리
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // 1. 인증번호 발송 요청
    const handleSendCode = async () => {
        if (!email) {
            setErrorMessage("이메일을 입력해 주세요.");
            return;
        }

        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const res = await fetch(
                "http://localhost:8000/api/send-verification",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                },
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "인증번호 발송에 실패했습니다.");
            }

            setIsSent(true);
            setSuccessMessage("인증번호가 이메일로 발송되었습니다.");
        } catch (err: any) {
            setErrorMessage(err.message || "서버 통신 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 2. 인증번호 검증 요청
    const handleVerifyCode = async () => {
        if (!code) {
            setErrorMessage("인증번호를 입력해 주세요.");
            return;
        }

        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const res = await fetch("http://localhost:8000/api/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "인증번호가 일치하지 않습니다.");
            }

            setIsVerified(true);
            setSuccessMessage("이메일 인증이 완료되었습니다.");
        } catch (err: any) {
            setErrorMessage(err.message || "인증에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* 이메일 입력 섹션 */}
            <div className="space-y-2">
                <label
                    htmlFor="email"
                    className="text-sm font-bold text-zinc-950"
                >
                    이메일
                </label>
                <div className="flex gap-2">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isVerified || loading}
                        placeholder="이메일을 입력하세요"
                        required
                        className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-950 disabled:bg-zinc-100"
                    />
                    <button
                        type="button"
                        onClick={handleSendCode}
                        disabled={isVerified || loading}
                        className="shrink-0 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-900 transition hover:bg-zinc-200 disabled:opacity-50"
                    >
                        {isSent ? "재전송" : "인증 요청"}
                    </button>
                </div>
            </div>

            {/* 인증번호 입력 섹션 (발송 성공 시 노출) */}
            {isSent && !isVerified && (
                <div className="space-y-2">
                    <label
                        htmlFor="code"
                        className="text-sm font-bold text-zinc-950"
                    >
                        인증번호
                    </label>
                    <div className="flex gap-2">
                        <input
                            id="code"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            disabled={loading}
                            placeholder="6자리 번호 입력"
                            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-950"
                        />
                        <button
                            type="button"
                            onClick={handleVerifyCode}
                            disabled={loading}
                            className="shrink-0 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:opacity-50"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}

            {/* hidden input: 폼 제출 시 서버 액션(signupAction)으로 이메일 인증 여부 전달 */}
            <input
                type="hidden"
                name="isEmailVerified"
                value={isVerified ? "true" : "false"}
            />

            {/* 에러 메세지 피드백 */}
            {errorMessage && (
                <p className="text-xs font-bold text-red-500">{errorMessage}</p>
            )}

            {/* 성공 메세지 피드백 */}
            {successMessage && (
                <p className="text-xs font-bold text-green-600">
                    {successMessage}
                </p>
            )}
        </div>
    );
}
