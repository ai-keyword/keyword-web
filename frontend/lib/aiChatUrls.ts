type AiChatUrlBuilder = {
    /** 모델명(소문자, 공백 제거 안 됨)에 매칭되는 정규식 */
    pattern: RegExp;
    /** 매칭되면 이 함수로 URL 생성 */
    buildUrl: () => string;
};

const AI_CHAT_URL_BUILDERS: AiChatUrlBuilder[] = [
    {
        pattern: /chatgpt|openai|gpt/,
        buildUrl: () => `https://chat.openai.com/`,
    },
    {
        pattern: /claude|anthropic/,
        buildUrl: () => `https://claude.ai/new`,
    },
    {
        pattern: /gemini|bard/,
        buildUrl: () => `https://gemini.google.com/app`,
    },
    {
        pattern: /copilot|github/,
        buildUrl: () => `https://github.com/copilot`,
    },
    {
        pattern: /perplexity/,
        buildUrl: () => `https://www.perplexity.ai/search`,
    },
    {
        pattern: /grok|xai/,
        buildUrl: () => `https://grok.com/`,
    },
    {
        pattern: /meta ?ai|llama/,
        buildUrl: () => `https://www.meta.ai/`,
    },
    {
        pattern: /mistral|le ?chat/,
        buildUrl: () => `https://chat.mistral.ai/chat`,
    },
    {
        pattern: /deepseek/,
        buildUrl: () => `https://chat.deepseek.com/`,
    },
    {
        pattern: /qwen|tongyi/,
        buildUrl: () => `https://chat.qwen.ai/`,
    },
    {
        pattern: /poe\.com|^poe$/,
        buildUrl: () => `https://poe.com/`,
    },
    {
        pattern: /you\.com|^you$/,
        buildUrl: () => `https://you.com/search`,
    },
    {
        pattern: /wrtn|뤼튼/,
        buildUrl: () => `https://wrtn.ai/`,
    },
    {
        pattern: /clova ?x|clovax|네이버/,
        buildUrl: () => `https://clova-x.naver.com/`,
    },
];

/**
 * AI 모델 이름과 프롬프트 내용을 받아, 해당 모델의 채팅 페이지 URL을 만든다.
 * 매칭되는 모델이 없으면 구글 검색으로 fallback한다.
 */
export function buildAiChatUrl(
    aiModel?: string,
    _content?: string,
): string | null {
    if (!aiModel) return null;

    const model = aiModel.trim().toLowerCase();

    const matched = AI_CHAT_URL_BUILDERS.find(({ pattern }) =>
        pattern.test(model),
    );
    if (matched) {
        return matched.buildUrl();
    }

    return `https://www.google.com/search?q=${encodeURIComponent(aiModel)}`;
}
