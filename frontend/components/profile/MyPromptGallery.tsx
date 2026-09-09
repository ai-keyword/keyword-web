import type { CurrentUser, Prompt } from "@/types";
import { PromptCard } from "../prompt/PromptCard";
import { TextPromptCard } from "../prompt/TextPromptCard";
import { Section } from "../layout/Section";

type MyPromptGalleryProps = {
    prompt: Prompt[];
    imageSectionTitle?: string;
    textSectionTitle?: string;
    imageEmptyMessage?: string;
    textEmptyMessage?: string;
    userData?: CurrentUser;
};

export function MyPromptGallery({
    prompt,
    imageSectionTitle = "내 이미지 프롬프트",
    textSectionTitle = "내 글씨 프롬프트",
    imageEmptyMessage = "작성한 이미지 프롬프트가 없어요.",
    textEmptyMessage = "작성한 글씨 프롬프트가 없어요.",
    userData,
}: MyPromptGalleryProps) {
    const userId = userData?.id ?? "없음";

    const imagePrompts = prompt.filter(
        (item) => Boolean(item.thumbnailUrl) && item.author.id !== userId,
    );
    const textPrompts = prompt.filter(
        (item) => !item.thumbnailUrl && item.author.id !== userId,
    );

    return (
        <section className="w-full max-w-5xl space-y-10">
            <Section title={imageSectionTitle} emptyMessage={imageEmptyMessage}>
                {imagePrompts.map((item) => (
                    <PromptCard key={item.id} prompt={item} hideRank />
                ))}
            </Section>
            <Section title={textSectionTitle} emptyMessage={textEmptyMessage}>
                {textPrompts.map((item) => (
                    <TextPromptCard key={item.id} prompt={item} hideRank />
                ))}
            </Section>
        </section>
    );
}
