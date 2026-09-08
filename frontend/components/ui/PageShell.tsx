import type { ReactNode } from "react";

type PageShellProps = {
    children: ReactNode;
    className?: string;
};

export function PageShell({ children, className = "" }: PageShellProps) {
    return (
        <main className={`min-h-screen bg-background ${className}`.trim()}>
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 py-8 sm:px-8 lg:px-10">
                {children}
            </div>
        </main>
    );
}
