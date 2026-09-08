from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AuthorOut(BaseModel):
    """프롬프트 응답에 포함될 작성자 정보 (User 모델 일부만 노출)"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str


class PromptBase(BaseModel):
    type: str
    keyword: str
    content: str
    description: str | None = None


class PromptCreate(PromptBase):
    """POST /api/prompts 요청 바디"""
    thumbnail_url: str | None = None


class PromptRead(PromptBase):
    """프롬프트 응답 (목록/상세 공용)"""
    model_config = ConfigDict(from_attributes=True)

    id: str
    rank: int
    thumbnail_url: str | None = None
    views: int
    created_at: datetime
    author: AuthorOut
    is_liked: bool = False  # 현재 로그인한 유저가 좋아요 눌렀는지 (비로그인/미조회 시 False)


# prompts.py 라우터가 이전에 PromptOut이라는 이름으로 import했을 수도 있어 하위호환용 별칭
PromptOut = PromptRead


class PromptListResponse(BaseModel):
    prompts: list[PromptRead]


class KeywordItem(BaseModel):
    keyword: str
    prompt_count: int = 0


class KeywordListResponse(BaseModel):
    keywords: list[KeywordItem]