import { Header } from "@/components/layout/Header";
import { PromptGallery } from "@/components/prompt/PromptGallery";
import { PageShell } from "@/components/ui/PageShell";
import { getPromptsByType } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
    const [imagePrompts, textPrompts] = await Promise.all([
        getPromptsByType("image"),
        getPromptsByType("text"),
    ]);

    return (
        <PageShell>
            <Header />
            <PromptGallery
                imageTitle="#요즘 뜨는 이미지 프롬프트"
                textTitle="#요즘 뜨는 글씨 프롬프트"
                imagePrompts={imagePrompts}
                textPrompts={textPrompts}
            />
        </PageShell>
    );
}
