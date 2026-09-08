import filledHeart from "@/public/heart_filled.svg";
import unfilledHeart from "@/public/heart_unfilled.svg";

type PromptLikeButtonProps = {
    isLiked: boolean;
    likeCount: number;
    pending: boolean;
    onToggle: () => void;
};

export function PromptLikeButton({
    isLiked,
    likeCount,
    pending,
    onToggle,
}: PromptLikeButtonProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            disabled={pending}
            aria-label={isLiked ? "좋아요 취소" : "좋아요"}
            className={`flex h-11 cursor-pointer items-center gap-2 rounded-lg px-4 text-sm font-bold transition-colors disabled:cursor-wait disabled:opacity-60
            }`}
        >
            {isLiked ? (
                <img src={filledHeart.src} alt="" className="h-4 w-4" />
            ) : (
                <img src={unfilledHeart.src} alt="" className="h-4 w-4" />
            )}

            <span>{likeCount}</span>
        </button>
    );
}
