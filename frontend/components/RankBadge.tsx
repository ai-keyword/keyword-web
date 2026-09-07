type RankBadgeProps = {
  rank: number;
};

export function RankBadge({ rank }: RankBadgeProps) {
  return (
    <span className="inline-flex h-8 min-w-10 items-center justify-center rounded-md bg-foreground px-2 text-sm font-black text-background">
      #{rank}
    </span>
  );
}
