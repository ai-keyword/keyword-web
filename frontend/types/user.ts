export type UserPromptSummary = {
    id: string;
    title?: string;
    created_at?: string;
    author?: string | null;
};

export type CurrentUser = {
    id: number;
    email: string;
    username: string;
    name: string;
    created_year: number | null;
    written_prompts: UserPromptSummary[];
    liked_prompts: UserPromptSummary[];
};
