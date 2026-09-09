import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, LargeBinary, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.like import user_likes


class Prompt(Base):
    __tablename__ = "prompts"

    id: Mapped[str] = mapped_column(
        String(80), primary_key=True, default=lambda: str(uuid.uuid4()), index=True
    )
    type: Mapped[str] = mapped_column(String(20), index=True)
    keyword: Mapped[str] = mapped_column(String(80), index=True)
    ai_model: Mapped[str | None] = mapped_column(String(100), nullable=True)
    rank: Mapped[int] = mapped_column(Integer, default=0, index=True)
    like_count: Mapped[int] = mapped_column(Integer, default=0, index=True)  # 추가된 필드
    content: Mapped[str] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    thumbnail_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    thumbnail_data: Mapped[bytes | None] = mapped_column(LargeBinary, nullable=True)
    thumbnail_content_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    views: Mapped[int] = mapped_column(Integer, default=0, index=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )

    # 작성자 (N:1)
    author: Mapped["User"] = relationship("User", back_populates="prompts")

    # 이 프롬프트를 좋아요 누른 유저들 (N:M)
    liked_by: Mapped[list["User"]] = relationship(
        "User", secondary=user_likes, back_populates="liked_prompts"
    )