import type { PromptType } from "@/types";

type PromptTypePickerProps = {
    onSelect: (type: PromptType) => void;
    onBack: () => void;
};

export function PromptTypePicker({ onSelect, onBack }: PromptTypePickerProps) {
    return (
        <div>
            <h1 className="mb-1 flex items-center gap-2 text-lg font-medium">
                <button
                    type="button"
                    onClick={onBack}
                    aria-label="뒤로"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-neutral-200/60"
                >
                    ←
                </button>
                프롬프트 만들기
            </h1>
            <p className="mb-5 text-sm text-neutral-500">
                어떤 종류의 프롬프트를 만들까요?
            </p>

            <div className="grid grid-cols-2 gap-3.5">
                <button
                    type="button"
                    onClick={() => onSelect("image")}
                    className="flex cursor-pointer flex-col gap-2.5 rounded-xl border border-neutral-200 bg-white p-5 text-left transition-colors hover:border-neutral-400"
                >
                    <span className="text-2xl text-amber-500">🖼</span>
                    <span className="text-[15px] font-medium">
                        이미지 프롬프트
                    </span>
                    <span className="text-xs text-neutral-400">
                        이미지 생성 및 변환용 프롬프트
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => onSelect("text")}
                    className="flex cursor-pointer flex-col gap-2.5 rounded-xl border border-neutral-200 bg-white p-5 text-left transition-colors hover:border-neutral-400"
                >
                    <span className="text-2xl text-amber-500">✏️</span>
                    <span className="text-[15px] font-medium">글씨 프롬프트</span>
                    <span className="text-xs text-neutral-400">
                        텍스트/코드용 프롬프트
                    </span>
                </button>
            </div>
        </div>
    );
}
