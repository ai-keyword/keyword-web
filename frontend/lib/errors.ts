import type { ApiErrorBody } from "@/types";

export function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return fallback;
}

export function isNextRedirectError(error: unknown): boolean {
    if (typeof error !== "object" || error === null) {
        return false;
    }

    if ("digest" in error && typeof error.digest === "string") {
        return error.digest.startsWith("NEXT_REDIRECT");
    }

    return getErrorMessage(error, "") === "NEXT_REDIRECT";
}

export function parseApiError(body: unknown, fallback: string): string {
    if (typeof body === "string" && body.trim()) {
        return body;
    }

    if (!body || typeof body !== "object") {
        return fallback;
    }

    const detail = (body as ApiErrorBody).detail;

    if (typeof detail === "string" && detail.trim()) {
        return detail;
    }

    if (Array.isArray(detail)) {
        const first = detail[0];
        if (typeof first === "string" && first.trim()) {
            return first;
        }
        if (first && typeof first === "object") {
            return first.msg ?? first.message ?? fallback;
        }
    }

    return fallback;
}
