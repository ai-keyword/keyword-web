type RankBadgeProps = {
    rank: number;
};

export function RankBadge({ rank }: RankBadgeProps) {
    const normalizedRank = Number(rank);
    const rankColor =
        normalizedRank === 1
            ? "bg-yellow-400 text-black"
            : normalizedRank === 2
              ? "bg-gray-300 text-black"
              : normalizedRank === 3
                ? "bg-[#CD7F32] text-white"
                : "bg-black text-white";

    return (
        <i
            className={`inline-flex min-h-10 min-w-10 shadow-sm items-center justify-center rounded-full px-2 text-sm font-black ${rankColor}`}
        >
            #{rank}
        </i>
    );
}
