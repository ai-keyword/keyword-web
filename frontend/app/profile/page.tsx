import { Header } from "@/components/Header";

export default function ProfilePage() {
    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 py-8 sm:px-8 lg:px-10">
                <Header recommend={false} />
                프로필페이지입니다.
            </div>
        </main>
    );
}
