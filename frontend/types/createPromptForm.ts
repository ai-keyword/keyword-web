export type PromptType = "image" | "text";

export interface Prompt {
    id: string;
    type: PromptType;
    keyword: string;
    rank: number;
    content: string;
    description?: string; // 선택 사항인 경우
    thumbnailUrl?: string; // 선택 사항인 경우
    author: string;
    views: number;
    createdAt: string;
}
