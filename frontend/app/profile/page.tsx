import { Header } from "@/components/layout/Header";
import { PageShell } from "@/components/ui/PageShell";
import profile from "@/public/profile.svg";
import { profileAction } from "./actions";

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
            </div>
        </PageShell>
    );
}
