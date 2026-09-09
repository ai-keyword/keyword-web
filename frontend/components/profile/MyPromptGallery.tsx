import type { Prompt } from "@/types";
import { PromptCard } from "../prompt/PromptCard";
import { TextPromptCard } from "../prompt/TextPromptCard";
import { Section } from "../layout/Section";

type MyPromptGalleryProps = {
    prompt: Prompt[];
};

export function MyPromptGallery({ prompt }: MyPromptGalleryProps) {
    const imagePrompts = prompt.filter((item) => Boolean(item.thumbnailUrl));
    const textPrompts = prompt.filter((item) => !item.thumbnailUrl);

    return (
        <section className="w-full max-w-5xl space-y-10">
            <Section
                title="내 이미지 프롬프트"
                emptyMessage="작성한 이미지 프롬프트가 없어요."
            >
                {imagePrompts.map((item) => (
                    <PromptCard key={item.id} prompt={item} />
                ))}
            </Section>
            <Section
                title="내 글씨 프롬프트"
                emptyMessage="작성한 글씨 프롬프트가 없어요."
            >
                {textPrompts.map((item) => (
                    <TextPromptCard key={item.id} prompt={item} />
                ))}
            </Section>
        </section>
    );
}
