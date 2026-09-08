import { loginAction } from "./actions";
import { AuthPageShell } from "@/components/ui/AuthPageShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
    return (
        <AuthPageShell
            title="로그인"
            description={
                <>
                    <span className="font-bold">#키워드</span>에 오신 것을
                    환영합니다.
                </>
            }
        >
            <LoginForm loginAction={loginAction} />
        </AuthPageShell>
    );
}
