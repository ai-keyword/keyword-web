"use server";

import OpenAI from "openai";

type IsHideInput = {
    text?: string;
    /** data:image/png;base64,... 형태의 base64 데이터 URL */
    imageDataUrl?: string;
};

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
 *
 * OPENAI_API_KEY가 없으면 검열을 건너뛰고 false를 돌려서,
 * 서버 액션의 모듈 평가 단계가 죽지 않도록 안전하게 동작한다.
 */
export async function isHide({
    text,
    imageDataUrl,
}: IsHideInput): Promise<boolean> {
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

    const client = getModerationClient();
    if (!client) {
        console.warn("OPENAI_API_KEY missing; moderation skipped.");
        return false;
    }

    try {
        const response = await client.moderations.create({
            model: "omni-moderation-latest",
            input,
        });

        return response.results[0]?.flagged ?? false;
    } catch (error) {
        console.error("Moderation check failed:", error);
        return false;
    }
}

/** File 객체를 base64 데이터 URL로 변환하는 헬퍼 (Server Action에서 File을 받았을 때 사용) */
export async function fileToDataUrl(file: File): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    return `data:${file.type};base64,${buffer.toString("base64")}`;
}
