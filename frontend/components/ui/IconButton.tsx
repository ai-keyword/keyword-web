type IconButtonProps = {
    label: string;
    onClick: () => void;
};

export function BackIconButton({ label, onClick }: IconButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-neutral-200/60"
        >
            ←
        </button>
    );
}

export function CloseIconButton({ label, onClick }: IconButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="h-10 w-10 rounded-md border border-zinc-200 text-xl font-bold text-zinc-500 hover:bg-zinc-50"
            aria-label={label}
        >
            ×
        </button>
    );
}
