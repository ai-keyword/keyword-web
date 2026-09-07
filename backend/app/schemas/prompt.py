from datetime import datetime, timedelta, timezone
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_serializer


KST = timezone(timedelta(hours=9))


class PromptBase(BaseModel):
    type: Literal["image", "text"]
    keyword: str
    rank: int
    content: str
    description: str | None = None
    thumbnail_url: str | None = Field(default=None, alias="thumbnailUrl")
    author: str
    views: int = 0
    created_at: datetime = Field(alias="createdAt")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    @field_serializer("created_at")
    def serialize_created_at(self, created_at: datetime) -> str:
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=KST)

        return created_at.isoformat()


class PromptCreate(PromptBase):
    id: str


class PromptRead(PromptBase):
    id: str


class PromptListResponse(BaseModel):
    prompts: list[PromptRead]


class KeywordListResponse(BaseModel):
    keywords: list[str]