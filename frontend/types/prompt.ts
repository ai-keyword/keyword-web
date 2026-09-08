import type { components } from "@/lib/api-types";

export type PromptType = "image" | "text";

/** 백엔드 PromptRead 응답의 author 필드 형태 (자동 생성 스펙 기준) */
export type PromptAuthor = components["schemas"]["AuthorOut"];

/** FastAPI `PromptRead` 응답 — 이제 손으로 유지보수하지 않음.
 *  백엔드 schemas/prompt.py가 바뀌면 `pnpm run generate:types` 실행만으로 자동 반영됨. */
export type PromptApi = components["schemas"]["PromptRead"];

/** FastAPI `PromptListResponse` 응답 */
export type PromptListResponse = components["schemas"]["PromptListResponse"];

export type PromptQuery = {
    keyword?: string;
    type?: PromptType;
    sort?: "rank" | "recent";
};

/** 화면에서 쓰는 프롬프트 모델 (mapPrompt()가 PromptApi → 이 타입으로 변환) */
export type Prompt = {
    id: string;
    type: PromptType;
    keyword: string;
    rank: number;
    content: string;
    description?: string;
    thumbnailUrl?: string;
    author: string;
    views: number;
    createdAt: string;
    isLiked: boolean;
};

export type PromptCreateForm = {
    keyword: string;
    content: string;
    description: string;
    thumbnailFile: File | null;
};
