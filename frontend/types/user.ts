import type { Prompt } from "./prompt";

export type CurrentUser = {
    id: number;
    email: string;
    username: string;
    name: string;
    created_year: number | null;
    written_prompts: Prompt[];
    liked_prompts: Prompt[];
};
