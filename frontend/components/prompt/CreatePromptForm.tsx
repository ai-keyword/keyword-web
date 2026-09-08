"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPromptAction } from "@/app/prompts/create/actions";
import { getErrorMessage } from "@/lib/errors";
import type { PromptCreateForm, PromptType } from "@/types";
import { CompactField, CompactTextarea } from "@/components/ui/FormField";
import { BackIconButton } from "@/components/ui/IconButton";
import { PromptTypePicker } from "@/components/prompt/PromptTypePicker";
import toast from "react-hot-toast";

const initialForm: PromptCreateForm = {
    keyword: "",
    content: "",
    description: "",
    thumbnailFile: null,
};

export function CreatePromptForm() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [type, setType] = useState<PromptType | null>(null);
    const [form, setForm] = useState<PromptCreateForm>(initialForm);
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

    function updateField<K extends keyof PromptCreateForm>(
        key: K,
        value: PromptCreateForm[K],
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
        body.append("type", type ?? "");
        body.append("keyword", form.keyword.trim());
        body.append("content", form.content.trim());

        if (type === "text" && form.description.trim()) {
            body.append("description", form.description.trim());
        }
        if (type === "image" && form.thumbnailFile) {
            body.append("thumbnail", form.thumbnailFile);
        }

        toast.loading("등록 중...", { id: "create-prompt" });

        startTransition(async () => {
            try {
                await createPromptAction(body);
                toast.success("프롬프트가 등록되었습니다.", {
                    id: "create-prompt",
                });
                router.back();
            } catch (err: unknown) {
                setError(getErrorMessage(err, "등록에 실패했어요."));
            }
        });
    }

    return (
        <div className="mx-auto max-w-md">
            {step === 1 && (
                <PromptTypePicker
                    onSelect={handleSelectType}
                    onBack={() => router.back()}
                />
            )}

            {step === 2 && type && (
                <div>
                    <div className="mb-5 flex items-center gap-2">
                        <BackIconButton label="뒤로" onClick={handleBack} />
                        <span className="text-[15px] font-medium">
                            {type === "image"
                                ? "이미지 프롬프트 만들기"
                                : "글씨 프롬프트 만들기"}
                        </span>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-3.5 rounded-xl border border-neutral-200 bg-white p-5"
                    >
                        <CompactField
                            id="keyword"
                            label="#키워드"
                            type="text"
                            value={form.keyword}
                            onChange={(e) =>
                                updateField("keyword", e.target.value)
                            }
                            placeholder="키워드를 입력해 주세요."
                        />

                        <CompactField
                            id="content"
                            label="프롬프트 문구"
                            type="text"
                            value={form.content}
                            onChange={(e) =>
                                updateField("content", e.target.value)
                            }
                            placeholder="프롬프트 문구를 입력해 주세요."
                        />

                        {type === "image" && (
                            <CompactField
                                id="thumbnail"
                                label="썸네일 이미지"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    updateField(
                                        "thumbnailFile",
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                                className="w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-neutral-700 hover:file:bg-neutral-200"
                            />
                        )}

                        {type === "text" && (
                            <CompactTextarea
                                id="description"
                                label="설명 (최소 10글자)"
                                minLength={10}
                                maxLength={300}
                                value={form.description}
                                onChange={(e) =>
                                    updateField("description", e.target.value)
                                }
                                placeholder="단계별 설명 등 부가 정보"
                                rows={3}
                            />
                        )}
                        {error && (
                            <p className="text-[13px] text-red-500">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-1 h-10 cursor-pointer rounded-md bg-neutral-900 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
                        >
                            {submitting ? "등록 중..." : "등록하기"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
