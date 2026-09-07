export type PromptType = "image" | "text";

export type Prompt = {
  id: string;
  type: PromptType;
  keyword: string;
  rank: number;
  content: string;
  description?: string;
  thumbnailUrl?: string;
  author: string;
  createdAt: string;
};
