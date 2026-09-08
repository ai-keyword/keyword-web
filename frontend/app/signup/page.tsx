import { signupAction } from "./actions";
import { SignupForm } from "@/components/auth/SignupForm";
import { AuthPageShell } from "@/components/ui/AuthPageShell";

export const dynamic = "force-dynamic";

export default function SignupPage() {
    return (
        <AuthPageShell
            title="회원가입"
            description={
                <>
                    <span className="font-bold">#keyword</span>의 새로운 계정을
                    만드세요.
                </>
            }
        >
            <SignupForm signupAction={signupAction} />
        </AuthPageShell>
    );
}
