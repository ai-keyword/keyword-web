from sqlalchemy import Column, ForeignKey, Table

from app.core.database import Base

user_likes = Table(
    "user_likes",
    Base.metadata,
    Column("user_id", ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("prompt_id", ForeignKey("prompts.id", ondelete="CASCADE"), primary_key=True),
)