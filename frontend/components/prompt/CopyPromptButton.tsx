type CopyPromptButtonProps = {
    copied: boolean;
    onCopy: () => void;
};

export function CopyPromptButton({ copied, onCopy }: CopyPromptButtonProps) {
    return (
        <button
            type="button"
            onClick={onCopy}
            className="h-11 cursor-pointer rounded-lg bg-zinc-950 px-5 text-sm font-bold text-white hover:bg-zinc-800"
        >
            {copied ? "복사됨" : "복사"}
        </button>
    );
}
