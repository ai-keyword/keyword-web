"use server";

import OpenAI from "openai";

type IsHideInput = {
    text?: string;
    /** data:image/png;base64,... 형태의 base64 데이터 URL */
    imageDataUrl?: string;
};

const PROFANITY_PATTERNS = [
    /씨발/g,
    /시발/g,
    /개새끼/g,
    /좆/g,
    /존나/g,
    /병신/g,
    /보지/g,
    /걸레/g,
    /fuck/gi,
    /shit/gi,
    /bitch/gi,
    /asshole/gi,
];

function containsProfanity(text?: string): boolean {
    if (!text || !text.trim()) {
        return false;
    }

    return PROFANITY_PATTERNS.some((pattern) => pattern.test(text));
}

function getModerationClient(): OpenAI | null {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return null;
    }

    return new OpenAI({ apiKey });
}

/**
 * 텍스트/이미지가 부적절한지 OpenAI Moderation API로 판정한다.
 * true면 화면에서 숨겨야(등록을 막아야) 하는 콘텐츠라는 뜻.
 */
export async function isHide({
    text,
    imageDataUrl,
}: IsHideInput): Promise<boolean> {
    // 1. 로컬 욕설 필터 — AI 호출 없이 바로 걸러지는 빠른 1차 검사
    if (containsProfanity(text)) {
        console.log("[isHide] 로컬 욕설 필터에 걸림");
        return true;
    }

    const input: Array<
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string } }
    > = [];

    if (text && text.trim()) {
        input.push({ type: "text", text });
    }

    if (imageDataUrl) {
        input.push({ type: "image_url", image_url: { url: imageDataUrl } });
    }

    if (input.length === 0) {
        return false;
    }

    console.log(
        `[isHide] OpenAI Moderation 호출 — 텍스트 ${text ? "있음" : "없음"}, 이미지 ${imageDataUrl ? "있음" : "없음"}`,
    );

    const client = getModerationClient();
    if (!client) {
        // API 키가 아예 없는 건 "설정 실수"라서, 여기서만 예외로 명확히 알림
        console.error(
            "[isHide] OPENAI_API_KEY가 설정되지 않았습니다. .env.local을 확인하세요.",
        );
        throw new Error(
            "검열 서비스 설정에 문제가 있습니다. 관리자에게 문의해주세요.",
        );
    }

    try {
        const response = await client.moderations.create({
            model: "omni-moderation-latest",
            input,
        });

        const result = response.results[0];
        const flagged = result?.flagged ?? false;

        if (flagged && result) {
            const flaggedCategories = Object.entries(result.categories)
                .filter(([, isFlagged]) => isFlagged)
                .map(([category]) => category);
            console.log(
                `[isHide] AI 판정: 부적절함 (감지 항목: ${flaggedCategories.join(", ")})`,
            );
        } else {
            console.log("[isHide] AI 판정: 정상");
        }

        return Boolean(flagged);
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : typeof error === "string"
                  ? error
                  : "";
        const isRateLimited =
            /429|Too Many Requests|rate limit|rate_limit/i.test(message) ||
            Boolean((error as { status?: number })?.status === 429);

        if (isRateLimited) {
            // 요청량 제한은 서비스 정책상 "통과"로 처리 (사용자 경험을 막지 않기 위함)
            console.warn(
                "[isHide] OpenAI rate-limit — 검열을 건너뛰고 통과시킴",
            );
            return false;
        }

        // 그 외 에러(키 오류, 네트워크 문제 등)는 원인을 알 수 없으니 안전하게 차단
        console.error(
            "[isHide] 검열 API 호출 실패, 안전하게 차단 처리:",
            error,
        );
        throw new Error(
            "콘텐츠 검열 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        );
    }
}

/** File 객체를 base64 데이터 URL로 변환하는 헬퍼 (Server Action에서 File을 받았을 때 사용) */
export async function fileToDataUrl(file: File): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    return `data:${file.type};base64,${buffer.toString("base64")}`;
}
