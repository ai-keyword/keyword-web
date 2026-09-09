export type PromptType = "image" | "text";

export type PromptAuthor = {
    id: number;
    username: string;
};

/** 백엔드 API에서 넘어오는 Raw 응답 규격 (snake_case) */
export type PromptApi = {
    id: number;
    type: string;
    keyword: string;
    ai_model: string | null;
    rank: number;
    content: string;
    description: string | null;
    thumbnail_url: string | null;
    views: number;
    like_count?: number;
    is_liked?: boolean;
    is_hide?: boolean;
    created_at: string;
    author: PromptAuthor | string;
};

/** 프론트엔드 UI 컴포넌트 전체에서 사용할 단일 표준 모델 (camelCase) */
export type Prompt = {
    id: number;
    type: PromptType;
    keyword: string;
    aiModel?: string;
    rank: number;
    content: string;
    description?: string;
    thumbnailUrl?: string;
    author: PromptAuthor;
    views: number;
    likeCount: number;
    isLiked: boolean;
    createdAt: string;
    isHide?: boolean;
};

export type PromptListResponse = {
    prompts: PromptApi[];
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
};

export type PromptPage = {
    prompts: Prompt[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
};

export type PromptQuery = {
    keyword?: string;
    type?: PromptType;
    sort?: "rank" | "recent";
    page?: number;
    pageSize?: number;
};

export type PromptCreateForm = {
    keyword: string;
    aiModel: string;
    content: string;
    description: string;
    thumbnailFile: File | null;
    captcha_token: string;
};
