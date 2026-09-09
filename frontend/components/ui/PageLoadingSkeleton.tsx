type PageLoadingSkeletonProps = {
    showRecommendations?: boolean;
};

function SkeletonBlock({ className }: { className: string }) {
    return (
        <div className={`animate-pulse rounded-lg bg-zinc-200 ${className}`} />
    );
}

function PromptRowSkeleton({ text = false }: { text?: boolean }) {
    return (
        <div className="flex shrink-0 snap-start flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm sm:w-full">
            {text ? (
                <div className="flex min-h-72 flex-col justify-between p-5">
                    <div className="space-y-5">
                        <div className="flex justify-between gap-3">
                            <SkeletonBlock className="h-7 w-12" />
                            <SkeletonBlock className="h-7 w-20" />
                        </div>
                        <SkeletonBlock className="h-28 w-full" />
                    </div>
                    <SkeletonBlock className="h-5 w-28" />
                </div>
            ) : (
                <>
                    <SkeletonBlock className="aspect-4/3 w-full rounded-none" />
                    <div className="space-y-5 p-4">
                        <SkeletonBlock className="h-20 w-full" />
                        <SkeletonBlock className="h-5 w-28" />
                    </div>
                </>
            )}
        </div>
    );
}

function SectionLoadingSkeleton({ text = false }: { text?: boolean }) {
    return (
        <section className="space-y-4">
            <SkeletonBlock className="h-8 w-64" />
            <div className="-mx-5 flex gap-4 overflow-hidden px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
                {Array.from({ length: 4 }, (_, index) => (
                    <PromptRowSkeleton key={index} text={text} />
                ))}
            </div>
        </section>
    );
}

export function PageLoadingSkeleton({
    showRecommendations = true,
}: PageLoadingSkeletonProps) {
    return (
        <main className="min-h-screen bg-background" aria-busy="true">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 py-8 sm:px-8 lg:px-10">
                <header className="flex w-full flex-col gap-6 border-b border-zinc-200 pb-8">
                    <div className="flex w-full items-center justify-between gap-4">
                        <div className="flex min-w-0 flex-1 items-center gap-4">
                            <SkeletonBlock className="h-10 w-28 shrink-0" />
                            <SkeletonBlock className="h-11 w-full max-w-xl" />
                        </div>
                        <SkeletonBlock className="h-10 w-24 shrink-0" />
                    </div>
                    <div className="flex w-full items-center justify-between gap-4">
                        {showRecommendations ? (
                            <div className="flex gap-2 overflow-hidden">
                                <SkeletonBlock className="h-8 w-20" />
                                <SkeletonBlock className="h-8 w-24" />
                                <SkeletonBlock className="h-8 w-20" />
                            </div>
                        ) : (
                            <span />
                        )}
                        <div className="flex gap-2">
                            <SkeletonBlock className="h-9 w-16" />
                            <SkeletonBlock className="h-9 w-16" />
                        </div>
                    </div>
                </header>
                <SectionLoadingSkeleton />
                <SectionLoadingSkeleton text />
            </div>
        </main>
    );
}
