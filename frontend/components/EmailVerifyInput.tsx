"use client";

import { useState } from "react";

export function EmailVerifyInput() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    // 인증번호 전송 요청
    const handleSendCode = async () => {
        if (!email) return alert("이메일을 입력해주세요.");

        const res = await fetch("http://localhost:8000/api/send-verification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        if (res.ok) {
            setIsSent(true);
            alert("인증번호가 발송되었습니다.");
        } else {
            alert("발송 실패. 이메일을 확인해 주세요.");
        }
    };

    // 인증번호 확인 요청
    const handleVerifyCode = async () => {
        const res = await fetch("http://localhost:8000/api/verify-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code }),
        });

        if (res.ok) {
            setIsVerified(true);
            alert("이메일 인증이 완료되었습니다!");
        } else {
            alert("인증번호가 올바르지 않습니다.");
        }
    };

    return (
        <div className="space-y-4">
            {/* 이메일 입력 */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-950">
                    이메일
                </label>
                <div className="flex gap-2">
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일을 입력하세요"
                        disabled={isVerified}
                        required
                        className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-950 disabled:bg-zinc-100"
                    />
                    <button
                        type="button"
                        onClick={handleSendCode}
                        disabled={isVerified}
                        className="shrink-0 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold text-zinc-950 transition hover:bg-zinc-100 cursor-pointer disabled:opacity-50"
                    >
                        {isSent ? "재전송" : "인증 전송"}
                    </button>
                </div>
            </div>

            {/* 인증번호 입력 필드 (발송된 경우만 표시) */}
            {isSent && !isVerified && (
                <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-950">
                        인증번호
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="인증번호 6자리"
                            className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-950"
                        />
                        <button
                            type="button"
                            onClick={handleVerifyCode}
                            className="shrink-0 rounded-xl bg-zinc-950 px-4 text-sm font-bold text-white transition hover:bg-zinc-800 cursor-pointer"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
