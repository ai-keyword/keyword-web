import type { Prompt } from "@/types";
import { PromptCard } from "@/components/prompt/PromptCard";
import { TextPromptCard } from "@/components/prompt/TextPromptCard";
import { Section } from "@/components/layout/Section";

type PromptGalleryProps = {
    imageTitle: string;
    textTitle: string;
    imagePrompts: Prompt[];
    textPrompts: Prompt[];
    displayKeyword?: string;
    imageEmptyMessage?: string;
    textEmptyMessage?: string;
};

export function PromptGallery({
    imageTitle,
    textTitle,
    imagePrompts,
    textPrompts,
    displayKeyword,
    imageEmptyMessage,
    textEmptyMessage,
}: PromptGalleryProps) {
    return (
        <>
            <Section title={imageTitle} emptyMessage={imageEmptyMessage}>
                {imagePrompts.map((prompt) => (
                    <PromptCard
                        key={prompt.id}
                        prompt={prompt}
                        displayKeyword={displayKeyword}
                    />
                ))}
            </Section>

            <Section title={textTitle} emptyMessage={textEmptyMessage}>
                {textPrompts.map((prompt) => (
                    <TextPromptCard
                        key={prompt.id}
                        prompt={prompt}
                        displayKeyword={displayKeyword}
                    />
                ))}
            </Section>
        </>
    );
}
