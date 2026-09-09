"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

type SamePageGuardLinkProps = {
    href: string;
    children: ReactNode;
    className?: string;
    ariaLabel?: string;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export function SamePageGuardLink({
    href,
    children,
    className,
    ariaLabel,
    onClick,
}: SamePageGuardLinkProps) {
    const pathname = usePathname();
    const safeTarget = href.split("?")[0].split("#")[0];
    const isSamePage = pathname === safeTarget;

    return (
        <Link
            href={href}
            aria-label={ariaLabel}
            className={className}
            onClick={(event) => {
                if (isSamePage) {
                    event.preventDefault();
                    event.stopPropagation();
                    return;
                }

                onClick?.(event);
            }}
        >
            {children}
        </Link>
    );
}
