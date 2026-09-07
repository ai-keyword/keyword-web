from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Prompt(Base):
    __tablename__ = "prompts"

    id: Mapped[str] = mapped_column(String(80), primary_key=True, index=True)
    type: Mapped[str] = mapped_column(String(20), index=True)
    keyword: Mapped[str] = mapped_column(String(80), index=True)
    rank: Mapped[int] = mapped_column(Integer, index=True)
    content: Mapped[str] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    thumbnail_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    author: Mapped[str] = mapped_column(String(80))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
