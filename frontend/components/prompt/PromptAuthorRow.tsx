type PromptAuthorRowProps = {
    author: string;
    views: number;
    compact?: boolean;
};

export function PromptAuthorRow({
    author,
    views,
    compact = false,
}: PromptAuthorRowProps) {
    if (compact) {
        return (
            <div className="flex items-center justify-between gap-3 text-sm font-semibold text-zinc-500">
                <span>작성자: {author}</span>
                <span>조회수 {views}회</span>
            </div>
        );
    }

    return (
        <span className="text-sm font-semibold text-zinc-500">
            작성자: {author} (조회수 {views}회)
        </span>
    );
}
