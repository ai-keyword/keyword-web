export type PromptType = "image" | "text";

export type PromptAuthor = {
    id: number;
    username: string;
};

/** 백엔드 API에서 넘어오는 Raw 응답 규격 (snake_case) */
export type PromptApi = {
    id: string;
    type: string;
    keyword: string;
    rank: number;
    content: string;
    description: string | null;
    thumbnail_url: string | null;
    views: number;
    like_count?: number;
    is_liked?: boolean;
    created_at: string;
    author: PromptAuthor | string;
};

/** 프론트엔드 UI 컴포넌트 전체에서 사용할 단일 표준 모델 (camelCase) */
export type Prompt = {
    id: string;
    type: PromptType;
    keyword: string;
    rank: number;
    content: string;
    description?: string;
    thumbnailUrl?: string;
    author: PromptAuthor;
    views: number;
    likeCount: number;
    isLiked: boolean;
    createdAt: string;
};

export type PromptListResponse = {
    prompts: PromptApi[];
};

export type PromptQuery = {
    keyword?: string;
    type?: PromptType;
    sort?: "rank" | "recent";
};

export type PromptCreateForm = {
    keyword: string;
    content: string;
    description: string;
    thumbnailFile: File | null;
};
