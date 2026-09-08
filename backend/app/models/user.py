from datetime import datetime, timezone

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.like import user_likes


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50))
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    password: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # 내가 쓴 프롬프트
    prompts: Mapped[list["Prompt"]] = relationship(
        "Prompt", back_populates="author", cascade="all, delete-orphan"
    )

    # 내가 좋아요 누른 프롬프트 (N:M, user_likes 매핑 테이블 경유)
    liked_prompts: Mapped[list["Prompt"]] = relationship(
        "Prompt", secondary=user_likes, back_populates="liked_by"
    )