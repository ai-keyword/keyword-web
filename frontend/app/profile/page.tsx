import { Header } from "@/components/layout/Header";
import { PageShell } from "@/components/ui/PageShell";
import profile from "@/public/profile.svg";
import { profileAction } from "./actions";
import { LogoutButton } from "@/components/profile/LogoutButton";
import { MyPromptGallery } from "@/components/profile/MyPromptGallery";

export default async function ProfilePage() {
    const userData = await profileAction();
    return (
        <PageShell>
            <Header recommend={false} />
            <div className="flex flex-col items-center justify-center gap-4">
                <img
                    src={profile.src}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover"
                />
                <h1 className="text-2xl font-bold">{userData.username}</h1>
                <p className="text-gray-600">{userData.email}</p>
                <LogoutButton />
                <MyPromptGallery prompt={userData.written_prompts} />

                <MyPromptGallery
                    userData={userData}
                    prompt={userData.liked_prompts}
                    imageSectionTitle="좋아요한 이미지 프롬프트"
                    textSectionTitle="좋아요한 글씨 프롬프트"
                    imageEmptyMessage="좋아요한 이미지 프롬프트가 없어요."
                    textEmptyMessage="좋아요한 글씨 프롬프트가 없어요."
                />
            </div>
        </PageShell>
    );
}
