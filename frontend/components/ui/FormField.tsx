import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldBase = {
    id: string;
    label: string;
};

type InputFieldProps = FieldBase &
    Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

const inputClassName =
    "w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-950 disabled:bg-zinc-100";

export function FormField({ id, label, className, ...props }: InputFieldProps) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="text-sm font-bold text-zinc-950">
                {label}
            </label>
            <input
                id={id}
                className={className ?? inputClassName}
                {...props}
            />
        </div>
    );
}

type CompactFieldProps = FieldBase &
    Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

const compactClassName =
    "w-full h-9 px-3 rounded-md border border-neutral-200 text-sm outline-none focus:border-neutral-400";

export function CompactField({
    id,
    label,
    className,
    ...props
}: CompactFieldProps) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-1 block text-[13px] text-neutral-500"
            >
                {label}
            </label>
            <input id={id} className={className ?? compactClassName} {...props} />
        </div>
    );
}

type CompactTextareaProps = FieldBase &
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id">;

export function CompactTextarea({
    id,
    label,
    className,
    ...props
}: CompactTextareaProps) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-1 block text-[13px] text-neutral-500"
            >
                {label}
            </label>
            <textarea
                id={id}
                className={
                    className ??
                    "w-full resize-y rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                }
                {...props}
            />
        </div>
    );
}
