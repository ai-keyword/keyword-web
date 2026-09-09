import type { Prompt } from "@/types";
import { PromptCard } from "@/components/prompt/PromptCard";
import { TextPromptCard } from "@/components/prompt/TextPromptCard";
import { Section } from "@/components/layout/Section";

type PromptGalleryProps = {
    imageTitle: string;
    textTitle: string;
    imagePrompts: Prompt[];
    textPrompts: Prompt[];
    recentImagePrompts: Prompt[];
    recentTextPrompts: Prompt[];
    sort: "rank" | "recent";
    displayKeyword?: string;
    imageEmptyMessage?: string;
    textEmptyMessage?: string;
};

export function PromptGallery({
    imageTitle,
    textTitle,
    imagePrompts,
    textPrompts,
    recentImagePrompts,
    recentTextPrompts,
    sort,
    displayKeyword,
    imageEmptyMessage,
    textEmptyMessage,
}: PromptGalleryProps) {
    const selectedImagePrompts =
        sort === "rank" ? imagePrompts : recentImagePrompts;
    const selectedTextPrompts =
        sort === "rank" ? textPrompts : recentTextPrompts;

    return (
        <>
            <Section title={imageTitle} emptyMessage={imageEmptyMessage}>
                {selectedImagePrompts.map((prompt) => (
                    <PromptCard
                        key={prompt.id}
                        prompt={prompt}
                        displayKeyword={displayKeyword}
                    />
                ))}
            </Section>

            <Section title={textTitle} emptyMessage={textEmptyMessage}>
                {selectedTextPrompts.map((prompt) => (
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
