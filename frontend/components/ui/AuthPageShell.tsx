import type { ReactNode } from "react";
import Link from "next/link";

type AuthPageShellProps = {
    title: string;
    description: ReactNode;
    children: ReactNode;
};

export function AuthPageShell({
    title,
    description,
    children,
}: AuthPageShellProps) {
    return (
        <main className="flex min-h-screen flex-col bg-background">
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-5 py-8 sm:px-8 lg:px-10">
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-950"
                    >
                        ← 홈으로
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-center pb-12">
                    <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-black text-zinc-950">
                                {title}
                            </h1>
                            <p className="mt-2 text-sm font-semibold text-zinc-500">
                                {description}
                            </p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
}
