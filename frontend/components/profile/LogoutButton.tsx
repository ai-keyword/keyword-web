"use client";

import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/profile/actions";

export function LogoutButton() {
    const router = useRouter();

    const logout = async () => {
        await logoutAction();
        router.replace("/login");
        router.refresh();
    };

    return (
        <button
            type="button"
            onClick={() => {
                if (confirm("로그아웃 하시겠습니까?")) {
                    void logout();
                }
            }}
            className="text-red-400 cursor-pointer"
        >
            로그아웃
        </button>
    );
}
