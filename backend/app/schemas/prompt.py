from datetime import datetime
from pydantic import BaseModel, ConfigDict


class AuthorOut(BaseModel):
    """프롬프트 응답에 포함될 작성자 정보"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str


class PromptBase(BaseModel):
    type: str
    keyword: str
    ai_model: str | None = None
    content: str
    description: str | None = None
    is_hide: bool = False


class PromptCreate(PromptBase):
    """POST /api/prompts 요청 바디"""
    thumbnail_url: str | None = None


class PromptRead(PromptBase):
    """프롬프트 응답 (목록/상세 공용)"""
    model_config = ConfigDict(from_attributes=True)

    id: str
    ai_model: str | None = None
    rank: int
    thumbnail_url: str | None = None
    views: int
    like_count: int = 0  # 추가된 필드
    created_at: datetime
    author: AuthorOut
    is_liked: bool = False


# 하위호환용 별칭
PromptOut = PromptRead


class LikeToggleResponse(BaseModel):
    """좋아요 토글 시 프론트엔드로 전달할 lightweight 응답"""
    is_liked: bool
    like_count: int


class PromptListResponse(BaseModel):
    prompts: list[PromptRead]
    page: int = 1
    page_size: int = 12
    total: int = 0
    total_pages: int = 1


class KeywordItem(BaseModel):
    keyword: str
    prompt_count: int = 0


class KeywordListResponse(BaseModel):
    keywords: list[str]