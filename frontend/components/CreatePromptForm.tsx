"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPromptAction } from "@/app/prompts/create/actions";

type PromptType = "image" | "text";

interface FormState {
    keyword: string;
    content: string;
    description: string;
    thumbnailFile: File | null;
}

const initialForm: FormState = {
    keyword: "",
    content: "",
    description: "",
    thumbnailFile: null,
};

export default function CreatePromptForm() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [type, setType] = useState<PromptType | null>(null);
    const [form, setForm] = useState<FormState>(initialForm);
    const [error, setError] = useState<string | null>(null);
    const [submitting, startTransition] = useTransition();

    function handleSelectType(selected: PromptType) {
        setType(selected);
        setStep(2);
    }

    function handleBack() {
        setStep(1);
        setError(null);
    }

    function updateField<K extends keyof FormState>(
        key: K,
        value: FormState[K],
    ) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (
            !form.keyword.trim() ||
            !form.content.trim() ||
            (type === "text" && !form.description.trim())
        ) {
            setError("덜 채워진 필드가 있어요. 모든 필드를 채워주세요.");
            return;
        }
        setError(null);

        const body = new FormData();
        body.append("type", type as string);
        body.append("keyword", form.keyword.trim());
        body.append("content", form.content.trim());

        if (type === "text" && form.description.trim()) {
            body.append("description", form.description.trim());
        }
        if (type === "image" && form.thumbnailFile) {
            body.append("thumbnail", form.thumbnailFile);
        }

        startTransition(async () => {
            try {
                await createPromptAction(body);
            } catch (err: any) {
                setError(err.message || "등록에 실패했어요.");
            }
        });
    }

    return (
        <div className="max-w-md mx-auto">
            {step === 1 && (
                <div>
                    <h1 className="text-lg font-medium mb-1 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            aria-label="뒤로"
                            className="cursor-pointer w-8 h-8 flex items-center justify-center hover:bg-neutral-200/60 rounded-full"
                        >
                            ←
                        </button>
                        프롬프트 만들기
                    </h1>
                    <p className="text-sm text-neutral-500 mb-5">
                        어떤 종류의 프롬프트를 만들까요?
                    </p>

                    <div className="grid grid-cols-2 gap-3.5">
                        <button
                            type="button"
                            onClick={() => handleSelectType("image")}
                            className="cursor-pointer bg-white text-left p-5 rounded-xl border border-neutral-200 hover:border-neutral-400 transition-colors flex flex-col gap-2.5"
                        >
                            <span className="text-amber-500 text-2xl">🖼</span>
                            <span className="text-[15px] font-medium">
                                이미지 프롬프트
                            </span>
                            <span className="text-xs text-neutral-400">
                                이미지 생성 및 변환용 프롬프트
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSelectType("text")}
                            className="cursor-pointer bg-white text-left p-5 rounded-xl border border-neutral-200 hover:border-neutral-400 transition-colors flex flex-col gap-2.5"
                        >
                            <span className="text-amber-500 text-2xl">✏️</span>
                            <span className="text-[15px] font-medium">
                                글씨 프롬프트
                            </span>
                            <span className="text-xs text-neutral-400">
                                텍스트/코드용 프롬프트
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && type && (
                <div>
                    <div className="flex items-center gap-2 mb-5">
                        <button
                            type="button"
                            onClick={handleBack}
                            aria-label="뒤로"
                            className="cursor-pointer w-8 h-8 flex items-center justify-center hover:bg-neutral-200/60 rounded-full"
                        >
                            ←
                        </button>
                        <span className="text-[15px] font-medium">
                            {type === "image"
                                ? "이미지 프롬프트 만들기"
                                : "글씨 프롬프트 만들기"}
                        </span>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="border border-neutral-200 rounded-xl bg-white p-5 flex flex-col gap-3.5"
                    >
                        <div>
                            <label className="block text-[13px] text-neutral-500 mb-1">
                                키워드
                            </label>
                            <input
                                type="text"
                                value={form.keyword}
                                onChange={(e) =>
                                    updateField("keyword", e.target.value)
                                }
                                placeholder="키워드를 입력해 주세요."
                                className="w-full h-9 px-3 rounded-md border border-neutral-200 text-sm outline-none focus:border-neutral-400"
                            />
                        </div>

                        <div>
                            <label className="block text-[13px] text-neutral-500 mb-1">
                                프롬프트 문구
                            </label>
                            <input
                                type="text"
                                value={form.content}
                                onChange={(e) =>
                                    updateField("content", e.target.value)
                                }
                                placeholder="프롬프트 문구를 입력해 주세요."
                                className="w-full h-9 px-3 rounded-md border border-neutral-200 text-sm outline-none focus:border-neutral-400"
                            />
                        </div>

                        {type === "image" && (
                            <div>
                                <label className="block text-[13px] text-neutral-500 mb-1">
                                    썸네일 이미지
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        updateField(
                                            "thumbnailFile",
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200"
                                />
                            </div>
                        )}

                        {type === "text" && (
                            <div>
                                <label className="block text-[13px] text-neutral-500 mb-1">
                                    설명 (최소 10글자)
                                </label>
                                <textarea
                                    minLength={10}
                                    maxLength={300}
                                    value={form.description}
                                    onChange={(e) =>
                                        updateField(
                                            "description",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="단계별 설명 등 부가 정보"
                                    rows={3}
                                    className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm outline-none focus:border-neutral-400 resize-y"
                                />
                            </div>
                        )}
                        {error && (
                            <p className="text-[13px] text-red-500">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-1 h-10 rounded-md bg-neutral-900 text-white text-sm font-medium disabled:opacity-50 cursor-pointer hover:bg-neutral-800 transition-colors"
                        >
                            {submitting ? "등록 중..." : "등록하기"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
